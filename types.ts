
export interface University {
  id: string;
  name: string;
  location: string;
  country: string;
  type: 'Public' | 'Private';
  worldRanking?: number;
  description: string;
  website: string;
  logo?: string;
  classification: string;
}

export interface Program {
  name: string;
  degree: 'Undergraduate' | 'Postgraduate' | 'Doctoral';
  faculty: string;
  duration: string;
  tuitionEstimate: string;
}

export interface ProgramDetails extends Program {
  overview: string;
  curriculum: string[];
  careerProspects: string[];
  admissionRequirements: string[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface UniversityDetails extends University {
  programs: Program[];
  sources: GroundingSource[];
}
