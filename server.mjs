// OpportunityLens AI — Production Standalone Server
// Provides static asset serving for the built React frontend
// and secure server-side Gemini AI proxy endpoints (/api/ai-status, /api/ai-analyze).
// Zero external runtime dependencies (uses native Node.js http, fs, path).

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = Number(process.env.PORT) || 3000;

// Helper to load .env without third-party packages
function loadEnvironmentVariables() {
  for (const fname of ['.env.local', '.env']) {
    const fpath = path.join(__dirname, fname);
    if (fs.existsSync(fpath)) {
      try {
        const raw = fs.readFileSync(fpath, 'utf8');
        const lines = raw.split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const match = trimmed.match(/^([^=]+)=(.*)$/);
          if (match) {
            const key = match[1].trim();
            const val = match[2].trim().replace(/^["']|["']$/g, '');
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      } catch {
        // ignore
      }
    }
  }
}

loadEnvironmentVariables();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function getGeminiConfig() {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '');
  const model = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim().replace(/^["']|["']$/g, '');
  return { apiKey, model };
}

// Handler for GET /api/ai-status
async function handleAiStatus(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    });
    return res.end();
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }

  const { apiKey, model } = getGeminiConfig();
  const keyDetected = Boolean(apiKey && apiKey.length > 5);

  if (!keyDetected) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    });
    return res.end(
      JSON.stringify({
        configured: false,
        keyDetected: false,
        authenticated: false,
        model,
        provider: 'Google Gemini AI',
        status: 'unconfigured',
        message: 'GEMINI_API_KEY is not configured in environment. Operating in deterministic rule fallback mode.',
      })
    );
  }

  let authenticated = false;
  let activeModel = model;
  let message = '';

  try {
    const checkUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const checkRes = await fetch(checkUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (checkRes.ok) {
      authenticated = true;
      const modelsData = await checkRes.json().catch(() => ({}));
      const modelList = modelsData.models || [];
      const hasRequestedModel = modelList.some(
        (m) => m.name.endsWith(model) || m.name === `models/${model}`
      );
      if (!hasRequestedModel && modelList.some((m) => m.name.includes('gemini-2.5-flash'))) {
        activeModel = 'gemini-2.5-flash';
      }
      message = `Gemini API authenticated successfully with Google AI. Active model: ${activeModel}.`;
    } else {
      const errBody = await checkRes.json().catch(() => ({}));
      message = `Gemini key detected, but authentication failed: ${errBody.error?.message || checkRes.status}. Operating in fallback mode.`;
    }
  } catch (err) {
    message = `Google AI endpoint check timed out (${err.message}). Operating in fallback mode.`;
  }

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  });
  return res.end(
    JSON.stringify({
      configured: true,
      keyDetected: true,
      authenticated,
      model: activeModel,
      provider: 'Google Gemini AI',
      status: authenticated ? 'ready' : 'key_detected',
      message,
    })
  );
}

// Handler for POST /api/ai-analyze
async function handleAiAnalyze(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }

  const { apiKey, model } = getGeminiConfig();

  if (!apiKey || apiKey.length < 5) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(
      JSON.stringify({
        success: false,
        fallback: true,
        reason: 'NO_API_KEY',
        message: 'GEMINI_API_KEY is not configured on server. Operating in deterministic rule-based fallback mode.',
      })
    );
  }

  const MAX_BYTES = 100 * 1024;
  let body = '';
  let tooLarge = false;

  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > MAX_BYTES) {
      tooLarge = true;
    }
  });

  req.on('end', async () => {
    if (tooLarge) {
      res.writeHead(413, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: false, error: 'Payload Too Large: Text exceeds 100 KB limit' }));
    }

    try {
      const parsed = JSON.parse(body || '{}');
      const { text, title, channel } = parsed;

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'Job text is required' }));
      }

      if (text.length > 50000) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'Job text exceeds 50,000 character maximum limit.' }));
      }

      const prompt = `You are the NLP extraction engine for OpportunityLens AI, an ethical student career protection system.
Analyze the following job description / recruiter message text:

Target Title: "${title || 'Unspecified'}"
Outreach Channel: "${channel || 'Unknown'}"
Job Text:
"""
${text}
"""

Task Instructions:
1. Extract technical and professional skills mentioned in the text.
   - "coreSkills": explicitly required skills mentioned in the text.
   - "secondarySkills": preferred, nice-to-have, or secondary skills mentioned in the text.
   - "inferredSkills": standard prerequisite skills typical for the role "${title}" that were NOT explicitly mentioned in the text.
2. Identify any suspicious employment scam patterns or red flags in the text.
   - "warningSigns": array of objects with:
     - "quote": verbatim excerpt from the text that triggered the concern (max 150 chars).
     - "explanation": objective explanation of why this pattern is risky.
     - "category": one of: "payment_request", "unprofessional_communication", "vague_spec", "suspicious_contact", "urgent_pressure", "unrealistic_compensation", "impersonation_scam", "other".
     - "severity": "high", "medium", or "low".
3. Identify unverified information candidates should check independently:
   - "unknowns": items requiring off-platform due diligence (corporate registration, career portal check, recruiter LinkedIn tenure).
4. Provide a 2-3 sentence "summaryExplanation" of your contextual analysis.

You MUST respond ONLY with a valid JSON object matching this schema without markdown fences:
{
  "coreSkills": ["string"],
  "secondarySkills": ["string"],
  "inferredSkills": ["string"],
  "warningSigns": [
    {
      "quote": "string",
      "explanation": "string",
      "category": "payment_request",
      "severity": "high"
    }
  ],
  "unknowns": [
    {
      "question": "string",
      "recommendation": "string",
      "verificationScope": "Corporate Registration"
    }
  ],
  "summaryExplanation": "string"
}`;

      let targetModel = model;
      let geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        targetModel
      )}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      let geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        }),
      });

      if (geminiRes.status === 404 && targetModel !== 'gemini-2.5-flash') {
        targetModel = 'gemini-2.5-flash';
        geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
          targetModel
        )}:generateContent?key=${encodeURIComponent(apiKey)}`;
        geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
        });
      }

      clearTimeout(timeoutId);

      if (!geminiRes.ok) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(
          JSON.stringify({
            success: false,
            fallback: true,
            reason: 'API_ERROR',
            message: `Gemini API returned status ${geminiRes.status}. Using deterministic rule-based fallback.`,
          })
        );
      }

      const geminiData = await geminiRes.json();
      const rawContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawContent) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(
          JSON.stringify({
            success: false,
            fallback: true,
            reason: 'EMPTY_AI_RESPONSE',
            message: 'Gemini returned an empty response. Falling back to rule engine.',
          })
        );
      }

      let cleaned = rawContent.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      }
      const jsonStart = cleaned.indexOf('{');
      const jsonEnd = cleaned.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
      }

      const parsedOutput = JSON.parse(cleaned);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(
        JSON.stringify({
          success: true,
          fallback: false,
          provider: targetModel,
          data: parsedOutput,
        })
      );
    } catch (err) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(
        JSON.stringify({
          success: false,
          fallback: true,
          reason: 'EXCEPTION',
          message: `Backend processing error: ${err.message}. Falling back to deterministic rule engine.`,
        })
      );
    }
  });
}

// Static file server with SPA fallback
function serveStatic(req, res) {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(DIST_DIR, reqPath);

  // Security: prevent path traversal outside DIST_DIR
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA Fallback: Serve index.html for client-side routing
      const indexPath = path.join(DIST_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end('Dist build not found. Please run "npm run build" first.');
        }
        res.writeHead(200, { 'Content-Type': MIME_TYPES['.html'] });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isImmutableAsset = filePath.includes(`${path.sep}assets${path.sep}`);

    const headers = { 'Content-Type': contentType };
    if (isImmutableAsset) {
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    } else {
      headers['Cache-Control'] = 'no-cache';
    }

    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (url === '/api/ai-status') {
    return handleAiStatus(req, res);
  }

  if (url === '/api/ai-analyze') {
    return handleAiAnalyze(req, res);
  }

  return serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`[OpportunityLens Production Server] Running on http://localhost:${PORT}`);
});
