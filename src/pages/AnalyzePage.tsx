import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import type { Opportunity, UserProfile, RiskAssessment, SkillMatchCalculation, SkillRoadmap, UserSkill, AnalysisProvider, AppSettings } from '../types';
import { SAMPLE_PRESETS } from '../data/sampleOpportunities';
import type { SamplePreset } from '../data/sampleOpportunities';
import { executeOpportunityAnalysis } from '../services/aiService';
import { computeSkillMatch } from '../services/skillEngine';
import { generateRoadmapsForMissingSkills } from '../services/roadmapEngine';
import { RiskAnalysisCard } from '../components/analysis/RiskAnalysisCard';
import { SkillGapCard } from '../components/analysis/SkillGapCard';
import { LearnBuildPracticeCard } from '../components/analysis/LearnBuildPracticeCard';
import { TransparentAnalysisCard } from '../components/analysis/TransparentAnalysisCard';
import { SaveOpportunityModal } from '../components/analysis/SaveOpportunityModal';
import { VerificationChecklist } from '../components/common/VerificationChecklist';
import {
  SearchCode,
  Sparkles,
  BookmarkCheck,
  RotateCcw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  FileEdit,
  UserCheck,
  Cpu,
} from 'lucide-react';

interface AnalyzePageProps {
  profile: UserProfile;
  onSaveOpportunity: (opp: Opportunity) => void;
  onUpdateProfile?: (updatedProfile: UserProfile) => void;
  settings?: AppSettings;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ profile, onSaveOpportunity, onUpdateProfile, settings }) => {
  const location = useLocation();

  // Form State
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [channel, setChannel] = useState<Opportunity['sourceChannel']>('LinkedIn');
  const [jobType, setJobType] = useState<Opportunity['jobType']>('Internship');
  const [workMode, setWorkMode] = useState<Opportunity['workMode']>('Remote');
  const [salaryStipend, setSalaryStipend] = useState('');
  const [contactDetail, setContactDetail] = useState('');
  const [rawText, setRawText] = useState('');

  // Execution State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [analysisProvider, setAnalysisProvider] = useState<AnalysisProvider>('deterministic-rules');
  const [aiExplanation, setAiExplanation] = useState<string | undefined>();
  const [activeAnalysis, setActiveAnalysis] = useState<{
    risk: RiskAssessment;
    skillMatch: SkillMatchCalculation;
    roadmaps: SkillRoadmap[];
    opportunityObject: Opportunity;
  } | null>(null);

  const [activeChecklist, setActiveChecklist] = useState<Record<string, boolean>>({});
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const applyPreset = (preset: SamplePreset) => {
    setJobTitle(preset.title);
    setCompany(preset.company);
    setChannel(preset.channel);
    setJobType(preset.jobType);
    setWorkMode(preset.workMode);
    setSalaryStipend(preset.salaryStipend);
    setContactDetail(preset.contactDetail);
    setRawText(preset.text);
    setErrorMessage('');
    setActiveAnalysis(null);
    setActiveChecklist({});
    setHasSaved(false);
  };

  const [prevLocationKey, setPrevLocationKey] = useState<string | null>(location.key);

  // Synchronize location preset or prefill text without triggering cascading renders
  if (location.key !== prevLocationKey) {
    setPrevLocationKey(location.key);
    if (location.state?.sampleId) {
      const preset = SAMPLE_PRESETS.find((p) => p.id === location.state.sampleId);
      if (preset) {
        setJobTitle(preset.title);
        setCompany(preset.company);
        setChannel(preset.channel);
        setJobType(preset.jobType);
        setWorkMode(preset.workMode);
        setSalaryStipend(preset.salaryStipend);
        setContactDetail(preset.contactDetail);
        setRawText(preset.text);
        setErrorMessage('');
        setActiveAnalysis(null);
        setActiveChecklist({});
        setHasSaved(false);
      }
    } else if (location.state?.prefillText) {
      setRawText(location.state.prefillText);
    }
  }

  const handleReset = () => {
    setJobTitle('');
    setCompany('');
    setChannel('LinkedIn');
    setJobType('Internship');
    setWorkMode('Remote');
    setSalaryStipend('');
    setContactDetail('');
    setRawText('');
    setErrorMessage('');
    setActiveAnalysis(null);
    setActiveChecklist({});
    setHasSaved(false);
  };

  const handleRunAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = rawText.trim();
    if (!trimmed) {
      setErrorMessage('Please paste or enter the job description or recruiter outreach message.');
      return;
    }

    if (trimmed.split(/\s+/).length < 5) {
      setErrorMessage('The submitted message is too brief. Please provide a fuller job description or message body.');
      return;
    }

    setErrorMessage('');
    setIsAnalyzing(true);
    setHasSaved(false);

    try {
      // Auto-extract company name and title from text if user left them blank
      let resolvedTitle = jobTitle.trim();
      let resolvedCompany = company.trim();

      if (!resolvedCompany) {
        if (/she\s*can\s*foundation/i.test(trimmed)) {
          resolvedCompany = 'She Can Foundation';
        } else {
          const compMatch =
            trimmed.match(/(?:organization|company|about|ngo|employer|firm)\s*:\s*([^\n\r,]+)/i) ||
            trimmed.match(/(?:at|join|with)\s+([A-Z][A-Za-z0-9&.\s]{2,30}(?:Foundation|Technologies|Solutions|Studios|Systems|Pvt|Ltd|Inc|LLC|NGO|Corp))/);
          if (compMatch) resolvedCompany = compMatch[1].trim();
        }
        if (resolvedCompany) {
          setCompany(resolvedCompany);
        }
      }

      if (!resolvedTitle) {
        const titleMatch =
          trimmed.match(/(?:position|role|opportunity|hiring for|job title)\s*:\s*([^\n\r,]+)/i) ||
          trimmed.match(/(?:as a|as an)\s+([A-Z][A-Za-z\s]{3,35}(?:Intern|Developer|Engineer|Associate|Manager|Designer|Analyst|Assistant|Lead))/i);
        if (titleMatch) resolvedTitle = titleMatch[1].trim();
        if (resolvedTitle) {
          setJobTitle(resolvedTitle);
        }
      }

      const effectiveTitle = resolvedTitle || 'Untitled Opportunity';
      const effectiveCompany = resolvedCompany || 'Unspecified Organization';

      const isSameOpp =
        activeAnalysis &&
        activeAnalysis.opportunityObject.title.toLowerCase().trim() === effectiveTitle.toLowerCase().trim() &&
        activeAnalysis.opportunityObject.company.toLowerCase().trim() === effectiveCompany.toLowerCase().trim();
      const stableId = isSameOpp ? activeAnalysis.opportunityObject.id : `opp-${Date.now()}`;

      const analysisResult = await executeOpportunityAnalysis({
        text: trimmed,
        title: effectiveTitle,
        company: effectiveCompany,
        channel,
        jobType,
        workMode,
        salaryStipend,
        contactDetail,
        profile,
        activeOpportunityId: stableId,
        existingChecklist: activeChecklist,
        riskSensitivity: settings?.riskSensitivity || 'balanced',
      });

      setActiveAnalysis({
        risk: analysisResult.risk,
        skillMatch: analysisResult.skillMatch,
        roadmaps: analysisResult.roadmaps,
        opportunityObject: analysisResult.opportunityObject,
      });
      setAnalysisProvider(analysisResult.analysisProvider);
      setAiExplanation(analysisResult.aiExplanation);
      setIsAnalyzing(false);

      setTimeout(() => {
        document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Analysis failed:', err);
      setErrorMessage('An unexpected error occurred while analyzing the opportunity. Please retry.');
      setIsAnalyzing(false);
    }
  };

  // Allow student to instantly add a missing skill to their profile and recalculate match
  const handleAddSkillToProfile = (skillName: string, category: string, level: UserSkill['level']) => {
    if (!profile.skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) {
      const newSkill: UserSkill = {
        id: `skill-${Date.now()}`,
        name: skillName,
        category: category as UserSkill['category'],
        level,
      };
      const updatedProfile: UserProfile = {
        ...profile,
        skills: [...profile.skills, newSkill],
      };

      if (onUpdateProfile) {
        onUpdateProfile(updatedProfile);
      }

      // Recalculate skill match with updated profile
      if (activeAnalysis) {
        const jobSkills = {
          core: activeAnalysis.skillMatch.matchedSkills.filter((s) => s.requiredLevel === 'required').map((s) => s.name).concat(
            activeAnalysis.skillMatch.missingSkills.filter((s) => s.requiredLevel === 'required').map((s) => s.name)
          ),
          secondary: activeAnalysis.skillMatch.matchedSkills.filter((s) => s.requiredLevel === 'preferred').map((s) => s.name).concat(
            activeAnalysis.skillMatch.missingSkills.filter((s) => s.requiredLevel === 'preferred').map((s) => s.name)
          ),
        };
        const updatedMatch = computeSkillMatch(jobSkills, updatedProfile.skills);
        updatedMatch.analysisProvider = analysisProvider;
        const updatedRoadmaps = generateRoadmapsForMissingSkills(updatedMatch.missingSkills);

        setActiveAnalysis({
          ...activeAnalysis,
          skillMatch: updatedMatch,
          roadmaps: updatedRoadmaps,
          opportunityObject: {
            ...activeAnalysis.opportunityObject,
            skillMatch: updatedMatch,
            roadmaps: updatedRoadmaps,
          },
        });
      }
    }
  };

  const handleChecklistUpdate = (updated: Record<string, boolean>) => {
    setActiveChecklist(updated);
    if (activeAnalysis) {
      const updatedOpp: Opportunity = {
        ...activeAnalysis.opportunityObject,
        verificationChecklist: updated,
      };
      setActiveAnalysis({
        ...activeAnalysis,
        opportunityObject: updatedOpp,
      });
      // If already saved, persist updated checklist automatically
      if (hasSaved) {
        onSaveOpportunity(updatedOpp);
      }
    }
  };

  // Direct 1-click Save handler
  const handleSaveOpportunityDirectly = () => {
    if (!activeAnalysis) return;
    const oppToSave: Opportunity = {
      ...activeAnalysis.opportunityObject,
      verificationChecklist: activeChecklist,
      status: activeAnalysis.opportunityObject.status || 'interested',
    };
    onSaveOpportunity(oppToSave);
    setHasSaved(true);
  };

  const handleSaveCompleted = (saved: Opportunity) => {
    const oppWithChecklist: Opportunity = {
      ...saved,
      verificationChecklist: activeChecklist,
    };
    onSaveOpportunity(oppWithChecklist);
    setHasSaved(true);
    setIsSaveModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
            Intelligent Screening & Roadmapping
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
          Analyze Opportunity
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Paste any job offer, WhatsApp text, LinkedIn posting, or Telegram recruitment message. We will
          dissect potential scam signals and formulate your skill gap action plan.
        </p>
      </div>

      {/* Preset Selector Chips for rapid testing */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Quick-Load Test Scenarios (1-Click Presets):</span>
          </div>
          <span className="text-[11px] text-slate-400">Click to autofill</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SAMPLE_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => applyPreset(p)}
              className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left text-xs transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${p.badgeColor}`}>
                  {p.badge}
                </span>
                <span className="text-[10px] text-slate-400">{p.channel}</span>
              </div>
              <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {p.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Profile Alignment Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 bg-indigo-50/70 rounded-2xl border border-indigo-200/80 text-xs text-indigo-950 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-800">
              Matching Against Profile: {profile.name}
            </span>
            <span className="text-slate-500 ml-1.5">
              ({profile.skills.length} skills listed • Class of {profile.gradYear})
            </span>
          </div>
        </div>
        <Link
          to="/profile"
          className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline shrink-0 text-xs flex items-center gap-1"
        >
          <span>Manage My Skills</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Analysis Form */}
      <form onSubmit={handleRunAnalysis} className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Job Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Opportunity / Role Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Junior Frontend Developer"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900 placeholder-slate-400"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Company / Recruiter Name
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Acme Corp (or Recruiter Name)"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900 placeholder-slate-400"
            />
          </div>

          {/* Source Channel */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Source / Outreach Channel
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as Opportunity['sourceChannel'])}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900"
            >
              <option value="LinkedIn">LinkedIn</option>
              <option value="Telegram">Telegram</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Direct Email</option>
              <option value="Campus Drive">Campus Placement</option>
              <option value="Internshala">Internshala / Job Board</option>
              <option value="Company Portal">Official Company Portal</option>
              <option value="Other">Other / Unsolicited DM</option>
            </select>
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Role Type
            </label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value as Opportunity['jobType'])}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900"
            >
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time Fresher</option>
              <option value="Part-time">Part-time / Gig</option>
              <option value="Contract">Contract</option>
              <option value="Unknown">Unspecified / Unknown</option>
            </select>
          </div>

          {/* Work Mode */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Work Location Mode
            </label>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value as Opportunity['workMode'])}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900"
            >
              <option value="Remote">Remote / Work from Home</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site / In Office</option>
              <option value="Unknown">Not Specified</option>
            </select>
          </div>

          {/* Salary / Stipend */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Stipend / Promised Salary
            </label>
            <input
              type="text"
              value={salaryStipend}
              onChange={(e) => setSalaryStipend(e.target.value)}
              placeholder="e.g. ₹25,000 / month or ₹7 LPA"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Contact info */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Sender Contact (Email, Phone, Telegram handle, or Portal URL)
          </label>
          <input
            type="text"
            value={contactDetail}
            onChange={(e) => setContactDetail(e.target.value)}
            placeholder="e.g. careers@company.com OR hr_apex@gmail.com OR @HiringTeamTelegram"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900 placeholder-slate-400"
          />
        </div>

        {/* Raw text input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Job Description / Message Text <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {rawText.length} characters
            </span>
          </div>
          <textarea
            rows={8}
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="Paste the full job description, email text, WhatsApp forward, or Telegram post here..."
            className="w-full p-4 text-xs font-mono rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all leading-relaxed text-slate-900 placeholder-slate-400"
          />
          {errorMessage && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-rose-600">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Fields</span>
          </button>

          <button
            type="submit"
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 rounded-xl shadow-md transition-all cursor-pointer shadow-indigo-500/20"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Opportunity (AI & Pattern Verification)...</span>
              </>
            ) : (
              <>
                <SearchCode className="w-4 h-4" />
                <span>Run OpportunityLens Analysis</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Analysis Results Display */}
      {activeAnalysis && (
        <div id="analysis-results" className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-400">
          {/* Action bar for saving to pipeline */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg border border-indigo-900/80">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                {analysisProvider && analysisProvider !== 'deterministic-rules' ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-300 font-bold bg-emerald-950/80 border border-emerald-500/50 px-2.5 py-0.5 rounded-full shadow-2xs">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>
                      {analysisProvider === 'gemini-2.5-flash'
                        ? 'Gemini 2.5 Flash'
                        : analysisProvider === 'gemini-1.5-flash'
                        ? 'Gemini 1.5 Flash'
                        : analysisProvider}{' '}
                      AI NLP + Deterministic Scoring
                    </span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-indigo-200 font-bold bg-indigo-950/80 border border-indigo-500/40 px-2.5 py-0.5 rounded-full shadow-2xs">
                    <Cpu className="w-3 h-3 text-indigo-400" />
                    <span>Deterministic Heuristic Engine (Rule-based Fallback)</span>
                  </span>
                )}
                <span className="text-[10px] text-slate-400 font-mono">
                  Exact Mathematical Fit
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white font-['Plus_Jakarta_Sans']">
                {activeAnalysis.opportunityObject.title} at {activeAnalysis.opportunityObject.company}
              </h3>
              {aiExplanation && (
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed italic">
                  &ldquo;{aiExplanation}&rdquo;
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {hasSaved ? (
                <>
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-xl text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Saved in Tracker</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSaveModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Edit Status / Notes</span>
                  </button>
                  <Link
                    to="/saved"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs transition-all"
                  >
                    <span>View in Saved</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSaveOpportunityDirectly}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    <span>Save Opportunity to Tracker</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSaveModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-colors cursor-pointer"
                    title="Add private notes or choose pipeline status before saving"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add Notes...</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Prominent Success Notification Banner */}
          {hasSaved && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-emerald-950 flex items-center gap-2">
                    <span>Opportunity Successfully Saved to Tracker!</span>
                  </div>
                  <div className="text-xs text-emerald-800">
                    <strong>{activeAnalysis.opportunityObject.title}</strong> at <strong>{activeAnalysis.opportunityObject.company}</strong> is recorded with its risk level ({activeAnalysis.risk.riskLevel.toUpperCase()}), {activeAnalysis.skillMatch.matchPercentage}% skill fit, and application status ({activeAnalysis.opportunityObject.status}).
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/saved"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <span>Go to Saved Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-900 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors cursor-pointer"
                >
                  <FileEdit className="w-3.5 h-3.5" />
                  <span>Edit Status / Notes</span>
                </button>
              </div>
            </div>
          )}

          {/* 1. Job Risk & Scam Breakdown */}
          <RiskAnalysisCard assessment={activeAnalysis.risk} />

          {/* 2. Skill Fit & Transparent Calculation */}
          <SkillGapCard
            skillMatch={activeAnalysis.skillMatch}
            onAddSkillToProfile={handleAddSkillToProfile}
          />

          {/* 3. Learn, Build, Practice Action Roadmap */}
          <LearnBuildPracticeCard roadmaps={activeAnalysis.roadmaps} />

          {/* 4. Complete Transparent Analysis & Mathematical Audit */}
          <TransparentAnalysisCard
            opportunity={activeAnalysis.opportunityObject}
            riskAssessment={activeAnalysis.risk}
            skillMatch={activeAnalysis.skillMatch}
          />

          {/* 5. Student Safety & Due Diligence Checklist */}
          <VerificationChecklist
            companyName={activeAnalysis.opportunityObject.company}
            initialChecked={activeChecklist}
            onChecklistChange={handleChecklistUpdate}
          />

          {/* 5. Bottom Save Action Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider mb-1">
                Due Diligence Completed
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Save & Track: {activeAnalysis.opportunityObject.title}
              </h3>
              <p className="text-xs text-slate-300">
                Track application status, monitor risk indicators, and retain your completed verification checklist.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {hasSaved ? (
                <>
                  <div className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-xl text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Saved in Opportunities Tracker</span>
                  </div>
                  <Link
                    to="/saved"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs transition-all"
                  >
                    <span>View in Saved Tracker</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSaveOpportunityDirectly}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    <span>Save Opportunity to Tracker</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSaveModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Customize Notes / Status</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Save Modal */}
          <SaveOpportunityModal
            isOpen={isSaveModalOpen}
            onClose={() => setIsSaveModalOpen(false)}
            opportunity={activeAnalysis.opportunityObject}
            onSave={handleSaveCompleted}
          />
        </div>
      )}
    </div>
  );
};
