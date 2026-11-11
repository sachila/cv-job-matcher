import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Calendar,
  ExternalLink,
  Filter,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { CVProfileHeader } from './components/CVProfileHeader';
import { CustomJobModal } from './components/CustomJobModal';
import { JobCard } from './components/JobCard';
import { JobDetailPanel } from './components/JobDetailPanel';
import { MULTI_SOURCE_CURATED_JOBS } from './data/curatedJobs';
import { fetchAllJobMatches } from './services/jobService';
import { JobMatchItem, JobSource, RoleTrack, SortOption } from './types/job';
import { isJobExpired, isPostedWithinHours } from './utils/dateUtils';
import { enrichJobWithMatch } from './utils/jobMatcher';

export function App() {
  // Initialize immediately with active (non-expired) multi-source listings
  const initialData = useMemo(() => {
    const activeRaw = MULTI_SOURCE_CURATED_JOBS.filter(
      (j) => !isJobExpired(j)
    );
    const expiredCount = MULTI_SOURCE_CURATED_JOBS.length - activeRaw.length;
    const list = activeRaw.map(enrichJobWithMatch);
    list.sort(
      (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    );
    return { list, expiredCount };
  }, []);

  const [jobs, setJobs] = useState<JobMatchItem[]>(initialData.list);
  const [customJobs, setCustomJobs] = useState<JobMatchItem[]>([]);
  const [expiredFilteredCount, setExpiredFilteredCount] = useState<number>(
    initialData.expiredCount
  );
  const [selectedJobId, setSelectedJobId] = useState<string>(
    initialData.list[0]?.id || ''
  );
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(true);
  const [sourceStats, setSourceStats] = useState({
    linkedin: initialData.list.filter((j) => j.source === 'LinkedIn').length,
    indeed: initialData.list.filter((j) => j.source === 'Indeed').length,
    jobtechSweden: initialData.list.filter((j) => j.source === 'JobTech Sweden')
      .length,
    arbeitnowEu: initialData.list.filter((j) => j.source === 'Arbeitnow EU')
      .length,
    remotive: initialData.list.filter((j) => j.source === 'Remotive').length,
    himalayasEu: initialData.list.filter((j) => j.source === 'Himalayas EU')
      .length,
  });

  // Filters & Sorting State (Default: Sort by Posted Date — Newest First)
  const [sortBy, setSortBy] = useState<SortOption>('posted_desc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locationScope, setLocationScope] = useState<
    'all' | 'stockholm' | 'remote_eu'
  >('all');
  const [roleTrackFilter, setRoleTrackFilter] = useState<'all' | RoleTrack>(
    'all'
  );
  const [sourceFilter, setSourceFilter] = useState<'all' | JobSource>('all');
  const [minMatchScore, setMinMatchScore] = useState<number>(0);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string | null>(
    null
  );
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

  const loadJobs = useCallback(async () => {
    setIsLoadingLive(true);
    try {
      const result = await fetchAllJobMatches();
      setJobs(result.jobs);
      setExpiredFilteredCount(result.expiredFilteredCount);
      setSourceStats(result.sourceBreakdown);
    } finally {
      setIsLoadingLive(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const combinedJobs = useMemo(() => {
    return [...customJobs, ...jobs];
  }, [customJobs, jobs]);

  // Filter and sort jobs (strictly excluding expired jobs)
  const filteredAndSortedJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = combinedJobs.filter((job) => {
      // Double-layer expiration guard: never display an expired job post
      if (isJobExpired(job)) {
        return false;
      }

      // Search query filter
      if (q) {
        const hay = `${job.title} ${job.company} ${job.location} ${job.source} ${job.description} ${job.match.matchedSkills
          .map((s) => s.name)
          .join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      // Location & Work Mode Scope
      if (locationScope === 'stockholm') {
        const locLower = job.location.toLowerCase();
        if (!locLower.includes('stockholm') && !locLower.includes('sweden')) {
          return false;
        }
      } else if (locationScope === 'remote_eu') {
        if (job.workMode !== 'Remote EU' && job.workMode !== 'Remote') {
          return false;
        }
      }

      // Role Track Filter
      if (roleTrackFilter !== 'all' && job.roleTrack !== roleTrackFilter) {
        return false;
      }

      // Job Board Source Filter
      if (sourceFilter !== 'all' && job.source !== sourceFilter) {
        return false;
      }

      // Minimum Match % Filter
      if (job.match.overallScore < minMatchScore) {
        return false;
      }

      // Specific CV Skill Pill Filter
      if (selectedSkillFilter) {
        const hasSkill = job.match.matchedSkills.some(
          (s) => s.name.toLowerCase() === selectedSkillFilter.toLowerCase()
        );
        if (!hasSkill) return false;
      }

      return true;
    });

    // Sort based on Posted Date (primary requirement) or CV Match Score
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      const timeA = new Date(a.postedAt).getTime();
      const timeB = new Date(b.postedAt).getTime();

      if (sortBy === 'posted_desc') {
        return timeB - timeA;
      }
      if (sortBy === 'posted_asc') {
        return timeA - timeB;
      }
      if (b.match.overallScore !== a.match.overallScore) {
        return b.match.overallScore - a.match.overallScore;
      }
      return timeB - timeA;
    });

    return sorted;
  }, [
    combinedJobs,
    searchQuery,
    locationScope,
    roleTrackFilter,
    sourceFilter,
    minMatchScore,
    selectedSkillFilter,
    sortBy,
  ]);

  // Keep selectedJob in sync with filtered list
  const selectedJob = useMemo(() => {
    return (
      filteredAndSortedJobs.find((j) => j.id === selectedJobId) ||
      filteredAndSortedJobs[0] ||
      null
    );
  }, [filteredAndSortedJobs, selectedJobId]);

  const avgMatchScore = useMemo(() => {
    if (filteredAndSortedJobs.length === 0) return 0;
    const sum = filteredAndSortedJobs.reduce(
      (acc, j) => acc + j.match.overallScore,
      0
    );
    return Math.round(sum / filteredAndSortedJobs.length);
  }, [filteredAndSortedJobs]);

  const freshLast24hCount = useMemo(() => {
    return filteredAndSortedJobs.filter((j) =>
      isPostedWithinHours(j.postedAt, 24)
    ).length;
  }, [filteredAndSortedJobs]);

  const handleAddCustomJob = (newJob: JobMatchItem) => {
    setCustomJobs((prev) => [newJob, ...prev]);
    setSelectedJobId(newJob.id);
    setSortBy('posted_desc');
  };

  const sourcePills: { label: string; value: 'all' | JobSource; count: number }[] = [
    { label: 'All Sources', value: 'all', count: combinedJobs.length },
    { label: 'LinkedIn', value: 'LinkedIn', count: sourceStats.linkedin },
    { label: 'Indeed', value: 'Indeed', count: sourceStats.indeed },
    {
      label: 'JobTech Sweden',
      value: 'JobTech Sweden',
      count: sourceStats.jobtechSweden,
    },
    {
      label: 'Arbeitnow EU',
      value: 'Arbeitnow EU',
      count: sourceStats.arbeitnowEu,
    },
    { label: 'Remotive', value: 'Remotive', count: sourceStats.remotive },
    {
      label: 'Himalayas EU',
      value: 'Himalayas EU',
      count: sourceStats.himalayasEu,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* CV Profile & Interactive Skills Header */}
      <CVProfileHeader
        totalMatches={filteredAndSortedJobs.length}
        avgMatchScore={avgMatchScore}
        freshLast24hCount={freshLast24hCount}
        expiredFilteredCount={expiredFilteredCount}
        isLoading={isLoadingLive}
        selectedSkillFilter={selectedSkillFilter}
        onSelectSkillFilter={setSelectedSkillFilter}
        onRefreshLive={loadJobs}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
      />

      {/* Main Content Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Multi-Source Board Selector + Sort/Filter Toolbar */}
        <section className="rounded-2xl border border-slate-800/90 bg-slate-900/75 p-4 shadow-lg backdrop-blur">
          {/* Row 1: Job Board Source Pills (LinkedIn, Indeed, JobTech Sweden, Arbeitnow, Remotive, Himalayas) */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-xs font-semibold text-slate-400">
                Job Sources:
              </span>
              {sourcePills.map((pill) => {
                const active = sourceFilter === pill.value;
                return (
                  <button
                    key={pill.value}
                    type="button"
                    onClick={() => setSourceFilter(pill.value)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-slate-950 text-slate-300 ring-1 ring-inset ring-slate-800 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{pill.label}</span>
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                        active
                          ? 'bg-indigo-700 text-indigo-100'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {pill.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Direct External Search Launchers for Sachila's CV Stack */}
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-slate-400">Live Board Search:</span>
              <a
                href="https://www.linkedin.com/jobs/search/?keywords=Senior%20Fullstack%20Engineer%20React%20TypeScript%20Node.js&location=Stockholm%2C%20Sweden&f_TPR=r604800&sortBy=DD"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-[#0A66C2]/20 px-2.5 py-1 font-semibold text-sky-300 ring-1 ring-inset ring-[#0A66C2]/40 hover:bg-[#0A66C2]/30"
              >
                LinkedIn SE <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://se.indeed.com/jobs?q=TypeScript+React+Node.js+Fullstack&l=Stockholm&fromage=14&sort=date"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-blue-600/20 px-2.5 py-1 font-semibold text-blue-300 ring-1 ring-inset ring-blue-500/40 hover:bg-blue-600/30"
              >
                Indeed SE <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://arbetsformedlingen.se/platsbanken/annonser?q=TypeScript%20React%20Fullstack"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-teal-500/15 px-2.5 py-1 font-semibold text-teal-300 ring-1 ring-inset ring-teal-500/35 hover:bg-teal-500/25"
              >
                Platsbanken <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Row 2: Search Box + Sort by Posted Date Controls */}
          <div className="mt-3.5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search active jobs by title, company (Klarna, Spotify, Lovable, Sana), source, or skill..."
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                Sort by:
              </span>

              <div className="inline-flex rounded-xl border border-slate-800 bg-slate-950 p-1">
                <button
                  type="button"
                  onClick={() => setSortBy('posted_desc')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    sortBy === 'posted_desc'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowDownWideNarrow className="h-3.5 w-3.5" />
                  Posted Date: Newest First
                </button>

                <button
                  type="button"
                  onClick={() => setSortBy('posted_asc')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    sortBy === 'posted_asc'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowUpNarrowWide className="h-3.5 w-3.5" />
                  Posted Date: Oldest First
                </button>

                <button
                  type="button"
                  onClick={() => setSortBy('match_desc')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    sortBy === 'match_desc'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  CV Match %
                </button>
              </div>
            </div>
          </div>

          {/* Row 3: Location, Role Track, Minimum Match %, and Expiration Guard Status */}
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                <Filter className="h-3.5 w-3.5 text-indigo-400" />
                Filters:
              </span>

              {/* Location Filter */}
              <select
                value={locationScope}
                onChange={(e) =>
                  setLocationScope(
                    e.target.value as 'all' | 'stockholm' | 'remote_eu'
                  )
                }
                aria-label="Filter by location and work mode"
                className="rounded-xl border border-slate-700/80 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="all">
                  All Locations (Stockholm + Remote EU)
                </option>
                <option value="stockholm">
                  Stockholm / Sweden (Hybrid & On-site)
                </option>
                <option value="remote_eu">Remote EU Only</option>
              </select>

              {/* Role Track Filter */}
              <select
                value={roleTrackFilter}
                onChange={(e) =>
                  setRoleTrackFilter(e.target.value as 'all' | RoleTrack)
                }
                aria-label="Filter by role track"
                className="rounded-xl border border-slate-700/80 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="all">All Role Tracks</option>
                <option value="Fullstack">Senior Fullstack Engineer</option>
                <option value="AI Engineer">AI / LLM Product Engineer</option>
                <option value="Frontend / UI">
                  Senior Frontend / Design Systems
                </option>
                <option value="Tech Lead">Lead / Staff Engineer</option>
              </select>

              {/* Min Match Score Filter */}
              <select
                value={minMatchScore}
                onChange={(e) => setMinMatchScore(Number(e.target.value))}
                aria-label="Filter by minimum CV match score"
                className="rounded-xl border border-slate-700/80 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value={0}>Any CV Match %</option>
                <option value={70}>70%+ CV Match</option>
                <option value={80}>80%+ Strong Match</option>
                <option value={88}>88%+ Top Tier Match</option>
              </select>
            </div>

            {/* Active / Non-Expired Guarantee Badge */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-emerald-300">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1 ring-1 ring-inset ring-emerald-500/30">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>
                  Expired jobs excluded ({expiredFilteredCount} expired postings
                  blocked)
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* Two-Pane Job List + CV Match Breakdown Inspector */}
        <section className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Left Column: Chronologically Sorted Active Job Cards */}
          <div className="space-y-3.5 lg:col-span-7">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {sortBy === 'posted_desc' &&
                  'Sorted by Posted Date (Newest First)'}
                {sortBy === 'posted_asc' &&
                  'Sorted by Posted Date (Oldest First)'}
                {sortBy === 'match_desc' &&
                  'Sorted by CV Skill-Match Score (Highest First)'}
              </h2>
              <span className="text-xs font-medium text-slate-400">
                Showing {filteredAndSortedJobs.length} active roles
              </span>
            </div>

            {filteredAndSortedJobs.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center">
                <p className="text-sm font-semibold text-slate-300">
                  No active jobs match the current filter combination.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setLocationScope('all');
                    setRoleTrackFilter('all');
                    setSourceFilter('all');
                    setMinMatchScore(0);
                    setSelectedSkillFilter(null);
                  }}
                  className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredAndSortedJobs.map((job, idx) => (
                <JobCard
                  key={job.id}
                  job={job}
                  rankIndex={idx}
                  isSelected={selectedJob?.id === job.id}
                  onSelect={(j) => setSelectedJobId(j.id)}
                />
              ))
            )}
          </div>

          {/* Right Column: Sticky CV Skill-Match Breakdown Detail Panel */}
          <div className="lg:col-span-5">
            <div className="sticky top-6">
              <JobDetailPanel job={selectedJob} />
            </div>
          </div>
        </section>
      </main>

      {/* Custom Job Description Matcher Modal */}
      <CustomJobModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddJob={handleAddCustomJob}
      />
    </div>
  );
}

export default App;
