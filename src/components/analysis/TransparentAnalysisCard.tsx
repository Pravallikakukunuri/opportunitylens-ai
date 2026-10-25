import React, { useState } from 'react';
import type { Opportunity, RiskAssessment, SkillMatchCalculation } from '../../types';
import {
  SearchCode,
  FileText,
  BrainCircuit,
  HelpCircle,
  Calculator,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface TransparentAnalysisCardProps {
  opportunity: Opportunity;
  riskAssessment: RiskAssessment;
  skillMatch: SkillMatchCalculation;
}

export const TransparentAnalysisCard: React.FC<TransparentAnalysisCardProps> = ({
  opportunity,
  riskAssessment,
  skillMatch,
}) => {
  const [activeTab, setActiveTab] = useState<'facts' | 'inferences' | 'unknowns' | 'risk_math' | 'skill_math'>('facts');

  const { scoringMethodology } = riskAssessment;
  const { formulaExplanation } = skillMatch;

  // Extract explicit skills vs inferred skills
  const explicitSkills = [
    ...skillMatch.matchedSkills.filter((s) => s.origin === 'explicit'),
    ...skillMatch.missingSkills.filter((s) => s.origin === 'explicit'),
  ];
  const inferredSkills = [
    ...skillMatch.matchedSkills.filter((s) => s.origin === 'inferred'),
    ...skillMatch.missingSkills.filter((s) => s.origin === 'inferred'),
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <SearchCode className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                Transparent Analysis & Mathematical Audit
              </h3>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              Complete provenance breakdown: facts directly extracted from submitted text, heuristic inferences, unknown verification data, and exact scoring calculations.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono px-3 py-1 rounded-xl bg-indigo-900/60 text-indigo-200 border border-indigo-700/50">
              Audit Transparency Engine
            </span>
          </div>
        </div>

        {/* Audit Tabs */}
        <div className="flex gap-2 mt-5 overflow-x-auto pb-1">
          {[
            { id: 'facts', label: '1. Direct Description Facts', icon: FileText },
            { id: 'inferences', label: '2. System Inferences', icon: BrainCircuit },
            { id: 'unknowns', label: '3. Unknown Information', icon: HelpCircle },
            { id: 'risk_math', label: '4. Risk Score Math', icon: ShieldAlert },
            { id: 'skill_math', label: '5. Skill-Match Math', icon: Calculator },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {/* TAB 1: Direct Description Facts */}
        {activeTab === 'facts' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Information Directly Sourced From Submitted Description</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  These data points were explicitly quoted or extracted word-for-word from the text.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Ground Truth Text
              </span>
            </div>

            {/* Extracted Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Stated Role / Title</span>
                <strong className="text-slate-900 font-semibold">{opportunity.title}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Stated Organization</span>
                <strong className="text-slate-900 font-semibold">{opportunity.company}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Recruiter Channel</span>
                <strong className="text-slate-900 font-semibold">{opportunity.sourceChannel}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Stated Compensation</span>
                <strong className="text-slate-900 font-semibold">{opportunity.salaryStipend || 'Unspecified'}</strong>
              </div>
            </div>

            {/* Verbatim Warning Signal Quotes */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Verbatim Text Snippets Triggering Warning Flags ({riskAssessment.evidenceFromText.length})</span>
              </div>
              {riskAssessment.evidenceFromText.length > 0 ? (
                <div className="space-y-2.5">
                  {riskAssessment.evidenceFromText.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-rose-200/90 bg-rose-50/40 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-900">{item.explanation}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                          {item.category.replace('_', ' ')}
                        </span>
                      </div>
                      {item.quote && (
                        <blockquote className="border-l-2 border-rose-400 pl-2.5 italic text-slate-700 bg-white/70 py-1 rounded-r">
                          &ldquo;{item.quote}&rdquo;
                        </blockquote>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No explicit scam indicator keywords or payment demand phrases were detected in the text.</span>
                </div>
              )}
            </div>

            {/* Explicit Skills Stated in Text */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Explicitly Stated Skills Found in Job Description ({explicitSkills.length})</span>
              </div>
              {explicitSkills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {explicitSkills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">{skill.name}</span>
                        <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {skill.requiredLevel === 'required' ? 'Required (2.0x)' : 'Preferred (1.0x)'}
                        </span>
                      </div>
                      {skill.evidenceSnippet ? (
                        <div className="text-[11px] font-mono text-slate-600 truncate bg-white p-1 rounded border border-slate-100">
                          &ldquo;{skill.evidenceSnippet}&rdquo;
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500">Explicitly listed in requirements section</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                  No technical skills were explicitly stated in the submitted description.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: System Inferences */}
        {activeTab === 'inferences' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-indigo-600" />
                  <span>Analytical Inferences & Channel Hypotheses</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  These insights are deductive inferences derived by pattern matching, not verbatim quotes.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                System Inferences
              </span>
            </div>

            {/* Inferred Hypotheses from Risk Engine */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Recruiter Behavior & Channel Hypotheses ({riskAssessment.aiInferences.length})
              </div>
              <div className="space-y-2.5">
                {riskAssessment.aiInferences.map((inf) => (
                  <div
                    key={inf.id}
                    className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/30 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-950">{inf.hypothesis}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        Confidence: {inf.confidence}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{inf.observation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inferred Skills */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Inferred Skill Requirements Based on Job Title ({inferredSkills.length})
              </div>
              {inferredSkills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {inferredSkills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-slate-900 font-bold">{skill.name}</strong>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Inferred Requirement
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Inferred from standard industry expectations for the role: &ldquo;{opportunity.title}&rdquo;.
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  Zero skills were inferred. All evaluated skills were directly present in the submitted text.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Unknown Information */}
        {activeTab === 'unknowns' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-slate-600" />
                  <span>Information That Remains Unknown From Text Alone</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  External off-platform facts that cannot be verified solely from a pasted job description.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                Unverified External Data
              </span>
            </div>

            {/* Critical Principle Notice */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Ethical Verification Principle: Missing Information Is NOT Fraud</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                A missing company registration number, lack of an official corporate email domain, or brief description in a text message is <strong>not proof of malicious fraud</strong>. Many genuine early-stage startups, university labs, non-profits, and small businesses lack formal enterprise job portals.
              </p>
            </div>

            {/* Unknown Data Cards */}
            <div className="space-y-3">
              {riskAssessment.unknownInformation.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.question}</span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Scope: {item.verificationScope}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-[11px] text-slate-700 flex items-start gap-2">
                    <span className="font-bold text-indigo-600 shrink-0">Safe Due Diligence Step:</span>
                    <span>{item.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Risk Score Math */}
        {activeTab === 'risk_math' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Mathematical Derivation of Job Risk Index</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  How the {riskAssessment.riskScore}/100 score was calculated from baseline uncertainty and detected signals.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Final Risk Score</span>
                <span className="text-lg font-extrabold text-slate-900">{riskAssessment.riskScore} / 100</span>
              </div>
            </div>

            {/* Formula Block */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 font-mono text-xs space-y-2">
              <div className="text-indigo-400 font-bold">Calculation Formula:</div>
              <div className="p-2.5 bg-slate-800 rounded-lg text-emerald-300 font-bold text-xs sm:text-sm">
                Final Score = min(98, max(5, Baseline(15) + RedFlagPenalties - PositiveDeductions))
              </div>
              <div className="text-[11px] text-slate-400">
                Formula explanation: {scoringMethodology.formulaSummary}
              </div>
            </div>

            {/* Step by Step Math */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40">
                <span className="text-slate-500 block mb-1 font-semibold">1. Baseline Uncertainty</span>
                <strong className="text-xl font-bold text-indigo-900">{scoringMethodology.baselineUncertainty} pts</strong>
                <p className="text-[11px] text-slate-600 mt-1">
                  Guaranteed floor: No text-only posting can receive a 0% score because off-platform identity cannot be verified from raw text alone.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40">
                <span className="text-slate-500 block mb-1 font-semibold">2. Red Flag Penalties</span>
                <strong className="text-xl font-bold text-rose-700">+{scoringMethodology.redFlagPoints} pts</strong>
                <p className="text-[11px] text-slate-600 mt-1">
                  Sum of weighted risk points triggered by suspicious phrases and high-risk recruitment channels.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                <span className="text-slate-500 block mb-1 font-semibold">3. Structure Deductions</span>
                <strong className="text-xl font-bold text-emerald-700">-{scoringMethodology.positiveDeductions} pts</strong>
                <p className="text-[11px] text-slate-600 mt-1">
                  Credits subtracted for legitimate career portals, structured multi-round interviews, and corporate domains.
                </p>
              </div>
            </div>

            {/* Limitations Notice */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <strong className="font-bold text-slate-800">Scoring Limitation Notice:</strong>
              <p className="text-[11px] leading-relaxed">
                OpportunityLens AI does not label an opportunity &ldquo;verified&rdquo; or &ldquo;guaranteed safe&rdquo; merely because no scam indicators were detected. Scammers continuously adapt phrasing to bypass filters. Always conduct independent student due diligence before sharing confidential documents.
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: Skill-Match Math */}
        {activeTab === 'skill_math' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-indigo-600" />
                  <span>Mathematical Derivation of Skill Match Percentage</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Transparent weighted formula calculating how your profile fits the requirements.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Overall Fit</span>
                <span className="text-lg font-extrabold text-indigo-600">{skillMatch.matchPercentage}%</span>
              </div>
            </div>

            {/* Incomplete Description Warning Banner if applicable */}
            {skillMatch.isIncompleteDescription && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-1">
                <strong className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Incomplete Job Description Notice</span>
                </strong>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  {skillMatch.descriptionWarning}
                </p>
              </div>
            )}

            {/* Math Formula Card */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 font-mono text-xs space-y-2">
              <div className="text-indigo-400 font-bold">Standard Weighted Formula:</div>
              <div className="p-2.5 bg-slate-800 rounded-lg text-indigo-300 font-bold text-xs sm:text-sm">
                Score % = ((R_matched × 2.0) + (P_matched × 1.0)) / ((R_total × 2.0) + (P_total × 1.0)) × 100%
              </div>
              <div className="text-[11px] text-slate-400">
                Where R = Required Skills (Weight: 2.0x) and P = Preferred Skills (Weight: 1.0x).
              </div>
            </div>

            {/* Calculation Steps Breakdown */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
              <div className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                Step-by-Step Arithmetic Derivation:
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                {formulaExplanation.calculationSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-800">
                    <span className="text-indigo-600 font-bold">›</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Counts Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Required Total</span>
                <strong className="text-base text-slate-900 font-bold">{formulaExplanation.coreTotal}</strong>
                <span className="text-[10px] text-slate-400 block mt-0.5">(Weight: {formulaExplanation.requiredWeight}x each)</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Required Matched</span>
                <strong className="text-base text-emerald-600 font-bold">{formulaExplanation.coreMatched}</strong>
                <span className="text-[10px] text-slate-400 block mt-0.5">Points: {formulaExplanation.coreMatched * formulaExplanation.requiredWeight}</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Preferred Total</span>
                <strong className="text-base text-slate-900 font-bold">{formulaExplanation.secondaryTotal}</strong>
                <span className="text-[10px] text-slate-400 block mt-0.5">(Weight: {formulaExplanation.preferredWeight}x each)</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Preferred Matched</span>
                <strong className="text-base text-indigo-600 font-bold">{formulaExplanation.secondaryMatched}</strong>
                <span className="text-[10px] text-slate-400 block mt-0.5">Points: {formulaExplanation.secondaryMatched * formulaExplanation.preferredWeight}</span>
              </div>
            </div>

            {/* Consistency verification */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <span className="font-semibold">Displayed Percentage Matches Calculated Math:</span>
              <strong className="font-mono text-emerald-800 text-sm">{skillMatch.matchPercentage}%</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
