import React from 'react';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Globe2,
  MapPin,
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
  onSelect: (job: JobMatchItem) => void;
  rankIndex: number;
}

export function getSourceBadgeStyle(source: JobSource): string {
  switch (source) {
    case 'LinkedIn':
      return 'bg-[#0A66C2]/20 text-sky-300 ring-[#0A66C2]/50';
    case 'Indeed':
      return 'bg-blue-600/20 text-blue-300 ring-blue-500/40';
    case 'JobTech Sweden':
      return 'bg-teal-500/15 text-teal-300 ring-teal-500/35';
    case 'Arbeitnow EU':
      return 'bg-indigo-500/15 text-indigo-300 ring-indigo-500/35';
    case 'Remotive':
      return 'bg-fuchsia-500/15 text-fuchsia-300 ring-fuchsia-500/35';
    case 'Himalayas EU':
      return 'bg-violet-500/15 text-violet-300 ring-violet-500/35';
    case 'Custom JD':
      return 'bg-amber-500/15 text-amber-300 ring-amber-500/35';
  }
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSelected,
  onSelect,
  rankIndex,
}) => {
  const isFreshToday = isPostedWithinHours(job.postedAt, 24);
  const { overallScore, matchedSkills, missingSkills } = job.match;

  const scoreColorClass =
    overallScore >= 88
      ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/40'
      : overallScore >= 75
      ? 'bg-indigo-500/15 text-indigo-300 ring-indigo-500/40'
      : 'bg-amber-500/15 text-amber-300 ring-amber-500/40';

  const sourceBadgeClass = getSourceBadgeStyle(job.source);

  return (
    <article
      onClick={() => onSelect(job)}
      className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-150 sm:p-5 ${
        isSelected
          ? 'border-indigo-500 bg-slate-900/95 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/60'
          : 'border-slate-800/90 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
      }`}
    >
      {/* Top Metadata Bar: Posted Date (Primary Sort Key) + Active Status + Source + Match Score */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-800/90 px-2 py-0.5 text-[11px] font-semibold text-slate-400">
            #{rankIndex + 1}
          </span>

          {/* Prominent Posted Date Badge */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
              isFreshToday
                ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30'
                : 'bg-slate-800/80 text-slate-200 ring-slate-700/80'
            }`}
            title={`Exact Posted Timestamp: ${job.postedAt}`}
          >
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>{formatRelativeTime(job.postedAt)}</span>
            <span className="text-slate-400">•</span>
            <span className="font-normal opacity-90">
              {formatPostedDate(job.postedAt)}
            </span>
          </span>

          {/* Active / Non-Expired Verification Badge */}
          <span
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/25"
            title={`Application Deadline: ${job.expiresAt}`}
          >
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            {formatExpirationStatus(job.expiresAt)}
          </span>
        </div>

        {/* Source & CV Match % Pill */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${sourceBadgeClass}`}
          >
            {job.source}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-xl px-3 py-1 text-xs font-bold ring-1 ring-inset ${scoreColorClass}`}
          >
            {overallScore}% CV Match
          </span>
        </div>
      </div>

      {/* Job Title & Company */}
      <div className="mt-3">
        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 sm:text-lg">
          {job.title}
        </h3>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300">
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-200">
            <Building2 className="h-3.5 w-3.5 text-indigo-400" />
            {job.company}
          </span>

          <span className="inline-flex items-center gap-1 text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            {job.location}
          </span>

          <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300">
            <Globe2 className="h-3 w-3 text-indigo-400" />
            {job.workMode}
          </span>

          <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/20">
            {job.roleTrack}
          </span>

          {job.salaryRange && (
            <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
              {job.salaryRange}
            </span>
          )}
        </div>
      </div>

      {/* Key Highlight Snippet */}
      {job.highlights.length > 0 && (
        <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-400">
          {job.highlights[0]}
        </p>
      )}

      {/* Skill-Match Breakdown Preview (Matched vs Missing Skills) */}
      <div className="mt-3.5 border-t border-slate-800/80 pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Matched ({matchedSkills.length}):
          </span>
          {matchedSkills.slice(0, 6).map((skill) => (
            <span
              key={skill.id}
              className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/25"
            >
              {skill.name}
            </span>
          ))}
          {matchedSkills.length > 6 && (
            <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-400">
              +{matchedSkills.length - 6} more
            </span>
          )}

          {missingSkills.length > 0 && (
            <>
              <span className="ml-2 mr-1 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400">
                <AlertCircle className="h-3.5 w-3.5" />
                Missing/Bonus ({missingSkills.length}):
              </span>
              {missingSkills.slice(0, 3).map((missing) => (
                <span
                  key={missing}
                  className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300 ring-1 ring-inset ring-amber-500/25"
                >
                  {missing}
                </span>
              ))}
            </>
          )}
        </div>
      </div>
    </article>
  );
};
