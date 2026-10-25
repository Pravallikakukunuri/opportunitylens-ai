import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { Opportunity } from '../types';
import { OpportunityCard } from '../components/saved/OpportunityCard';
import { OpportunityDetailModal } from '../components/saved/OpportunityDetailModal';
import { EmptyState } from '../components/common/EmptyState';
import {
  Search,
  PlusCircle,
  Download,
  BookmarkCheck,
} from 'lucide-react';

interface SavedOpportunitiesPageProps {
  opportunities: Opportunity[];
  onUpdateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  onDeleteOpportunity: (id: string) => void;
}

export const SavedOpportunitiesPage: React.FC<SavedOpportunitiesPageProps> = ({
  opportunities,
  onUpdateOpportunity,
  onDeleteOpportunity,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>(
    location.state?.filterStatus || 'all'
  );
  const [selectedRisk, setSelectedRisk] = useState<string>(
    location.state?.filterRisk || 'all'
  );
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'score_desc' | 'score_asc'>('date_desc');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  const [prevLocationKey, setPrevLocationKey] = useState<string | null>(location.key);

  if (location.key !== prevLocationKey) {
    setPrevLocationKey(location.key);
    if (location.state?.filterStatus) {
      setSelectedStatus(location.state.filterStatus);
    }
    if (location.state?.filterRisk) {
      setSelectedRisk(location.state.filterRisk);
    }
  }

  // Filter & Search Logic
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // Search matching (title, company, skills, or notes)
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesCompany = opp.company.toLowerCase().includes(q);
        const matchesChannel = opp.sourceChannel.toLowerCase().includes(q);
        const matchesNotes = opp.userNotes?.toLowerCase().includes(q);
        const matchesSkills = opp.skillMatch.matchedSkills.some((s) => s.name.toLowerCase().includes(q)) ||
          opp.skillMatch.missingSkills.some((s) => s.name.toLowerCase().includes(q));

        if (!matchesTitle && !matchesCompany && !matchesChannel && !matchesNotes && !matchesSkills) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'all' && opp.status !== selectedStatus) {
        return false;
      }

      // Risk filter
      if (selectedRisk !== 'all' && opp.riskAssessment.riskLevel !== selectedRisk) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'date_asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'score_desc') {
        return b.skillMatch.matchPercentage - a.skillMatch.matchPercentage;
      }
      if (sortBy === 'score_asc') {
        return a.skillMatch.matchPercentage - b.skillMatch.matchPercentage;
      }
      return 0;
    });
  }, [opportunities, searchQuery, selectedStatus, selectedRisk, sortBy]);

  // Status counts for badge tabs
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: opportunities.length };
    opportunities.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [opportunities]);

  // Export JSON
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(opportunities, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `opportunitylens_pipeline_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              Pipeline Management
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
            Saved Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track applications, monitor scam indicators, and keep notes on interview progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Export pipeline to JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export JSON</span>
          </button>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Analyze New</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-4">
        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Opportunities' },
            { id: 'interested', label: 'Interested' },
            { id: 'applied', label: 'Applied' },
            { id: 'interviewing', label: 'Interviewing' },
            { id: 'offer', label: 'Offer Received' },
            { id: 'rejected', label: 'Rejected' },
            { id: 'archived', label: 'Flagged / Archived' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedStatus === st.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{st.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedStatus === st.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {statusCounts[st.id] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Secondary Filter Dropdowns */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, company name, skill (e.g. React), or notes..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Risk filter */}
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all cursor-pointer"
            >
              <option value="all">Risk: All Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Caution</option>
              <option value="high">High Suspicion</option>
            </select>

            {/* Sort order */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all cursor-pointer"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="score_desc">Highest Match Fit</option>
              <option value="score_asc">Lowest Match Fit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredOpportunities.length === 0 ? (
        <EmptyState
          icon={BookmarkCheck}
          title={
            opportunities.length === 0
              ? 'No saved opportunities yet'
              : 'No opportunities match your search filter'
          }
          description={
            opportunities.length === 0
              ? 'Analyze job descriptions or recruiter messages to start tracking your applications and safety scores.'
              : 'Try clearing your search query or switching your status filter.'
          }
          actionText={opportunities.length === 0 ? 'Analyze an Opportunity' : 'Clear Filters'}
          onAction={
            opportunities.length === 0
              ? () => navigate('/analyze')
              : () => {
                  setSearchQuery('');
                  setSelectedStatus('all');
                  setSelectedRisk('all');
                }
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onViewDetails={(o) => setSelectedOpp(o)}
              onStatusChange={(id, status) => onUpdateOpportunity(id, { status })}
              onDelete={onDeleteOpportunity}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <OpportunityDetailModal
        opportunity={selectedOpp}
        isOpen={!!selectedOpp}
        onClose={() => setSelectedOpp(null)}
        onUpdate={onUpdateOpportunity}
      />
    </div>
  );
};
