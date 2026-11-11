import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  BadgeCheck,
  Calendar,
  ExternalLink,
  Eye,
  Filter,
  Languages,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { CVProfileHeader } from './components/CVProfileHeader';
import { CustomJobModal } from './components/CustomJobModal';
import { CVUploadModal } from './components/CVUploadModal';
import { JobCard } from './components/JobCard';
import { JobDetailPanel } from './components/JobDetailPanel';
import { MULTI_SOURCE_CURATED_JOBS } from './data/curatedJobs';
import { SACHILA_CV_PROFILE } from './data/cvProfile';
import { fetchAllJobMatches } from './services/jobService';
import {
  CVProfile,
  JobMatchItem,
  JobSource,
  RoleTrack,
  SortOption,
} from './types/job';
import { isJobExpired, isPostedWithinHours } from './utils/dateUtils';
import { enrichJobWithMatch } from './utils/jobMatcher';

export function App() {
  // Manage Active CV Profile with localStorage persistence (Default: Sachila Ranawaka)
  const [activeProfile, setActiveProfile] = useState<CVProfile>(() => {
    try {
      const stored = localStorage.getItem('cv_matcher_active_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id && parsed.skills) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return SACHILA_CV_PROFILE;
  });

  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const isCustomProfile = activeProfile.id !== SACHILA_CV_PROFILE.id;

  // Initialize immediately with active (non-expired) multi-source listings enriched against activeProfile
  const initialData = useMemo(() => {
    const activeRaw = MULTI_SOURCE_CURATED_JOBS.filter(
      (j) => !isJobExpired(j)
    );
    const expiredCount = MULTI_SOURCE_CURATED_JOBS.length - activeRaw.length;
    const list = activeRaw.map((job) => enrichJobWithMatch(job, activeProfile));
    list.sort(
      (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    );
    return { list, expiredCount };
  }, [activeProfile]);

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
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
  const [workModeScope, setWorkModeScope] = useState<
    'all' | 'hybrid' | 'onsite'
  >('all');
  const [roleTrackFilter, setRoleTrackFilter] = useState<'all' | RoleTrack>(
    'all'
  );
  const [sourceFilter, setSourceFilter] = useState<'all' | JobSource>('all');
  const [minMatchScore, setMinMatchScore] = useState<number>(0);
  const [visaSponsorshipOnly, setVisaSponsorshipOnly] =
    useState<boolean>(false);
  const [excludeSwedishRequired, setExcludeSwedishRequired] =
    useState<boolean>(false);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string | null>(
    null
  );
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

  // 'New' and 'Seen' Category State with localStorage persistence
  const [seenJobIds, setSeenJobIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sachila_cv_matcher_seen_jobs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [viewCategory, setViewCategory] = useState<'new' | 'seen'>('new');

  useEffect(() => {
    try {
      localStorage.setItem(
        'sachila_cv_matcher_seen_jobs',
        JSON.stringify(seenJobIds)
      );
    } catch {
      // Ignore storage errors
    }
  }, [seenJobIds]);

  const handleMarkJobSeen = useCallback((jobId: string) => {
    setSeenJobIds((prev) => {
      if (prev.includes(jobId)) return prev;
      return [jobId, ...prev];
    });
  }, []);

  const handleMarkJobUnseen = useCallback((jobId: string) => {
    setSeenJobIds((prev) => prev.filter((id) => id !== jobId));
  }, []);

  const handleClearAllSeen = useCallback(() => {
    setSeenJobIds([]);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const loadJobs = useCallback(
    async (profileToUse?: CVProfile) => {
      setIsLoadingLive(true);
      try {
        const prof = profileToUse || activeProfile;
        const result = await fetchAllJobMatches(prof);
        setJobs(result.jobs);
        setExpiredFilteredCount(result.expiredFilteredCount);
        setSourceStats(result.sourceBreakdown);
      } finally {
        setIsLoadingLive(false);
      }
    },
    [activeProfile]
  );

  const handleApplyProfile = useCallback(
    (newProfile: CVProfile) => {
      setActiveProfile(newProfile);
      try {
        localStorage.setItem(
          'cv_matcher_active_profile',
          JSON.stringify(newProfile)
        );
      } catch {
        // ignore storage errors
      }

      // Reset skill filter if not present in new profile
      if (
        selectedSkillFilter &&
        !newProfile.skills.some(
          (s) => s.name.toLowerCase() === selectedSkillFilter.toLowerCase()
        )
      ) {
        setSelectedSkillFilter(null);
      }

      // Re-enrich any custom added jobs
      setCustomJobs((prev) =>
        prev.map((job) => enrichJobWithMatch(job, newProfile))
      );

      // Re-fetch and re-score live jobs with new profile
      loadJobs(newProfile);
    },
    [selectedSkillFilter, loadJobs]
  );

  const handleResetToDefaultProfile = useCallback(() => {
    handleApplyProfile(SACHILA_CV_PROFILE);
  }, [handleApplyProfile]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const combinedJobs = useMemo(() => {
    return [...customJobs, ...jobs];
  }, [customJobs, jobs]);

  const visaSponsoredTotalCount = useMemo(() => {
    return combinedJobs.filter((j) => !isJobExpired(j) && j.visaSponsorship)
      .length;
  }, [combinedJobs]);

  const noSwedishRequiredCount = useMemo(() => {
    return combinedJobs.filter((j) => !isJobExpired(j) && !j.requiresSwedish)
      .length;
  }, [combinedJobs]);

  const swedishRequiredCount = useMemo(() => {
    return combinedJobs.filter((j) => !isJobExpired(j) && j.requiresSwedish)
      .length;
  }, [combinedJobs]);

  // Filter and sort jobs (strictly excluding expired jobs)
  const filteredAndSortedJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = combinedJobs.filter((job) => {
      // Double-layer expiration guard: never display an expired job post
      if (isJobExpired(job)) {
        return false;
      }

      // Strict Stockholm, Sweden location guard
      if (!job.location.toLowerCase().includes('stockholm')) {
        return false;
      }

      // Visa Sponsorship Filter
      if (visaSponsorshipOnly && !job.visaSponsorship) {
        return false;
      }

      // Swedish Language Filter: exclude jobs that specifically mention Swedish is needed
      if (excludeSwedishRequired && job.requiresSwedish) {
        return false;
      }

      // Search query filter
      if (q) {
        const hay = `${job.title} ${job.company} ${job.location} ${job.source} ${job.description} ${
          job.visaSponsorshipNote || ''
        } ${job.match.matchedSkills.map((s) => s.name).join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      // Stockholm Work Mode Scope
      if (workModeScope === 'hybrid' && job.workMode !== 'Hybrid') {
        return false;
      }
      if (workModeScope === 'onsite' && job.workMode !== 'On-site') {
        return false;
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
    visaSponsorshipOnly,
    excludeSwedishRequired,
    searchQuery,
    workModeScope,
    roleTrackFilter,
    sourceFilter,
    minMatchScore,
    selectedSkillFilter,
    sortBy,
  ]);

  // Partition filtered jobs into 'New' and 'Seen'
  const seenSet = useMemo(() => new Set(seenJobIds), [seenJobIds]);

  const newJobs = useMemo(
    () => filteredAndSortedJobs.filter((job) => !seenSet.has(job.id)),
    [filteredAndSortedJobs, seenSet]
  );

  const seenJobs = useMemo(
    () => filteredAndSortedJobs.filter((job) => seenSet.has(job.id)),
    [filteredAndSortedJobs, seenSet]
  );

  const displayedJobs = viewCategory === 'new' ? newJobs : seenJobs;

  // Keep selectedJob in sync with current view and filtered list
  const selectedJob = useMemo(() => {
    return (
      displayedJobs.find((j) => j.id === selectedJobId) ||
      displayedJobs[0] ||
      filteredAndSortedJobs.find((j) => j.id === selectedJobId) ||
      filteredAndSortedJobs[0] ||
      null
    );
  }, [displayedJobs, filteredAndSortedJobs, selectedJobId]);

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

  const resetAllFilters = () => {
    setSearchQuery('');
    setWorkModeScope('all');
    setRoleTrackFilter('all');
    setSourceFilter('all');
    setMinMatchScore(0);
    setVisaSponsorshipOnly(false);
    setExcludeSwedishRequired(false);
    setSelectedSkillFilter(null);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    workModeScope !== 'all' ||
    roleTrackFilter !== 'all' ||
    sourceFilter !== 'all' ||
    minMatchScore > 0 ||
    visaSponsorshipOnly ||
    excludeSwedishRequired ||
    selectedSkillFilter !== null;

  const sourcePills: {
    label: string;
    value: 'all' | JobSource;
    count: number;
  }[] = [
    { label: 'All Active Sources', value: 'all', count: combinedJobs.length },
    { label: 'LinkedIn SE', value: 'LinkedIn', count: sourceStats.linkedin },
    { label: 'Indeed SE', value: 'Indeed', count: sourceStats.indeed },
    {
      label: 'JobTech (Platsbanken)',
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] transition-colors dark:bg-[#090A0F] dark:text-zinc-100">
      {/* Option A: Nordic Editorial Header */}
      <CVProfileHeader
        profile={activeProfile}
        isCustomProfile={isCustomProfile}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onResetToDefault={handleResetToDefaultProfile}
        totalMatches={filteredAndSortedJobs.length}
        avgMatchScore={avgMatchScore}
        freshLast24hCount={freshLast24hCount}
        expiredFilteredCount={expiredFilteredCount}
        isLoading={isLoadingLive}
        selectedSkillFilter={selectedSkillFilter}
        onSelectSkillFilter={setSelectedSkillFilter}
        onRefreshLive={() => loadJobs(activeProfile)}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        theme={theme}
        onToggleTheme={() =>
          setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
        }
      />

      {/* Option A: 3-Column Scandi Editorial Workspace */}
      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* LEFT COLUMN (3 cols): Sources, Faceted Filters & CV Core Skills */}
          <aside className="space-y-4 lg:col-span-3">
            <div className="sticky top-6 space-y-4">
              {/* Job Board Sources Card */}
              <div className="rounded-xl border border-[#E5E0D8] bg-white p-4 shadow-sm dark:border-[#1F2230] dark:bg-[#0F111A]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-zinc-400">
                    Job Sources
                  </h2>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F766E] hover:underline dark:text-emerald-400"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reset
                    </button>
                  )}
                </div>

                <div className="mt-2.5 space-y-1">
                  {sourcePills.map((pill) => {
                    const active = sourceFilter === pill.value;
                    return (
                      <button
                        key={pill.value}
                        type="button"
                        onClick={() => setSourceFilter(pill.value)}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
                          active
                            ? 'bg-[#F5F2EB] font-bold text-[#18181B] ring-1 ring-inset ring-[#E5E0D8] dark:bg-[#181A26] dark:text-white dark:ring-[#2A2E42]'
                            : 'font-medium text-[#57534E] hover:bg-[#FAF8F5] hover:text-[#18181B] dark:text-zinc-400 dark:hover:bg-[#141620] dark:hover:text-zinc-200'
                        }`}
                      >
                        <span>{pill.label}</span>
                        <span
                          className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${
                            active
                              ? 'bg-[#18181B] text-white dark:bg-emerald-600'
                              : 'bg-[#F3EFEA] text-[#78716C] dark:bg-[#141722] dark:text-zinc-400'
                          }`}
                        >
                          {pill.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Role, Location, Visa Sponsorship, Swedish Language & Match Threshold Filters */}
                <div className="mt-4 space-y-3 border-t border-[#E5E0D8] pt-3.5 dark:border-[#1F2230]">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-zinc-400">
                    <Filter className="h-3.5 w-3.5 text-[#0F766E] dark:text-emerald-400" />
                    Scope & Role Filters
                  </div>

                  {/* Visa Sponsorship Filter Toggle */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#57534E] dark:text-zinc-400">
                      Work Visa Sponsorship
                    </label>
                    <button
                      type="button"
                      onClick={() => setVisaSponsorshipOnly((prev) => !prev)}
                      className={`mt-1 flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-xs font-semibold transition ${
                        visaSponsorshipOnly
                          ? 'border-[#0F766E] bg-[#E6F4F1] text-[#0F766E] shadow-2xs dark:border-teal-500 dark:bg-teal-500/20 dark:text-teal-300'
                          : 'border-[#E5E0D8] bg-[#FAF8F5] text-[#44403C] hover:border-[#A8A29E] dark:border-[#262A3B] dark:bg-[#090A0F] dark:text-zinc-300'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <BadgeCheck
                          className={`h-4 w-4 ${
                            visaSponsorshipOnly
                              ? 'text-[#0F766E] dark:text-teal-300'
                              : 'text-[#78716C]'
                          }`}
                        />
                        <span>Visa Sponsorship Mentioned</span>
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${
                          visaSponsorshipOnly
                            ? 'bg-[#0F766E] text-white dark:bg-teal-500 dark:text-zinc-950'
                            : 'bg-[#E5E0D8]/70 text-[#57534E] dark:bg-[#141722] dark:text-zinc-400'
                        }`}
                      >
                        {visaSponsoredTotalCount}
                      </span>
                    </button>
                  </div>

                  {/* Swedish Language Filter Toggle */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#57534E] dark:text-zinc-400">
                      Swedish Language Requirement
                    </label>
                    <button
                      type="button"
                      onClick={() => setExcludeSwedishRequired((prev) => !prev)}
                      className={`mt-1 flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-xs font-semibold transition ${
                        excludeSwedishRequired
                          ? 'border-[#0F766E] bg-[#E6F4F1] text-[#0F766E] shadow-2xs dark:border-teal-500 dark:bg-teal-500/20 dark:text-teal-300'
                          : 'border-[#E5E0D8] bg-[#FAF8F5] text-[#44403C] hover:border-[#A8A29E] dark:border-[#262A3B] dark:bg-[#090A0F] dark:text-zinc-300'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Languages
                          className={`h-4 w-4 ${
                            excludeSwedishRequired
                              ? 'text-[#0F766E] dark:text-teal-300'
                              : 'text-[#78716C]'
                          }`}
                        />
                        <span>Exclude Swedish Required</span>
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${
                          excludeSwedishRequired
                            ? 'bg-[#0F766E] text-white dark:bg-teal-500 dark:text-zinc-950'
                            : 'bg-[#E5E0D8]/70 text-[#57534E] dark:bg-[#141722] dark:text-zinc-400'
                        }`}
                      >
                        {noSwedishRequiredCount}
                      </span>
                    </button>
                    {excludeSwedishRequired && swedishRequiredCount > 0 && (
                      <p className="mt-1 text-[10px] font-medium text-[#0F766E] dark:text-teal-400">
                        Hiding {swedishRequiredCount} role(s) that require
                        Swedish
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#57534E] dark:text-zinc-400">
                      Stockholm Work Mode
                    </label>
                    <select
                      value={workModeScope}
                      onChange={(e) =>
                        setWorkModeScope(
                          e.target.value as 'all' | 'hybrid' | 'onsite'
                        )
                      }
                      aria-label="Filter by Stockholm work mode"
                      className="mt-1 w-full rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] px-2.5 py-1.5 text-xs font-medium text-[#18181B] focus:border-[#18181B] focus:outline-none dark:border-[#262A3B] dark:bg-[#090A0F] dark:text-zinc-200"
                    >
                      <option value="all">
                        Stockholm, Sweden (All Work Modes)
                      </option>
                      <option value="hybrid">
                        Stockholm · Hybrid Only
                      </option>
                      <option value="onsite">
                        Stockholm · On-site Only
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#57534E] dark:text-zinc-400">
                      Role Track
                    </label>
                    <select
                      value={roleTrackFilter}
                      onChange={(e) =>
                        setRoleTrackFilter(e.target.value as 'all' | RoleTrack)
                      }
                      aria-label="Filter by role track"
                      className="mt-1 w-full rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] px-2.5 py-1.5 text-xs font-medium text-[#18181B] focus:border-[#18181B] focus:outline-none dark:border-[#262A3B] dark:bg-[#090A0F] dark:text-zinc-200"
                    >
                      <option value="all">All Role Tracks</option>
                      <option value="Fullstack">
                        Senior Fullstack Engineer
                      </option>
                      <option value="QA / Test">
                        QA & Test Automation
                      </option>
                      <option value="DevOps / Platform">
                        DevOps & Cloud Platform
                      </option>
                      <option value="AI Engineer">
                        AI / LLM Product Engineer
                      </option>
                      <option value="Frontend / UI">
                        Senior Frontend / UI
                      </option>
                      <option value="Tech Lead">Lead / Staff Engineer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#57534E] dark:text-zinc-400">
                      Minimum CV Match %
                    </label>
                    <select
                      value={minMatchScore}
                      onChange={(e) => setMinMatchScore(Number(e.target.value))}
                      aria-label="Filter by minimum CV match score"
                      className="mt-1 w-full rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] px-2.5 py-1.5 text-xs font-medium text-[#18181B] focus:border-[#18181B] focus:outline-none dark:border-[#262A3B] dark:bg-[#090A0F] dark:text-zinc-200"
                    >
                      <option value={0}>Any CV Match %</option>
                      <option value={70}>70%+ CV Match</option>
                      <option value={80}>80%+ Strong Fit</option>
                      <option value={88}>88%+ Top Tier Fit</option>
                    </select>
                  </div>
                </div>

                {/* Dynamic CV Core Skills Filter Matrix */}
                <div className="mt-4 border-t border-[#E5E0D8] pt-3.5 dark:border-[#1F2230]">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-zinc-400">
                      <Sparkles className="h-3.5 w-3.5 text-[#0F766E] dark:text-emerald-400" />
                      {activeProfile.name.split(' ')[0]}&apos;s CV Skills
                    </span>
                    {selectedSkillFilter && (
                      <button
                        type="button"
                        onClick={() => setSelectedSkillFilter(null)}
                        className="text-[11px] font-semibold text-rose-600 hover:underline dark:text-rose-400"
                      >
                        Clear ×
                      </button>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                    {activeProfile.skills.map((skill) => {
                      const isSelected = selectedSkillFilter === skill.name;
                      return (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() =>
                            setSelectedSkillFilter(
                              isSelected ? null : skill.name
                            )
                          }
                          className={`rounded-md px-2 py-1 text-[11px] font-medium transition ${
                            isSelected
                              ? 'bg-[#18181B] text-white shadow-2xs dark:bg-emerald-600'
                              : 'bg-[#F3EFEA] text-[#44403C] hover:bg-[#E5E0D8] dark:bg-[#141722] dark:text-zinc-300 dark:hover:bg-[#1E2231]'
                          }`}
                        >
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Direct External Search Launchers */}
                <div className="mt-4 border-t border-[#E5E0D8] pt-3.5 dark:border-[#1F2230]">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#78716C] dark:text-zinc-400">
                    Direct Board Search ({activeProfile.targetRoleTrack})
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-1.5 text-xs">
                    <a
                      href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
                        `${activeProfile.title} ${activeProfile.primarySearchKeywords.slice(0, 2).join(' ')}`
                      )}&location=Stockholm%2C%20Sweden&f_TPR=r604800&sortBy=DD`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] px-2.5 py-1.5 font-semibold text-[#18181B] transition hover:bg-[#F3EFEA] dark:border-[#262A3B] dark:bg-[#090A0F] dark:text-zinc-200"
                    >
                      <span className="truncate">LinkedIn: {activeProfile.title}</span>
                      <ExternalLink className="h-3 w-3 shrink-0 text-[#78716C]" />
                    </a>
                    <a
                      href={`https://se.indeed.com/jobs?q=${encodeURIComponent(
                        `${activeProfile.title} ${activeProfile.primarySearchKeywords.slice(0, 2).join(' ')}`
                      )}&l=Stockholm&fromage=14&sort=date`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] px-2.5 py-1.5 font-semibold text-[#18181B] transition hover:bg-[#F3EFEA] dark:border-[#262A3B] dark:bg-[#090A0F] dark:text-zinc-200"
                    >
                      <span className="truncate">Indeed: {activeProfile.title}</span>
                      <ExternalLink className="h-3 w-3 shrink-0 text-[#78716C]" />
                    </a>
                    <a
                      href={`https://arbetsformedlingen.se/platsbanken/annonser?q=${encodeURIComponent(
                        `${activeProfile.primarySearchKeywords.slice(0, 3).join(' ')} Stockholm`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] px-2.5 py-1.5 font-semibold text-[#18181B] transition hover:bg-[#F3EFEA] dark:border-[#262A3B] dark:bg-[#090A0F] dark:text-zinc-200"
                    >
                      <span className="truncate">Platsbanken: {activeProfile.title}</span>
                      <ExternalLink className="h-3 w-3 shrink-0 text-[#78716C]" />
                    </a>
                  </div>
                </div>

                {/* Expiration Guard Footnote */}
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#C8E6C9] bg-[#E8F5E9]/60 px-3 py-2 text-[11px] font-medium text-[#1B5E20] dark:border-emerald-500/25 dark:bg-emerald-950/20 dark:text-emerald-300">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-[#0F766E] dark:text-emerald-400" />
                  <span>
                    {expiredFilteredCount} expired postings automatically
                    excluded
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* CENTER COLUMN (5 cols): Category Switcher, Search, Sort & Editorial Feed */}
          <section className="space-y-3.5 lg:col-span-5">
            {/* Category Switcher: New vs Seen Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E0D8] bg-white p-2 shadow-sm dark:border-[#1F2230] dark:bg-[#0F111A]">
              <div className="grid flex-1 grid-cols-2 gap-1.5 rounded-lg bg-[#F3EFEA] p-1 dark:bg-[#090A0F]">
                <button
                  type="button"
                  onClick={() => setViewCategory('new')}
                  className={`flex items-center justify-center gap-2 rounded-md py-2 text-xs font-bold transition ${
                    viewCategory === 'new'
                      ? 'bg-white text-[#18181B] shadow-2xs dark:bg-[#181A26] dark:text-white'
                      : 'text-[#57534E] hover:text-[#18181B] dark:text-zinc-400 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#0F766E] dark:text-emerald-400" />
                  <span>New Jobs</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${
                      viewCategory === 'new'
                        ? 'bg-[#0F766E] text-white dark:bg-emerald-600'
                        : 'bg-[#E5E0D8] text-[#44403C] dark:bg-[#141722] dark:text-zinc-300'
                    }`}
                  >
                    {newJobs.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewCategory('seen')}
                  className={`flex items-center justify-center gap-2 rounded-md py-2 text-xs font-bold transition ${
                    viewCategory === 'seen'
                      ? 'bg-white text-[#18181B] shadow-2xs dark:bg-[#181A26] dark:text-white'
                      : 'text-[#57534E] hover:text-[#18181B] dark:text-zinc-400 dark:hover:text-white'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5 text-[#78716C] dark:text-zinc-400" />
                  <span>Seen Jobs</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${
                      viewCategory === 'seen'
                        ? 'bg-[#18181B] text-white dark:bg-zinc-200 dark:text-zinc-950'
                        : 'bg-[#E5E0D8] text-[#44403C] dark:bg-[#141722] dark:text-zinc-300'
                    }`}
                  >
                    {seenJobs.length}
                  </span>
                </button>
              </div>

              {viewCategory === 'seen' && seenJobs.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllSeen}
                  title="Move all seen jobs back to the New tab"
                  className="inline-flex items-center gap-1 rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] px-3 py-1.5 text-xs font-semibold text-[#57534E] transition hover:bg-[#F3EFEA] hover:text-[#18181B] dark:border-[#262A3B] dark:bg-[#141722] dark:text-zinc-300"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset All to New</span>
                </button>
              )}
            </div>

            {/* Search + Sort Bar */}
            <div className="rounded-xl border border-[#E5E0D8] bg-white p-3.5 shadow-sm dark:border-[#1F2230] dark:bg-[#0F111A]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78716C]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search active jobs by title, company (Klarna, Spotify, Lovable, Sana), or skill..."
                  className="w-full rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] py-2 pl-9 pr-3.5 text-xs text-[#18181B] placeholder-[#78716C] focus:border-[#18181B] focus:bg-white focus:outline-none dark:border-[#262A3B] dark:bg-[#090A0F] dark:text-white dark:placeholder-zinc-500"
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#E5E0D8] pt-2.5 dark:border-[#1F2230]">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setVisaSponsorshipOnly((prev) => !prev)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                      visaSponsorshipOnly
                        ? 'border-[#0F766E] bg-[#0F766E] text-white shadow-2xs dark:border-teal-500 dark:bg-teal-500 dark:text-zinc-950'
                        : 'border-[#E5E0D8] bg-[#FAF8F5] text-[#44403C] hover:bg-[#F3EFEA] dark:border-[#262A3B] dark:bg-[#090A0F] dark:text-zinc-300'
                    }`}
                  >
                    <BadgeCheck className="h-3.5 w-3.5" />
                    <span>Visa Sponsorship ({visaSponsoredTotalCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExcludeSwedishRequired((prev) => !prev)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                      excludeSwedishRequired
                        ? 'border-[#0F766E] bg-[#0F766E] text-white shadow-2xs dark:border-teal-500 dark:bg-teal-500 dark:text-zinc-950'
                        : 'border-[#E5E0D8] bg-[#FAF8F5] text-[#44403C] hover:bg-[#F3EFEA] dark:border-[#262A3B] dark:bg-[#090A0F] dark:text-zinc-300'
                    }`}
                  >
                    <Languages className="h-3.5 w-3.5" />
                    <span>No Swedish Needed ({noSwedishRequiredCount})</span>
                  </button>
                </div>

                <div className="inline-flex flex-wrap items-center gap-1">
                  <span className="mr-1 inline-flex items-center gap-1 text-xs font-semibold text-[#57534E] dark:text-zinc-400">
                    <Calendar className="h-3.5 w-3.5 text-[#0F766E] dark:text-emerald-400" />
                    Sort:
                  </span>
                  <div className="inline-flex flex-wrap gap-1 rounded-lg bg-[#F3EFEA] p-1 dark:bg-[#090A0F]">
                    <button
                      type="button"
                      onClick={() => setSortBy('posted_desc')}
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition ${
                        sortBy === 'posted_desc'
                          ? 'bg-white text-[#18181B] shadow-2xs dark:bg-[#181A26] dark:text-white'
                          : 'text-[#57534E] hover:text-[#18181B] dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      <ArrowDownWideNarrow className="h-3.5 w-3.5 text-[#0F766E] dark:text-emerald-400" />
                      Newest
                    </button>

                    <button
                      type="button"
                      onClick={() => setSortBy('posted_asc')}
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition ${
                        sortBy === 'posted_asc'
                          ? 'bg-white text-[#18181B] shadow-2xs dark:bg-[#181A26] dark:text-white'
                          : 'text-[#57534E] hover:text-[#18181B] dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      <ArrowUpNarrowWide className="h-3.5 w-3.5" />
                      Oldest
                    </button>

                    <button
                      type="button"
                      onClick={() => setSortBy('match_desc')}
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition ${
                        sortBy === 'match_desc'
                          ? 'bg-white text-[#18181B] shadow-2xs dark:bg-[#181A26] dark:text-white'
                          : 'text-[#57534E] hover:text-[#18181B] dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-[#0F766E] dark:text-emerald-400" />
                      CV Fit %
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed Subheader */}
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-zinc-400">
                {viewCategory === 'new' ? 'New Roles' : 'Seen Roles'} ·{' '}
                {sortBy === 'posted_desc' && 'Posted Date (Newest First)'}
                {sortBy === 'posted_asc' && 'Posted Date (Oldest First)'}
                {sortBy === 'match_desc' && 'CV Match Score (Highest First)'}
                {visaSponsorshipOnly && ' · Visa Sponsorship'}
                {excludeSwedishRequired && ' · No Swedish'}
              </h2>
              <span className="text-xs font-semibold text-[#57534E] dark:text-zinc-400">
                Showing {displayedJobs.length} of {filteredAndSortedJobs.length}{' '}
                matching
              </span>
            </div>

            {/* Job Cards Feed */}
            {displayedJobs.length === 0 ? (
              <div className="rounded-xl border border-[#E5E0D8] bg-white p-10 text-center shadow-sm dark:border-[#1F2230] dark:bg-[#0F111A]">
                {viewCategory === 'seen' ? (
                  <>
                    <p className="text-sm font-bold text-[#18181B] dark:text-zinc-200">
                      No seen jobs yet.
                    </p>
                    <p className="mt-1 text-xs text-[#78716C] dark:text-zinc-400">
                      When you click on a job's link to view it in a new tab, it
                      will automatically move here.
                    </p>
                    <button
                      type="button"
                      onClick={() => setViewCategory('new')}
                      className="mt-4 rounded-lg bg-[#18181B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#27272A] dark:bg-emerald-600"
                    >
                      Back to New Jobs ({newJobs.length})
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-[#18181B] dark:text-zinc-200">
                      {filteredAndSortedJobs.length > 0
                        ? 'All matching jobs have been viewed!'
                        : 'No active jobs match the current filter combination.'}
                    </p>
                    <p className="mt-1 text-xs text-[#78716C] dark:text-zinc-400">
                      {filteredAndSortedJobs.length > 0
                        ? `You have marked all ${seenJobs.length} matching jobs as seen.`
                        : 'Try clearing a skill filter or switching work mode.'}
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      {seenJobs.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setViewCategory('seen')}
                          className="rounded-lg bg-[#0F766E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0d645e] dark:bg-emerald-600"
                        >
                          View Seen Jobs ({seenJobs.length})
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="rounded-lg border border-[#E5E0D8] bg-white px-4 py-2 text-xs font-semibold text-[#18181B] hover:bg-[#F3EFEA] dark:border-[#262A3B] dark:bg-[#141722] dark:text-zinc-200"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {displayedJobs.map((job, idx) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    rankIndex={idx}
                    isSelected={selectedJob?.id === job.id}
                    isSeen={seenSet.has(job.id)}
                    onSelect={(j) => setSelectedJobId(j.id)}
                    onMarkSeen={handleMarkJobSeen}
                    onMarkUnseen={handleMarkJobUnseen}
                  />
                ))}
              </div>
            )}
          </section>

          {/* RIGHT COLUMN (4 cols): Sticky CV Match Scorecard Inspector */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              <JobDetailPanel
                job={selectedJob}
                onMarkSeen={handleMarkJobSeen}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Custom Job Description Matcher Modal */}
      <CustomJobModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddJob={handleAddCustomJob}
        profile={activeProfile}
      />

      {/* Dynamic CV Upload & Switch Modal */}
      <CVUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        activeProfile={activeProfile}
        onApplyProfile={handleApplyProfile}
      />
    </div>
  );
}

export default App;
