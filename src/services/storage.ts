import type { Opportunity, UserProfile, AppSettings } from '../types';
import { DEFAULT_USER_PROFILE } from '../data/sampleProfile';
import { SAMPLE_PRESETS } from '../data/sampleOpportunities';
import { analyzeOpportunityRisk } from './riskEngine';
import { extractSkillsFromJobText, computeSkillMatch } from './skillEngine';
import { generateRoadmapsForMissingSkills } from './roadmapEngine';

const STORAGE_KEYS = {
  OPPORTUNITIES: 'opportunitylens_opportunities_v1',
  PROFILE: 'opportunitylens_profile_v1',
  SETTINGS: 'opportunitylens_settings_v1',
};

export const DEFAULT_SETTINGS: AppSettings = {
  aiEngine: 'auto',
  riskSensitivity: 'balanced',
  enableScamAlertsBanner: true,
  theme: 'navy-light',
};

function generateInitialOpportunities(profile: UserProfile): Opportunity[] {
  const seeds: { presetIndex: number; status: Opportunity['status']; notes?: string; createdDaysAgo: number }[] = [
    {
      presetIndex: 1, // NovaScale Frontend
      status: 'interviewing',
      notes: 'Passed first screening round on Thursday! Preparing for 60-min live React component pairing session.',
      createdDaysAgo: 3,
    },
    {
      presetIndex: 3, // AetherData Backend
      status: 'applied',
      notes: 'Applied via company careers portal. Reached out to university alum on LinkedIn.',
      createdDaysAgo: 5,
    },
    {
      presetIndex: 0, // Scam sample Telegram
      status: 'archived',
      notes: 'Flagged as high-suspicion scam due to ₹3,999 laptop security deposit and anonymous Telegram contact. DO NOT PROCEED.',
      createdDaysAgo: 7,
    },
    {
      presetIndex: 2, // Unpaid startup intern
      status: 'interested',
      notes: 'Under review: role is unpaid commission-based. Deciding whether to ask for fixed minimum stipend.',
      createdDaysAgo: 1,
    },
  ];

  return seeds.map((s, index) => {
    const preset = SAMPLE_PRESETS[s.presetIndex];
    const risk = analyzeOpportunityRisk(preset.text, preset.channel);
    const jobSkills = extractSkillsFromJobText(preset.text, preset.title);
    const skillMatch = computeSkillMatch(jobSkills, profile.skills);
    const roadmaps = generateRoadmapsForMissingSkills(skillMatch.missingSkills);

    const date = new Date();
    date.setDate(date.getDate() - s.createdDaysAgo);

    return {
      id: `opp-seed-${index + 1}`,
      title: preset.title,
      company: preset.company,
      rawText: preset.text,
      sourceChannel: preset.channel,
      jobType: preset.jobType,
      workMode: preset.workMode,
      salaryStipend: preset.salaryStipend,
      contactDetail: preset.contactDetail,
      createdAt: date.toISOString(),
      status: s.status,
      userNotes: s.notes,
      riskAssessment: risk,
      skillMatch,
      roadmaps,
      isDemoSeed: true,
      analysisProvider: 'deterministic-rules',
      verificationChecklist: {
        'check-fee': s.presetIndex === 1,
        'check-email': s.presetIndex === 1,
      },
    };
  });
}

export function loadUserProfile(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && (parsed.name === 'Priya Sharma' || parsed.name === 'Alex Rivera' || parsed.name === 'Rohan Mehta')) {
        parsed.name = 'Pravallika';
        parsed.headline = 'CSE Student · Class of 2028';
        parsed.education = 'B.Tech in Computer Science and Engineering';
        parsed.gradYear = '2028';
        try {
          localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(parsed));
        } catch {
          // ignore
        }
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load user profile from storage', e);
  }
  return DEFAULT_USER_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile to storage', e);
  }
}

export function loadOpportunities(): Opportunity[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
    if (data !== null) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load opportunities from storage', e);
  }

  const profile = loadUserProfile();
  const initial = generateInitialOpportunities(profile);
  saveOpportunities(initial);
  return initial;
}

export function reseedDemoOpportunities(): Opportunity[] {
  const profile = loadUserProfile();
  const initial = generateInitialOpportunities(profile);
  saveOpportunities(initial);
  return initial;
}

export function clearAllOpportunities(): void {
  saveOpportunities([]);
}

export function saveOpportunities(opportunities: Opportunity[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opportunities));
  } catch (e) {
    console.error('Failed to save opportunities to storage', e);
  }
}

export function saveOrUpdateOpportunity(opportunity: Opportunity): { isUpdate: boolean; saved: Opportunity } {
  const current = loadOpportunities();
  const normTitle = opportunity.title.toLowerCase().trim();
  const normCompany = opportunity.company.toLowerCase().trim();

  const hasDistinctName =
    normTitle.length > 0 &&
    normCompany.length > 0 &&
    normTitle !== 'untitled opportunity' &&
    normCompany !== 'unspecified organization';

  // Deduplication check: match on ID or normalized Title + Company
  const existingIndex = current.findIndex(
    (o) =>
      o.id === opportunity.id ||
      (hasDistinctName &&
        o.title.toLowerCase().trim() === normTitle &&
        o.company.toLowerCase().trim() === normCompany)
  );

  let isUpdate = false;
  let saved: Opportunity;

  if (existingIndex !== -1) {
    const existing = current[existingIndex];
    saved = {
      ...existing,
      ...opportunity,
      id: existing.id, // Preserve original unique ID
      createdAt: existing.createdAt, // Preserve original creation date
      rawText: opportunity.rawText || existing.rawText,
      riskAssessment: opportunity.riskAssessment || existing.riskAssessment,
      skillMatch: opportunity.skillMatch || existing.skillMatch,
      roadmaps: opportunity.roadmaps || existing.roadmaps,
      userNotes: opportunity.userNotes !== undefined ? opportunity.userNotes : existing.userNotes,
      status: opportunity.status || existing.status,
      verificationChecklist: {
        ...(existing.verificationChecklist || {}),
        ...(opportunity.verificationChecklist || {}),
      },
    };
    current[existingIndex] = saved;
    isUpdate = true;
  } else {
    saved = {
      ...opportunity,
      isDemoSeed: opportunity.isDemoSeed ?? false,
    };
    current.unshift(saved);
  }

  saveOpportunities(current);
  return { isUpdate, saved };
}

export function addOpportunity(opportunity: Opportunity): void {
  saveOrUpdateOpportunity(opportunity);
}

export function updateOpportunity(id: string, updates: Partial<Opportunity>): void {
  const current = loadOpportunities();
  const updated = current.map((o) => (o.id === id ? { ...o, ...updates } : o));
  saveOpportunities(updated);
}

export function deleteOpportunity(id: string): void {
  const current = loadOpportunities();
  const updated = current.filter((o) => o.id !== id);
  saveOpportunities(updated);
}

export function loadSettings(): AppSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function resetAllDataToDefault(): void {
  localStorage.removeItem(STORAGE_KEYS.OPPORTUNITIES);
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
}
