import React, { useState } from 'react';
import type { Opportunity, ApplicationStatus } from '../../types';
import { Modal } from '../common/Modal';
import { RiskAnalysisCard } from '../analysis/RiskAnalysisCard';
import { SkillGapCard } from '../analysis/SkillGapCard';
import { LearnBuildPracticeCard } from '../analysis/LearnBuildPracticeCard';
import { TransparentAnalysisCard } from '../analysis/TransparentAnalysisCard';
import { VerificationChecklist } from '../common/VerificationChecklist';
import { Save, Check } from 'lucide-react';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Opportunity>) => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'risk' | 'skills' | 'roadmap' | 'audit' | 'text'>('overview');
  const [notes, setNotes] = useState(opportunity?.userNotes || '');
  const [status, setStatus] = useState<ApplicationStatus>(opportunity?.status || 'interested');
  const [checklist, setChecklist] = useState<Record<string, boolean>>(opportunity?.verificationChecklist || {});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [prevOpportunity, setPrevOpportunity] = useState(opportunity);
  if (opportunity !== prevOpportunity) {
    setPrevOpportunity(opportunity);
    setNotes(opportunity?.userNotes || '');
    setStatus(opportunity?.status || 'interested');
    setChecklist(opportunity?.verificationChecklist || {});
  }

  if (!opportunity) return null;

  const handleSaveNotes = () => {
    onUpdate(opportunity.id, {
      userNotes: notes,
      status,
      verificationChecklist: checklist,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleChecklistChange = (updated: Record<string, boolean>) => {
    setChecklist(updated);
    onUpdate(opportunity.id, {
      verificationChecklist: updated,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={opportunity.title}
      subtitle={`${opportunity.company} • ${opportunity.sourceChannel} • ${opportunity.jobType}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Status' },
            { id: 'risk', label: 'Risk Breakdown' },
            { id: 'skills', label: 'Skill Match & Math' },
            { id: 'roadmap', label: 'Learn-Build-Practice' },
            { id: 'audit', label: 'Transparent Audit' },
            { id: 'text', label: 'Original Posting' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview & Notes */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-400 block mb-0.5">Compensation</span>
                <strong className="text-slate-900 text-sm font-bold">
                  {opportunity.salaryStipend || 'Unspecified'}
                </strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-400 block mb-0.5">Work Arrangement</span>
                <strong className="text-slate-900 text-sm font-bold">
                  {opportunity.workMode || 'Remote'}
                </strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-400 block mb-0.5">Recruiter Channel</span>
                <strong className="text-slate-900 text-sm font-bold">
                  {opportunity.sourceChannel}
                </strong>
              </div>
            </div>

            {/* Application Pipeline Status Update */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Update Pipeline Status
                </label>
                {saveSuccess && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved!
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(['interested', 'applied', 'interviewing', 'offer', 'rejected', 'archived'] as ApplicationStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      status === s
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Notes */}
              <div className="pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Private Application Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add meeting notes, recruiter questions, follow-up deadlines..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Updates</span>
                </button>
              </div>
            </div>

            {/* Verification Checklist with Persisted State */}
            <VerificationChecklist
              companyName={opportunity.company}
              initialChecked={checklist}
              onChecklistChange={handleChecklistChange}
            />
          </div>
        )}

        {/* Tab 2: Risk Breakdown */}
        {activeTab === 'risk' && (
          <RiskAnalysisCard assessment={opportunity.riskAssessment} />
        )}

        {/* Tab 3: Skills */}
        {activeTab === 'skills' && (
          <SkillGapCard skillMatch={opportunity.skillMatch} />
        )}

        {/* Tab 4: Roadmap */}
        {activeTab === 'roadmap' && (
          <LearnBuildPracticeCard roadmaps={opportunity.roadmaps} />
        )}

        {/* Tab 5: Transparent Audit */}
        {activeTab === 'audit' && (
          <TransparentAnalysisCard
            opportunity={opportunity}
            riskAssessment={opportunity.riskAssessment}
            skillMatch={opportunity.skillMatch}
          />
        )}

        {/* Tab 6: Raw text */}
        {activeTab === 'text' && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono text-xs whitespace-pre-wrap text-slate-800 leading-relaxed max-h-96 overflow-y-auto">
            {opportunity.rawText}
          </div>
        )}
      </div>
    </Modal>
  );
};
