import React, { useState } from 'react';
import {
  Award,
  Briefcase,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FilePlus2,
  GraduationCap,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { CV_SKILLS, SACHILA_CV_PROFILE } from '../data/cvProfile';

interface CVProfileHeaderProps {
  totalMatches: number;
  avgMatchScore: number;
  freshLast24hCount: number;
  expiredFilteredCount: number;
  isLoading: boolean;
  selectedSkillFilter: string | null;
  onSelectSkillFilter: (skillName: string | null) => void;
  onRefreshLive: () => void;
  onOpenCustomModal: () => void;
}

export const CVProfileHeader: React.FC<CVProfileHeaderProps> = ({
  totalMatches,
  avgMatchScore,
  freshLast24hCount,
  expiredFilteredCount,
  isLoading,
  selectedSkillFilter,
  onSelectSkillFilter,
  onRefreshLive,
  onOpenCustomModal,
}) => {
  const [showFullCvDrawer, setShowFullCvDrawer] = useState(false);

  return (
    <header className="border-b border-slate-800/80 bg-gradient-to-b from-slate-900/95 via-slate-900/75 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Top Row: Identity & Action Buttons */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/30">
                <UserCheck className="h-3.5 w-3.5" />
                CV Profile Loaded
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
                <MapPin className="h-3.5 w-3.5" />
                {SACHILA_CV_PROFILE.location}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-300 ring-1 ring-inset ring-amber-500/30">
                <Award className="h-3.5 w-3.5" />
                AWS Certified Solutions Architect (Jan 2026)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-inset ring-slate-700">
                <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                MSc Advanced Software Engineering
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {SACHILA_CV_PROFILE.name}
              </h1>
              <span className="text-base font-medium text-indigo-400 sm:text-lg">
                — {SACHILA_CV_PROFILE.title} Job Match Radar
              </span>
            </div>

            <p className="max-w-3xl text-sm leading-relaxed text-slate-400">
              Aggregating active, non-expired roles across{' '}
              <strong className="font-medium text-sky-300">LinkedIn</strong>,{' '}
              <strong className="font-medium text-blue-300">Indeed</strong>,{' '}
              <strong className="font-medium text-teal-300">
                JobTech Sweden (Platsbanken)
              </strong>
              ,{' '}
              <strong className="font-medium text-indigo-300">
                Arbeitnow EU
              </strong>
              , <strong className="font-medium text-fuchsia-300">Remotive</strong>
              , and{' '}
              <strong className="font-medium text-violet-300">
                Himalayas EU
              </strong>{' '}
              matched against your CV and sorted by posted date.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenCustomModal}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-indigo-950/50 transition hover:bg-indigo-500"
            >
              <FilePlus2 className="h-4 w-4" />
              Test Custom JD Match
            </button>

            <button
              type="button"
              onClick={onRefreshLive}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 text-indigo-400 ${
                  isLoading ? 'animate-spin' : ''
                }`}
              />
              {isLoading ? 'Syncing Boards...' : 'Refresh All Sources'}
            </button>

            <button
              type="button"
              onClick={() => setShowFullCvDrawer((prev) => !prev)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2.5 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:text-white"
            >
              <Briefcase className="h-3.5 w-3.5 text-slate-400" />
              CV Details
              {showFullCvDrawer ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 px-4 py-3">
            <div className="text-xs font-medium text-slate-400">
              Active Matching Roles
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {totalMatches}
              </span>
              <span className="text-xs text-emerald-400">100% active</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 px-4 py-3">
            <div className="text-xs font-medium text-slate-400">
              Average CV Match Score
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-400">
                {avgMatchScore}%
              </span>
              <span className="text-xs text-slate-400">stack & role fit</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 px-4 py-3">
            <div className="text-xs font-medium text-slate-400">
              Posted in Last 24 Hours
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-indigo-400">
                {freshLast24hCount}
              </span>
              <span className="text-xs text-emerald-400">fresh listings</span>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-3">
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Expiration Filter Active
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-400">
                {expiredFilteredCount}
              </span>
              <span className="text-xs text-slate-400">
                expired jobs hidden
              </span>
            </div>
          </div>
        </div>

        {/* Interactive CV Skills Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            Filter by CV Skill:
          </span>
          {selectedSkillFilter && (
            <button
              type="button"
              onClick={() => onSelectSkillFilter(null)}
              className="rounded-lg bg-rose-500/20 px-2.5 py-1 text-xs font-semibold text-rose-300 ring-1 ring-inset ring-rose-500/40 transition hover:bg-rose-500/30"
            >
              Clear "{selectedSkillFilter}" ×
            </button>
          )}
          {CV_SKILLS.map((skill) => {
            const isSelected = selectedSkillFilter === skill.name;
            return (
              <button
                key={skill.id}
                type="button"
                onClick={() =>
                  onSelectSkillFilter(isSelected ? null : skill.name)
                }
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                    : 'bg-slate-900 text-slate-300 ring-1 ring-inset ring-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {skill.name}
              </button>
            );
          })}
        </div>

        {/* Collapsible Full CV Experience Drawer */}
        {showFullCvDrawer && (
          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400">
                  Parsed CV Experience & Links
                </h2>
                <p className="text-xs text-slate-400">
                  Used as the baseline for calculating skill-match scores and
                  role evidence.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <a
                  href={SACHILA_CV_PROFILE.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-indigo-400 hover:text-indigo-300"
                >
                  Portfolio <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href={SACHILA_CV_PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-indigo-400 hover:text-indigo-300"
                >
                  LinkedIn <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {SACHILA_CV_PROFILE.experience.map((exp) => (
                <div
                  key={`${exp.company}-${exp.period}`}
                  className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-white">{exp.role}</span>
                    <span className="text-[11px] font-medium text-indigo-400">
                      {exp.period}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-slate-400">
                    {exp.company} • {exp.location}
                  </div>
                  <ul className="mt-2.5 space-y-1.5 text-xs text-slate-300">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="leading-relaxed">
                        • {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
