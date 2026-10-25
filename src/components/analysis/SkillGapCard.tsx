import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { SkillMatchCalculation, UserSkill } from '../../types';
import { MatchScoreBadge } from '../common/MatchScoreBadge';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Calculator,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Check,
  AlertCircle,
  Info,
} from 'lucide-react';

interface SkillGapCardProps {
  skillMatch: SkillMatchCalculation;
  onAddSkillToProfile?: (skillName: string, category: string, level: UserSkill['level']) => void;
}

export const SkillGapCard: React.FC<SkillGapCardProps> = ({ skillMatch, onAddSkillToProfile }) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const [addingSkillName, setAddingSkillName] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<UserSkill['level']>('intermediate');

  const { formulaExplanation } = skillMatch;

  const handleConfirmAddSkill = (skillName: string, category: string) => {
    if (onAddSkillToProfile) {
      onAddSkillToProfile(skillName, category, selectedLevel);
    }
    setAddingSkillName(null);
  };

  // Separate matched and missing by Required vs Preferred
  const requiredMatched = skillMatch.matchedSkills.filter((s) => s.requiredLevel === 'required');
  const preferredMatched = skillMatch.matchedSkills.filter((s) => s.requiredLevel === 'preferred');

  const requiredMissing = skillMatch.missingSkills.filter((s) => s.requiredLevel === 'required');
  const preferredMissing = skillMatch.missingSkills.filter((s) => s.requiredLevel === 'preferred');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              Skill Alignment & Gap Analysis
            </h3>
            <MatchScoreBadge score={skillMatch.matchPercentage} size="md" />
          </div>
          <p className="text-xs text-slate-500">
            {skillMatch.formulaExplanation.unweightedFormula}
            {skillMatch.criticalMissingCount > 0 && (
              <span className="text-rose-600 font-semibold ml-1.5">
                ({skillMatch.criticalMissingCount} required core skills missing)
              </span>
            )}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Manage Profile</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowFormulaDetails(!showFormulaDetails)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5 text-indigo-600" />
            <span>Weighting Math</span>
            {showFormulaDetails ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Responsible Metric Alignment Disclaimer */}
      <div className="bg-slate-50/90 border-b border-slate-200/80 px-6 py-2.5 flex items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong className="text-slate-800">Responsible Metric Notice:</strong> Skill alignment measures how closely your current profile aligns with stated requirements. It does <strong>not</strong> measure or predict your probability of getting hired.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] shrink-0 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Explicit (Stated in Text)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Inferred Recommendation
          </span>
        </div>
      </div>

      {/* Incomplete Description Alert */}
      {skillMatch.isIncompleteDescription && (
        <div className="p-4 bg-amber-50 border-b border-amber-200 text-xs text-amber-950 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-900">Brief / Incomplete Job Description Detected</div>
            <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
              {skillMatch.descriptionWarning || 'The submitted text contains minimal details. To adhere to Responsible AI principles, OpportunityLens will only evaluate skills explicitly present in the text without inventing unstated prerequisites.'}
            </p>
          </div>
        </div>
      )}

      {/* Formula Transparency Box */}
      {showFormulaDetails && (
        <div className="p-5 bg-indigo-50/50 border-b border-indigo-100 text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2 mb-2 text-indigo-900 font-bold">
            <Calculator className="w-4 h-4 text-indigo-600" />
            <span>Mathematical Calculation & Weighting Transparency</span>
          </div>
          <p className="text-slate-600 mb-3 leading-relaxed">
            Every percentage displayed by OpportunityLens is strictly derived from the visible prerequisites. <strong>Required Core Skills</strong> carry double weight (<strong>2.0x = 2 points each</strong>) while <strong>Preferred Bonus Skills</strong> carry normal weight (<strong>1.0x = 1 point each</strong>).
          </p>

          <div className="bg-white p-3.5 rounded-xl border border-indigo-200/80 font-mono text-slate-800 text-[11px] overflow-x-auto shadow-xs mb-3">
            <div className="font-semibold text-indigo-950 mb-1">Exact Arithmetic Formula:</div>
            <div className="text-indigo-700">{formulaExplanation.formula}</div>
          </div>

          {/* Step-by-Step Breakdown */}
          {formulaExplanation.calculationSteps && formulaExplanation.calculationSteps.length > 0 && (
            <div className="bg-white/80 p-3.5 rounded-xl border border-indigo-100 text-[11px] space-y-1.5 mb-3 text-slate-700">
              <div className="font-bold text-slate-900 mb-1">Step-by-Step Derivation:</div>
              {formulaExplanation.calculationSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
              <span className="text-slate-500 block">Required Skills (2.0x):</span>
              <strong className="text-slate-900 text-sm">{formulaExplanation.coreMatched} / {formulaExplanation.coreTotal} matched</strong>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
              <span className="text-slate-500 block">Preferred Skills (1.0x):</span>
              <strong className="text-slate-900 text-sm">{formulaExplanation.secondaryMatched} / {formulaExplanation.secondaryTotal} matched</strong>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
              <span className="text-slate-500 block">Weighted Fit Score:</span>
              <strong className="text-indigo-700 text-sm">{skillMatch.matchPercentage}%</strong>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
              <span className="text-slate-500 block">Unweighted Ratio:</span>
              <strong className="text-slate-900 text-sm">{skillMatch.unweightedMatchPercentage}% ({skillMatch.matchedCount}/{skillMatch.totalRequiredCount})</strong>
            </div>
          </div>
        </div>
      )}

      {/* Skill Clusters */}
      <div className="p-6 space-y-6">
        {skillMatch.totalRequiredCount === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
            No technical skills or prerequisites were detected in this posting text. This is common in vague non-technical tasks or generic advertisements.
          </div>
        ) : (
          <>
            {/* Required Skills Section (Weight: 2.0x) */}
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Required Core Skills (Weight: 2.0x)
                  </h4>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {requiredMatched.length} of {formulaExplanation.coreTotal} matched
                </span>
              </div>

              {/* Matched Required */}
              <div className="flex flex-wrap gap-2">
                {requiredMatched.map((skill) => (
                  <div
                    key={skill.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs shadow-xs"
                    title={skill.evidenceSnippet ? `Text quote: "${skill.evidenceSnippet}"` : undefined}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-bold">{skill.name}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-emerald-200/70 text-emerald-800 rounded">
                      {skill.studentProficiency}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                      Required (2x)
                    </span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${skill.origin === 'explicit' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-amber-100 text-amber-900 border-amber-200'}`}>
                      {skill.origin === 'explicit' ? 'Explicit (Stated in Text)' : 'Inferred Recommendation'}
                    </span>
                  </div>
                ))}

                {/* Missing Required */}
                {requiredMissing.map((skill) => (
                  <div
                    key={skill.name}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs shadow-xs"
                    title={skill.evidenceSnippet ? `Text quote: "${skill.evidenceSnippet}"` : undefined}
                  >
                    <div className="flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span className="font-bold">{skill.name}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-rose-200/80 text-rose-800 rounded">
                        Critical Required (2x)
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${skill.origin === 'explicit' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-amber-100 text-amber-900 border-amber-200'}`}>
                        {skill.origin === 'explicit' ? 'Explicit (Stated in Text)' : 'Inferred Recommendation'}
                      </span>
                    </div>

                    {/* Quick Add to profile trigger */}
                    {onAddSkillToProfile && (
                      addingSkillName === skill.name ? (
                        <div className="flex items-center gap-1.5 pl-1.5 border-l border-rose-200">
                          <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value as UserSkill['level'])}
                            className="text-[11px] font-semibold bg-white border border-rose-300 rounded px-1.5 py-0.5 text-slate-800"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleConfirmAddSkill(skill.name, skill.category)}
                            className="p-1 rounded bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                            title="Confirm add to profile"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setAddingSkillName(skill.name)}
                          className="text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-rose-100 hover:bg-rose-200/80 px-2 py-0.5 rounded cursor-pointer transition-colors"
                        >
                          + I have this
                        </button>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Preferred Skills Section (Weight: 1.0x) */}
            {formulaExplanation.secondaryTotal > 0 && (
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Preferred / Bonus Skills (Weight: 1.0x)
                    </h4>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {preferredMatched.length} of {formulaExplanation.secondaryTotal} matched
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {preferredMatched.map((skill) => (
                    <div
                      key={skill.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs shadow-xs"
                      title={skill.evidenceSnippet ? `Text quote: "${skill.evidenceSnippet}"` : undefined}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold">{skill.name}</span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                        Preferred (1x)
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${skill.origin === 'explicit' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-amber-100 text-amber-900 border-amber-200'}`}>
                        {skill.origin === 'explicit' ? 'Explicit (Stated in Text)' : 'Inferred Recommendation'}
                      </span>
                    </div>
                  ))}

                  {preferredMissing.map((skill) => (
                    <div
                      key={skill.name}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs shadow-xs"
                      title={skill.evidenceSnippet ? `Text quote: "${skill.evidenceSnippet}"` : undefined}
                    >
                      <div className="flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                          Preferred (1x)
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${skill.origin === 'explicit' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-amber-100 text-amber-900 border-amber-200'}`}>
                          {skill.origin === 'explicit' ? 'Explicit (Stated in Text)' : 'Inferred Recommendation'}
                        </span>
                      </div>

                      {onAddSkillToProfile && (
                        addingSkillName === skill.name ? (
                          <div className="flex items-center gap-1.5 pl-1.5 border-l border-amber-200">
                            <select
                              value={selectedLevel}
                              onChange={(e) => setSelectedLevel(e.target.value as UserSkill['level'])}
                              className="text-[11px] font-semibold bg-white border border-amber-300 rounded px-1.5 py-0.5 text-slate-800"
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => handleConfirmAddSkill(skill.name, skill.category)}
                              className="p-1 rounded bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                              title="Confirm add to profile"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAddingSkillName(skill.name)}
                            className="text-[11px] font-bold text-amber-800 hover:text-amber-900 bg-amber-100 hover:bg-amber-200/80 px-2 py-0.5 rounded cursor-pointer transition-colors"
                          >
                            + I have this
                          </button>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bonus Skills that Student Has */}
            {skillMatch.bonusSkills.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Your Profile Bonus Assets ({skillMatch.bonusSkills.length})
                  </h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skillMatch.bonusSkills.slice(0, 8).map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium"
                    >
                      +{skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
