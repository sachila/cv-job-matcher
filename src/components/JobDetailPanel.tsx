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
}

export const JobDetailPanel: React.FC<JobDetailPanelProps> = ({ job }) => {
  if (!job) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
        <Target className="h-10 w-10 text-slate-600" />
        <h3 className="mt-3 text-base font-semibold text-slate-300">
          Select a job to inspect your CV Skill-Match Breakdown
        </h3>
        <p className="mt-1 max-w-sm text-xs text-slate-500">
          Click any active job card on the left to view matched CV skills,
          missing requirements, and tailored CV evidence.
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

  const encodedQuery = encodeURIComponent(
    `${job.title} ${job.company}`
  );
  const linkedInSearchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodedQuery}&location=Stockholm%2C%20Sweden&f_TPR=r2592000`;
  const indeedSearchUrl = `https://se.indeed.com/jobs?q=${encodedQuery}&l=Stockholm&fromage=14`;
  const jobtechSearchUrl = `https://arbetsformedlingen.se/platsbanken/annonser?q=${encodeURIComponent(
    job.title
  )}`;

  return (
    <aside className="rounded-2xl border border-slate-800 bg-slate-900/85 p-5 shadow-xl sm:p-6">
      {/* Header Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800/90 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-inset ring-slate-700">
          <CalendarClock className="h-3.5 w-3.5 text-indigo-400" />
          <span>Posted {formatRelativeTime(job.postedAt)}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">{formatPostedDate(job.postedAt)}</span>
        </div>

        <span
          className={`rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getSourceBadgeStyle(
            job.source
          )}`}
        >
          {job.source}
        </span>
      </div>

      {/* Active / Non-Expired Status Banner */}
      <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-300">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Verified Active Listing (Not Expired)
        </span>
        <span className="text-[11px] font-medium text-emerald-200/90">
          {formatExpirationStatus(job.expiresAt)}
        </span>
      </div>

      {/* Role Title & Company */}
      <div className="mt-4">
        <h2 className="text-xl font-extrabold leading-snug text-white">
          {job.title}
        </h2>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
          <span className="inline-flex items-center gap-1.5 font-semibold text-white">
            <Building2 className="h-4 w-4 text-indigo-400" />
            {job.company}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-300">
            <MapPin className="h-4 w-4 text-emerald-400" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2.5 py-0.5 font-medium text-slate-200">
            <Globe2 className="h-3.5 w-3.5 text-indigo-400" />
            {job.workMode}
          </span>
          {job.salaryRange && (
            <span className="rounded-md bg-emerald-500/15 px-2.5 py-0.5 font-semibold text-emerald-300">
              {job.salaryRange}
            </span>
          )}
        </div>

        {/* Primary Apply + Cross-Board Links (LinkedIn, Indeed, JobTech) */}
        <div className="mt-4 space-y-2">
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-950/60 transition hover:bg-indigo-500"
          >
            Open & Apply on {job.source}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <a
              href={linkedInSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-700/80 bg-slate-950/90 px-2.5 py-1.5 text-[11px] font-semibold text-sky-300 transition hover:border-sky-500/50 hover:bg-slate-900"
            >
              LinkedIn <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={indeedSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-700/80 bg-slate-950/90 px-2.5 py-1.5 text-[11px] font-semibold text-blue-300 transition hover:border-blue-500/50 hover:bg-slate-900"
            >
              Indeed SE <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={jobtechSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-700/80 bg-slate-950/90 px-2.5 py-1.5 text-[11px] font-semibold text-teal-300 transition hover:border-teal-500/50 hover:bg-slate-900"
            >
              Platsbanken <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* CV Skill-Match Breakdown Box */}
      <div className="mt-6 rounded-2xl border border-indigo-500/25 bg-slate-950/80 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              CV Skill-Match Breakdown
            </h3>
          </div>
          <span className="rounded-xl bg-emerald-500/20 px-3 py-1 text-sm font-extrabold text-emerald-300 ring-1 ring-inset ring-emerald-500/40">
            {overallScore}% Overall Fit
          </span>
        </div>

        {/* 3 Sub-Scores */}
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Tech Stack Alignment</span>
              <span className="font-bold text-emerald-400">
                {techStackScore}%
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                style={{ width: `${techStackScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">
                Role & Seniority Fit ({job.roleTrack})
              </span>
              <span className="font-bold text-indigo-400">
                {roleSeniorityScore}%
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-indigo-500"
                style={{ width: `${roleSeniorityScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">
                Location & Work Mode ({job.workMode})
              </span>
              <span className="font-bold text-sky-400">
                {locationDomainScore}%
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-sky-400"
                style={{ width: `${locationDomainScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Matched CV Skills */}
        <div className="mt-5 border-t border-slate-800/90 pt-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Matched Skills from Your CV ({matchedSkills.length})
            </span>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {matchedSkills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-200 ring-1 ring-inset ring-emerald-500/30"
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Missing / Stretch Skills */}
        <div className="mt-4 border-t border-slate-800/90 pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            Missing / Bonus Skills Mentioned ({missingSkills.length})
          </span>
          {missingSkills.length === 0 ? (
            <p className="mt-1.5 text-xs text-emerald-300/90">
              ✓ Your CV covers 100% of the detected primary technical keywords
              for this role.
            </p>
          ) : (
            <>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {missingSkills.map((missing) => (
                  <span
                    key={missing}
                    className="inline-flex items-center rounded-lg bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-200 ring-1 ring-inset ring-amber-500/30"
                  >
                    {missing}
                  </span>
                ))}
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">
                Tip: Highlight adjacent strengths (e.g., AWS Solutions Architect
                or Node.js microservices) when addressing these in your
                application.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Why This Matches Your CV (Evidence) */}
      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
          <Layers className="h-3.5 w-3.5 text-indigo-400" />
          Why Your CV Matches This Role
        </h4>
        <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-slate-300">
          {cvEvidenceReasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Full Job Description */}
      <div className="mt-5 border-t border-slate-800 pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Role Highlights & Description
        </h4>
        {job.highlights.length > 0 && (
          <ul className="mt-2.5 space-y-1.5 text-xs text-slate-200">
            {job.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <span className="text-indigo-400">•</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 max-h-72 overflow-y-auto whitespace-pre-line rounded-xl bg-slate-950/60 p-3.5 text-xs leading-relaxed text-slate-300">
          {job.description}
        </div>
      </div>
    </aside>
  );
};
