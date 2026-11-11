import React from 'react';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  ExternalLink,
  Globe2,
  MapPin,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { JobMatchItem, JobSource } from '../types/job';
import {
  formatExpirationStatus,
  formatPostedDate,
  formatRelativeTime,
  isPostedWithinHours,
} from '../utils/dateUtils';

interface JobCardProps {
  job: JobMatchItem;
  isSelected: boolean;
  isSeen?: boolean;
  onSelect: (job: JobMatchItem) => void;
  onMarkSeen?: (jobId: string) => void;
  onMarkUnseen?: (jobId: string) => void;
  rankIndex: number;
}

export function getSourceBadgeStyle(source: JobSource): string {
  switch (source) {
    case 'LinkedIn':
      return 'bg-[#EEF4FA] text-[#0A66C2] ring-[#0A66C2]/25 dark:bg-[#0A66C2]/20 dark:text-sky-300 dark:ring-[#0A66C2]/50';
    case 'Indeed':
      return 'bg-[#EEF2FF] text-[#1D4ED8] ring-[#1D4ED8]/25 dark:bg-blue-600/20 dark:text-blue-300 dark:ring-blue-500/40';
    case 'JobTech Sweden':
      return 'bg-[#E6F4F1] text-[#0F766E] ring-[#0F766E]/25 dark:bg-teal-500/15 dark:text-teal-300 dark:ring-teal-500/35';
    case 'Arbeitnow EU':
      return 'bg-[#F3EFEA] text-[#44403C] ring-[#D6D0C4] dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-500/35';
    case 'Remotive':
      return 'bg-[#FDF2F8] text-[#9D174D] ring-[#FBCFE8] dark:bg-fuchsia-500/15 dark:text-fuchsia-300 dark:ring-fuchsia-500/35';
    case 'Himalayas EU':
      return 'bg-[#F5F3FF] text-[#5B21B6] ring-[#DDD6FE] dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-500/35';
    case 'Custom JD':
      return 'bg-[#FEF3C7] text-[#92400E] ring-[#FDE68A] dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/35';
  }
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSelected,
  isSeen = false,
  onSelect,
  onMarkSeen,
  onMarkUnseen,
  rankIndex,
}) => {
  const isFreshToday = isPostedWithinHours(job.postedAt, 24);
  const { overallScore, matchedSkills, missingSkills } = job.match;

  const scoreTextClass =
    overallScore >= 88
      ? 'text-[#0F766E] dark:text-emerald-400'
      : overallScore >= 75
      ? 'text-[#18181B] dark:text-zinc-100'
      : 'text-[#B45309] dark:text-amber-400';

  const sourceBadgeClass = getSourceBadgeStyle(job.source);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    onSelect(job);
    if (onMarkSeen) {
      onMarkSeen(job.id);
    }
  };

  return (
    <article
      onClick={() => onSelect(job)}
      className={`group cursor-pointer rounded-xl p-4 transition-all duration-150 ${
        isSelected
          ? 'border-2 border-[#18181B] bg-white shadow-md dark:border-emerald-500 dark:bg-[#12141E]'
          : 'border border-[#E5E0D8] bg-white hover:border-[#A8A29E] hover:shadow-sm dark:border-[#1F2230] dark:bg-[#0F111A] dark:hover:border-[#2E3348]'
      }`}
    >
      {/* Top Editorial Metadata Bar: Posted Date (Primary Sort Key) + Active Status + Source */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded bg-[#F3EFEA] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#78716C] dark:bg-[#181A26] dark:text-zinc-400">
            #{rankIndex + 1}
          </span>

          {/* Prominent Posted Date Indicator */}
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
              isFreshToday
                ? 'text-[#0F766E] dark:text-emerald-400'
                : 'text-[#57534E] dark:text-zinc-300'
            }`}
            title={`Exact Posted Timestamp: ${job.postedAt}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isFreshToday
                  ? 'bg-[#0F766E] dark:bg-emerald-400'
                  : 'bg-[#A8A29E] dark:bg-zinc-500'
              }`}
            />
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>Posted {formatRelativeTime(job.postedAt)}</span>
            <span className="text-[#A8A29E] dark:text-zinc-600">·</span>
            <span className="font-normal text-[#78716C] dark:text-zinc-400">
              {formatPostedDate(job.postedAt)}
            </span>
          </span>
        </div>

        {/* Source Pill & Active Verification */}
        <div className="flex items-center gap-1.5">
          {isSeen ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#F3EFEA] px-2 py-0.5 text-[11px] font-semibold text-[#57534E] dark:bg-[#181A26] dark:text-zinc-300">
              <Eye className="h-3 w-3 text-[#0F766E] dark:text-emerald-400" />
              Seen
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#E6F4F1] px-2 py-0.5 text-[11px] font-bold text-[#0F766E] dark:bg-emerald-500/15 dark:text-emerald-300">
              New
            </span>
          )}

          <span
            className="inline-flex items-center gap-1 rounded-md bg-[#E8F5E9] px-2 py-0.5 text-[11px] font-medium text-[#1B5E20] dark:bg-emerald-500/10 dark:text-emerald-300"
            title={`Application Deadline: ${job.expiresAt}`}
          >
            <ShieldCheck className="h-3 w-3 text-[#0F766E] dark:text-emerald-400" />
            {formatExpirationStatus(job.expiresAt)}
          </span>
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            title="Open original job posting in a new tab (moves job to Seen)"
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset transition hover:opacity-85 ${sourceBadgeClass}`}
          >
            <span>{job.source}</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </div>
      </div>

      {/* Main Title, Company & Prominent Scandi Match Percentage */}
      <div className="mt-2.5 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-snug text-[#18181B] dark:text-white">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              title="Click job link to open in a new tab and move to Seen"
              className="inline-flex items-center gap-1.5 text-[#18181B] underline-offset-2 hover:text-[#0F766E] hover:underline dark:text-white dark:hover:text-emerald-400"
            >
              <span>{job.title}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[#0F766E] opacity-75 transition group-hover:opacity-100 dark:text-emerald-400" />
            </a>
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#57534E] dark:text-zinc-400">
            <span className="inline-flex items-center gap-1 font-semibold text-[#18181B] dark:text-zinc-200">
              <Building2 className="h-3.5 w-3.5 text-[#78716C]" />
              {job.company}
            </span>

            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-[#0F766E] dark:text-emerald-400" />
              {job.location}
            </span>

            <span className="inline-flex items-center gap-1 rounded bg-[#F3EFEA] px-2 py-0.5 text-[11px] font-medium text-[#44403C] dark:bg-[#181A26] dark:text-zinc-300">
              <Globe2 className="h-3 w-3 text-[#78716C]" />
              {job.workMode}
            </span>

            <span className="inline-flex items-center rounded bg-[#FAF8F5] px-2 py-0.5 text-[11px] font-medium text-[#57534E] ring-1 ring-inset ring-[#E5E0D8] dark:bg-[#141722] dark:text-zinc-300 dark:ring-[#262A3B]">
              {job.roleTrack}
            </span>

            {job.salaryRange && (
              <span className="inline-flex items-center rounded bg-[#E8F5E9] px-2 py-0.5 text-[11px] font-semibold text-[#1B5E20] dark:bg-emerald-500/15 dark:text-emerald-300">
                {job.salaryRange}
              </span>
            )}

            {job.visaSponsorship && (
              <span
                title={
                  job.visaSponsorshipNote ||
                  'Job post mentions supporting work visa sponsorship'
                }
                className="inline-flex items-center gap-1 rounded bg-[#E6F4F1] px-2 py-0.5 text-[11px] font-semibold text-[#0F766E] ring-1 ring-inset ring-[#0F766E]/25 dark:bg-teal-500/15 dark:text-teal-300 dark:ring-teal-500/35"
              >
                <ShieldCheck className="h-3 w-3" />
                Visa Sponsorship
              </span>
            )}

            {job.requiresSwedish ? (
              <span
                title={
                  job.swedishRequirementNote ||
                  'Job post specifically mentions Swedish is required'
                }
                className="inline-flex items-center gap-1 rounded bg-[#FEF3C7] px-2 py-0.5 text-[11px] font-semibold text-[#92400E] ring-1 ring-inset ring-[#FDE68A] dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/35"
              >
                <AlertCircle className="h-3 w-3" />
                Swedish Required
              </span>
            ) : (
              <span
                title="No Swedish language requirement mentioned (English working language)"
                className="inline-flex items-center rounded bg-[#F3EFEA] px-2 py-0.5 text-[11px] font-medium text-[#44403C] dark:bg-[#181A26] dark:text-zinc-300"
              >
                No Swedish Needed
              </span>
            )}
          </div>
        </div>

        {/* Right Editorial Score Readout */}
        <div className="shrink-0 text-right">
          <div className={`text-xl font-black tracking-tight ${scoreTextClass}`}>
            {overallScore}%
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C] dark:text-zinc-500">
            CV Fit
          </div>
        </div>
      </div>

      {/* Key Highlight Snippet */}
      {job.highlights.length > 0 && (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#57534E] dark:text-zinc-400">
          {job.highlights[0]}
        </p>
      )}

      {/* Skill-Match Breakdown Preview + Direct Job Link Action */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#E5E0D8] pt-2.5 dark:border-[#1F2230]">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F766E] dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Matched ({matchedSkills.length}):
          </span>
          {matchedSkills.slice(0, 5).map((skill) => (
            <span
              key={skill.id}
              className="rounded bg-[#F3EFEA] px-2 py-0.5 text-[11px] font-medium text-[#18181B] dark:bg-emerald-500/10 dark:text-emerald-300"
            >
              {skill.name}
            </span>
          ))}
          {matchedSkills.length > 5 && (
            <span className="rounded bg-[#FAF8F5] px-1.5 py-0.5 text-[11px] font-medium text-[#78716C] ring-1 ring-inset ring-[#E5E0D8] dark:bg-[#181A26] dark:text-zinc-400 dark:ring-[#262A3B]">
              +{matchedSkills.length - 5}
            </span>
          )}

          {missingSkills.length > 0 && (
            <>
              <span className="ml-1.5 mr-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#B45309] dark:text-amber-400">
                <AlertCircle className="h-3 w-3" />
                Bonus ({missingSkills.length}):
              </span>
              {missingSkills.slice(0, 2).map((missing) => (
                <span
                  key={missing}
                  className="rounded bg-[#FEF3C7]/70 px-2 py-0.5 text-[11px] font-medium text-[#92400E] dark:bg-amber-500/10 dark:text-amber-300"
                >
                  {missing}
                </span>
              ))}
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isSeen && onMarkUnseen && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMarkUnseen(job.id);
              }}
              className="inline-flex items-center gap-1 rounded-md border border-[#E5E0D8] bg-[#FAF8F5] px-2 py-1 text-[11px] font-semibold text-[#57534E] transition hover:bg-[#F3EFEA] hover:text-[#18181B] dark:border-[#262A3B] dark:bg-[#141722] dark:text-zinc-300"
              title="Move this job back to the New tab"
            >
              <RotateCcw className="h-3 w-3" />
              Move to New
            </button>
          )}

          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="inline-flex items-center gap-1 rounded-md bg-[#18181B] px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-[#0F766E] dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <span>Open Job Link</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  );
};
