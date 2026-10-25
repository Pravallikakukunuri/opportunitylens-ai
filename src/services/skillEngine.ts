import type { SkillMatchCalculation, UserSkill, MatchedSkill, MissingSkill } from '../types';

interface SkillDefinition {
  canonical: string;
  category: string;
  regex: RegExp;
  isCoreDefault?: boolean;
}

const SKILL_DICTIONARY: SkillDefinition[] = [
  // Languages
  { canonical: 'JavaScript', category: 'Languages', regex: /\b(javascript|es6\+?|js)\b/i, isCoreDefault: true },
  { canonical: 'TypeScript', category: 'Languages', regex: /\b(typescript|ts)\b/i, isCoreDefault: true },
  { canonical: 'Python', category: 'Languages', regex: /\b(python|python3)\b/i, isCoreDefault: true },
  { canonical: 'Java', category: 'Languages', regex: /\b(java(?!script))\b/i, isCoreDefault: true },
  { canonical: 'C++', category: 'Languages', regex: /\b(c\+\+|cpp)\b/i, isCoreDefault: true },
  { canonical: 'C', category: 'Languages', regex: /\bc language\b|\bansi c\b/i },
  { canonical: 'Go', category: 'Languages', regex: /\b(golang|go language)\b/i },
  { canonical: 'HTML', category: 'Frontend', regex: /\b(html5?)\b/i, isCoreDefault: true },
  { canonical: 'CSS', category: 'Frontend', regex: /\b(css3?)\b/i, isCoreDefault: true },
  { canonical: 'HTML5/CSS3', category: 'Frontend', regex: /\b(html5?\/css3?|html\s*(?:&|and)\s*css)\b/i, isCoreDefault: true },
  { canonical: 'SQL', category: 'Database', regex: /\b(sql|structured query language)\b/i, isCoreDefault: true },

  // Frontend
  { canonical: 'React', category: 'Frontend', regex: /\b(react|react\.js|reactjs)\b/i, isCoreDefault: true },
  { canonical: 'Next.js', category: 'Frontend', regex: /\b(next\.js|nextjs)\b/i },
  { canonical: 'Vue.js', category: 'Frontend', regex: /\b(vue|vue\.js|vuejs)\b/i },
  { canonical: 'Angular', category: 'Frontend', regex: /\b(angular|angularjs)\b/i },
  { canonical: 'Tailwind CSS', category: 'Frontend', regex: /\b(tailwind|tailwindcss)\b/i },
  { canonical: 'Redux', category: 'Frontend', regex: /\b(redux|redux-toolkit|rtk)\b/i },
  { canonical: 'REST APIs', category: 'Frontend', regex: /\b(rest(ful)? apis?|rest api)\b/i, isCoreDefault: true },
  { canonical: 'Responsive Web Design', category: 'Frontend', regex: /\b(responsive design|responsive web)\b/i },

  // Backend
  { canonical: 'Node.js', category: 'Backend', regex: /\b(node|node\.js|nodejs)\b/i, isCoreDefault: true },
  { canonical: 'Express.js', category: 'Backend', regex: /\b(express|express\.js|expressjs)\b/i },
  { canonical: 'Spring Boot', category: 'Backend', regex: /\b(spring boot|springboot|spring framework)\b/i, isCoreDefault: true },
  { canonical: 'FastAPI', category: 'Backend', regex: /\b(fastapi)\b/i },
  { canonical: 'Django', category: 'Backend', regex: /\b(django)\b/i },
  { canonical: 'Flask', category: 'Backend', regex: /\b(flask)\b/i },
  { canonical: 'GraphQL', category: 'Backend', regex: /\b(graphql)\b/i },
  { canonical: 'Microservices', category: 'Backend', regex: /\b(microservices?|micro-services?)\b/i },

  // Database
  { canonical: 'PostgreSQL', category: 'Database', regex: /\b(postgres(ql)?)\b/i, isCoreDefault: true },
  { canonical: 'MongoDB', category: 'Database', regex: /\b(mongo(db)?)\b/i, isCoreDefault: true },
  { canonical: 'MySQL', category: 'Database', regex: /\b(mysql)\b/i },
  { canonical: 'Redis', category: 'Database', regex: /\b(redis)\b/i },
  { canonical: 'Firebase / Firestore', category: 'Database', regex: /\b(firebase|firestore)\b/i },

  // Cloud & DevOps
  { canonical: 'Git', category: 'Cloud & DevOps', regex: /\b(git(?!hub|lab)|version control)\b/i, isCoreDefault: true },
  { canonical: 'GitHub', category: 'Cloud & DevOps', regex: /\b(github|gitlab)\b/i },
  { canonical: 'Git & GitHub', category: 'Cloud & DevOps', regex: /\b(git\s*(?:&|and)\s*github)\b/i, isCoreDefault: true },
  { canonical: 'Docker', category: 'Cloud & DevOps', regex: /\b(docker|containerization)\b/i },
  { canonical: 'Kubernetes', category: 'Cloud & DevOps', regex: /\b(kubernetes|k8s)\b/i },
  { canonical: 'AWS (S3, EC2, Lambda)', category: 'Cloud & DevOps', regex: /\b(aws|amazon web services|ec2|s3|lambda)\b/i },
  { canonical: 'Google Cloud (GCP)', category: 'Cloud & DevOps', regex: /\b(gcp|google cloud)\b/i },
  { canonical: 'CI/CD Pipelines', category: 'Cloud & DevOps', regex: /\b(ci\/cd|continuous integration|github actions)\b/i },
  { canonical: 'Linux / Shell Scripting', category: 'Cloud & DevOps', regex: /\b(linux|bash|shell scripting|unix)\b/i },

  // AI & Data
  { canonical: 'Pandas', category: 'AI & Data', regex: /\b(pandas)\b/i, isCoreDefault: true },
  { canonical: 'NumPy', category: 'AI & Data', regex: /\b(numpy)\b/i },
  { canonical: 'Scikit-Learn', category: 'AI & Data', regex: /\b(scikit-learn|sklearn)\b/i },
  { canonical: 'TensorFlow', category: 'AI & Data', regex: /\b(tensorflow)\b/i },
  { canonical: 'PyTorch', category: 'AI & Data', regex: /\b(pytorch)\b/i },

  // Tools & Testing
  { canonical: 'Postman / API Testing', category: 'Tools & Methods', regex: /\b(postman|api testing)\b/i },
  { canonical: 'Jest / Unit Testing', category: 'Tools & Methods', regex: /\b(jest|unit testing|testing library|mocha)\b/i },
  { canonical: 'Figma', category: 'Tools & Methods', regex: /\b(figma)\b/i },
  { canonical: 'Agile / Scrum', category: 'Tools & Methods', regex: /\b(agile|scrum|sprint)\b/i },

  // Soft Skills
  { canonical: 'Problem Solving', category: 'Soft Skills', regex: /\b(problem solving|analytical skills|dsa|data structures)\b/i, isCoreDefault: true },
  { canonical: 'Technical Communication', category: 'Soft Skills', regex: /\b(communication|presentation skills|cross-functional)\b/i },
  { canonical: 'Team Collaboration', category: 'Soft Skills', regex: /\b(team player|collaborative|teamwork)\b/i },
];

export interface ExtractedSkillMetadata {
  origin: 'explicit' | 'inferred';
  level: 'required' | 'preferred';
  evidenceSnippet?: string;
}

export interface ExtractedSkillsResult {
  core: string[];
  secondary: string[];
  skillMetadata: Map<string, ExtractedSkillMetadata>;
  isIncompleteDescription: boolean;
  wordCount: number;
  descriptionWarning?: string;
}

export function extractSkillsFromJobText(text: string, jobTitle: string = ''): ExtractedSkillsResult {
  const words = (text || '').trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const isIncompleteDescription = wordCount < 20;
  const descriptionWarning = isIncompleteDescription
    ? `The submitted text contains only ${wordCount} words. Requirements cannot be reliably extracted from very brief or fragmented text. Please provide a complete job posting or recruiter message for accurate skill matching.`
    : undefined;

  const combined = `${jobTitle} \n ${text}`;
  const lowerText = combined.toLowerCase();
  const detected: { skill: SkillDefinition; snippet?: string }[] = [];
  const lines = text.split('\n');

  SKILL_DICTIONARY.forEach((skill) => {
    if (skill.regex.test(lowerText)) {
      if (!detected.some((d) => d.skill.canonical === skill.canonical)) {
        const matchedLine = lines.find((l) => skill.regex.test(l)) || jobTitle;
        detected.push({ skill, snippet: matchedLine.trim() });
      }
    }
  });

  const titleLower = jobTitle.toLowerCase();
  const core: string[] = [];
  const secondary: string[] = [];
  const skillMetadata = new Map<string, ExtractedSkillMetadata>();

  // If description is incomplete and no skills found, do not invent anything!
  if (isIncompleteDescription && detected.length === 0) {
    return {
      core: [],
      secondary: [],
      skillMetadata,
      isIncompleteDescription,
      wordCount,
      descriptionWarning,
    };
  }

  // Section header analysis
  let currentSection: 'required' | 'preferred' | 'neutral' = 'neutral';
  const preferredKeywordRegex = /(preferred|plus|bonus|nice to have|good to have|optional|desirable)/i;
  const requiredKeywordRegex = /(required|requirements|must have|qualifications|eligibility|prerequisites|core skills)/i;
  const skillSectionMap = new Map<string, 'required' | 'preferred'>();

  lines.forEach((line) => {
    if (preferredKeywordRegex.test(line) && !requiredKeywordRegex.test(line)) {
      currentSection = 'preferred';
    } else if (requiredKeywordRegex.test(line)) {
      currentSection = 'required';
    }

    if (currentSection === 'required' || currentSection === 'preferred') {
      const assignedLevel = currentSection;
      detected.forEach(({ skill }) => {
        if (skill.regex.test(line) && !skillSectionMap.has(skill.canonical)) {
          skillSectionMap.set(skill.canonical, assignedLevel);
        }
      });
    }
  });

  detected.forEach(({ skill, snippet }) => {
    const sName = skill.canonical.toLowerCase();
    const explicitSection = skillSectionMap.get(skill.canonical);

    if (explicitSection === 'preferred') {
      secondary.push(skill.canonical);
      skillMetadata.set(skill.canonical, {
        origin: 'explicit',
        level: 'preferred',
        evidenceSnippet: snippet,
      });
      return;
    }

    if (explicitSection === 'required') {
      core.push(skill.canonical);
      skillMetadata.set(skill.canonical, {
        origin: 'explicit',
        level: 'required',
        evidenceSnippet: snippet,
      });
      return;
    }

    // If no explicit section header, check line phrasing
    const hasExplicitReqPhrase = snippet ? /(must|required|proficient|experience with|solid|essential|knowledge of|hands-on)/i.test(snippet) : false;
    const hasExplicitPrefPhrase = snippet ? /(plus|bonus|nice to have|good to have|preferred|optional)/i.test(snippet) : false;

    if (hasExplicitPrefPhrase) {
      secondary.push(skill.canonical);
      skillMetadata.set(skill.canonical, {
        origin: 'explicit',
        level: 'preferred',
        evidenceSnippet: snippet,
      });
      return;
    }

    if (hasExplicitReqPhrase) {
      core.push(skill.canonical);
      skillMetadata.set(skill.canonical, {
        origin: 'explicit',
        level: 'required',
        evidenceSnippet: snippet,
      });
      return;
    }

    // Role-specific heuristics
    const isDirectRoleMatch =
      (titleLower.includes('frontend') && (sName.includes('react') || sName.includes('javascript') || sName.includes('html') || sName.includes('css') || sName.includes('typescript'))) ||
      (titleLower.includes('backend') && (sName.includes('node') || sName.includes('python') || sName.includes('java') || sName.includes('sql') || sName.includes('express') || sName.includes('django'))) ||
      (titleLower.includes('full') && (sName.includes('react') || sName.includes('node') || sName.includes('javascript') || sName.includes('sql') || sName.includes('typescript'))) ||
      (titleLower.includes('data') && (sName.includes('python') || sName.includes('sql') || sName.includes('pandas') || sName.includes('numpy')));

    if (isDirectRoleMatch || skill.isCoreDefault) {
      core.push(skill.canonical);
      skillMetadata.set(skill.canonical, {
        origin: 'inferred',
        level: 'required',
        evidenceSnippet: snippet,
      });
    } else {
      secondary.push(skill.canonical);
      skillMetadata.set(skill.canonical, {
        origin: 'inferred',
        level: 'preferred',
        evidenceSnippet: snippet,
      });
    }
  });

  // Ensure at least some core skills if any detected
  if (core.length === 0 && secondary.length > 0) {
    const moved = secondary.shift()!;
    core.push(moved);
    const existing = skillMetadata.get(moved);
    if (existing) {
      skillMetadata.set(moved, { ...existing, level: 'required' });
    }
  }

  return {
    core,
    secondary,
    skillMetadata,
    isIncompleteDescription,
    wordCount,
    descriptionWarning,
  };
}

export const SKILL_ALIAS_CLUSTERS: Record<string, string[]> = {
  html: ['html', 'html5', 'html5/css3', 'html/css', 'html & css'],
  html5: ['html', 'html5', 'html5/css3', 'html/css', 'html & css'],
  css: ['css', 'css3', 'html5/css3', 'html/css', 'html & css', 'tailwind css'],
  css3: ['css', 'css3', 'html5/css3', 'html/css', 'html & css'],
  'html5/css3': ['html', 'html5', 'css', 'css3', 'html5/css3', 'html/css', 'html & css'],
  'html/css': ['html', 'html5', 'css', 'css3', 'html5/css3', 'html/css', 'html & css'],
  javascript: ['javascript', 'js', 'es6', 'es6+', 'ecmascript'],
  typescript: ['typescript', 'ts'],
  react: ['react', 'react.js', 'reactjs', 'react native'],
  'node.js': ['node', 'node.js', 'nodejs'],
  'express.js': ['express', 'express.js', 'expressjs'],
  'vue.js': ['vue', 'vue.js', 'vuejs'],
  'next.js': ['next', 'next.js', 'nextjs'],
  angular: ['angular', 'angularjs', 'angular 2+'],
  'tailwind css': ['tailwind', 'tailwindcss', 'tailwind css'],
  git: ['git', 'github', 'gitlab', 'git & github', 'version control'],
  'git & github': ['git', 'github', 'gitlab', 'git & github', 'version control'],
  github: ['git', 'github', 'gitlab', 'git & github', 'version control'],
  aws: ['aws', 'amazon web services', 'aws (s3, ec2, lambda)', 's3', 'ec2', 'lambda'],
  'aws (s3, ec2, lambda)': ['aws', 'amazon web services', 'aws (s3, ec2, lambda)', 's3', 'ec2', 'lambda'],
  'google cloud (gcp)': ['gcp', 'google cloud', 'google cloud platform'],
  postgresql: ['postgresql', 'postgres'],
  mongodb: ['mongodb', 'mongo'],
  sql: ['sql', 'structured query language', 'mysql', 'postgresql', 'sqlite'],
  python: ['python', 'python3'],
  java: ['java'],
  'c++': ['c++', 'cpp'],
  'c#': ['c#', 'csharp', '.net', 'dotnet'],
  'postman / api testing': ['postman', 'api testing', 'postman / api testing'],
  postman: ['postman', 'api testing', 'postman / api testing'],
  'jest / unit testing': ['jest', 'unit testing', 'testing library', 'jest / unit testing', 'automated testing'],
  jest: ['jest', 'unit testing', 'testing library', 'jest / unit testing'],
  docker: ['docker', 'containerization', 'containers'],
  kubernetes: ['kubernetes', 'k8s'],
  'rest apis': ['rest', 'rest api', 'rest apis', 'restful', 'restful apis'],
  'responsive web design': ['responsive web design', 'responsive design', 'responsive web'],
  'problem solving': ['problem solving', 'dsa', 'data structures', 'algorithms'],
  'data cleaning & eda': ['data cleaning', 'eda', 'data cleaning & eda', 'exploratory data analysis'],
};

export function findMatchingUserSkill(jobSkillName: string, userSkills: UserSkill[]): UserSkill | undefined {
  const cleanJob = jobSkillName.trim().toLowerCase();
  if (!cleanJob) return undefined;

  // 1. Direct case-insensitive match
  const direct = userSkills.find((u) => u.name.trim().toLowerCase() === cleanJob);
  if (direct) return direct;

  // 2. Strict guard against false-positive cross-matches
  // Never match Java to JavaScript or C to C++
  const isJavaNotJs = (job: string, user: string) =>
    (job === 'java' && user.includes('javascript')) || (job.includes('javascript') && user === 'java');
  const isCNotCpp = (job: string, user: string) =>
    (job === 'c' && user.includes('c++')) || (job.includes('c++') && user === 'c');

  // 3. Cluster alias match
  const jobCluster = SKILL_ALIAS_CLUSTERS[cleanJob] || [cleanJob];

  for (const userSkill of userSkills) {
    const cleanUser = userSkill.name.trim().toLowerCase();

    if (isJavaNotJs(cleanJob, cleanUser) || isCNotCpp(cleanJob, cleanUser)) {
      continue;
    }

    if (cleanUser === cleanJob) return userSkill;
    if (jobCluster.includes(cleanUser)) return userSkill;

    const userCluster = SKILL_ALIAS_CLUSTERS[cleanUser];
    if (userCluster && userCluster.includes(cleanJob)) return userSkill;

    if (userCluster && userCluster.some((alias) => jobCluster.includes(alias))) {
      return userSkill;
    }
  }

  return undefined;
}

function deduplicateSkillList(skills: string[]): string[] {
  const seen = new Set<string>();
  const deduped: string[] = [];
  for (const s of skills || []) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    const lower = trimmed.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      deduped.push(trimmed);
    }
  }
  return deduped;
}

export function computeSkillMatch(
  jobSkills: {
    core: string[];
    secondary: string[];
    skillMetadata?: Map<string, ExtractedSkillMetadata>;
    isIncompleteDescription?: boolean;
    descriptionWarning?: string;
  },
  userSkills: UserSkill[]
): SkillMatchCalculation {
  const rawCore = deduplicateSkillList(jobSkills.core || []);
  const rawSecondary = deduplicateSkillList(jobSkills.secondary || []).filter(
    (sec) => !rawCore.some((c) => c.toLowerCase() === sec.toLowerCase())
  );

  const matchedSkills: MatchedSkill[] = [];
  const missingSkills: MissingSkill[] = [];
  const matchedUserSkillIds = new Set<string>();

  let coreMatched = 0;
  const coreTotal = rawCore.length;
  let secondaryMatched = 0;
  const secondaryTotal = rawSecondary.length;

  const requiredWeight = 2.0;
  const preferredWeight = 1.0;

  // Process Required (Core) Skills (Weight: 2.0x)
  rawCore.forEach((skillName) => {
    const userSkill = findMatchingUserSkill(skillName, userSkills);
    const dictEntry = SKILL_DICTIONARY.find(
      (d) => d.canonical.toLowerCase() === skillName.toLowerCase()
    );
    const category = dictEntry?.category || userSkill?.category || 'General';
    const meta = jobSkills.skillMetadata?.get(skillName);
    const origin = meta?.origin || 'explicit';
    const evidenceSnippet = meta?.evidenceSnippet;

    if (userSkill) {
      coreMatched += 1;
      matchedUserSkillIds.add(userSkill.id);
      matchedSkills.push({
        name: skillName,
        category,
        weight: 2,
        studentProficiency: userSkill.level,
        requiredLevel: 'required',
        origin,
        evidenceSnippet,
      });
    } else {
      missingSkills.push({
        name: skillName,
        category,
        importance: 'critical',
        requiredLevel: 'required',
        weight: 2,
        origin,
        evidenceSnippet,
      });
    }
  });

  // Process Preferred (Secondary) Skills (Weight: 1.0x)
  rawSecondary.forEach((skillName) => {
    const userSkill = findMatchingUserSkill(skillName, userSkills);
    const dictEntry = SKILL_DICTIONARY.find(
      (d) => d.canonical.toLowerCase() === skillName.toLowerCase()
    );
    const category = dictEntry?.category || userSkill?.category || 'General';
    const meta = jobSkills.skillMetadata?.get(skillName);
    const origin = meta?.origin || 'explicit';
    const evidenceSnippet = meta?.evidenceSnippet;

    if (userSkill) {
      secondaryMatched += 1;
      matchedUserSkillIds.add(userSkill.id);
      matchedSkills.push({
        name: skillName,
        category,
        weight: 1,
        studentProficiency: userSkill.level,
        requiredLevel: 'preferred',
        origin,
        evidenceSnippet,
      });
    } else {
      missingSkills.push({
        name: skillName,
        category,
        importance: 'secondary',
        requiredLevel: 'preferred',
        weight: 1,
        origin,
        evidenceSnippet,
      });
    }
  });

  // Bonus Skills (Student has them, job didn't specifically list or match)
  const bonusSkills = userSkills
    .filter((s) => !matchedUserSkillIds.has(s.id))
    .map((s) => s.name);

  // Exact Mathematical Formula:
  // Numerator: (Required Matched × 2) + (Preferred Matched × 1)
  // Denominator: (Required Total × 2) + (Preferred Total × 1)
  const numerator = coreMatched * 2 + secondaryMatched * 1;
  const denominator = coreTotal * 2 + secondaryTotal * 1;

  let matchPercentage = 0;
  let unweightedMatchPercentage = 0;
  const totalCount = coreTotal + secondaryTotal;
  const totalMatchedCount = coreMatched + secondaryMatched;

  if (denominator > 0) {
    matchPercentage = Math.min(100, Math.round((numerator / denominator) * 100));
  }
  if (totalCount > 0) {
    unweightedMatchPercentage = Math.min(100, Math.round((totalMatchedCount / totalCount) * 100));
  }

  const formula = denominator > 0
    ? `[(${coreMatched} Required × 2) + (${secondaryMatched} Preferred × 1)] ÷ [(${coreTotal} Required × 2) + (${secondaryTotal} Preferred × 1)] = ${numerator} ÷ ${denominator} × 100% = ${matchPercentage}%`
    : 'No recognized technical prerequisites in the submitted job text (0/0 = 0%).';

  const unweightedFormula = totalCount > 0
    ? `${totalMatchedCount} of ${totalCount} identified skills matched (${unweightedMatchPercentage}%)`
    : 'No recognized skills found in text.';

  const calculationSteps = denominator > 0
    ? [
        `1. Identify Required Skills: ${coreTotal} total (weighted at 2.0x each = ${coreTotal * 2} max points).`,
        `2. Identify Preferred Skills: ${secondaryTotal} total (weighted at 1.0x each = ${secondaryTotal * 1} max points).`,
        `3. Total Maximum Points (Denominator) = (${coreTotal} × 2) + (${secondaryTotal} × 1) = ${denominator} points.`,
        `4. Student Required Matches: ${coreMatched} of ${coreTotal} (${coreMatched} × 2 = ${coreMatched * 2} points earned).`,
        `5. Student Preferred Matches: ${secondaryMatched} of ${secondaryTotal} (${secondaryMatched} × 1 = ${secondaryMatched * 1} points earned).`,
        `6. Total Earned Points (Numerator) = ${coreMatched * 2} + ${secondaryMatched * 1} = ${numerator} points.`,
        `7. Exact Weighted Match = (${numerator} ÷ ${denominator}) × 100% = ${matchPercentage}%.`,
        `8. Unweighted Count Ratio = ${totalMatchedCount} of ${totalCount} skills matched (${unweightedMatchPercentage}%).`,
      ]
    : [
        '1. Submitted text does not contain recognized technical requirements.',
        '2. No prerequisites extracted from text (Denominator = 0).',
        '3. Overall match score defaults to 0% with unweighted ratio 0/0.',
      ];

  return {
    matchPercentage,
    unweightedMatchPercentage,
    totalRequiredCount: totalCount,
    matchedCount: totalMatchedCount,
    criticalMissingCount: missingSkills.filter((m) => m.importance === 'critical').length,
    matchedSkills,
    missingSkills,
    bonusSkills,
    isIncompleteDescription: jobSkills.isIncompleteDescription,
    descriptionWarning: jobSkills.descriptionWarning,
    formulaExplanation: {
      coreMatched,
      coreTotal,
      secondaryMatched,
      secondaryTotal,
      numerator,
      denominator,
      requiredWeight,
      preferredWeight,
      formula,
      unweightedFormula,
      calculationSteps,
    },
  };
}
