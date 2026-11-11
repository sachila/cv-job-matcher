export type SkillCategory =
  | 'Frontend & UI'
  | 'Backend & APIs'
  | 'Cloud, DevOps & Testing'
  | 'AI & Engineering Leadership';

export interface CVSkill {
  id: string;
  name: string;
  category: SkillCategory;
  weight: number; // 1 to 10 importance weight in Sachila's CV
  aliases: string[];
}

export type WorkMode = 'Hybrid' | 'On-site' | 'Remote EU' | 'Remote';

export type RoleTrack =
  | 'Fullstack'
  | 'Frontend / UI'
  | 'AI Engineer'
  | 'Tech Lead';

export type JobSource =
  | 'LinkedIn'
  | 'Indeed'
  | 'JobTech Sweden'
  | 'Arbeitnow EU'
  | 'Remotive'
  | 'Himalayas EU'
  | 'Custom JD';

export interface SkillMatchBreakdown {
  overallScore: number; // 0 - 99
  techStackScore: number; // 0 - 100
  roleSeniorityScore: number; // 0 - 100
  locationDomainScore: number; // 0 - 100
  matchedSkills: CVSkill[];
  missingSkills: string[];
  cvEvidenceReasons: string[];
}

export interface RawJobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: WorkMode;
  roleTrack?: RoleTrack;
  postedAt: string; // ISO 8601 date string
  expiresAt?: string; // ISO 8601 application deadline / expiration date
  isClosedOrExpired?: boolean; // Explicit flag if source marks posting closed/removed
  salaryRange?: string;
  visaSponsorship?: boolean; // True if job post mentions supporting work visa sponsorship
  visaSponsorshipNote?: string; // Specific excerpt/note about visa sponsorship from the post
  requiresSwedish?: boolean; // True if job post specifically mentions Swedish language is required
  swedishRequirementNote?: string; // Excerpt/note about Swedish language requirement
  description: string;
  highlights?: string[];
  requiredKeywords?: string[];
  url: string;
  source: JobSource;
}

export interface JobMatchItem extends RawJobPosting {
  expiresAt: string; // Guaranteed active future expiration date
  roleTrack: RoleTrack;
  visaSponsorship: boolean;
  visaSponsorshipNote?: string;
  requiresSwedish: boolean;
  swedishRequirementNote?: string;
  highlights: string[];
  match: SkillMatchBreakdown;
}

export type SortOption =
  | 'posted_desc'
  | 'posted_asc'
  | 'match_desc';
