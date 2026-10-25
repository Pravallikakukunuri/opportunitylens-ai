import { describe, it, expect } from 'vitest';
import { computeSkillMatch, findMatchingUserSkill } from '../src/services/skillEngine';
import type { UserSkill } from '../src/types';

describe('Skill Engine — Alias Normalization & Mathematical Matching', () => {
  it('correctly matches aliases bidirectionally (HTML, CSS, Git, React)', () => {
    const profileSkills: UserSkill[] = [
      { id: '1', name: 'HTML5/CSS3', category: 'Frontend', level: 'advanced' },
      { id: '2', name: 'JavaScript', category: 'Languages', level: 'intermediate' },
      { id: '3', name: 'React', category: 'Frontend', level: 'intermediate' },
      { id: '4', name: 'Git & GitHub', category: 'Cloud & DevOps', level: 'intermediate' },
    ];

    expect(findMatchingUserSkill('HTML', profileSkills)?.name).toBe('HTML5/CSS3');
    expect(findMatchingUserSkill('CSS', profileSkills)?.name).toBe('HTML5/CSS3');
    expect(findMatchingUserSkill('JavaScript', profileSkills)?.name).toBe('JavaScript');
    expect(findMatchingUserSkill('React', profileSkills)?.name).toBe('React');
    expect(findMatchingUserSkill('Git', profileSkills)?.name).toBe('Git & GitHub');
    expect(findMatchingUserSkill('GitHub', profileSkills)?.name).toBe('Git & GitHub');
  });

  it('never falsely awards Java to JavaScript or vice-versa', () => {
    const javaProfile: UserSkill[] = [
      { id: 'j1', name: 'Java', category: 'Languages', level: 'advanced' },
    ];
    expect(findMatchingUserSkill('JavaScript', javaProfile)).toBeUndefined();

    const jsProfile: UserSkill[] = [
      { id: 'js1', name: 'JavaScript', category: 'Languages', level: 'advanced' },
    ];
    expect(findMatchingUserSkill('Java', jsProfile)).toBeUndefined();
  });

  it('scores 100% for Frontend Internship when profile has HTML5/CSS3, JavaScript, React, Git & GitHub', () => {
    const profileSkills: UserSkill[] = [
      { id: '1', name: 'HTML5/CSS3', category: 'Frontend', level: 'advanced' },
      { id: '2', name: 'JavaScript', category: 'Languages', level: 'intermediate' },
      { id: '3', name: 'React', category: 'Frontend', level: 'intermediate' },
      { id: '4', name: 'Git & GitHub', category: 'Cloud & DevOps', level: 'intermediate' },
    ];

    const jobSkills = {
      core: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
      secondary: [],
    };

    const result = computeSkillMatch(jobSkills, profileSkills);

    expect(result.formulaExplanation.coreMatched).toBe(5);
    expect(result.formulaExplanation.coreTotal).toBe(5);
    expect(result.matchPercentage).toBe(100);
    expect(result.missingSkills).toHaveLength(0);
    expect(result.matchedSkills.map((m) => m.name)).toEqual(['HTML', 'CSS', 'JavaScript', 'React', 'Git']);
  });

  it('scores 60% for Pravallika with HTML5/CSS3 (matches HTML, CSS, Git; missing React, JS)', () => {
    const pravallikaSkills: UserSkill[] = [
      { id: 'b1', name: 'Python', category: 'Languages', level: 'advanced' },
      { id: 'b2', name: 'Java', category: 'Languages', level: 'intermediate' },
      { id: 'b3', name: 'Django', category: 'Backend', level: 'intermediate' },
      { id: 'b4', name: 'FastAPI', category: 'Backend', level: 'beginner' },
      { id: 'b5', name: 'PostgreSQL', category: 'Database', level: 'intermediate' },
      { id: 'b6', name: 'Docker', category: 'Cloud & DevOps', level: 'beginner' },
      { id: 'b7', name: 'AWS (S3, EC2, Lambda)', category: 'Cloud & DevOps', level: 'beginner' },
      { id: 'b8', name: 'Git & GitHub', category: 'Cloud & DevOps', level: 'intermediate' },
      { id: 'b9', name: 'HTML5/CSS3', category: 'Frontend', level: 'intermediate' },
    ];

    const jobSkills = {
      core: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
      secondary: [],
    };

    const result = computeSkillMatch(jobSkills, pravallikaSkills);

    // Core total = 5 (HTML, CSS, JavaScript, React, Git).
    // Matched = 3 (HTML, CSS, Git).
    // Missing = 2 (JavaScript, React).
    // Percentage = (3 * 2) / (5 * 2) * 100 = 6/10 = 60%.
    expect(result.formulaExplanation.coreMatched).toBe(3);
    expect(result.formulaExplanation.coreTotal).toBe(5);
    expect(result.matchPercentage).toBe(60);
    expect(result.missingSkills.map((m) => m.name)).toEqual(['JavaScript', 'React']);
    expect(result.matchedSkills.map((m) => m.name)).toEqual(['HTML', 'CSS', 'Git']);
  });

  it('scores 20% for Pravallika (Backend Track) without HTML/CSS (only Git matches, 4 frontend missing)', () => {
    const pravallikaBackendOnly: UserSkill[] = [
      { id: 'b1', name: 'Python', category: 'Languages', level: 'advanced' },
      { id: 'b2', name: 'Java', category: 'Languages', level: 'intermediate' },
      { id: 'b3', name: 'Django', category: 'Backend', level: 'intermediate' },
      { id: 'b4', name: 'FastAPI', category: 'Backend', level: 'beginner' },
      { id: 'b5', name: 'PostgreSQL', category: 'Database', level: 'intermediate' },
      { id: 'b6', name: 'Docker', category: 'Cloud & DevOps', level: 'beginner' },
      { id: 'b7', name: 'AWS (S3, EC2, Lambda)', category: 'Cloud & DevOps', level: 'beginner' },
      { id: 'b8', name: 'Git & GitHub', category: 'Cloud & DevOps', level: 'intermediate' },
    ];

    const jobSkills = {
      core: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
      secondary: [],
    };

    const result = computeSkillMatch(jobSkills, pravallikaBackendOnly);

    // Core total = 5. Matched = 1 (Git). Missing = 4 (HTML, CSS, JavaScript, React).
    // Percentage = (1 * 2) / (5 * 2) * 100 = 2/10 = 20%.
    expect(result.formulaExplanation.coreMatched).toBe(1);
    expect(result.formulaExplanation.coreTotal).toBe(5);
    expect(result.matchPercentage).toBe(20);
    expect(result.missingSkills.map((m) => m.name)).toEqual(['HTML', 'CSS', 'JavaScript', 'React']);
    expect(result.matchedSkills.map((m) => m.name)).toEqual(['Git']);
  });
});
