export interface Field {
  id: string;
  name: string;
  subfields: Subfield[];
}

export interface Subfield {
  id: string;
  name: string;
  description?: string;
}

export const fieldsData: Field[] = [
  {
    id: 'it',
    name: 'Information Technology',
    subfields: [
      { id: 'fullstack', name: 'Full Stack Developer', description: 'Frontend and backend development' },
      { id: 'frontend', name: 'Frontend Developer', description: 'User interface development' },
      { id: 'backend', name: 'Backend Developer', description: 'Server-side development' },
      { id: 'devops', name: 'DevOps Engineer', description: 'Infrastructure and deployment' },
      { id: 'data-science', name: 'Data Scientist', description: 'Data analysis and machine learning' },
      { id: 'cybersecurity', name: 'Cybersecurity Specialist', description: 'Security and threat protection' },
      { id: 'mobile', name: 'Mobile Developer', description: 'iOS and Android development' },
      { id: 'qa', name: 'QA Engineer', description: 'Quality assurance and testing' }
    ]
  },
  {
    id: 'science',
    name: 'Science',
    subfields: [
      { id: 'physics', name: 'Physics', description: 'Physical sciences and research' },
      { id: 'chemistry', name: 'Chemistry', description: 'Chemical sciences and research' },
      { id: 'biology', name: 'Biology', description: 'Biological sciences and research' },
      { id: 'mathematics', name: 'Mathematics', description: 'Mathematical research and analysis' },
      { id: 'engineering', name: 'Engineering', description: 'Various engineering disciplines' }
    ]
  },
  {
    id: 'commerce',
    name: 'Commerce & Business',
    subfields: [
      { id: 'finance', name: 'Finance', description: 'Financial services and banking' },
      { id: 'marketing', name: 'Marketing', description: 'Digital and traditional marketing' },
      { id: 'hr', name: 'Human Resources', description: 'HR management and recruitment' },
      { id: 'operations', name: 'Operations', description: 'Business operations and management' },
      { id: 'sales', name: 'Sales', description: 'Sales and business development' },
      { id: 'accounting', name: 'Accounting', description: 'Financial accounting and auditing' }
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    subfields: [
      { id: 'nursing', name: 'Nursing', description: 'Patient care and nursing' },
      { id: 'pharmacy', name: 'Pharmacy', description: 'Pharmaceutical sciences' },
      { id: 'medical-research', name: 'Medical Research', description: 'Clinical and medical research' },
      { id: 'public-health', name: 'Public Health', description: 'Community health and epidemiology' }
    ]
  },
  {
    id: 'education',
    name: 'Education',
    subfields: [
      { id: 'teaching', name: 'Teaching', description: 'K-12 and higher education teaching' },
      { id: 'administration', name: 'Educational Administration', description: 'School and university administration' },
      { id: 'curriculum', name: 'Curriculum Development', description: 'Educational content development' },
      { id: 'special-education', name: 'Special Education', description: 'Special needs education' }
    ]
  }
];
