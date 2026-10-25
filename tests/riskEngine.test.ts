import { describe, it, expect } from 'vitest';
import { analyzeOpportunityRisk } from '../src/services/riskEngine';

describe('Risk Engine — Deterministic Scoring & Sensitivity Modes', () => {
  const upfrontDepositScam = `
    Job Title: Data Entry Intern
    Company: FastTyping Global
    Requirements: Must pay a refundable security deposit of ₹3,999 for laptop dispatch and credentials setup via UPI.
    Contact: typing_jobs@gmail.com
  `;

  it('flags upfront deposit as HIGH risk in all sensitivity modes (Conservative, Balanced, Lenient)', () => {
    const strictResult = analyzeOpportunityRisk(upfrontDepositScam, 'Telegram', 'conservative');
    const balancedResult = analyzeOpportunityRisk(upfrontDepositScam, 'Telegram', 'balanced');
    const lenientResult = analyzeOpportunityRisk(upfrontDepositScam, 'Telegram', 'lenient');

    expect(strictResult.riskLevel).toBe('high');
    expect(balancedResult.riskLevel).toBe('high');
    expect(lenientResult.riskLevel).toBe('high');

    // Deposit evidence must be captured in all modes
    expect(strictResult.evidenceFromText.some((e) => e.category === 'payment_request')).toBe(true);
    expect(balancedResult.evidenceFromText.some((e) => e.category === 'payment_request')).toBe(true);
    expect(lenientResult.evidenceFromText.some((e) => e.category === 'payment_request')).toBe(true);
  });

  it('differentiates informal channel and free webmail penalties across modes', () => {
    const subtleJob = `
      Seeking a summer intern to help our campus startup with content writing.
      Reach out to founder@gmail.com.
    `;

    const strict = analyzeOpportunityRisk(subtleJob, 'Other', 'conservative');
    const balanced = analyzeOpportunityRisk(subtleJob, 'Other', 'balanced');
    const lenient = analyzeOpportunityRisk(subtleJob, 'Other', 'lenient');

    // Free email penalty: Conservative = 25, Balanced = 20, Lenient = 10
    // Score = 15 baseline + email penalty
    expect(strict.riskScore).toBe(40); // 15 + 25 = 40
    expect(balanced.riskScore).toBe(35); // 15 + 20 = 35
    expect(lenient.riskScore).toBe(25); // 15 + 10 = 25

    // Risk levels should respect thresholds
    expect(strict.riskLevel).toBe('high'); // Threshold >= 40
    expect(balanced.riskLevel).toBe('medium'); // Threshold >= 25
    expect(lenient.riskLevel).toBe('low'); // Threshold < 30
  });

  it('waives Telegram channel penalty in Lenient mode when no payment is requested', () => {
    const neutralJob = `
      Looking for a Graphic Design Intern for our local university festival.
      Requirements: Figma skills, poster design, and team collaboration.
      Apply via our campus drive form.
    `;

    const balanced = analyzeOpportunityRisk(neutralJob, 'Telegram', 'balanced');
    const lenient = analyzeOpportunityRisk(neutralJob, 'Telegram', 'lenient');

    // Balanced applies +15 for Telegram channel
    expect(balanced.riskScore).toBe(30); // 15 baseline + 15 tg = 30
    // Lenient waives Telegram informality when no fraud patterns exist
    expect(lenient.riskScore).toBe(15); // 15 baseline + 0 = 15
  });

  it('enforces the 15% baseline uncertainty floor on all text', () => {
    const legitimateJob = `
      Role: Junior Software Engineer at Microsoft India.
      Location: Hyderabad, India.
      Qualifications: B.Tech in Computer Science. Strong knowledge of Data Structures, Algorithms, and C++.
      Selection Process: Multi-round technical interview and system design pairing on MS Teams.
      Apply through our official careers portal at https://careers.microsoft.com.
      Microsoft never charges any application or processing fee.
    `;

    const result = analyzeOpportunityRisk(legitimateJob, 'Company Portal', 'balanced');
    expect(result.riskScore).toBe(15); // Cannot go below 15%
    expect(result.riskLevel).toBe('low');
    expect(result.scoringMethodology.baselineUncertainty).toBe(15);
  });

  it('includes educational limitations disclaimer in all assessments', () => {
    const result = analyzeOpportunityRisk('Simple job description', 'LinkedIn', 'balanced');
    expect(result.scoringMethodology.limitations.length).toBeGreaterThan(2);
    expect(result.scoringMethodology.limitations[0]).toContain('Text-Only Limitation');
  });
});
