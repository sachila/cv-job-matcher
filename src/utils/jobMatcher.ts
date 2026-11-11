import { CV_SKILLS, NON_CV_TECH_KEYWORDS, SACHILA_CV_PROFILE } from '../data/cvProfile';
import {
  CVSkill,
  CVProfile,
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

/**
 * Detects whether a job posting mentions supporting work visa sponsorship / work permits.
 */
export function detectVisaSponsorship(job: RawJobPosting): {
  supported: boolean;
  note?: string;
} {
  if (typeof job.visaSponsorship === 'boolean') {
    return {
      supported: job.visaSponsorship,
      note:
        job.visaSponsorshipNote ||
        (job.visaSponsorship
          ? 'Job post mentions Visa Sponsorship & Work Permit support'
          : undefined),
    };
  }

  const combined = [
    job.title,
    job.description,
    ...(job.highlights || []),
    ...(job.requiredKeywords || []),
  ]
    .join(' ')
    .toLowerCase();

  // Explicit negative patterns
  const negativePatterns = [
    'no visa sponsorship',
    'cannot sponsor',
    'unable to sponsor',
    'do not sponsor',
    'does not sponsor',
    'without visa sponsorship',
    'not offering visa sponsorship',
  ];
  if (negativePatterns.some((pat) => combined.includes(pat))) {
    return { supported: false };
  }

  // Explicit positive patterns mentioning visa sponsorship or work permit support
  const positivePatterns = [
    'visa sponsorship',
    'sponsor visa',
    'work visa',
    'work permit sponsorship',
    'work permit support',
    'sponsor work permit',
    'relocation and visa',
    'relocation & visa',
    'visa & relocation',
    'visa and relocation',
    'visa support',
    'eu blue card',
    'migrationsverket',
  ];

  if (positivePatterns.some((pat) => combined.includes(pat))) {
    return {
      supported: true,
      note:
        job.visaSponsorshipNote ||
        'Job post mentions Visa Sponsorship & Work Permit support',
    };
  }

  return { supported: false };
}

/**
 * Detects whether a job posting specifically mentions that Swedish language is needed/required.
 */
export function detectSwedishRequirement(job: RawJobPosting): {
  required: boolean;
  note?: string;
} {
  if (typeof job.requiresSwedish === 'boolean') {
    return {
      required: job.requiresSwedish,
      note:
        job.swedishRequirementNote ||
        (job.requiresSwedish
          ? 'Job post specifically mentions Swedish language proficiency is required'
          : 'English working language — No Swedish requirement mentioned'),
    };
  }

  const combined = [
    job.title,
    job.description,
    ...(job.highlights || []),
    ...(job.requiredKeywords || []),
  ]
    .join(' ')
    .toLowerCase();

  // Check if explicitly stating Swedish is NOT required
  const notRequiredPatterns = [
    'no swedish required',
    'swedish is not required',
    'swedish not required',
    'without swedish',
    'swedish is a bonus, not a requirement',
  ];
  if (notRequiredPatterns.some((pat) => combined.includes(pat))) {
    return {
      required: false,
      note: 'Explicitly states Swedish is not required (English working language)',
    };
  }

  // English & Swedish phrases indicating Swedish proficiency is needed
  const swedishRequiredPatterns = [
    'fluent in swedish',
    'fluency in swedish',
    'swedish is required',
    'swedish required',
    'requires swedish',
    'must speak swedish',
    'proficient in swedish',
    'proficiency in swedish',
    'swedish and english',
    'both swedish and english',
    'native swedish',
    'professional swedish',
    'good command of swedish',
    'swedish language is a requirement',
    'flytande svenska',
    'svenska i tal och skrift',
    'goda kunskaper i svenska',
    'behärskar svenska',
    'krav på svenska',
    'svenska och engelska',
    'vi söker dig som',
    'arbetsuppgifter',
    'kvalifikationer',
  ];

  if (swedishRequiredPatterns.some((pat) => combined.includes(pat))) {
    return {
      required: true,
      note:
        job.swedishRequirementNote ||
        'Job post mentions Swedish language proficiency is required',
    };
  }

  return {
    required: false,
    note: 'English working language — No Swedish requirement mentioned',
  };
}

export function inferRoleTrack(title: string, description: string): RoleTrack {
  const combined = `${title} ${description}`.toLowerCase();
  const titleLower = title.toLowerCase();

  if (
    titleLower.includes('qa ') ||
    titleLower.includes('qa/') ||
    titleLower.includes('qa-') ||
    titleLower.includes('sdet') ||
    titleLower.includes('test') ||
    titleLower.includes('quality assurance') ||
    titleLower.includes('automation engineer') ||
    titleLower.includes('software tester') ||
    combined.includes('playwright') ||
    combined.includes('cypress') ||
    combined.includes('selenium')
  ) {
    return 'QA / Test';
  }

  if (
    titleLower.includes('devops') ||
    titleLower.includes('platform') ||
    titleLower.includes('sre') ||
    titleLower.includes('site reliability') ||
    titleLower.includes('cloud engineer') ||
    titleLower.includes('infrastructure')
  ) {
    return 'DevOps / Platform';
  }

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

export function computeSkillMatch(
  job: RawJobPosting,
  profile?: CVProfile
): SkillMatchBreakdown {
  const activeProfile = profile || SACHILA_CV_PROFILE;
  const cvSkills =
    Array.isArray(activeProfile?.skills) && activeProfile.skills.length > 0
      ? activeProfile.skills
      : CV_SKILLS;

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
  for (const skill of cvSkills) {
    const aliases = Array.isArray(skill.aliases) && skill.aliases.length > 0
      ? skill.aliases
      : [skill.name];
    const isMatched = aliases.some((alias) =>
      containsTerm(searchableText, alias)
    );
    if (isMatched) {
      matchedSkills.push(skill);
    }
  }

  // Sort matched skills by weight descending
  matchedSkills.sort((a, b) => (b.weight || 5) - (a.weight || 5));

  // 2. Detect Missing / Stretch Skills mentioned in the job
  const missingSkillsSet = new Set<string>();
  for (const nonCvSkill of NON_CV_TECH_KEYWORDS) {
    const isPresent = (nonCvSkill.aliases || []).some((alias) =>
      containsTerm(searchableText, alias)
    );
    if (isPresent) {
      // Don't mark as missing if the active profile already has this skill
      const coveredInProfile = cvSkills.some((s) => {
        const sAliases = Array.isArray(s.aliases) && s.aliases.length > 0
          ? s.aliases
          : [s.name];
        return sAliases.some(
          (a) => a.toLowerCase() === nonCvSkill.name.toLowerCase()
        );
      });
      if (!coveredInProfile) {
        missingSkillsSet.add(nonCvSkill.name);
      }
    }
  }

  // Also check if job has explicit requiredKeywords not covered by profile skills
  if (job.requiredKeywords && Array.isArray(job.requiredKeywords)) {
    for (const kw of job.requiredKeywords) {
      const coveredByCv = cvSkills.some((s) => {
        const sAliases = Array.isArray(s.aliases) && s.aliases.length > 0
          ? s.aliases
          : [s.name];
        return (
          s.name.toLowerCase() === kw.toLowerCase() ||
          sAliases.some((a) => a.toLowerCase() === kw.toLowerCase())
        );
      });
      if (!coveredByCv) {
        missingSkillsSet.add(kw);
      }
    }
  }

  const missingSkills = Array.from(missingSkillsSet).slice(0, 6);

  // 3. Calculate Sub-Scores
  const matchedIds = new Set(matchedSkills.map((s) => s.id));
  
  // Top 5-6 pillar skills from profile
  const sortedPillars = [...cvSkills]
    .sort((a, b) => (b.weight || 5) - (a.weight || 5))
    .slice(0, 6)
    .map((s) => s.id);
  const matchedCoreCount = sortedPillars.filter((id) => matchedIds.has(id)).length;

  const totalDetectedSkills = matchedSkills.length + missingSkills.length;
  const rawCoverageRatio =
    totalDetectedSkills > 0 ? matchedSkills.length / totalDetectedSkills : 0.7;

  // Tech stack score (0-100)
  const weightedSum = matchedSkills.reduce((acc, s) => acc + (s.weight || 5), 0);
  const baseStackScore = Math.min(
    100,
    Math.round(rawCoverageRatio * 72 + Math.min(28, weightedSum * 0.45))
  );
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

  // Role track affinity
  const targetTrack = activeProfile?.targetRoleTrack;
  const inferred = inferRoleTrack(job.title, job.description);
  const primaryKeywords = Array.isArray(activeProfile?.primarySearchKeywords)
    ? activeProfile.primarySearchKeywords
    : [];

  if (targetTrack && inferred === targetTrack) {
    roleSeniorityScore += 10;
  } else if (
    primaryKeywords.some((kw) =>
      titleLower.includes(kw.toLowerCase())
    )
  ) {
    roleSeniorityScore += 8;
  }
  roleSeniorityScore = Math.min(99, roleSeniorityScore);

  // Location & Domain Fit (0-100)
  const locLower = job.location.toLowerCase();
  let locationDomainScore = 80;
  if (locLower.includes('stockholm') || locLower.includes('sweden')) {
    locationDomainScore = 98;
  } else if (
    job.workMode === 'Remote EU' ||
    locLower.includes('europe') ||
    locLower.includes('eu')
  ) {
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

  // 4. Generate tailored CV Evidence Reasons
  const cvEvidenceReasons: string[] = [];

  if (activeProfile.id === 'sachila') {
    // Specialized Sachila Ranawaka high-fidelity evidence
    if (
      matchedIds.has('react') &&
      matchedIds.has('typescript') &&
      matchedIds.has('nodejs')
    ) {
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

    if (
      matchedIds.has('nextjs') ||
      matchedIds.has('tailwind') ||
      matchedIds.has('design-systems')
    ) {
      cvEvidenceReasons.push(
        'Leverages your Next.js SSR, Tailwind CSS, and class-variance-authority (cva) design system architecture experience.'
      );
    }

    if (
      matchedIds.has('aws') ||
      matchedIds.has('microservices') ||
      matchedIds.has('cicd')
    ) {
      cvEvidenceReasons.push(
        'Backed by your AWS Certified Solutions Architect (Jan 2026) credential and microservices / CI/CD pipeline ownership.'
      );
    }

    if (matchedIds.has('fintech')) {
      cvEvidenceReasons.push(
        'High domain synergy with your fintech, accounting workflows, and RBAC security background at Qvalia.'
      );
    }
  } else {
    // Dynamic Evidence Generation for any uploaded/selected CV Profile
    // 1. Check experience alignment
    if (Array.isArray(activeProfile?.experience) && activeProfile.experience.length > 0) {
      let bestExp = activeProfile.experience[0];
      let bestMatchCount = 0;

      for (const exp of activeProfile.experience) {
        const highlightsText = Array.isArray(exp.highlights) ? exp.highlights.join(' ') : '';
        const expText = `${exp.role || ''} ${exp.company || ''} ${highlightsText}`.toLowerCase();
        const count = matchedSkills.filter((s) => {
          const sAliases = Array.isArray(s.aliases) && s.aliases.length > 0
            ? s.aliases
            : [s.name];
          return sAliases.some((a) => expText.includes(a.toLowerCase()));
        }).length;
        if (count > bestMatchCount) {
          bestMatchCount = count;
          bestExp = exp;
        }
      }

      if (bestExp) {
        const periodStr = bestExp.period ? ` (${bestExp.period})` : '';
        cvEvidenceReasons.push(
          `Strong role synergy with your experience as ${bestExp.role} at ${bestExp.company}${periodStr} leveraging ${matchedSkills.slice(0, 3).map((s) => s.name).join(', ')}.`
        );
      }
    }

    // 2. Check certification alignment
    if (Array.isArray(activeProfile?.certifications) && activeProfile.certifications.length > 0) {
      const topCert = activeProfile.certifications[0];
      const certTime = topCert.year || topCert.date ? ` (${topCert.year || topCert.date})` : '';
      cvEvidenceReasons.push(
        `Reinforced by your verified certification: ${topCert.name}${certTime}.`
      );
    }

    // 3. Check education alignment
    if (Array.isArray(activeProfile?.education) && activeProfile.education.length > 0) {
      const topEdu = activeProfile.education[0];
      cvEvidenceReasons.push(
        `Supported by your ${topEdu.degree} from ${topEdu.institution}.`
      );
    }
  }

  if (cvEvidenceReasons.length === 0) {
    const years = activeProfile?.yearsOfExperience || 5;
    const title = activeProfile?.title || 'Software Engineer';
    cvEvidenceReasons.push(
      `Matches ${matchedSkills.length} verified competencies (${matchedSkills
        .slice(0, 4)
        .map((s) => s.name)
        .join(', ')}) from your ${years}+ years ${title} background.`
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

export function enrichJobWithMatch(
  raw: RawJobPosting,
  profile?: CVProfile
): JobMatchItem {
  const roleTrack = raw.roleTrack || inferRoleTrack(raw.title, raw.description);
  const match = computeSkillMatch(raw, profile);
  const visaInfo = detectVisaSponsorship(raw);
  const swedishInfo = detectSwedishRequirement(raw);

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
    visaSponsorship: visaInfo.supported,
    visaSponsorshipNote: visaInfo.note,
    requiresSwedish: swedishInfo.required,
    swedishRequirementNote: swedishInfo.note,
    highlights:
      highlights.length > 0
        ? highlights
        : ['Product engineering role with modern tech stack.'],
    match,
  };
}
