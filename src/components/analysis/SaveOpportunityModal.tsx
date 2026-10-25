import React, { useState } from 'react';
import type { Opportunity, ApplicationStatus } from '../../types';
import { Modal } from '../common/Modal';
import { BookmarkCheck, Building, Check, RefreshCw } from 'lucide-react';
import { loadOpportunities } from '../../services/storage';

interface SaveOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
  onSave: (savedOpportunity: Opportunity) => void;
}

export const SaveOpportunityModal: React.FC<SaveOpportunityModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  onSave,
}) => {
  const [status, setStatus] = useState<ApplicationStatus>(opportunity.status || 'interested');
  const [notes, setNotes] = useState(opportunity.userNotes || '');

  // Check if an entry with this title + company or ID already exists in storage
  const existingList = loadOpportunities();
  const isExisting = existingList.some(
    (o) =>
      o.id === opportunity.id ||
      (o.title.toLowerCase().trim() === opportunity.title.toLowerCase().trim() &&
        o.company.toLowerCase().trim() === opportunity.company.toLowerCase().trim())
  );

  const statuses: { value: ApplicationStatus; label: string; desc: string }[] = [
    { value: 'interested', label: 'Interested', desc: 'Bookmarked to review, research, or apply later' },
    { value: 'applied', label: 'Applied', desc: 'Resume submitted; waiting for initial response' },
    { value: 'interviewing', label: 'Interviewing', desc: 'Screening or technical rounds scheduled' },
    { value: 'offer', label: 'Offer Received', desc: 'Received formal written offer letter' },
    { value: 'rejected', label: 'Rejected', desc: 'Application not moving forward' },
    { value: 'archived', label: 'Archived / Flagged', desc: 'Scam, inactive, or not pursuing' },
  ];

  const handleSave = () => {
    onSave({
      ...opportunity,
      status,
      userNotes: notes,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isExisting ? 'Update Opportunity in Tracker' : 'Save Opportunity to Tracker'}
      subtitle="Track your application progress, status changes, and private interview notes"
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Duplicate / Existing Indicator Banner */}
        {isExisting && (
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              An entry for <strong>{opportunity.title} at {opportunity.company}</strong> is already in your tracker. Saving will update the existing record without creating duplicates.
            </span>
          </div>
        )}

        {/* Opportunity Summary pill */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <div className="font-bold text-slate-900 text-sm">{opportunity.title}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Building className="w-3.5 h-3.5" />
              <span>{opportunity.company}</span>
              <span>•</span>
              <span>{opportunity.sourceChannel}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              {opportunity.skillMatch.matchPercentage}% Fit
            </span>
          </div>
        </div>

        {/* Application Status Picker */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Select Application Pipeline Status
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {statuses.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStatus(s.value)}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  status === s.value
                    ? 'bg-indigo-50/80 border-indigo-500 ring-1 ring-indigo-500 text-indigo-950 shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold">{s.label}</span>
                  {status === s.value && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Personal Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Private Notes & Reminders
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Applied via university portal. Reached out to recruiter on LinkedIn. Follow-up on Thursday."
            className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all placeholder-slate-400"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>{isExisting ? 'Update Opportunity in Tracker' : 'Save Opportunity to Tracker'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
