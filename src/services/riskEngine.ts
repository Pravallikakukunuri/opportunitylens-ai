import type { RiskAssessment, RiskLevel, TextEvidence, AIInference, UnknownInformation, ScoringMethodology } from '../types';

interface RiskRule {
  id: string;
  category: TextEvidence['category'];
  regex: RegExp;
  weight: number;
  explanation: string;
  severity: 'high' | 'medium' | 'low';
}

const RED_FLAG_RULES: RiskRule[] = [
  {
    id: 'rf-deposit',
    category: 'payment_request',
    regex: /(security deposit|refundable deposit|laptop (dispatch|kit|fee)|dispatch fee|registration fee|processing fee|onboarding fee|training fee|uniform fee|pay ₹|transfer ₹|transfer of ₹|deposit of ₹)/i,
    weight: 45,
    explanation: 'Legitimate employers NEVER ask candidates to pay money, transfer funds, or put down a "refundable security deposit" for equipment, training, uniforms, or onboarding.',
    severity: 'high',
  },
  {
    id: 'rf-upi',
    category: 'payment_request',
    regex: /(via upi|gpay|phonepe|paytm|crypto|bitcoin|usdt|telegram wallet|recharge wallet|wire transfer to accounts coordinator)/i,
    weight: 30,
    explanation: 'Demanding peer-to-peer UPI transfers, crypto, or personal wallet payments during the recruitment phase is an immediate sign of advance-fee employment fraud.',
    severity: 'high',
  },
  {
    id: 'rf-free-email',
    category: 'suspicious_contact',
    regex: /([a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|rediffmail\.com))/i,
    weight: 20,
    explanation: 'Official corporate communications originate from verified corporate domain names (e.g., name@company.com), not free public webmail accounts.',
    severity: 'medium',
  },
  {
    id: 'rf-telegram-only',
    category: 'suspicious_contact',
    regex: /(t\.me\/|telegram\s*:\s*@|telegram\s+channel|ping.*telegram|contact.*telegram|join telegram group)/i,
    weight: 25,
    explanation: 'Directing students to anonymous Telegram channels or accounts eliminates verifiable recruiter identity and enables untraceable communication.',
    severity: 'high',
  },
  {
    id: 'rf-no-interview',
    category: 'unrealistic_compensation',
    regex: /(no interview|direct offer|offer letter issued within \d+|without (any )?(interview|screening|test)|guaranteed selection|direct appointment)/i,
    weight: 35,
    explanation: 'Issuing employment contracts or appointment letters without an interview, technical evaluation, or formal screening is a hallmark of bait-and-switch schemes.',
    severity: 'high',
  },
  {
    id: 'rf-unrealistic-pay',
    category: 'unrealistic_compensation',
    regex: /(earn ₹\s*\d+.*daily|earn.*1500.*to.*3000.*daily|typing scanned pdf|data entry.*₹\d{4,}|copy paste job|earn \d+k without skills|daily payout for typing)/i,
    weight: 30,
    explanation: 'Exorbitant compensation promised for unskilled, mechanical tasks (e.g., retyping PDFs or solving captchas) matches standard predatory work-from-home lures.',
    severity: 'high',
  },
  {
    id: 'rf-aadhaar-upfront',
    category: 'unprofessional_communication',
    regex: /(send (your )?aadhaar|submit (your )?aadhaar|pan card copy|bank account details.*before interview|send otp|atm card photo)/i,
    weight: 25,
    explanation: 'Requesting national identity numbers (Aadhaar, PAN) or banking credentials prior to any formal technical interview creates severe identity-theft exposure.',
    severity: 'high',
  },
  {
    id: 'rf-urgency',
    category: 'urgent_pressure',
    regex: /(urgent hiring!!?|limited slots available|act fast|offer expires today|immediate joining required|hurry up|only \d+ seats left)/i,
    weight: 15,
    explanation: 'Artificial urgency and countdown pressure are psychological levers used to bypass the candidate’s rational caution and verification checks.',
    severity: 'low',
  },
  {
    id: 'rf-unpaid-commission',
    category: 'vague_spec',
    regex: /(unpaid during probation|stipend.*nil|commission based on conversions|commission on each student|sales target to get certificate|enroll \d+ students to earn)/i,
    weight: 20,
    explanation: 'Unregulated multi-level marketing or peer-selling tasks disguised as engineering/tech internships. Certificate conditioned on selling products to peers.',
    severity: 'medium',
  },
  {
    id: 'rf-impersonation',
    category: 'impersonation_scam',
    regex: /(google-careers|tcs-hr|infosys-hiring|cisco-recruit|microsoft-offer|amazon-wfh|wipro-select)[\w-]*\.(online|site|live|xyz|top|work)/i,
    weight: 40,
    explanation: 'Domain pattern indicates brand impersonation using deceptive typo-squatted domains rather than the enterprise’s genuine primary domain.',
    severity: 'high',
  },
];

const POSITIVE_INDICATORS: { regex: RegExp; discount: number; label: string }[] = [
  {
    regex: /(will never ask.*for money|never ask.*deposit|no recruitment fee|free of charge|never charge.*(?:fee|money|deposit)|does not charge.*(?:fee|money|deposit))/i,
    discount: 15,
    label: 'Explicit anti-fraud compliance statement found in text',
  },
  {
    regex: /(https?:\/\/[a-zA-Z0-9-]+\.(io|com|org|co\.in|in)\/careers|portal)/i,
    discount: 15,
    label: 'Application routes through an official corporate career portal',
  },
  {
    regex: /(technical interview|live coding|system design|phone screen|interview process|screening round)/i,
    discount: 15,
    label: 'Multi-stage professional interview process outlined',
  },
  {
    regex: /(bachelor's|degree in computer science|practical experience|responsibilities:)/i,
    discount: 10,
    label: 'Clearly structured technical requirements and deliverables',
  },
];

// Baseline uncertainty constant: text analysis alone carries inherent limitations
const BASELINE_UNCERTAINTY_FLOOR = 15;

export function analyzeOpportunityRisk(
  text: string,
  channel: string = 'Other',
  sensitivity: 'conservative' | 'balanced' | 'lenient' = 'balanced'
): RiskAssessment {
  const normalizedText = text || '';
  const evidenceList: TextEvidence[] = [];
  const inferencesList: AIInference[] = [];
  const unknownList: UnknownInformation[] = [];

  let redFlagPoints = 0;

  // 1. Evaluate Direct Text Evidence
  RED_FLAG_RULES.forEach((rule) => {
    const match = rule.regex.exec(normalizedText);
    if (match) {
      // Negation guard: Legitimate employers explicitly declaring "never charges any fee/deposit"
      if (rule.id === 'rf-deposit') {
        const windowStart = Math.max(0, match.index - 60);
        const preceding = normalizedText.slice(windowStart, match.index).toLowerCase();
        if (/\b(never|not|no|does not|do not|without any|won't|will not)\b[\w\s]{0,30}\b(charge|charges|charging|ask|asks|asking|require|requires|demand|demands|collect|collects|pay|accept|take|takes)\b/i.test(preceding)) {
          return; // Skip false positive on employer's anti-fraud disclaimer
        }
      }

      const matchIndex = match.index;
      const start = Math.max(0, normalizedText.lastIndexOf('.', matchIndex) + 1);
      let end = normalizedText.indexOf('.', matchIndex + match[0].length);
      if (end === -1) end = Math.min(normalizedText.length, matchIndex + match[0].length + 80);

      const quote = normalizedText.slice(start, end).trim() || match[0];

      evidenceList.push({
        id: rule.id,
        category: rule.category,
        quote: quote.length > 180 ? quote.slice(0, 177) + '...' : quote,
        explanation: rule.explanation,
        severity: rule.severity,
      });

      // Sensitivity adjustments: Critical deposit/UPI rules remain strong in all modes
      let ruleWeight = rule.weight;
      if (rule.id === 'rf-free-email') {
        if (sensitivity === 'conservative') ruleWeight = 25;
        else if (sensitivity === 'lenient') ruleWeight = 10;
        else ruleWeight = 20;
      } else if (rule.id === 'rf-no-interview') {
        if (sensitivity === 'conservative') ruleWeight = 40;
        else if (sensitivity === 'lenient') ruleWeight = 25;
        else ruleWeight = 35;
      } else if (rule.id === 'rf-unrealistic-pay') {
        if (sensitivity === 'conservative') ruleWeight = 35;
        else if (sensitivity === 'lenient') ruleWeight = 20;
        else ruleWeight = 30;
      } else if (rule.id === 'rf-telegram-only') {
        if (sensitivity === 'conservative') ruleWeight = 30;
        else if (sensitivity === 'lenient') ruleWeight = 15;
        else ruleWeight = 25;
      }

      redFlagPoints += ruleWeight;
    }
  });

  // Channel-specific contextual adjustments
  if (channel === 'Telegram' && !evidenceList.some((e) => e.category === 'suspicious_contact')) {
    const tgPoints = sensitivity === 'conservative' ? 20 : sensitivity === 'lenient' ? 0 : 15;
    if (tgPoints > 0) {
      redFlagPoints += tgPoints;
      inferencesList.push({
        id: 'inf-channel-tg',
        observation: 'Recruitment outreach initiated or routed through Telegram.',
        hypothesis: 'Telegram provides sender anonymity and message self-destruction, widely exploited in student employment scams.',
        confidence: 'medium',
      });
    }
  } else if (channel === 'WhatsApp' && /group|community|dm|ping/i.test(normalizedText)) {
    const waPoints = sensitivity === 'conservative' ? 15 : sensitivity === 'lenient' ? 0 : 10;
    if (waPoints > 0) {
      redFlagPoints += waPoints;
      inferencesList.push({
        id: 'inf-channel-wa',
        observation: 'Outreach delivered through informal WhatsApp group broadcasts or personal DMs.',
        hypothesis: 'Unsolicited WhatsApp job pitches targeting freshers frequently lead to predatory commission schemes or advance-fee scams.',
        confidence: 'medium',
      });
    }
  }

  // 2. Evaluate Positive Signals
  let positiveDeductions = 0;
  POSITIVE_INDICATORS.forEach((ind) => {
    if (ind.regex.test(normalizedText)) {
      positiveDeductions += ind.discount;
    }
  });

  // 3. Generate Analytical Inferences (Contextual Hypotheses)
  if (evidenceList.some((e) => e.category === 'payment_request')) {
    inferencesList.push({
      id: 'inf-advance-fee',
      observation: 'Upfront monetary deposit requested for dispatching equipment or processing credentials.',
      hypothesis: 'Matches the classic "Advance Fee Employment Scam" pattern. Once payment is transferred, the recruiter typically disconnects.',
      confidence: 'high',
    });
  }

  if (evidenceList.some((e) => e.category === 'unrealistic_compensation') && evidenceList.some((e) => e.category === 'unprofessional_communication')) {
    inferencesList.push({
      id: 'inf-predatory-targeting',
      observation: 'Exorbitant compensation promised for minimal skill requirements with zero technical screening.',
      hypothesis: 'Engineered specifically to target financially stressed students seeking rapid pocket money or first-time internship letters.',
      confidence: 'high',
    });
  }

  if (normalizedText.length < 150 && redFlagPoints === 0) {
    if (sensitivity === 'conservative') {
      redFlagPoints += 10;
      inferencesList.push({
        id: 'inf-scant-details-strict',
        observation: 'Extremely brief posting under 150 characters without verifiable employer context.',
        hypothesis: 'Strict mode applies an elevated caution penalty (+10) for insufficient verifiable company details.',
        confidence: 'medium',
      });
    } else {
      inferencesList.push({
        id: 'inf-scant-details',
        observation: 'Extremely brief posting with minimal company or role context.',
        hypothesis: 'Insufficient text provided. High likelihood of missing context; requires requesting an official job description PDF or company link.',
        confidence: 'medium',
      });
    }
  }

  // 4. Missing Verification Data (Explicitly kept separate from evidence of fraud)
  unknownList.push({
    id: 'unk-cin',
    question: 'Corporate Registration / MCA Status',
    recommendation: 'Check the Ministry of Corporate Affairs (MCA) portal or equivalent business registrar to confirm the business entity exists and is active.',
    verificationScope: 'Corporate Registration',
  });

  unknownList.push({
    id: 'unk-career-page',
    question: 'Official Career Portal Listing',
    recommendation: 'Search for this exact role title on the company\'s official website (e.g. company.com/careers). If it exists only on social media chats, proceed with extreme caution.',
    verificationScope: 'Official Domain',
  });

  unknownList.push({
    id: 'unk-recruiter-identity',
    question: 'Recruiter Verified Work Profile',
    recommendation: 'Locate the recruiter on LinkedIn. Verify if they have mutual connections, active company tenure, and an official corporate email domain.',
    verificationScope: 'Recruiter Authorization',
  });

  unknownList.push({
    id: 'unk-interview-format',
    question: 'Physical or Live Video Interview Format',
    recommendation: 'Confirm whether the interview will occur over verified enterprise video (Google Meet, Zoom, MS Teams from company domain) rather than anonymous text messaging.',
    verificationScope: 'Interview Format',
  });

  // 5. Compute Final Risk Score with Baseline Uncertainty Floor
  // Formula: FinalScore = Math.max(BASELINE_UNCERTAINTY_FLOOR, Math.min(100, BASELINE_UNCERTAINTY_FLOOR + redFlagPoints - positiveDeductions))
  const rawCalculatedScore = BASELINE_UNCERTAINTY_FLOOR + redFlagPoints - positiveDeductions;
  const finalScore = Math.max(BASELINE_UNCERTAINTY_FLOOR, Math.min(100, rawCalculatedScore));

  let riskLevel: RiskLevel = 'low';
  if (sensitivity === 'conservative') {
    if (finalScore >= 40 || evidenceList.some((e) => e.severity === 'high')) {
      riskLevel = 'high';
    } else if (finalScore >= 20 || evidenceList.length > 0) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'low';
    }
  } else if (sensitivity === 'lenient') {
    if (finalScore >= 60 || evidenceList.some((e) => e.category === 'payment_request')) {
      riskLevel = 'high';
    } else if (finalScore >= 30 || evidenceList.some((e) => e.severity === 'high')) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'low';
    }
  } else {
    // Balanced mode (default)
    if (finalScore >= 50 || evidenceList.some((e) => e.severity === 'high')) {
      riskLevel = 'high';
    } else if (finalScore >= 25 || evidenceList.length > 0) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'low';
    }
  }

  const sensitivityLabel =
    sensitivity === 'conservative'
      ? 'High Caution (Strict)'
      : sensitivity === 'lenient'
      ? 'Lenient'
      : 'Balanced';

  const scoringMethodology: ScoringMethodology = {
    baselineUncertainty: BASELINE_UNCERTAINTY_FLOOR,
    redFlagPoints,
    positiveDeductions,
    rawCalculatedScore,
    finalScore,
    formulaSummary: `Baseline Uncertainty (${BASELINE_UNCERTAINTY_FLOOR}) + Red Flag Penalty (+${redFlagPoints}) - Verified Structure Discount (-${positiveDeductions}) = ${finalScore}/100 [Sensitivity: ${sensitivityLabel}]`,
    sensitivityMode: sensitivity,
    limitations: [
      'Text-Only Limitation: Scammers can copy-paste authentic job descriptions from legitimate companies into anonymous channels.',
      'No Domain Verification: Plain text pasted by a user cannot cryptographically prove sender identity (SPF/DKIM/DMARC) without email headers.',
      'Offline Realities: An employer may be legitimately registered but maintain toxic or unregulated working conditions not discernible from text alone.',
      'Baseline Uncertainty: A score of 15% represents the irreducible minimum risk of unverified textual claims. No job is ever 0% risk based on text alone.',
    ],
  };

  const actionChecklist: string[] = [
    'Rule #1: NEVER pay money, transfer UPI, or pay registration/deposit fees for any job or internship.',
    'Verify if the sender\'s email domain matches the official corporate website (e.g., @cisco.com vs @cisco-recruiter-mail.com).',
    'Do not share sensitive credentials (Aadhaar full number, OTPs, bank passwords) before formal written offer verification.',
    'Ask for an official Offer Letter on formal corporate letterhead containing CIN, registered address, and official HR phone contact.',
  ];

  if (riskLevel === 'high') {
    actionChecklist.unshift('⚠️ PAUSE: High scam probability indicators detected in text. Do not send funds or private IDs.');
  }

  const summary =
    riskLevel === 'high'
      ? 'High Caution: This posting contains prominent indicators commonly associated with employment fraud or advance-fee requests.'
      : riskLevel === 'medium'
      ? 'Moderate Attention: Several ambiguous or informal signals were detected. Independent company and recruiter verification recommended.'
      : 'Favorable Indicators (Low Risk): Standard professional hiring structure detected. Residual baseline uncertainty applies to all unverified text.';

  const verdictDisclaimer =
    'OpportunityLens AI provides heuristic decision-support based on textual patterns. It does not provide legal guarantees and can never label an opportunity definitely legitimate or fraudulent based on text alone. Always perform independent due diligence.';

  return {
    riskLevel,
    riskScore: finalScore,
    summary,
    verdictDisclaimer,
    evidenceFromText: evidenceList,
    aiInferences: inferencesList,
    unknownInformation: unknownList,
    actionChecklist,
    scoringMethodology,
  };
}
