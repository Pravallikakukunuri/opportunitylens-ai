export type RiskLevel = 'low' | 'medium' | 'high';

export type ApplicationStatus =
  | 'interested'
  | 'applied'
  | 'interviewing'
  | 'offer'
  | 'rejected'
  | 'archived';

export interface TextEvidence {
  id: string;
  category: 'payment_request' | 'unprofessional_communication' | 'vague_spec' | 'suspicious_contact' | 'urgent_pressure' | 'unrealistic_compensation' | 'impersonation_scam' | 'other';
  quote: string;
  explanation: string;
  severity: 'high' | 'medium' | 'low';
}

export interface AIInference {
  id: string;
  observation: string;
  hypothesis: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface UnknownInformation {
  id: string;
  question: string;
  recommendation: string;
  verificationScope: 'Corporate Registration' | 'Official Domain' | 'Recruiter Authorization' | 'Interview Format';
}

export interface ScoringMethodology {
  baselineUncertainty: number; // Inherent uncertainty of plain text (minimum 15 points)
  redFlagPoints: number;
  positiveDeductions: number;
  rawCalculatedScore: number;
  finalScore: number;
  formulaSummary: string;
  limitations: string[];
  sensitivityMode?: 'conservative' | 'balanced' | 'lenient';
}

export type AnalysisProvider = 'gemini-1.5-flash' | 'gemini-2.0-flash' | 'gemini-2.5-flash' | 'deterministic-rules' | (string & {});

export interface RiskAssessment {
  riskLevel: RiskLevel;
  riskScore: number; // 15 (minimum baseline uncertainty) to 100 (highest risk)
  summary: string;
  verdictDisclaimer: string;
  evidenceFromText: TextEvidence[];
  aiInferences: AIInference[];
  unknownInformation: UnknownInformation[];
  actionChecklist: string[];
  scoringMethodology: ScoringMethodology;
  analysisProvider?: AnalysisProvider;
  aiExplanation?: string;
}

export interface MatchedSkill {
  name: string;
  category: string;
  weight: number; // 2 for required, 1 for preferred
  studentProficiency?: 'beginner' | 'intermediate' | 'advanced';
  requiredLevel: 'required' | 'preferred';
  origin: 'explicit' | 'inferred';
  evidenceSnippet?: string;
}

export interface MissingSkill {
  name: string;
  category: string;
  importance: 'critical' | 'secondary';
  requiredLevel: 'required' | 'preferred';
  weight: number;
  origin: 'explicit' | 'inferred';
  evidenceSnippet?: string;
}

export interface SkillMatchCalculation {
  matchPercentage: number; // Weighted match percentage
  unweightedMatchPercentage: number; // Raw count percentage (e.g. 5 of 7 = 71%)
  totalRequiredCount: number;
  matchedCount: number;
  criticalMissingCount: number;
  matchedSkills: MatchedSkill[];
  missingSkills: MissingSkill[];
  bonusSkills: string[];
  isIncompleteDescription?: boolean;
  descriptionWarning?: string;
  analysisProvider?: AnalysisProvider;
  formulaExplanation: {
    coreMatched: number;
    coreTotal: number;
    secondaryMatched: number;
    secondaryTotal: number;
    numerator: number;
    denominator: number;
    requiredWeight: number;
    preferredWeight: number;
    formula: string;
    unweightedFormula: string;
    calculationSteps: string[];
  };
}

export interface LearnResource {
  title: string;
  type: 'free_course' | 'documentation' | 'interactive';
  url: string;
  timeEstimate: string;
  provider: string;
}

export interface SkillRoadmap {
  skillName: string;
  category: string;
  learn: {
    coreConcepts: string[];
    resources: LearnResource[];
  };
  build: {
    projectTitle: string;
    projectDescription: string;
    deliverables: string[];
    estimatedHours: number;
  };
  practice: {
    interviewQuestions: string[];
    codingChallenges: string[];
    keyTakeaway: string;
  };
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  rawText: string;
  sourceChannel: 'LinkedIn' | 'Telegram' | 'WhatsApp' | 'Email' | 'Campus Drive' | 'Internshala' | 'Company Portal' | 'Other';
  jobType: 'Internship' | 'Full-time' | 'Part-time' | 'Contract' | 'Unknown';
  workMode: 'Remote' | 'On-site' | 'Hybrid' | 'Unknown';
  salaryStipend?: string;
  contactDetail?: string;
  createdAt: string;
  status: ApplicationStatus;
  userNotes?: string;
  riskAssessment: RiskAssessment;
  skillMatch: SkillMatchCalculation;
  roadmaps: SkillRoadmap[];
  verificationChecklist?: Record<string, boolean>;
  isDemoSeed?: boolean;
  analysisProvider?: AnalysisProvider;
}

export interface UserSkill {
  id: string;
  name: string;
  category: 'Languages' | 'Frontend' | 'Backend' | 'Database' | 'Cloud & DevOps' | 'AI & Data' | 'Tools & Methods' | 'Soft Skills';
  level: 'beginner' | 'intermediate' | 'advanced';
  yearsExperience?: number;
}

export interface UserProfile {
  name: string;
  headline: string;
  education: string;
  gradYear: string;
  targetRoles: string[];
  skills: UserSkill[];
  bio: string;
}

export interface AppSettings {
  aiEngine: 'auto' | 'gemini-1.5-flash' | 'gemini-2.0-flash' | 'gemini-2.5-flash' | 'deterministic-rules';
  riskSensitivity: 'conservative' | 'balanced' | 'lenient';
  enableScamAlertsBanner: boolean;
  theme: 'navy-light' | 'navy-dark';
}

export interface AppNotification {
  id: string;
  type: 'scam_alert' | 'due_diligence' | 'pipeline_update' | 'skill_gap';
  title: string;
  message: string;
  timestamp: string;
  opportunityId?: string;
  severity: 'high' | 'medium' | 'low';
  read: boolean;
}

