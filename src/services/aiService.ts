import type {
  Opportunity,
  UserProfile,
  RiskAssessment,
  SkillMatchCalculation,
  SkillRoadmap,
  AnalysisProvider,
  TextEvidence,
} from '../types';
import { analyzeOpportunityRisk } from './riskEngine';
import { extractSkillsFromJobText, computeSkillMatch } from './skillEngine';
import type { ExtractedSkillsResult } from './skillEngine';
import { generateRoadmapsForMissingSkills } from './roadmapEngine';

export interface AIStatusResponse {
  configured: boolean;
  keyDetected?: boolean;
  authenticated?: boolean;
  model: string;
  provider: string;
  status: 'ready' | 'key_detected' | 'unconfigured' | 'error';
  message: string;
  error?: string;
}

export interface AnalysisExecutionResult {
  risk: RiskAssessment;
  skillMatch: SkillMatchCalculation;
  roadmaps: SkillRoadmap[];
  opportunityObject: Opportunity;
  analysisProvider: AnalysisProvider;
  fallbackReason?: string;
  aiExplanation?: string;
}

export async function checkAiBackendStatus(): Promise<AIStatusResponse> {
  try {
    const res = await fetch('/api/ai-status', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return {
        configured: Boolean(data.configured),
        keyDetected: Boolean(data.keyDetected),
        authenticated: Boolean(data.authenticated),
        model: data.model || 'gemini-2.5-flash',
        provider: data.provider || 'Google Gemini AI',
        status: data.status || (data.authenticated ? 'ready' : data.configured ? 'key_detected' : 'unconfigured'),
        message:
          data.message ||
          (data.authenticated
            ? 'Gemini backend endpoint is authenticated and ready for NLP extraction.'
            : data.configured
            ? 'Gemini API key detected in environment. Verifying connection...'
            : 'GEMINI_API_KEY is not configured in backend environment (.env). Operating in deterministic rule-based fallback mode.'),
      };
    } else {
      return {
        configured: false,
        keyDetected: false,
        authenticated: false,
        model: 'gemini-2.5-flash',
        provider: 'Google Gemini AI',
        status: 'error',
        message: `Backend returned HTTP ${res.status}. Operating in deterministic fallback mode.`,
        error: `HTTP ${res.status}`,
      };
    }
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'Backend offline or unreachable';
    return {
      configured: false,
      keyDetected: false,
      authenticated: false,
      model: 'gemini-2.5-flash',
      provider: 'Google Gemini AI',
      status: 'error',
      message: `Cannot connect to backend endpoint (/api/ai-status): ${errMsg}. Operating in local rule fallback mode.`,
      error: errMsg,
    };
  }
}

export async function executeOpportunityAnalysis(params: {
  text: string;
  title: string;
  company: string;
  channel: Opportunity['sourceChannel'];
  jobType: Opportunity['jobType'];
  workMode: Opportunity['workMode'];
  salaryStipend?: string;
  contactDetail?: string;
  profile: UserProfile;
  activeOpportunityId?: string;
  existingChecklist?: Record<string, boolean>;
  riskSensitivity?: 'conservative' | 'balanced' | 'lenient';
}): Promise<AnalysisExecutionResult> {
  const {
    text,
    title,
    company,
    channel,
    jobType,
    workMode,
    salaryStipend,
    contactDetail,
    profile,
    activeOpportunityId,
    existingChecklist,
    riskSensitivity = 'balanced',
  } = params;

  let aiExplanation: string | undefined;
  let fallbackReason: string | undefined;

  // Step 1: Attempt Gemini AI Backend Analysis
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch('/api/ai-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        text,
        title,
        channel,
      }),
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const responseData = await res.json();

      if (responseData.success && responseData.data) {
        const aiData = responseData.data;
        aiExplanation = aiData.summaryExplanation;
        const activeProvider: AnalysisProvider = (responseData.provider as AnalysisProvider) || 'gemini-2.5-flash';

        // Construct ExtractedSkillsResult from AI extraction
        const coreSkills: string[] = Array.isArray(aiData.coreSkills) ? aiData.coreSkills : [];
        const secondarySkills: string[] = Array.isArray(aiData.secondarySkills) ? aiData.secondarySkills : [];
        const inferredSkills: string[] = Array.isArray(aiData.inferredSkills) ? aiData.inferredSkills : [];

        // Build skillMetadata Map
        const skillMetadata = new Map<string, { origin: 'explicit' | 'inferred'; level: 'required' | 'preferred'; evidenceSnippet?: string }>();

        coreSkills.forEach((s) => {
          skillMetadata.set(s, {
            origin: 'explicit',
            level: 'required',
            evidenceSnippet: `Extracted as required requirement by ${activeProvider} NLP`,
          });
        });

        secondarySkills.forEach((s) => {
          skillMetadata.set(s, {
            origin: 'explicit',
            level: 'preferred',
            evidenceSnippet: `Extracted as preferred / bonus requirement by ${activeProvider} NLP`,
          });
        });

        inferredSkills.forEach((s) => {
          skillMetadata.set(s, {
            origin: 'inferred',
            level: 'preferred',
            evidenceSnippet: `Inferred prerequisite recommended by AI for role "${title}"`,
          });
        });

        const allSecondary = [...secondarySkills, ...inferredSkills];
        const extractedResult: ExtractedSkillsResult = {
          core: coreSkills,
          secondary: allSecondary,
          skillMetadata,
          isIncompleteDescription: text.trim().split(/\s+/).length < 20,
          wordCount: text.trim().split(/\s+/).length,
        };

        // Deterministic Mathematical Scoring from AI-extracted requirements
        const skillMatch = computeSkillMatch(extractedResult, profile.skills);
        skillMatch.analysisProvider = activeProvider;

        // Deterministic Risk Assessment enhanced with AI warning quotes
        const baseRisk = analyzeOpportunityRisk(text, channel, riskSensitivity);

        // Merge AI-identified warning signs into text evidence if novel
        if (Array.isArray(aiData.warningSigns) && aiData.warningSigns.length > 0) {
          aiData.warningSigns.forEach((ws: { quote?: string; explanation?: string; category?: TextEvidence['category']; severity?: TextEvidence['severity'] }, idx: number) => {
            if (ws.quote && !baseRisk.evidenceFromText.some((e) => e.quote.toLowerCase() === ws.quote?.toLowerCase())) {
              baseRisk.evidenceFromText.push({
                id: `ai-ws-${idx + 1}`,
                category: ws.category || 'other',
                quote: ws.quote,
                explanation: ws.explanation || `Contextual anomaly flagged by ${activeProvider} NLP`,
                severity: ws.severity || 'medium',
              });
            }
          });
        }

        // Add Gemini contextual inference
        baseRisk.aiInferences.unshift({
          id: 'inf-gemini-summary',
          observation: `${activeProvider} Analysis: ${aiExplanation || 'Analyzed contextual posting patterns'}`,
          hypothesis: 'Semantic NLP extraction validated against deterministic scoring rules.',
          confidence: 'high',
        });

        baseRisk.analysisProvider = activeProvider;
        baseRisk.aiExplanation = aiExplanation;

        const roadmaps = generateRoadmapsForMissingSkills(skillMatch.missingSkills);

        const oppId = activeOpportunityId || `opp-${Date.now()}`;
        const opportunityObject: Opportunity = {
          id: oppId,
          title: title || 'Untitled Opportunity',
          company: company || 'Unspecified Organization',
          rawText: text,
          sourceChannel: channel,
          jobType,
          workMode,
          salaryStipend: salaryStipend?.trim() || undefined,
          contactDetail: contactDetail?.trim() || undefined,
          createdAt: new Date().toISOString(),
          status: 'interested',
          riskAssessment: baseRisk,
          skillMatch,
          roadmaps,
          verificationChecklist: existingChecklist || {},
          analysisProvider: activeProvider,
          isDemoSeed: false,
        };

        return {
          risk: baseRisk,
          skillMatch,
          roadmaps,
          opportunityObject,
          analysisProvider: activeProvider,
          aiExplanation,
        };
      } else {
        fallbackReason = responseData.message || 'AI service returned fallback flag.';
      }
    } else {
      fallbackReason = `Backend HTTP ${res.status}`;
    }
  } catch (err: unknown) {
    fallbackReason = err instanceof Error ? err.message : 'Network error or backend offline';
  }

  // Step 2: Transparent Rule-Based Deterministic Fallback
  // (Executed when Gemini API key is unconfigured or call fails)
  const risk = analyzeOpportunityRisk(text, channel, riskSensitivity);
  risk.analysisProvider = 'deterministic-rules';

  const jobSkills = extractSkillsFromJobText(text, title);
  const skillMatch = computeSkillMatch(jobSkills, profile.skills);
  skillMatch.analysisProvider = 'deterministic-rules';

  const roadmaps = generateRoadmapsForMissingSkills(skillMatch.missingSkills);

  const oppId = activeOpportunityId || `opp-${Date.now()}`;
  const opportunityObject: Opportunity = {
    id: oppId,
    title: title || 'Untitled Opportunity',
    company: company || 'Unspecified Organization',
    rawText: text,
    sourceChannel: channel,
    jobType,
    workMode,
    salaryStipend: salaryStipend?.trim() || undefined,
    contactDetail: contactDetail?.trim() || undefined,
    createdAt: new Date().toISOString(),
    status: 'interested',
    riskAssessment: risk,
    skillMatch,
    roadmaps,
    verificationChecklist: existingChecklist || {},
    analysisProvider: 'deterministic-rules',
    isDemoSeed: false,
  };

  return {
    risk,
    skillMatch,
    roadmaps,
    opportunityObject,
    analysisProvider: 'deterministic-rules',
    fallbackReason,
  };
}
