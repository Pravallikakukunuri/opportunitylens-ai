import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Opportunity, UserProfile, ApplicationStatus } from '../types';
import { OpportunityCard } from '../components/saved/OpportunityCard';
import { OpportunityDetailModal } from '../components/saved/OpportunityDetailModal';
import { SAMPLE_PRESETS } from '../data/sampleOpportunities';
import {
  ShieldAlert,
  Target,
  BookmarkCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Send,
  Zap,
  RotateCcw,
  PlusCircle,
  FileSearch,
} from 'lucide-react';

interface DashboardPageProps {
  opportunities: Opportunity[];
  profile: UserProfile;
  onUpdateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  onDeleteOpportunity: (id: string) => void;
  onReseedDemoData?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  opportunities,
  profile,
  onUpdateOpportunity,
  onDeleteOpportunity,
  onReseedDemoData,
}) => {
  const navigate = useNavigate();
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [quickText, setQuickText] = useState('');

  // Dynamically calculate metrics from actual records
  const totalAnalyzed = opportunities.length;
  const demoSeedCount = opportunities.filter((o) => o.isDemoSeed).length;
  const highRiskCount = opportunities.filter((o) => o.riskAssessment.riskLevel === 'high').length;
  const interviewingCount = opportunities.filter((o) => o.status === 'interviewing').length;

  const validScores = opportunities.filter((o) => o.skillMatch.totalRequiredCount > 0);
  const avgMatch =
    validScores.length > 0
      ? Math.round(
          validScores.reduce((acc, curr) => acc + curr.skillMatch.matchPercentage, 0) /
            validScores.length
        )
      : 0;

  // Pipeline status distribution calculated from live storage
  const statusCounts: Record<ApplicationStatus, number> = {
    interested: opportunities.filter((o) => o.status === 'interested').length,
    applied: opportunities.filter((o) => o.status === 'applied').length,
    interviewing: opportunities.filter((o) => o.status === 'interviewing').length,
    offer: opportunities.filter((o) => o.status === 'offer').length,
    rejected: opportunities.filter((o) => o.status === 'rejected').length,
    archived: opportunities.filter((o) => o.status === 'archived').length,
  };

  const handleQuickAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickText.trim()) {
      navigate('/analyze', { state: { prefillText: quickText } });
    }
  };

  const handleLoadSample = (sampleId: string) => {
    navigate('/analyze', { state: { sampleId } });
  };

  const navigateToSavedWithFilter = (filterType: 'status' | 'risk', value: string) => {
    if (filterType === 'status') {
      navigate('/saved', { state: { filterStatus: value } });
    } else {
      navigate('/saved', { state: { filterRisk: value } });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0a1128] via-[#101b3b] to-[#1c2c5b] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OpportunityLens AI • Career Shield</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight mb-2">
            Welcome back, {profile?.name || 'Pravallika'}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
            Your career protection dashboard is actively tracking opportunities. Detect advance-fee scams,
            uncover transparent skill requirements, and follow tailored Learn-Build-Practice roadmaps.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Analyze New Opportunity</span>
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl border border-slate-700 transition-all"
            >
              <span>My Skill Profile ({profile.skills.length} skills)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Safety Alert Ticker & Demo Data Indicator */}
      <div className="space-y-2">
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5 text-amber-900 font-bold">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span>Student Scam Alert:</span>
            <span className="font-normal text-amber-800">
              Beware of Telegram "Data Entry" jobs demanding refundable security deposits for laptops or training.
            </span>
          </div>
          <button
            onClick={() => handleLoadSample('scam-sample-1')}
            className="text-indigo-700 hover:text-indigo-900 font-bold hover:underline shrink-0 text-xs flex items-center gap-1 cursor-pointer"
          >
            <span>Test Scam Preset</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {demoSeedCount > 0 && (
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100/80 rounded-xl border border-slate-200/80 text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <strong className="text-slate-700">Demo Mode Active:</strong> Dashboard metrics include {demoSeedCount} pre-loaded sample opportunities for hackathon demonstration.
            </span>
            <Link to="/saved" className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline">
              Inspect in Tracker &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* Key Metric Cards - All Clickable with Navigational Utility */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Live Opportunity Metrics (Click any card to filter)
          </h2>
          <span className="text-[11px] text-slate-400">Calculated from actual saved records</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Analyzed -> Navigates to /saved */}
          <div
            onClick={() => navigate('/saved')}
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex items-center justify-between cursor-pointer group"
            title="Click to view all saved opportunities"
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-indigo-600 transition-colors">
                Total Tracked
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1 font-['Plus_Jakarta_Sans']">
                {totalAnalyzed}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                <span>View tracker records</span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <BookmarkCheck className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: High Risk Warnings -> Navigates to /saved with high risk filter */}
          <div
            onClick={() => navigateToSavedWithFilter('risk', 'high')}
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-rose-300 transition-all flex items-center justify-between cursor-pointer group"
            title="Click to filter high-risk opportunities"
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-rose-600 transition-colors">
                Scam Warnings Caught
              </div>
              <div className="text-2xl font-black text-rose-600 mt-1 font-['Plus_Jakarta_Sans']">
                {highRiskCount}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                <span>View flagged postings</span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Avg Match -> Navigates to /profile */}
          <div
            onClick={() => navigate('/profile')}
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex items-center justify-between cursor-pointer group"
            title="Click to review and edit your skill profile"
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-emerald-600 transition-colors">
                Avg Skill Alignment
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-1 font-['Plus_Jakarta_Sans']">
                {avgMatch}%
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                <span>Manage skill passport</span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Target className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Interviewing Rounds -> Navigates to /saved with interviewing filter */}
          <div
            onClick={() => navigateToSavedWithFilter('status', 'interviewing')}
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-violet-300 transition-all flex items-center justify-between cursor-pointer group"
            title="Click to view interviewing pipeline"
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-violet-600 transition-colors">
                Interviewing Stages
              </div>
              <div className="text-2xl font-black text-indigo-600 mt-1 font-['Plus_Jakarta_Sans']">
                {interviewingCount}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                <span>View active rounds</span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Analyzer Box & Demo Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Paste Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-600" />
                Quick Opportunity Scanner
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">
                Paste WhatsApp, Telegram, or Email text
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Received a suspicious job message or recruiter DM? Paste it below to immediately inspect scam markers and skill requirements.
            </p>
            <form onSubmit={handleQuickAnalyze}>
              <textarea
                rows={4}
                value={quickText}
                onChange={(e) => setQuickText(e.target.value)}
                placeholder="Paste the recruiter's message, email body, or job description snippet here..."
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all placeholder-slate-400 text-slate-900"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-[11px] text-slate-400">
                  Runs local heuristic NLP & scoring immediately
                </span>
                <button
                  type="submit"
                  disabled={!quickText.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Inspect Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 1-Click Hackathon Presets */}
        <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-1 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Instant Hackathon Evaluation</span>
            </div>
            <h4 className="font-extrabold text-white text-sm mb-2">
              Test Pre-Configured Scenarios
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Click any scenario to see real-time risk classification, transparent math, and Learn-Build-Practice roadmaps.
            </p>
            <div className="space-y-2">
              {SAMPLE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleLoadSample(p.id)}
                  className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left text-xs transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="truncate pr-2">
                    <div className="font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors truncate">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-slate-400">{p.channel} • {p.company}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Application Pipeline Overview Bar - All Clickable */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans']">
              Application Pipeline Stages
            </h3>
            <p className="text-xs text-slate-500">Click any stage to filter your tracker</p>
          </div>
          <Link
            to="/saved"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
          >
            <span>Manage All in Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'interested', label: 'Interested', count: statusCounts.interested, bg: 'bg-blue-50/70 hover:bg-blue-100/70 text-blue-800 border-blue-200' },
            { id: 'applied', label: 'Applied', count: statusCounts.applied, bg: 'bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-800 border-indigo-200' },
            { id: 'interviewing', label: 'Interviewing', count: statusCounts.interviewing, bg: 'bg-amber-50/70 hover:bg-amber-100/70 text-amber-800 border-amber-200' },
            { id: 'offer', label: 'Offer Received', count: statusCounts.offer, bg: 'bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-800 border-emerald-200' },
            { id: 'rejected', label: 'Rejected', count: statusCounts.rejected, bg: 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 border-slate-200' },
            { id: 'archived', label: 'Flagged / Scam', count: statusCounts.archived, bg: 'bg-rose-50/70 hover:bg-rose-100/70 text-rose-800 border-rose-200' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => navigateToSavedWithFilter('status', st.id)}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer shadow-2xs group ${st.bg}`}
              title={`Click to filter tracker by ${st.label}`}
            >
              <div className="text-xs font-semibold text-slate-600 mb-0.5 group-hover:text-slate-900 transition-colors">
                {st.label}
              </div>
              <div className="text-xl font-black font-['Plus_Jakarta_Sans']">{st.count}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Opportunities or Empty State */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              Recent Opportunities
            </h3>
            <p className="text-xs text-slate-500">Your latest analyzed job postings and pipeline statuses</p>
          </div>
          {opportunities.length > 0 && (
            <Link
              to="/saved"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
            >
              <span>View All ({opportunities.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {opportunities.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4">
              <FileSearch className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1.5 font-['Plus_Jakarta_Sans']">
              No Saved Opportunities Yet
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
              Your career tracker is currently empty. Analyze a recruiter message or job description, or load the pre-configured hackathon demo dataset to explore the engine.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Scan New Job Message</span>
              </Link>
              {onReseedDemoData && (
                <button
                  type="button"
                  onClick={onReseedDemoData}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Load Demo Dataset</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {opportunities.slice(0, 4).map((opp) => (
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
      </div>

      {/* Opportunity Detail Modal */}
      <OpportunityDetailModal
        opportunity={selectedOpp}
        isOpen={!!selectedOpp}
        onClose={() => setSelectedOpp(null)}
        onUpdate={onUpdateOpportunity}
      />
    </div>
  );
};
