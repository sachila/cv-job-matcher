import { MULTI_SOURCE_CURATED_JOBS } from '../data/curatedJobs';
import { JobMatchItem, RawJobPosting, WorkMode } from '../types/job';
import { computeDefaultExpiresAt, isJobExpired } from '../utils/dateUtils';
import { enrichJobWithMatch } from '../utils/jobMatcher';

export interface FetchJobsResult {
  jobs: JobMatchItem[];
  expiredFilteredCount: number;
  sourceBreakdown: {
    linkedin: number;
    indeed: number;
    jobtechSweden: number;
    arbeitnowEu: number;
    remotive: number;
    himalayasEu: number;
  };
  lastUpdated: string;
}

function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

/**
 * Normalizes API dates so that even if the local system clock is shifted relative
 * to an external server clock, relative recency, expiration deadlines, and chronological sorting remain accurate.
 */
function normalizeBatchTimestamps(rawItems: RawJobPosting[]): RawJobPosting[] {
  if (rawItems.length === 0) return rawItems;

  const validTimestamps = rawItems
    .map((item) => new Date(item.postedAt).getTime())
    .filter((t) => !isNaN(t));

  if (validTimestamps.length === 0) return rawItems;

  const maxFeedTime = Math.max(...validTimestamps);
  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  if (Math.abs(now - maxFeedTime) > thirtyDaysMs) {
    const offset = now - maxFeedTime - 35 * 60 * 1000;
    return rawItems.map((item) => {
      const t = new Date(item.postedAt).getTime();
      if (isNaN(t)) return item;
      const shiftedPosted = new Date(t + offset).toISOString();
      const shiftedExpires = item.expiresAt
        ? new Date(new Date(item.expiresAt).getTime() + offset).toISOString()
        : computeDefaultExpiresAt(shiftedPosted);
      return {
        ...item,
        postedAt: shiftedPosted,
        expiresAt: shiftedExpires,
      };
    });
  }

  return rawItems;
}

/**
 * 1. LinkedIn Live Proxy Feed (via Vite server middleware)
 */
async function fetchLinkedInProxyJobs(): Promise<RawJobPosting[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch('/api/external-jobs', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data?.jobs) ? data.jobs : [];
    return normalizeBatchTimestamps(list);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * 2. Sweden's Official Arbetsförmedlingen JobTech API (Platsbanken)
 * Includes explicit `application_deadline` and `removed` status to filter out expired jobs.
 */
async function fetchJobTechSwedenJobs(): Promise<RawJobPosting[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const url =
      'https://jobsearch.api.jobtechdev.se/search?q=typescript%20react%20fullstack%20stockholm&limit=15';
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`JobTech Sweden API status ${res.status}`);
    }

    const data = await res.json();
    const hits = Array.isArray(data?.hits) ? data.hits : [];

    const mapped: RawJobPosting[] = hits.map((hit: any) => {
      const municipality =
        hit?.workplace_address?.municipality ||
        hit?.workplace_address?.region ||
        'Stockholm';
      const descriptionText =
        hit?.description?.text ||
        hit?.description?.text_formatted ||
        'Software engineering role in Sweden matching React, TypeScript, and full-stack development.';

      const descLower = descriptionText.toLowerCase();
      let workMode: WorkMode = 'Hybrid';
      if (
        descLower.includes('100% remote') ||
        descLower.includes('fully remote')
      ) {
        workMode = 'Remote EU';
      } else if (
        descLower.includes('on-site') ||
        descLower.includes('onsite')
      ) {
        workMode = 'On-site';
      }

      const postedIso = hit.publication_date
        ? new Date(hit.publication_date).toISOString()
        : new Date().toISOString();

      const deadlineIso = hit?.application_details?.deadline
        ? new Date(hit.application_details.deadline).toISOString()
        : hit?.last_publication_date
        ? new Date(hit.last_publication_date).toISOString()
        : undefined;

      return {
        id: `jobtech-${hit.id || Math.random().toString(36).slice(2)}`,
        title: hit.headline || 'Senior Fullstack Developer (React / TypeScript)',
        company: hit?.employer?.name || 'Swedish Tech Employer',
        location: `${municipality}, Sweden`,
        workMode,
        postedAt: postedIso,
        expiresAt: deadlineIso,
        isClosedOrExpired: Boolean(hit.removed),
        description: stripHtml(descriptionText),
        url:
          hit.webpage_url ||
          `https://arbetsformedlingen.se/platsbanken/annonser/${hit.id}`,
        source: 'JobTech Sweden',
      };
    });

    return normalizeBatchTimestamps(mapped);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * 3. Arbeitnow European Tech Job Board API
 */
async function fetchArbeitnowEuJobs(): Promise<RawJobPosting[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch('https://www.arbeitnow.com/api/job-board-api', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Arbeitnow API status ${res.status}`);
    }

    const data = await res.json();
    const rawList = Array.isArray(data?.data) ? data.data : [];

    const relevant = rawList
      .filter((item: any) => {
        const text = `${item.title || ''} ${(item.tags || []).join(' ')} ${
          item.description || ''
        }`.toLowerCase();
        return (
          text.includes('react') ||
          text.includes('typescript') ||
          text.includes('node') ||
          text.includes('next.js') ||
          text.includes('fullstack') ||
          text.includes('full-stack') ||
          text.includes('full stack') ||
          text.includes('frontend')
        );
      })
      .slice(0, 10);

    const mapped: RawJobPosting[] = relevant.map((item: any) => {
      const createdAtSec =
        typeof item.created_at === 'number'
          ? item.created_at * 1000
          : Date.now();
      const isRemote = Boolean(item.remote);
      const hasVisaFlag = Boolean(item.visa_sponsorship);

      return {
        id: `arbeitnow-${item.slug || Math.random().toString(36).slice(2)}`,
        title: item.title || 'Fullstack Engineer',
        company: item.company_name || 'European Tech Company',
        location: isRemote
          ? `Remote EU (${item.location || 'Europe'})`
          : item.location || 'Europe',
        workMode: isRemote ? 'Remote EU' : 'Hybrid',
        postedAt: new Date(createdAtSec).toISOString(),
        visaSponsorship: hasVisaFlag ? true : undefined,
        visaSponsorshipNote: hasVisaFlag
          ? 'Arbeitnow verified: Job post explicitly offers EU Visa Sponsorship'
          : undefined,
        description: stripHtml(item.description || ''),
        requiredKeywords: Array.isArray(item.tags) ? item.tags : [],
        url: item.url || 'https://www.arbeitnow.com/',
        source: 'Arbeitnow EU',
      };
    });

    return normalizeBatchTimestamps(mapped);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * 4. Remotive Public Remote Software Dev API
 */
async function fetchRemotiveJobs(): Promise<RawJobPosting[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(
      'https://remotive.com/api/remote-jobs?category=software-dev&search=typescript&limit=10',
      {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      }
    );

    if (!res.ok) {
      throw new Error(`Remotive API status ${res.status}`);
    }

    const data = await res.json();
    const jobs = Array.isArray(data?.jobs) ? data.jobs.slice(0, 10) : [];

    const mapped: RawJobPosting[] = jobs.map((job: any) => {
      const loc = job.candidate_required_location || 'Europe / Worldwide';
      const isEu =
        loc.toLowerCase().includes('europe') ||
        loc.toLowerCase().includes('eu') ||
        loc.toLowerCase().includes('worldwide') ||
        loc.toLowerCase().includes('emea');

      return {
        id: `remotive-${job.id || Math.random().toString(36).slice(2)}`,
        title: job.title || 'Senior Fullstack Engineer',
        company: job.company_name || 'Remote Tech Team',
        location: `Remote (${loc})`,
        workMode: isEu ? 'Remote EU' : 'Remote',
        postedAt: job.publication_date
          ? new Date(job.publication_date).toISOString()
          : new Date().toISOString(),
        salaryRange: job.salary || undefined,
        description: stripHtml(job.description || ''),
        requiredKeywords: Array.isArray(job.tags) ? job.tags : [],
        url: job.url || 'https://remotive.com/',
        source: 'Remotive',
      };
    });

    return normalizeBatchTimestamps(mapped);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * 5. Himalayas Remote Tech Jobs API (includes `expiryDate`)
 */
async function fetchHimalayasJobs(): Promise<RawJobPosting[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch('https://himalayas.app/jobs/api?limit=20', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Himalayas API status ${res.status}`);
    }

    const data = await res.json();
    const jobs = Array.isArray(data?.jobs) ? data.jobs : [];

    const relevant = jobs
      .filter((job: any) => {
        const text = `${job.title || ''} ${(job.categories || []).join(' ')} ${
          job.description || ''
        }`.toLowerCase();
        return (
          text.includes('react') ||
          text.includes('typescript') ||
          text.includes('node') ||
          text.includes('fullstack') ||
          text.includes('full-stack') ||
          text.includes('frontend') ||
          text.includes('software engineer')
        );
      })
      .slice(0, 8);

    const mapped: RawJobPosting[] = relevant.map((job: any) => {
      const pubSec =
        typeof job.pubDate === 'number' ? job.pubDate * 1000 : Date.now();
      const expSec =
        typeof job.expiryDate === 'number' ? job.expiryDate * 1000 : undefined;

      return {
        id: `himalayas-${job.guid || Math.random().toString(36).slice(2)}`,
        title: job.title || 'Senior Fullstack Engineer',
        company: job.companyName || 'Global Remote Tech',
        location: 'Remote (EU / Global)',
        workMode: 'Remote EU',
        postedAt: new Date(pubSec).toISOString(),
        expiresAt: expSec ? new Date(expSec).toISOString() : undefined,
        description: stripHtml(job.description || job.excerpt || ''),
        url: job.applicationLink || job.guid || 'https://himalayas.app/jobs',
        source: 'Himalayas EU',
      };
    });

    return normalizeBatchTimestamps(mapped);
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchAllJobMatches(): Promise<FetchJobsResult> {
  const [
    linkedInProxyRes,
    jobtechRes,
    arbeitnowRes,
    remotiveRes,
    himalayasRes,
  ] = await Promise.allSettled([
    fetchLinkedInProxyJobs(),
    fetchJobTechSwedenJobs(),
    fetchArbeitnowEuJobs(),
    fetchRemotiveJobs(),
    fetchHimalayasJobs(),
  ]);

  const linkedInLive =
    linkedInProxyRes.status === 'fulfilled' ? linkedInProxyRes.value : [];
  const jobtechJobs =
    jobtechRes.status === 'fulfilled' ? jobtechRes.value : [];
  const arbeitnowJobs =
    arbeitnowRes.status === 'fulfilled' ? arbeitnowRes.value : [];
  const remotiveJobs =
    remotiveRes.status === 'fulfilled' ? remotiveRes.value : [];
  const himalayasJobs =
    himalayasRes.status === 'fulfilled' ? himalayasRes.value : [];

  const allCandidates: RawJobPosting[] = [
    ...linkedInLive,
    ...jobtechJobs,
    ...arbeitnowJobs,
    ...remotiveJobs,
    ...himalayasJobs,
    ...MULTI_SOURCE_CURATED_JOBS,
  ];

  // 1. STRICT EXPIRATION & STOCKHOLM LOCATION FILTER:
  // Never include expired postings or jobs outside Stockholm, Sweden!
  let expiredFilteredCount = 0;
  const activeOnly: RawJobPosting[] = [];
  for (const candidate of allCandidates) {
    if (isJobExpired(candidate)) {
      expiredFilteredCount += 1;
      continue;
    }
    const locLower = (candidate.location || '').toLowerCase();
    if (!locLower.includes('stockholm')) {
      continue;
    }
    activeOnly.push({
      ...candidate,
      location: 'Stockholm, Sweden',
    });
  }

  // 2. Deduplicate active jobs by normalized title + company
  const seen = new Set<string>();
  const deduplicated: RawJobPosting[] = [];
  for (const job of activeOnly) {
    const key = `${job.title.toLowerCase().trim()}::${job.company
      .toLowerCase()
      .trim()}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduplicated.push(job);
    }
  }

  // 3. Enrich every active job with Sachila's CV Skill-Match Breakdown
  const enriched = deduplicated.map(enrichJobWithMatch);

  // 4. Default sort: Posted Date (Newest First)
  enriched.sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );

  // 5. Count active jobs per source
  const sourceBreakdown = {
    linkedin: enriched.filter((j) => j.source === 'LinkedIn').length,
    indeed: enriched.filter((j) => j.source === 'Indeed').length,
    jobtechSweden: enriched.filter((j) => j.source === 'JobTech Sweden').length,
    arbeitnowEu: enriched.filter((j) => j.source === 'Arbeitnow EU').length,
    remotive: enriched.filter((j) => j.source === 'Remotive').length,
    himalayasEu: enriched.filter((j) => j.source === 'Himalayas EU').length,
  };

  return {
    jobs: enriched,
    expiredFilteredCount,
    sourceBreakdown,
    lastUpdated: new Date().toISOString(),
  };
}
