import { CV_SKILLS, NON_CV_TECH_KEYWORDS } from '../data/cvProfile';
import {
  CVSkill,
  JobMatchItem,
  RawJobPosting,
  RoleTrack,
  SkillMatchBreakdown,
} from '../types/job';
import { computeDefaultExpiresAt } from './dateUtils';

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function containsTerm(text: string, term: string): boolean {
  const escaped = escapeRegExp(term.toLowerCase());
  // Use non-alphanumeric boundaries so terms like "node.js", "next.js", "c#", "ci/cd", "ts", "ai" match cleanly as whole tokens
  const pattern = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
  return pattern.test(text);
}

export function inferRoleTrack(title: string, description: string): RoleTrack {
  const combined = `${title} ${description}`.toLowerCase();
  const titleLower = title.toLowerCase();

  if (
    titleLower.includes('lead') ||
    titleLower.includes('staff') ||
    titleLower.includes('principal') ||
    titleLower.includes('engineering manager')
  ) {
    return 'Tech Lead';
  }

  if (
    titleLower.includes('ai ') ||
    titleLower.includes('ai/') ||
    titleLower.includes('llm') ||
    titleLower.includes('agent') ||
    (combined.includes('llm') && combined.includes('agent'))
  ) {
    return 'AI Engineer';
  }

  if (
    titleLower.includes('frontend') ||
    titleLower.includes('front-end') ||
    titleLower.includes('ui ') ||
    titleLower.includes('design system')
  ) {
    return 'Frontend / UI';
  }

  return 'Fullstack';
}

export function computeSkillMatch(job: RawJobPosting): SkillMatchBreakdown {
  const searchableText = [
    job.title,
    job.company,
    job.location,
    job.description,
    ...(job.highlights || []),
    ...(job.requiredKeywords || []),
  ]
    .join(' \n ')
    .toLowerCase();

  // 1. Detect Matched CV Skills
  const matchedSkills: CVSkill[] = [];
  for (const skill of CV_SKILLS) {
    const isMatched = skill.aliases.some((alias) =>
      containsTerm(searchableText, alias)
    );
    if (isMatched) {
      matchedSkills.push(skill);
    }
  }

  // Sort matched skills by weight descending
  matchedSkills.sort((a, b) => b.weight - a.weight);

  // 2. Detect Missing / Stretch Skills mentioned in the job
  const missingSkillsSet = new Set<string>();
  for (const nonCvSkill of NON_CV_TECH_KEYWORDS) {
    const isPresent = nonCvSkill.aliases.some((alias) =>
      containsTerm(searchableText, alias)
    );
    if (isPresent) {
      missingSkillsSet.add(nonCvSkill.name);
    }
  }

  // Also check if job has explicit requiredKeywords not covered by CV_SKILLS
  if (job.requiredKeywords) {
    for (const kw of job.requiredKeywords) {
      const coveredByCv = CV_SKILLS.some(
        (s) =>
          s.name.toLowerCase() === kw.toLowerCase() ||
          s.aliases.some((a) => a.toLowerCase() === kw.toLowerCase())
      );
      if (!coveredByCv) {
        missingSkillsSet.add(kw);
      }
    }
  }

  const missingSkills = Array.from(missingSkillsSet).slice(0, 6);

  // 3. Calculate Sub-Scores
  const matchedIds = new Set(matchedSkills.map((s) => s.id));
  const corePillars = ['typescript', 'react', 'nextjs', 'nodejs', 'aws', 'ai-agents'];
  const matchedCoreCount = corePillars.filter((id) => matchedIds.has(id)).length;

  const totalDetectedSkills = matchedSkills.length + missingSkills.length;
  const rawCoverageRatio =
    totalDetectedSkills > 0 ? matchedSkills.length / totalDetectedSkills : 0.7;

  // Tech stack score (0-100)
  const weightedSum = matchedSkills.reduce((acc, s) => acc + s.weight, 0);
  const baseStackScore = Math.min(100, Math.round(rawCoverageRatio * 72 + Math.min(28, weightedSum * 0.45)));
  const techStackScore = Math.max(
    45,
    Math.min(99, baseStackScore + (matchedCoreCount >= 3 ? 6 : 0))
  );

  // Role & Seniority Fit (0-100)
  const titleLower = job.title.toLowerCase();
  let roleSeniorityScore = 78;
  if (
    titleLower.includes('senior') ||
    titleLower.includes('sr') ||
    titleLower.includes('lead') ||
    titleLower.includes('staff')
  ) {
    roleSeniorityScore += 12;
  }
  if (
    titleLower.includes('fullstack') ||
    titleLower.includes('full-stack') ||
    titleLower.includes('full stack') ||
    titleLower.includes('react') ||
    titleLower.includes('typescript') ||
    titleLower.includes('frontend') ||
    titleLower.includes('ai')
  ) {
    roleSeniorityScore += 8;
  }
  roleSeniorityScore = Math.min(99, roleSeniorityScore);

  // Location & Domain Fit (0-100)
  const locLower = job.location.toLowerCase();
  let locationDomainScore = 80;
  if (locLower.includes('stockholm') || locLower.includes('sweden')) {
    locationDomainScore = 98;
  } else if (job.workMode === 'Remote EU' || locLower.includes('europe') || locLower.includes('eu')) {
    locationDomainScore = 92;
  } else if (job.workMode === 'Remote') {
    locationDomainScore = 86;
  }

  // Overall Score (weighted blend)
  const overallScore = Math.min(
    99,
    Math.max(
      52,
      Math.round(
        techStackScore * 0.55 +
          roleSeniorityScore * 0.25 +
          locationDomainScore * 0.2
      )
    )
  );

  // 4. Generate tailored CV Evidence Reasons linking directly to Sachila's background
  const cvEvidenceReasons: string[] = [];

  if (matchedIds.has('react') && matchedIds.has('typescript') && matchedIds.has('nodejs')) {
    cvEvidenceReasons.push(
      'Direct core-stack match with your 5+ years at Qvalia (Stockholm) building customer-facing React, TypeScript & Node.js applications.'
    );
  } else if (matchedIds.has('react') && matchedIds.has('typescript')) {
    cvEvidenceReasons.push(
      'Strong frontend alignment with your Senior Developer track record in React & TypeScript across Qvalia and Creative Software.'
    );
  }

  if (matchedIds.has('ai-agents') || matchedIds.has('sse')) {
    cvEvidenceReasons.push(
      'Matches your hands-on AI engineering experience integrating real-time LLM analytics assistants with Server-Sent Events (SSE) and custom agent skills.'
    );
  }

  if (matchedIds.has('nextjs') || matchedIds.has('tailwind') || matchedIds.has('design-systems')) {
    cvEvidenceReasons.push(
      'Leverages your Next.js SSR, Tailwind CSS, and class-variance-authority (cva) design system architecture experience.'
    );
  }

  if (matchedIds.has('aws') || matchedIds.has('microservices') || matchedIds.has('cicd')) {
    cvEvidenceReasons.push(
      'Backed by your AWS Certified Solutions Architect (Jan 2026) credential and microservices / CI/CD pipeline ownership.'
    );
  }

  if (matchedIds.has('fintech')) {
    cvEvidenceReasons.push(
      'High domain synergy with your fintech, accounting workflows, and RBAC security background at Qvalia.'
    );
  }

  if (cvEvidenceReasons.length === 0) {
    cvEvidenceReasons.push(
      `Matches ${matchedSkills.length} technical skills from your MSc & 9+ years of full-stack software engineering profile.`
    );
  }

  return {
    overallScore,
    techStackScore,
    roleSeniorityScore,
    locationDomainScore,
    matchedSkills,
    missingSkills,
    cvEvidenceReasons,
  };
}

export function enrichJobWithMatch(raw: RawJobPosting): JobMatchItem {
  const roleTrack = raw.roleTrack || inferRoleTrack(raw.title, raw.description);
  const match = computeSkillMatch(raw);

  // Extract 3 concise highlights if not provided
  const highlights =
    raw.highlights && raw.highlights.length > 0
      ? raw.highlights
      : raw.description
          .split(/(?<=[.!?])\s+|\n+/)
          .map((s) => s.replace(/^[•\-*]\s*/, '').trim())
          .filter((s) => s.length > 35 && s.length < 180)
          .slice(0, 3);

  return {
    ...raw,
    expiresAt: raw.expiresAt || computeDefaultExpiresAt(raw.postedAt),
    roleTrack,
    highlights:
      highlights.length > 0
        ? highlights
        : ['Full-stack product engineering with modern TypeScript & cloud stack.'],
    match,
  };
}
