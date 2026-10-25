import React from 'react';
import type { Opportunity, ApplicationStatus } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { MatchScoreBadge } from '../common/MatchScoreBadge';
import {
  Building,
  Calendar,
  DollarSign,
  MapPin,
  ExternalLink,
  Trash2,
  ChevronDown,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onViewDetails: (opp: Opportunity) => void;
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
  onDelete: (id: string) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onViewDetails,
  onStatusChange,
  onDelete,
}) => {
  const statusColors: Record<ApplicationStatus, { bg: string; text: string; label: string }> = {
    interested: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', label: 'Interested' },
    applied: { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', label: 'Applied' },
    interviewing: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'Interviewing' },
    offer: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: 'Offer Received' },
    rejected: { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-600', label: 'Rejected' },
    archived: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', label: 'Flagged / Archived' },
  };

  const statusConfig = statusColors[opportunity.status] || statusColors.interested;

  const formattedDate = new Date(opportunity.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const verifiedCount = opportunity.verificationChecklist
    ? Object.values(opportunity.verificationChecklist).filter(Boolean).length
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <RiskBadge level={opportunity.riskAssessment.riskLevel} size="sm" />
            <MatchScoreBadge score={opportunity.skillMatch.matchPercentage} size="sm" />
            {opportunity.isDemoSeed && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200" title="Pre-loaded sample for demo purposes">
                Demo
              </span>
            )}
            {opportunity.analysisProvider && opportunity.analysisProvider !== 'deterministic-rules' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1" title={`Analyzed with ${opportunity.analysisProvider}`}>
                <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
                AI
              </span>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative inline-block text-left">
            <select
              value={opportunity.status}
              onChange={(e) => onStatusChange(opportunity.id, e.target.value as ApplicationStatus)}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg border appearance-none pr-6 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-100 ${statusConfig.bg} ${statusConfig.text}`}
            >
              <option value="interested">Interested</option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="offer">Offer Received</option>
              <option value="rejected">Rejected</option>
              <option value="archived">Flagged / Archived</option>
            </select>
            <ChevronDown className="w-3 h-3 text-current absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Job Title & Company */}
        <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1 font-['Plus_Jakarta_Sans']">
          {opportunity.title}
        </h4>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <Building className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-700">{opportunity.company}</span>
          <span>•</span>
          <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
            {opportunity.sourceChannel}
          </span>
        </div>

        {/* Quick Details Chips */}
        <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 mb-4">
          {opportunity.salaryStipend && (
            <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
              <DollarSign className="w-3 h-3 text-slate-400" />
              <span className="truncate max-w-[130px]">{opportunity.salaryStipend}</span>
            </span>
          )}
          <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{opportunity.workMode || 'Remote'}</span>
          </span>
          <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{formattedDate}</span>
          </span>
          {verifiedCount > 0 && (
            <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100 font-semibold" title="Candidate manual verification checklist completed">
              <CheckCircle2 className="w-3 h-3 text-indigo-600" />
              <span>{verifiedCount}/5 Due-Diligence Checks</span>
            </span>
          )}
        </div>

        {/* User Notes Preview */}
        {opportunity.userNotes && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-4 italic line-clamp-2">
            "{opportunity.userNotes}"
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewDetails(opportunity)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
        >
          <span>View Analysis & Plan</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onDelete(opportunity.id)}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          title="Remove opportunity"
          aria-label="Remove opportunity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
