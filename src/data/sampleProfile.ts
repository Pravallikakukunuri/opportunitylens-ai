import type { UserProfile } from '../types';
import { INITIAL_USER_SKILLS } from './predefinedSkills';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Pravallika',
  headline: 'CSE Student · Class of 2028',
  education: 'B.Tech in Computer Science and Engineering',
  gradYear: '2028',
  targetRoles: ['Frontend Engineer', 'Full Stack Developer', 'Software Engineer Intern'],
  skills: INITIAL_USER_SKILLS,
  bio: 'Passionate student builder building scalable React & Node.js applications. Actively seeking Summer internship opportunities.',
};

export const PRESET_PROFILES: { label: string; profile: UserProfile }[] = [
  {
    label: 'Frontend Aspirant (Default)',
    profile: DEFAULT_USER_PROFILE,
  },
  {
    label: 'Backend & Cloud Focused',
    profile: {
      name: 'Pravallika',
      headline: 'CSE Student · Class of 2028',
      education: 'B.Tech in Computer Science and Engineering',
      gradYear: '2028',
      targetRoles: ['Backend Developer', 'Cloud Engineer Intern', 'DevOps Trainee'],
      skills: [
        { id: 'b1', name: 'Python', category: 'Languages', level: 'advanced' },
        { id: 'b2', name: 'Java', category: 'Languages', level: 'intermediate' },
        { id: 'b3', name: 'Django', category: 'Backend', level: 'intermediate' },
        { id: 'b4', name: 'FastAPI', category: 'Backend', level: 'beginner' },
        { id: 'b5', name: 'PostgreSQL', category: 'Database', level: 'intermediate' },
        { id: 'b6', name: 'Docker', category: 'Cloud & DevOps', level: 'beginner' },
        { id: 'b7', name: 'AWS (S3, EC2, Lambda)', category: 'Cloud & DevOps', level: 'beginner' },
        { id: 'b8', name: 'Git & GitHub', category: 'Cloud & DevOps', level: 'intermediate' },
      ],
      bio: 'Enthusiastic about distributed systems, microservices, and database indexing.',
    },
  },
  {
    label: 'AI & Data Science Student',
    profile: {
      name: 'Pravallika',
      headline: 'CSE Student · Class of 2028',
      education: 'B.Tech in Computer Science and Engineering',
      gradYear: '2028',
      targetRoles: ['Data Analyst Intern', 'Junior ML Engineer', 'Business Intelligence Analyst'],
      skills: [
        { id: 'd1', name: 'Python', category: 'Languages', level: 'advanced' },
        { id: 'd2', name: 'SQL', category: 'Database', level: 'advanced' },
        { id: 'd3', name: 'Pandas', category: 'AI & Data', level: 'intermediate' },
        { id: 'd4', name: 'NumPy', category: 'AI & Data', level: 'intermediate' },
        { id: 'd5', name: 'Scikit-Learn', category: 'AI & Data', level: 'beginner' },
        { id: 'd6', name: 'Data Cleaning & EDA', category: 'AI & Data', level: 'intermediate' },
        { id: 'd7', name: 'Prompt Engineering', category: 'AI & Data', level: 'intermediate' },
      ],
      bio: 'Building actionable insights from raw data, statistical analysis, and predictive modeling.',
    },
  },
];
