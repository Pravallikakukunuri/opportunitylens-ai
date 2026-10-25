import type { Plugin, ViteDevServer } from 'vite';
import { loadEnv } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

interface GeminiExtractionResponse {
  coreSkills: string[];
  secondarySkills: string[];
  inferredSkills: string[];
  warningSigns: Array<{
    quote: string;
    explanation: string;
    category: 'payment_request' | 'unprofessional_communication' | 'vague_spec' | 'suspicious_contact' | 'urgent_pressure' | 'unrealistic_compensation' | 'impersonation_scam' | 'other';
    severity: 'high' | 'medium' | 'low';
  }>;
  unknowns: Array<{
    question: string;
    recommendation: string;
    verificationScope: 'Corporate Registration' | 'Official Domain' | 'Recruiter Authorization' | 'Interview Format';
  }>;
  summaryExplanation: string;
}

export function aiBackendPlugin(): Plugin {
  let currentMode = 'development';
  let envDir = process.cwd();

  function getEnvConfig() {
    const env = loadEnv(currentMode, envDir, '');
    let apiKey = (env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '');
    let model = (env.GEMINI_MODEL || process.env.GEMINI_MODEL || '').trim().replace(/^["']|["']$/g, '');

    // Fallback: parse .env and .env.local directly if loadEnv missed it
    if (!apiKey) {
      for (const fname of ['.env.local', '.env']) {
        const fpath = path.join(envDir, fname);
        if (fs.existsSync(fpath)) {
          try {
            const raw = fs.readFileSync(fpath, 'utf8');
            const matchKey = raw.match(/^\s*GEMINI_API_KEY\s*=\s*(.*)$/m);
            if (matchKey) {
              const parsedVal = matchKey[1].trim().replace(/^["']|["']$/g, '');
              if (parsedVal) {
                apiKey = parsedVal;
                break;
              }
            }
          } catch {
            // ignore
          }
        }
      }
    }

    if (!model) {
      model = 'gemini-2.5-flash';
    }

    return { apiKey, model };
  }

  return {
    name: 'opportunitylens-ai-backend',
    configResolved(config) {
      currentMode = config.mode;
      envDir = config.envDir || config.root || process.cwd();
    },
    configureServer(server: ViteDevServer) {
      // 1. GET /api/ai-status endpoint
      server.middlewares.use('/api/ai-status', async (_req: IncomingMessage, res: ServerResponse) => {
        if (_req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
          res.end();
          return;
        }

        if (_req.method && _req.method !== 'GET' && _req.method !== 'HEAD') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

        const { apiKey, model } = getEnvConfig();
        const keyDetected = Boolean(apiKey && apiKey.length > 5);

        if (!keyDetected) {
          res.end(
            JSON.stringify({
              configured: false,
              keyDetected: false,
              authenticated: false,
              model,
              provider: 'Google Gemini AI',
              status: 'unconfigured',
              message:
                'GEMINI_API_KEY is not configured in backend environment (.env). Operating in deterministic rule-based fallback mode.',
            })
          );
          return;
        }

        // Key is detected. Authenticate key against Google Gemini API without exposing it.
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
            const modelsData = (await checkRes.json().catch(() => ({}))) as { models?: Array<{ name: string }> };
            const modelList = modelsData.models || [];
            const hasRequestedModel = modelList.some(
              (m) => m.name.endsWith(model) || m.name === `models/${model}`
            );
            if (!hasRequestedModel && modelList.some((m) => m.name.includes('gemini-2.5-flash'))) {
              activeModel = 'gemini-2.5-flash';
            }
            message = `Gemini API key detected in .env and successfully authenticated with Google AI. Active model: ${activeModel}.`;
          } else {
            const errBody = (await checkRes.json().catch(() => ({}))) as { error?: { message?: string } };
            const errDetail = errBody.error?.message || `HTTP ${checkRes.status}`;
            message = `Gemini API key detected in .env, but authentication failed: ${errDetail}. Operating in fallback mode.`;
          }
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : 'Network timeout';
          message = `Gemini API key detected in .env, but Google AI endpoint could not be reached (${errMsg}). Operating in fallback mode.`;
        }

        res.end(
          JSON.stringify({
            configured: keyDetected,
            keyDetected: true,
            authenticated,
            model: activeModel,
            provider: 'Google Gemini AI',
            status: authenticated ? 'ready' : 'key_detected',
            message,
          })
        );
      });

      // 2. POST /api/ai-analyze endpoint
      server.middlewares.use('/api/ai-analyze', async (req: IncomingMessage, res: ServerResponse) => {
        res.setHeader('Content-Type', 'application/json');

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        const { apiKey, model } = getEnvConfig();

        // Check if API key is present
        if (!apiKey || apiKey.length < 5) {
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              success: false,
              fallback: true,
              reason: 'NO_API_KEY',
              message:
                'GEMINI_API_KEY is not set on the backend server. Falling back transparently to the deterministic heuristic engine.',
            })
          );
          return;
        }

        // Collect request body with size limits (100 KB max)
        const MAX_BODY_BYTES = 100 * 1024;
        let body = '';
        let bodyTooLarge = false;

        req.on('data', (chunk) => {
          body += chunk;
          if (body.length > MAX_BODY_BYTES) {
            bodyTooLarge = true;
          }
        });

        req.on('end', async () => {
          if (bodyTooLarge) {
            res.statusCode = 413;
            res.end(JSON.stringify({ success: false, error: 'Payload Too Large: Job posting exceeds 100 KB limit' }));
            return;
          }

          try {
            const parsed = JSON.parse(body || '{}');
            const { text, title, channel } = parsed;

            if (!text || typeof text !== 'string' || text.trim().length === 0) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Job text is required' }));
              return;
            }

            if (text.length > 50000) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Job text exceeds 50,000 character maximum limit.' }));
              return;
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
                contents: [
                  {
                    parts: [{ text: prompt }],
                  },
                ],
                generationConfig: {
                  responseMimeType: 'application/json',
                  temperature: 0.2,
                },
              }),
            });

            // If the specified model returns 404 (e.g. gemini-1.5-flash is retired), try gemini-2.5-flash
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
                  contents: [
                    {
                      parts: [{ text: prompt }],
                    },
                  ],
                  generationConfig: {
                    responseMimeType: 'application/json',
                    temperature: 0.2,
                  },
                }),
              });
            }

            clearTimeout(timeoutId);

            if (!geminiRes.ok) {
              const errText = await geminiRes.text();
              console.warn('[OpportunityLens Backend] Gemini API call returned error:', geminiRes.status, errText);
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  success: false,
                  fallback: true,
                  reason: 'API_ERROR',
                  message: `Gemini API returned status ${geminiRes.status}. Using deterministic rule-based fallback.`,
                })
              );
              return;
            }

            const geminiData = (await geminiRes.json()) as {
              candidates?: Array<{
                content?: {
                  parts?: Array<{ text?: string }>;
                };
              }>;
            };
            const rawContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!rawContent) {
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  success: false,
                  fallback: true,
                  reason: 'EMPTY_AI_RESPONSE',
                  message: 'Gemini returned an empty response. Falling back to rule engine.',
                })
              );
              return;
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

            const parsedOutput: GeminiExtractionResponse = JSON.parse(cleaned);

            res.statusCode = 200;
            res.end(
              JSON.stringify({
                success: true,
                fallback: false,
                provider: targetModel,
                data: parsedOutput,
              })
            );
          } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            console.warn('[OpportunityLens Backend] AI Analysis failed, falling back:', errorMsg);
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                success: false,
                fallback: true,
                reason: 'EXCEPTION',
                message: `Backend processing error: ${errorMsg}. Falling back to deterministic rule engine.`,
              })
            );
          }
        });
      });
    },
  };
}
