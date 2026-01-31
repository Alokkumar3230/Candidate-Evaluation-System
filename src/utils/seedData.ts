import { faker } from '@faker-js/faker';
import { bulkCreateCandidates } from '@/db/api';
import type { Candidate } from '@/types';

const positions = [
  'Software Engineer',
  'Product Manager',
  'Data Scientist',
  'UX Designer',
  'DevOps Engineer',
  'Marketing Manager',
  'Sales Director',
  'HR Manager',
  'Financial Analyst',
  'Operations Manager',
  'Business Analyst',
  'Project Manager',
  'Quality Assurance Engineer',
  'Security Analyst',
  'Customer Success Manager'
];

const skillSets = [
  ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS'],
  ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis', 'SQL'],
  ['Product Strategy', 'Agile', 'Roadmapping', 'User Research', 'Analytics'],
  ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping', 'User Testing'],
  ['Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform'],
  ['Digital Marketing', 'SEO', 'Content Strategy', 'Social Media', 'Analytics'],
  ['Sales Strategy', 'CRM', 'Negotiation', 'Lead Generation', 'Account Management'],
  ['Recruitment', 'Employee Relations', 'Performance Management', 'Training', 'Compliance'],
  ['Financial Modeling', 'Excel', 'Forecasting', 'Budgeting', 'Risk Analysis'],
  ['Process Optimization', 'Supply Chain', 'Logistics', 'Lean Six Sigma', 'Project Management'],
  ['Business Intelligence', 'SQL', 'Tableau', 'Requirements Gathering', 'Process Mapping'],
  ['Scrum', 'JIRA', 'Risk Management', 'Stakeholder Management', 'Budgeting'],
  ['Test Automation', 'Selenium', 'API Testing', 'Performance Testing', 'Bug Tracking'],
  ['Cybersecurity', 'Penetration Testing', 'SIEM', 'Compliance', 'Incident Response'],
  ['Customer Onboarding', 'Account Management', 'Support', 'Training', 'Retention']
];

export const generateCandidates = (count = 40): Omit<Candidate, 'id' | 'created_at'>[] => {
  const candidates: Omit<Candidate, 'id' | 'created_at'>[] = [];

  for (let i = 0; i < count; i++) {
    const positionIndex = i % positions.length;
    const position = positions[positionIndex];
    const skills = skillSets[positionIndex];
    
    candidates.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      experience_years: faker.number.int({ min: 1, max: 20 }),
      skills: skills,
      position: position
    });
  }

  return candidates;
};

export const seedCandidates = async (): Promise<{ success: boolean; count: number; error?: string }> => {
  try {
    const candidates = generateCandidates(40);
    const result = await bulkCreateCandidates(candidates);
    return { success: true, count: result.length };
  } catch (error) {
    console.error('Error seeding candidates:', error);
    return { 
      success: false, 
      count: 0, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
