import React, { useState } from 'react';
import type { UserProfile, UserSkill } from '../types';
import { SKILL_CATEGORIES, POPULAR_SKILLS } from '../data/predefinedSkills';
import { PRESET_PROFILES } from '../data/sampleProfile';
import {
  Plus,
  Trash2,
  Sparkles,
  Save,
  Check,
  GraduationCap,
  Award,
  Edit2,
  Info,
  X,
  Search,
} from 'lucide-react';

let skillIdSequence = 0;
function createSkillId(skillName: string): string {
  skillIdSequence += 1;
  const slug = skillName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `skill-${slug}-${skillIdSequence}`;
}

interface SkillProfilePageProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const SkillProfilePage: React.FC<SkillProfilePageProps> = ({ profile, onSaveProfile }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [prevProfile, setPrevProfile] = useState<UserProfile>(profile);
  const [activeCategory, setActiveCategory] = useState<string>('Languages');
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillLevel, setCustomSkillLevel] = useState<UserSkill['level']>('intermediate');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [skillSearch, setSkillSearch] = useState('');

  // Editing state for existing skill
  const [editingSkill, setEditingSkill] = useState<UserSkill | null>(null);

  // Synchronize local form data when parent profile updates
  if (profile !== prevProfile) {
    setPrevProfile(profile);
    setFormData(profile);
  }

  const handleApplyPreset = (preset: UserProfile) => {
    setFormData(preset);
    onSaveProfile(preset);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddSkillFromPopular = (skillName: string, category: string) => {
    if (formData.skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) {
      return;
    }
    const newSkill: UserSkill = {
      id: createSkillId(skillName),
      name: skillName,
      category: category as UserSkill['category'],
      level: 'intermediate',
    };
    const updated = {
      ...formData,
      skills: [...formData.skills, newSkill],
    };
    setFormData(updated);
    onSaveProfile(updated);
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillName.trim()) return;

    if (formData.skills.some((s) => s.name.toLowerCase() === customSkillName.trim().toLowerCase())) {
      setCustomSkillName('');
      return;
    }

    const newSkill: UserSkill = {
      id: createSkillId(customSkillName.trim()),
      name: customSkillName.trim(),
      category: activeCategory as UserSkill['category'],
      level: customSkillLevel,
    };

    const updated = {
      ...formData,
      skills: [...formData.skills, newSkill],
    };
    setFormData(updated);
    onSaveProfile(updated);
    setCustomSkillName('');
  };

  const handleUpdateSkillLevel = (id: string, level: UserSkill['level']) => {
    const updated = {
      ...formData,
      skills: formData.skills.map((s) => (s.id === id ? { ...s, level } : s)),
    };
    setFormData(updated);
    onSaveProfile(updated);
  };

  const handleSaveEditedSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    const updated = {
      ...formData,
      skills: formData.skills.map((s) => (s.id === editingSkill.id ? editingSkill : s)),
    };
    setFormData(updated);
    onSaveProfile(updated);
    setEditingSkill(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleRemoveSkill = (id: string) => {
    const updated = {
      ...formData,
      skills: formData.skills.filter((s) => s.id !== id),
    };
    setFormData(updated);
    onSaveProfile(updated);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const filteredSkills = formData.skills.filter((s) => {
    if (!skillSearch.trim()) return true;
    const q = skillSearch.toLowerCase().trim();
    return s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              Student Competency Passport
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
            My Skill Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Define your skills, target engineering roles, and proficiency levels to power our transparent match calculations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Profile Changes Saved!</span>
            </span>
          )}
          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      {/* Crucial Ethical AI Notice: Skill Matching != Hiring Probability */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/90 text-xs text-indigo-950 flex items-start gap-3 shadow-xs">
        <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-indigo-950 text-sm mb-1">
            How OpportunityLens Skill-Match Alignment Works
          </h4>
          <p className="text-slate-700 leading-relaxed text-xs">
            Skill matching measures <strong>mathematical alignment with listed technical and soft prerequisites</strong> extracted from the job posting.
            <strong className="text-indigo-900"> It does NOT predict your probability of getting hired, interview callback odds, or final job offer likelihood.</strong>{' '}
            Real hiring evaluations depend on resume depth, problem-solving demonstrations, culture fit, interview performance, and applicant competition.
          </p>
        </div>
      </div>

      {/* Preset Profiles Bar */}
      <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Quick Profile Presets (1-Click Student Personas):</span>
          </div>
          <span className="text-[11px] text-slate-400">Click to switch roles</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_PROFILES.map((p) => {
            const isActive =
              formData.targetRoles.length === p.profile.targetRoles.length &&
              formData.targetRoles.every((role, idx) => role === p.profile.targetRoles[idx]);
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => handleApplyPreset(p.profile)}
                className={`p-3 rounded-xl border text-left text-xs transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/50 shadow-md'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`font-bold transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-200 group-hover:text-indigo-300'}`}>
                    {p.label}
                  </span>
                  {isActive && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 px-1.5 py-0.5 rounded">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1">
                  {p.profile.headline}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {p.profile.skills.length} skills • {p.profile.education}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Student Academic & Career Details Form */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Academic & Career Details</span>
          </h3>
          <span className="text-[11px] px-2.5 py-1 rounded-lg font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            {PRESET_PROFILES.some((p) => p.profile.name === formData.name) ? (
              <>Preset: <strong className="text-slate-800">{formData.name}</strong></>
            ) : (
              <>Custom Profile: <strong className="text-slate-800">{formData.name}</strong></>
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Degree & Major
            </label>
            <input
              type="text"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Graduation Year
            </label>
            <input
              type="text"
              value={formData.gradYear}
              onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Professional Headline
          </label>
          <input
            type="text"
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            About / Bio
          </label>
          <textarea
            rows={2}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900"
          />
        </div>
      </div>

      {/* Skills Management Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Skills Catalog ({formData.skills.length} skills on profile)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Add popular skills, configure proficiency levels, or create custom skills.
            </p>
          </div>
        </div>

        {/* Category Tabs for Popular Suggestions */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Popular Skills in Active Category */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Suggested {activeCategory} Skills (1-Click Add):
          </div>
          <div className="flex flex-wrap gap-2">
            {(POPULAR_SKILLS[activeCategory] || []).map((skillName) => {
              const alreadyHas = formData.skills.some(
                (s) => s.name.toLowerCase() === skillName.toLowerCase()
              );
              return (
                <button
                  key={skillName}
                  type="button"
                  onClick={() => handleAddSkillFromPopular(skillName, activeCategory)}
                  disabled={alreadyHas}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    alreadyHas
                      ? 'bg-emerald-100/70 text-emerald-800 border border-emerald-200 opacity-60 cursor-default'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 shadow-2xs'
                  }`}
                >
                  {alreadyHas ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>{skillName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Custom Skill Row */}
        <form onSubmit={handleAddCustomSkill} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={customSkillName}
            onChange={(e) => setCustomSkillName(e.target.value)}
            placeholder={`Add custom skill under "${activeCategory}"...`}
            className="flex-1 w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all text-slate-900 placeholder-slate-400"
          />
          <select
            value={customSkillLevel}
            onChange={(e) => setCustomSkillLevel(e.target.value as UserSkill['level'])}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 outline-hidden cursor-pointer"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <button
            type="submit"
            disabled={!customSkillName.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Profile</span>
          </button>
        </form>

        {/* Active Profile Skills with Inline Edit & Remove */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Active Skills on Profile ({formData.skills.length} total)
            </h4>

            {/* Quick Filter Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="Filter active skills..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-indigo-400 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all flex items-center justify-between gap-2"
              >
                <div className="truncate pr-1">
                  <div className="font-bold text-xs text-slate-900 truncate">{skill.name}</div>
                  <div className="text-[10px] text-slate-400">{skill.category}</div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <select
                    value={skill.level}
                    onChange={(e) =>
                      handleUpdateSkillLevel(skill.id, e.target.value as UserSkill['level'])
                    }
                    className="text-[11px] font-semibold px-2 py-1 rounded-md border border-slate-200 bg-slate-50 text-slate-700 cursor-pointer focus:border-indigo-400"
                    title="Update proficiency level"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setEditingSkill(skill)}
                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                    title="Edit skill details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                    title="Remove skill from profile"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Skill Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-indigo-600" />
                <span>Edit Profile Skill</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingSkill(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-500 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Skill Category
                </label>
                <select
                  value={editingSkill.category}
                  onChange={(e) =>
                    setEditingSkill({
                      ...editingSkill,
                      category: e.target.value as UserSkill['category'],
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 outline-hidden"
                >
                  {SKILL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Proficiency Level
                </label>
                <select
                  value={editingSkill.level}
                  onChange={(e) =>
                    setEditingSkill({
                      ...editingSkill,
                      level: e.target.value as UserSkill['level'],
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 outline-hidden"
                >
                  <option value="beginner">Beginner (Foundational)</option>
                  <option value="intermediate">Intermediate (Comfortable building)</option>
                  <option value="advanced">Advanced (Production mastery)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
