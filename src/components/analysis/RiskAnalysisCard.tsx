import React, { useState } from 'react';
import type { RiskAssessment } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import {
  FileText,
  BrainCircuit,
  HelpCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Scale,
} from 'lucide-react';

interface RiskAnalysisCardProps {
  assessment: RiskAssessment;
}

export const RiskAnalysisCard: React.FC<RiskAnalysisCardProps> = ({ assessment }) => {
  const [showMethodology, setShowMethodology] = useState(false);
  const { scoringMethodology } = assessment;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header with Risk Level and Score */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              Job Risk & Scam Signal Breakdown
            </h3>
            <RiskBadge level={assessment.riskLevel} size="md" />
          </div>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            {assessment.summary}
          </p>
        </div>

        {/* Risk Score Gauge & Methodology Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Risk Index
              </div>
              <div className="text-xl font-extrabold text-slate-900">
                {assessment.riskScore}<span className="text-xs font-normal text-slate-400">/100</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 flex items-center justify-center font-bold text-xs relative">
              <span
                className={
                  assessment.riskLevel === 'high'
                    ? 'text-rose-600'
                    : assessment.riskLevel === 'medium'
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }
              >
                {assessment.riskScore}%
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowMethodology(!showMethodology)}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Inspect scoring methodology & limitations"
          >
            <Scale className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Methodology</span>
            {showMethodology ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Mandatory Ethical AI Disclaimer */}
      <div className="bg-amber-50/70 border-y border-amber-200/60 px-6 py-3 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-snug">
          <strong className="font-semibold">Ethical AI Principle: </strong>
          {assessment.verdictDisclaimer.replace(/^ETHICAL AI PRINCIPLE:\s*/i, '')}
        </p>
      </div>

      {/* Scoring Methodology & Limitations Drawer */}
      {showMethodology && scoringMethodology && (
        <div className="p-6 bg-slate-900 text-slate-200 border-b border-slate-800 space-y-4 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Scale className="w-4 h-4" />
              <span>Transparent Scoring Methodology & Baseline Uncertainty</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Deterministic Math Engine
            </span>
          </div>

          {/* Formula calculation box */}
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 font-mono text-[11px] space-y-1">
            <div className="text-slate-400">Scoring Formula:</div>
            <div className="text-indigo-300 font-bold">{scoringMethodology.formulaSummary}</div>
          </div>

          {/* 3 Metric Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
              <span className="text-slate-400 block mb-0.5">Baseline Uncertainty Floor:</span>
              <strong className="text-indigo-300 text-sm">{scoringMethodology.baselineUncertainty}%</strong>
              <p className="text-[10px] text-slate-400 mt-1">
                Text alone cannot verify off-platform facts. Minimum uncertainty is capped at 15%.
              </p>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
              <span className="text-slate-400 block mb-0.5">Detected Red Flag Points:</span>
              <strong className="text-rose-400 text-sm">+{scoringMethodology.redFlagPoints} pts</strong>
              <p className="text-[10px] text-slate-400 mt-1">
                Weighted points from explicit suspicious phrases detected in the text.
              </p>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
              <span className="text-slate-400 block mb-0.5">Positive Structure Deductions:</span>
              <strong className="text-emerald-400 text-sm">-{scoringMethodology.positiveDeductions} pts</strong>
              <p className="text-[10px] text-slate-400 mt-1">
                Deductions for verified corporate portals and transparent interview rounds.
              </p>
            </div>
          </div>

          {/* Limitations */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Inherent Limitations of Text-Only Job Analysis:
            </div>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              {scoringMethodology.limitations.map((lim, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Section 1: Evidence in the Submitted Text */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              1. Direct Evidence in Submitted Text
            </h4>
            <span className="text-[11px] font-semibold text-slate-400">
              ({assessment.evidenceFromText.length} specific signals detected)
            </span>
          </div>

          {assessment.evidenceFromText.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                No explicit scam markers (deposit demands, payment requests, Telegram-only redirection, instant job offers) were found in the text.
                <em>(Baseline 15% text uncertainty still applies).</em>
              </span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {assessment.evidenceFromText.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border text-xs ${
                    item.severity === 'high'
                      ? 'bg-rose-50/50 border-rose-200/80 text-rose-950'
                      : item.severity === 'medium'
                      ? 'bg-amber-50/50 border-amber-200/80 text-amber-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-md bg-white border border-current">
                      {item.category.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        item.severity === 'high'
                          ? 'text-rose-700'
                          : item.severity === 'medium'
                          ? 'text-amber-700'
                          : 'text-slate-600'
                      }`}
                    >
                      {item.severity.toUpperCase()} SEVERITY
                    </span>
                  </div>
                  <blockquote className="italic border-l-2 border-current pl-2.5 my-1.5 text-slate-700 font-serif">
                    "{item.quote}"
                  </blockquote>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Analytical Inferences & Pattern Hypotheses */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-violet-50 text-violet-700">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              2. Analytical Inferences (Contextual Hypotheses)
            </h4>
            <span className="text-[11px] font-semibold text-slate-400">
              ({assessment.aiInferences.length} hypotheses)
            </span>
          </div>

          <div className="space-y-2.5">
            {assessment.aiInferences.map((inf) => (
              <div
                key={inf.id}
                className="p-3.5 rounded-xl bg-violet-50/40 border border-violet-200/60 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-violet-900">{inf.observation}</span>
                  <span className="text-[10px] font-semibold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">
                    {inf.confidence} confidence inference
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed mt-1">
                  <strong className="text-slate-800">Hypothesis: </strong>
                  {inf.hypothesis}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Missing / Unknown Verification Data (Kept strictly separate from evidence of fraud) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                3. Missing / Unknown Verification Data
              </h4>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Separate from Fraud Evidence
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            The items below are unverified in the plain text. Missing information is <strong>not proof of fraud</strong>, but marks external due diligence that students must conduct before accepting an offer.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {assessment.unknownInformation.map((unk) => (
              <div
                key={unk.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {unk.verificationScope}
                  </div>
                  <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{unk.question}</span>
                  </div>
                  <p className="text-slate-500 leading-relaxed text-[11px]">
                    {unk.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Action Checklist */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Recommended Student Safeguards
            </h4>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {assessment.actionChecklist.map((action, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
