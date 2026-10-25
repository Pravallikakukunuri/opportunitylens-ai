import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadUserProfile,
  saveUserProfile,
  loadOpportunities,
  addOpportunity,
  updateOpportunity,
  deleteOpportunity,
  loadSettings,
  saveSettings,
} from '../src/services/storage';
import { DEFAULT_USER_PROFILE } from '../src/data/sampleProfile';
import type { Opportunity, AppSettings, UserProfile } from '../src/types';

class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  clear() {
    this.store.clear();
  }
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null;
  }
}

if (!globalThis.localStorage) {
  // @ts-expect-error polyfill
  globalThis.localStorage = new MemoryStorage();
}

describe('Local Storage Persistence & Lifecycle', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads default profile if storage is empty', () => {
    const profile = loadUserProfile();
    expect(profile.name).toBe(DEFAULT_USER_PROFILE.name);
    expect(profile.skills.length).toBeGreaterThan(0);
  });

  it('persists and restores updated profile across sessions', () => {
    const customProfile: UserProfile = {
      name: 'Pravallika',
      headline: 'CSE Student · Class of 2028',
      education: 'B.Tech in Computer Science and Engineering',
      gradYear: '2028',
      targetRoles: ['Backend Developer'],
      skills: [
        { id: 'b1', name: 'Python', category: 'Languages', level: 'advanced' },
        { id: 'b2', name: 'Java', category: 'Languages', level: 'intermediate' },
        { id: 'b5', name: 'PostgreSQL', category: 'Database', level: 'intermediate' },
      ],
      bio: 'Distributed systems builder.',
    };

    saveUserProfile(customProfile);
    const restored = loadUserProfile();

    expect(restored.name).toBe('Pravallika');
    expect(restored.education).toBe('B.Tech in Computer Science and Engineering');
    expect(restored.skills).toHaveLength(3);
    expect(restored.skills.map((s) => s.name)).toContain('PostgreSQL');
  });

  it('migrates legacy demo names to Pravallika seamlessly', () => {
    localStorage.setItem(
      'opportunitylens_profile_v1',
      JSON.stringify({
        name: 'Priya Sharma',
        headline: 'Backend Developer',
        skills: [{ id: 's1', name: 'Python', category: 'Languages', level: 'intermediate' }],
      })
    );

    const loaded = loadUserProfile();
    expect(loaded.name).toBe('Pravallika');
    expect(loaded.headline).toBe('CSE Student · Class of 2028');
    expect(loaded.skills).toHaveLength(1);
    expect(loaded.skills[0].name).toBe('Python');
  });

  it('initializes default seed opportunities with isDemoSeed flag', () => {
    const opps = loadOpportunities();
    expect(opps.length).toBeGreaterThanOrEqual(4);
    expect(opps.every((o) => o.isDemoSeed === true)).toBe(true);
  });

  it('saves new opportunity without marking it as a demo seed', () => {
    const newOpp: Opportunity = {
      id: 'opp-user-12345',
      title: 'Junior React Engineer',
      company: 'InnovateTech Solutions',
      rawText: 'Looking for a React developer with Git and TypeScript.',
      sourceChannel: 'LinkedIn',
      jobType: 'Full-time',
      workMode: 'Remote',
      createdAt: new Date().toISOString(),
      status: 'applied',
      isDemoSeed: false,
      riskAssessment: {
        riskScore: 15,
        riskLevel: 'low',
        evidenceFromText: [],
        aiInferences: [],
        unknownInformation: [],
        scoringMethodology: {
          baselineUncertainty: 15,
          redFlagPoints: 0,
          positiveDeductions: 10,
          rawCalculatedScore: 5,
          finalScore: 15,
          formulaSummary: 'Deterministic score calculation',
          limitations: [],
        },
      },
      skillMatch: {
        matchPercentage: 80,
        matchedSkills: [],
        missingSkills: [],
        totalRequiredCount: 4,
        coreRequirementCount: 3,
        secondaryRequirementCount: 1,
        coverageCategorySummary: { coreCoverage: 100, secondaryCoverage: 50 },
      },
      roadmaps: [],
      verificationChecklist: {},
      analysisProvider: 'deterministic-rules',
    };

    addOpportunity(newOpp);
    const allOpps = loadOpportunities();
    const retrieved = allOpps.find((o) => o.id === 'opp-user-12345');

    expect(retrieved).toBeDefined();
    expect(retrieved?.isDemoSeed).toBe(false);
    expect(retrieved?.title).toBe('Junior React Engineer');
  });

  it('updates opportunity status and user notes without dropping risk data', () => {
    const opps = loadOpportunities();
    const target = opps[0];

    updateOpportunity(target.id, {
      status: 'offer',
      userNotes: 'Received official offer letter via corporate email. Verified credentials.',
    });

    const refreshed = loadOpportunities();
    const updated = refreshed.find((o) => o.id === target.id);

    expect(updated?.status).toBe('offer');
    expect(updated?.userNotes).toContain('Received official offer letter');
    expect(updated?.riskAssessment.riskScore).toBe(target.riskAssessment.riskScore);
  });

  it('deletes an opportunity from storage cleanly', () => {
    const opps = loadOpportunities();
    const countBefore = opps.length;
    const targetId = opps[0].id;

    deleteOpportunity(targetId);
    const oppsAfter = loadOpportunities();

    expect(oppsAfter).toHaveLength(countBefore - 1);
    expect(oppsAfter.some((o) => o.id === targetId)).toBe(false);
  });

  it('persists risk sensitivity settings correctly', () => {
    const newSettings: AppSettings = {
      aiEngine: 'gemini-2.5-flash',
      riskSensitivity: 'conservative',
      enableScamAlertsBanner: false,
      theme: 'navy-light',
    };

    saveSettings(newSettings);
    const loaded = loadSettings();

    expect(loaded.riskSensitivity).toBe('conservative');
    expect(loaded.aiEngine).toBe('gemini-2.5-flash');
    expect(loaded.enableScamAlertsBanner).toBe(false);
  });
});
