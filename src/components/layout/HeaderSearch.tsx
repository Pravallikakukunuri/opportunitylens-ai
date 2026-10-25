import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Opportunity, UserProfile } from '../../types';
import { Search, X, Building2, Briefcase, Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

interface HeaderSearchProps {
  opportunities: Opportunity[];
  profile: UserProfile;
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({ opportunities, profile }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Compute matched items
  const { matchedOpportunities, matchedSkills } = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { matchedOpportunities: [], matchedSkills: [] };
    }

    // 1. Opportunities match on title, company, channel, or notes
    const opps = opportunities.filter((opp) => {
      return (
        opp.title.toLowerCase().includes(q) ||
        opp.company.toLowerCase().includes(q) ||
        opp.sourceChannel.toLowerCase().includes(q) ||
        opp.userNotes?.toLowerCase().includes(q)
      );
    });

    // 2. Skills match from user profile + extracted job skills
    const skillSet = new Map<string, { name: string; category: string; inProfile: boolean }>();

    // Profile skills
    profile.skills.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)) {
        skillSet.set(s.name.toLowerCase(), {
          name: s.name,
          category: s.category,
          inProfile: true,
        });
      }
    });

    // Opportunity skills
    opportunities.forEach((opp) => {
      opp.skillMatch.matchedSkills.forEach((s) => {
        if (s.name.toLowerCase().includes(q)) {
          skillSet.set(s.name.toLowerCase(), {
            name: s.name,
            category: s.category || 'Skill',
            inProfile: true,
          });
        }
      });
      opp.skillMatch.missingSkills.forEach((s) => {
        if (s.name.toLowerCase().includes(q)) {
          if (!skillSet.has(s.name.toLowerCase())) {
            skillSet.set(s.name.toLowerCase(), {
              name: s.name,
              category: s.category || 'Required Skill',
              inProfile: false,
            });
          }
        }
      });
    });

    return {
      matchedOpportunities: opps.slice(0, 5),
      matchedSkills: Array.from(skillSet.values()).slice(0, 4),
    };
  }, [query, opportunities, profile]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim()) {
        setIsOpen(false);
        navigate('/saved', { state: { searchQuery: query.trim() } });
      }
    }
  };

  const handleSelectOpportunity = (opp: Opportunity) => {
    setIsOpen(false);
    setQuery('');
    navigate('/saved', { state: { selectedOppId: opp.id } });
  };

  const handleSelectSkill = (skillName: string) => {
    setIsOpen(false);
    setQuery('');
    navigate('/saved', { state: { searchQuery: skillName } });
  };

  const hasResults = matchedOpportunities.length > 0 || matchedSkills.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Box */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search companies, job postings, skills..."
          className="w-full pl-10 pr-9 py-2 bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm rounded-xl border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 placeholder-slate-400 outline-hidden"
          aria-label="Search opportunities and skills"
          aria-expanded={isOpen}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Results Dropdown Panel */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 top-full mt-2 w-full sm:w-[28rem] max-w-[90vw] bg-white rounded-2xl shadow-xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[26rem]">
          {hasResults ? (
            <div className="overflow-y-auto divide-y divide-slate-100 p-2">
              {/* Opportunities Section */}
              {matchedOpportunities.length > 0 && (
                <div className="p-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-2 flex items-center justify-between">
                    <span>Saved Opportunities ({matchedOpportunities.length})</span>
                    <span className="text-[10px] text-indigo-600 font-normal">Click to view</span>
                  </div>
                  <div className="space-y-1">
                    {matchedOpportunities.map((opp) => (
                      <div
                        key={opp.id}
                        onClick={() => handleSelectOpportunity(opp)}
                        className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate transition-colors">
                              {opp.title}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
                              <Building2 className="w-3 h-3 text-slate-400 inline" />
                              <span>{opp.company}</span>
                              <span className="text-slate-300">•</span>
                              <span>{opp.sourceChannel}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <RiskBadge level={opp.riskAssessment.riskLevel} size="sm" />
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Section */}
              {matchedSkills.length > 0 && (
                <div className="p-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-2">
                    Skills ({matchedSkills.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-2">
                    {matchedSkills.map((skill) => (
                      <button
                        key={skill.name}
                        type="button"
                        onClick={() => handleSelectSkill(skill.name)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                        <span>{skill.name}</span>
                        <span className="text-[10px] font-normal text-slate-400">
                          ({skill.inProfile ? 'in profile' : 'job required'})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Enter prompt action */}
              <div
                onClick={() => {
                  setIsOpen(false);
                  navigate('/saved', { state: { searchQuery: query.trim() } });
                }}
                className="p-2.5 hover:bg-indigo-50/50 cursor-pointer flex items-center justify-between text-xs text-indigo-700 font-semibold rounded-xl transition-colors m-1"
              >
                <span>Search all saved opportunities for &ldquo;{query}&rdquo;</span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                  <CornerDownLeft className="w-3 h-3" />
                  <span>Enter</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                No opportunities or skills match &ldquo;{query}&rdquo;
              </p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                Try searching for company names like &ldquo;NovaScale&rdquo;, skills like &ldquo;React&rdquo; or channels like &ldquo;Telegram&rdquo;.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
