import React, { useState } from 'react';
import type { SkillRoadmap } from '../../types';
import {
  BookOpen,
  Hammer,
  HelpCircle,
  ExternalLink,
  Clock,
  CheckSquare,
  Sparkles,
  Code2,
} from 'lucide-react';

interface LearnBuildPracticeCardProps {
  roadmaps: SkillRoadmap[];
}

export const LearnBuildPracticeCard: React.FC<LearnBuildPracticeCardProps> = ({ roadmaps }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!roadmaps || roadmaps.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-900 text-sm">No Actionable Skill Gaps Found</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          You either match all prerequisites for this position or no technical skills were detected.
        </p>
      </div>
    );
  }

  const currentRoadmap = roadmaps[activeTab] || roadmaps[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Learn, Build & Practice Action Roadmap
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Targeted study, portfolio project, and interview preparation plan for high-priority missing skills.
        </p>

        {/* Skill Selector Tabs */}
        {roadmaps.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {roadmaps.map((rm, idx) => (
              <button
                key={rm.skillName}
                onClick={() => setActiveTab(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === idx
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                {rm.skillName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Educational Guidance Notice */}
      <div className="bg-slate-50/90 border-b border-slate-200/80 px-6 py-2.5 flex items-start gap-2.5 text-xs text-slate-600">
        <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong className="font-semibold text-slate-800">Educational Guidance: </strong>
          The curated resources, projects, and interview questions below are general study recommendations generated to help close technical gaps. They are <strong>independent educational aids</strong> and do not represent verified interview questions, proprietary tests, or formal endorsements from this employer.
        </p>
      </div>

      {/* Main Roadmap Display for Current Selected Skill */}
      <div className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              Focus Skill
            </span>
            <span className="text-base font-extrabold text-slate-900">
              {currentRoadmap.skillName}
            </span>
            <span className="text-xs text-slate-400">({currentRoadmap.category})</span>
          </div>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Est. ~{currentRoadmap.build.estimatedHours + 6}h to mastery
          </span>
        </div>

        {/* The 3 Pillars: Learn, Build, Practice */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pillar 1: Learn */}
          <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-blue-900 font-bold text-sm">
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span>1. Learn (Foundations)</span>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800 mb-2">
                Core Concepts to Master:
              </div>
              <ul className="space-y-1.5 mb-4 text-xs text-slate-700">
                {currentRoadmap.learn.coreConcepts.map((concept, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">›</span>
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800 mb-2">
                Curated Free Resources:
              </div>
              <div className="space-y-2">
                {currentRoadmap.learn.resources.map((res, i) => (
                  <a
                    key={i}
                    href={res.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white border border-blue-200/80 hover:border-blue-400 text-xs block transition-all shadow-xs group"
                  >
                    <div className="flex items-center justify-between text-slate-900 font-semibold group-hover:text-blue-600">
                      <span className="truncate pr-2">{res.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                      <span className="capitalize">{res.type.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{res.timeEstimate}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Pillar 2: Build */}
          <div className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-indigo-900 font-bold text-sm">
                <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                  <Hammer className="w-4 h-4" />
                </div>
                <span>2. Build (Portfolio Proof)</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-indigo-200/80 mb-3 shadow-xs">
                <div className="text-xs font-bold text-indigo-950 mb-1">
                  {currentRoadmap.build.projectTitle}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentRoadmap.build.projectDescription}
                </p>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 mb-2">
                Key GitHub Deliverables:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {currentRoadmap.build.deliverables.map((deliv, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-100 text-xs text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1 font-medium text-indigo-700">
                <Code2 className="w-3.5 h-3.5" />
                Proof of Work
              </span>
              <span className="font-semibold text-slate-700">
                ~{currentRoadmap.build.estimatedHours} Hours
              </span>
            </div>
          </div>

          {/* Pillar 3: Practice */}
          <div className="p-5 rounded-2xl bg-violet-50/40 border border-violet-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-violet-900 font-bold text-sm">
                <div className="p-1.5 rounded-lg bg-violet-100 text-violet-700">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <span>3. Practice (Interview Readiness)</span>
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-violet-800 mb-2">
                Frequently Asked Interview Questions:
              </div>
              <div className="space-y-2 mb-4">
                {currentRoadmap.practice.interviewQuestions.map((q, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-white border border-violet-200/80 text-xs text-slate-800 shadow-xs"
                  >
                    <span className="font-bold text-violet-700 mr-1.5">Q{i + 1}:</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-violet-100/60 rounded-xl border border-violet-200 text-xs">
              <span className="font-bold text-violet-900 block mb-1">💡 Interview Pro-Tip:</span>
              <p className="text-violet-950 text-[11px] leading-relaxed">
                {currentRoadmap.practice.keyTakeaway}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
