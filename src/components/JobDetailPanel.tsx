import React from 'react';
import {
  AlertTriangle,
  Building2,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  Globe2,
  Layers,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { JobMatchItem } from '../types/job';
import {
  formatExpirationStatus,
  formatPostedDate,
  formatRelativeTime,
} from '../utils/dateUtils';
import { getSourceBadgeStyle } from './JobCard';

interface JobDetailPanelProps {
  job: JobMatchItem | null;
  onMarkSeen?: (jobId: string) => void;
}

export const JobDetailPanel: React.FC<JobDetailPanelProps> = ({
  job,
  onMarkSeen,
}) => {
  if (!job) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-[#E5E0D8] bg-white p-8 text-center shadow-sm dark:border-[#1F2230] dark:bg-[#0F111A]">
        <Target className="h-10 w-10 text-[#A8A29E] dark:text-zinc-600" />
        <h3 className="mt-3 text-base font-bold text-[#18181B] dark:text-zinc-200">
          Select a role to inspect your CV Match Scorecard
        </h3>
        <p className="mt-1 max-w-sm text-xs text-[#78716C] dark:text-zinc-500">
          Click any active job card in the center feed to view matched CV
          skills, missing requirements, and tailored CV evidence.
        </p>
      </div>
    );
  }

  const {
    overallScore,
    techStackScore,
    roleSeniorityScore,
    locationDomainScore,
    matchedSkills,
    missingSkills,
    cvEvidenceReasons,
  } = job.match;

  const encodedQuery = encodeURIComponent(`${job.title} ${job.company}`);
  const linkedInSearchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodedQuery}&location=Stockholm%2C%20Sweden&f_TPR=r2592000`;
  const indeedSearchUrl = `https://se.indeed.com/jobs?q=${encodedQuery}&l=Stockholm&fromage=14`;
  const jobtechSearchUrl = `https://arbetsformedlingen.se/platsbanken/annonser?q=${encodeURIComponent(
    job.title
  )}`;

  return (
    <aside className="rounded-xl border border-[#E5E0D8] bg-white p-5 shadow-sm dark:border-[#1F2230] dark:bg-[#0F111A]">
      {/* Scorecard Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E0D8] pb-3.5 dark:border-[#1F2230]">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-zinc-400">
            CV Match Scorecard
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[#57534E] dark:text-zinc-400">
            <CalendarClock className="h-3.5 w-3.5 text-[#0F766E] dark:text-emerald-400" />
            <span>Posted {formatRelativeTime(job.postedAt)}</span>
            <span>·</span>
            <span>{formatPostedDate(job.postedAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getSourceBadgeStyle(
              job.source
            )}`}
          >
            {job.source}
          </span>
          <span className="rounded-md bg-[#E8F5E9] px-2.5 py-1 text-xs font-extrabold text-[#1B5E20] ring-1 ring-inset ring-[#C8E6C9] dark:bg-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-500/40">
            {overallScore}% Fit
          </span>
        </div>
      </div>

      {/* Active / Non-Expired Status Banner */}
      <div className="mt-3 flex items-center justify-between rounded-lg border border-[#C8E6C9] bg-[#E8F5E9]/60 px-3 py-2 text-xs text-[#1B5E20] dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <ShieldCheck className="h-4 w-4 text-[#0F766E] dark:text-emerald-400" />
          Verified Active Listing
        </span>
        <span className="text-[11px] font-medium">
          {formatExpirationStatus(job.expiresAt)}
        </span>
      </div>

      {/* Role Title & Company */}
      <div className="mt-4">
        <h2 className="text-lg font-extrabold leading-snug text-[#18181B] dark:text-white">
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onMarkSeen?.(job.id)}
            className="inline-flex items-center gap-1.5 hover:text-[#0F766E] hover:underline dark:hover:text-emerald-400"
          >
            <span>{job.title}</span>
            <ExternalLink className="h-4 w-4 shrink-0 opacity-70" />
          </a>
        </h2>

        <div className="mt-1.5 flex flex-wrap items-center gap-2.5 text-xs text-[#57534E] dark:text-zinc-300">
          <span className="inline-flex items-center gap-1 font-bold text-[#18181B] dark:text-white">
            <Building2 className="h-3.5 w-3.5 text-[#0F766E] dark:text-emerald-400" />
            {job.company}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-[#0F766E] dark:text-emerald-400" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-[#F3EFEA] px-2 py-0.5 font-medium text-[#44403C] dark:bg-[#181A26] dark:text-zinc-200">
            <Globe2 className="h-3 w-3 text-[#78716C]" />
            {job.workMode}
          </span>
          {job.salaryRange && (
            <span className="rounded bg-[#E8F5E9] px-2 py-0.5 font-semibold text-[#1B5E20] dark:bg-emerald-500/15 dark:text-emerald-300">
              {job.salaryRange}
            </span>
          )}
          {job.visaSponsorship && (
            <span className="inline-flex items-center gap-1 rounded bg-[#E6F4F1] px-2 py-0.5 font-semibold text-[#0F766E] ring-1 ring-inset ring-[#0F766E]/25 dark:bg-teal-500/15 dark:text-teal-300 dark:ring-teal-500/35">
              <ShieldCheck className="h-3 w-3" />
              Visa Sponsorship
            </span>
          )}
          {job.requiresSwedish ? (
            <span className="inline-flex items-center gap-1 rounded bg-[#FEF3C7] px-2 py-0.5 font-semibold text-[#92400E] ring-1 ring-inset ring-[#FDE68A] dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/35">
              <AlertTriangle className="h-3 w-3" />
              Swedish Required
            </span>
          ) : (
            <span className="inline-flex items-center rounded bg-[#F3EFEA] px-2 py-0.5 font-medium text-[#44403C] dark:bg-[#181A26] dark:text-zinc-300">
              English · No Swedish Needed
            </span>
          )}
        </div>

        {job.visaSponsorship && (
          <div className="mt-2.5 rounded-lg border border-[#0F766E]/25 bg-[#E6F4F1]/70 px-3 py-2 text-xs text-[#0F766E] dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-300">
            <span className="font-semibold">
              {job.visaSponsorshipNote ||
                'Job post mentions supporting work visa sponsorship & relocation.'}
            </span>
          </div>
        )}

        {job.requiresSwedish && (
          <div className="mt-2 rounded-lg border border-[#FDE68A] bg-[#FEF3C7]/60 px-3 py-2 text-xs text-[#92400E] dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            <span className="font-semibold">
              {job.swedishRequirementNote ||
                'Job post specifically mentions Swedish language proficiency is required.'}
            </span>
          </div>
        )}

        {/* Primary Apply + Cross-Board Links */}
        <div className="mt-4 space-y-2">
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            onClick={() => onMarkSeen?.(job.id)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#18181B] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#27272A] dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            Apply on {job.source}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <div className="grid grid-cols-3 gap-1.5">
            <a
              href={linkedInSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1 rounded-md border border-[#E5E0D8] bg-[#FAF8F5] px-2 py-1.5 text-[11px] font-semibold text-[#44403C] transition hover:bg-[#F3EFEA] dark:border-[#262A3B] dark:bg-[#141722] dark:text-zinc-300"
            >
              LinkedIn <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={indeedSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1 rounded-md border border-[#E5E0D8] bg-[#FAF8F5] px-2 py-1.5 text-[11px] font-semibold text-[#44403C] transition hover:bg-[#F3EFEA] dark:border-[#262A3B] dark:bg-[#141722] dark:text-zinc-300"
            >
              Indeed SE <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={jobtechSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1 rounded-md border border-[#E5E0D8] bg-[#FAF8F5] px-2 py-1.5 text-[11px] font-semibold text-[#44403C] transition hover:bg-[#F3EFEA] dark:border-[#262A3B] dark:bg-[#141722] dark:text-zinc-300"
            >
              Platsbanken <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 3-Factor CV Alignment Bars */}
      <div className="mt-5 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] p-4 dark:border-[#1F2230] dark:bg-[#090A0F]">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#18181B] dark:text-zinc-200">
          <Sparkles className="h-3.5 w-3.5 text-[#0F766E] dark:text-emerald-400" />
          Multi-Factor Fit Breakdown
        </div>

        <div className="mt-3 space-y-2.5 text-xs">
          <div>
            <div className="flex justify-between font-medium text-[#44403C] dark:text-zinc-300">
              <span>Tech Stack Alignment</span>
              <span className="font-bold text-[#0F766E] dark:text-emerald-400">
                {techStackScore}%
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E0D8] dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-[#0F766E] dark:bg-emerald-400"
                style={{ width: `${techStackScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-medium text-[#44403C] dark:text-zinc-300">
              <span>Seniority & Role ({job.roleTrack})</span>
              <span className="font-bold text-[#18181B] dark:text-white">
                {roleSeniorityScore}%
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E0D8] dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-[#18181B] dark:bg-indigo-400"
                style={{ width: `${roleSeniorityScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-medium text-[#44403C] dark:text-zinc-300">
              <span>Location & Work Mode ({job.workMode})</span>
              <span className="font-bold text-[#44403C] dark:text-sky-400">
                {locationDomainScore}%
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E0D8] dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-[#57534E] dark:bg-sky-400"
                style={{ width: `${locationDomainScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Matched CV Skills */}
        <div className="mt-4 border-t border-[#E5E0D8] pt-3.5 dark:border-[#1F2230]">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Matched Skills from Your CV ({matchedSkills.length})
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {matchedSkills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1 rounded-md border border-[#E5E0D8] bg-white px-2 py-0.5 text-xs font-medium text-[#18181B] shadow-2xs dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-200"
              >
                <CheckCircle2 className="h-3 w-3 text-[#0F766E] dark:text-emerald-400" />
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Missing / Stretch Skills */}
        <div className="mt-3.5 border-t border-[#E5E0D8] pt-3.5 dark:border-[#1F2230]">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B45309] dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            Missing / Bonus Skills ({missingSkills.length})
          </span>
          {missingSkills.length === 0 ? (
            <p className="mt-1 text-xs text-[#0F766E] dark:text-emerald-300">
              ✓ Your CV covers 100% of the primary technical keywords for this
              listing.
            </p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {missingSkills.map((missing) => (
                <span
                  key={missing}
                  className="inline-flex items-center rounded-md bg-[#FEF3C7] px-2 py-0.5 text-xs font-medium text-[#92400E] dark:bg-amber-500/15 dark:text-amber-200"
                >
                  {missing}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Why This Matches Your CV (Evidence) */}
      <div className="mt-4 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] p-3.5 dark:border-[#1F2230] dark:bg-[#090A0F]">
        <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#18181B] dark:text-zinc-200">
          <Layers className="h-3.5 w-3.5 text-[#0F766E] dark:text-emerald-400" />
          CV Evidence & Talking Points
        </h4>
        <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-[#44403C] dark:text-zinc-300">
          {cvEvidenceReasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F766E] dark:bg-emerald-400" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Full Job Description */}
      <div className="mt-4 border-t border-[#E5E0D8] pt-3.5 dark:border-[#1F2230]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-zinc-400">
          Role Highlights & Description
        </h4>
        {job.highlights.length > 0 && (
          <ul className="mt-2 space-y-1 text-xs text-[#44403C] dark:text-zinc-300">
            {job.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <span className="font-bold text-[#0F766E]">•</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-2.5 max-h-60 overflow-y-auto whitespace-pre-line rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] p-3 text-xs leading-relaxed text-[#44403C] dark:border-[#1F2230] dark:bg-[#090A0F] dark:text-zinc-300">
          {job.description}
        </div>
      </div>
    </aside>
  );
};
