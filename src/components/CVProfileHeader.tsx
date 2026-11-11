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
  Moon,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sun,
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
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
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
  theme = 'light',
  onToggleTheme,
}) => {
  const [showFullCvDrawer, setShowFullCvDrawer] = useState(false);

  return (
    <header className="border-b border-[#E5E0D8] bg-[#FAF8F5] dark:border-[#1F2230] dark:bg-[#090A0F]">
      <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">
        {/* Top Row: Identity & Action Buttons */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-semibold text-[#1B5E20] ring-1 ring-inset ring-[#C8E6C9] dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30">
                <UserCheck className="h-3.5 w-3.5" />
                CV Profile Loaded
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3EFEA] px-3 py-1 text-xs font-medium text-[#44403C] ring-1 ring-inset ring-[#E5E0D8] dark:bg-[#141722] dark:text-zinc-300 dark:ring-[#262A3B]">
                <MapPin className="h-3.5 w-3.5 text-[#0F766E] dark:text-emerald-400" />
                {SACHILA_CV_PROFILE.location}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7]/80 px-3 py-1 text-xs font-medium text-[#92400E] ring-1 ring-inset ring-[#FDE68A] dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30">
                <Award className="h-3.5 w-3.5" />
                AWS Certified Solutions Architect (Jan 2026)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3EFEA] px-3 py-1 text-xs font-medium text-[#57534E] ring-1 ring-inset ring-[#E5E0D8] dark:bg-[#141722] dark:text-zinc-300 dark:ring-[#262A3B]">
                <GraduationCap className="h-3.5 w-3.5 text-[#78716C]" />
                MSc Advanced Software Engineering
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl dark:text-white">
                {SACHILA_CV_PROFILE.name}
              </h1>
              <span className="text-base font-medium text-[#0F766E] sm:text-lg dark:text-emerald-400">
                · {SACHILA_CV_PROFILE.title} Job Radar
              </span>
            </div>

            <p className="max-w-3xl text-xs leading-relaxed text-[#57534E] sm:text-sm dark:text-zinc-400">
              Verified non-expired roles across{' '}
              <strong className="font-semibold text-[#18181B] dark:text-zinc-200">
                LinkedIn
              </strong>
              ,{' '}
              <strong className="font-semibold text-[#18181B] dark:text-zinc-200">
                Indeed
              </strong>
              ,{' '}
              <strong className="font-semibold text-[#0F766E] dark:text-emerald-300">
                JobTech Sweden (Platsbanken)
              </strong>
              ,{' '}
              <strong className="font-semibold text-[#18181B] dark:text-zinc-200">
                Arbeitnow EU
              </strong>
              ,{' '}
              <strong className="font-semibold text-[#18181B] dark:text-zinc-200">
                Remotive
              </strong>
              , and{' '}
              <strong className="font-semibold text-[#18181B] dark:text-zinc-200">
                Himalayas EU
              </strong>{' '}
              — matched against your CV and sorted chronologically by posted
              date.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                title="Switch between Nordic Light Editorial and Dark Obsidian"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-white px-3 py-2 text-xs font-semibold text-[#44403C] shadow-sm transition hover:bg-[#F5F2EB] dark:border-[#262A3B] dark:bg-[#12141D] dark:text-zinc-200 dark:hover:bg-[#191C28]"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="h-3.5 w-3.5 text-[#57534E]" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-3.5 w-3.5 text-amber-400" />
                    <span>Nordic Light</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onRefreshLive}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-white px-3.5 py-2 text-xs font-semibold text-[#18181B] shadow-sm transition hover:bg-[#F5F2EB] disabled:opacity-50 dark:border-[#262A3B] dark:bg-[#12141D] dark:text-zinc-200 dark:hover:bg-[#191C28]"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 text-[#0F766E] dark:text-emerald-400 ${
                  isLoading ? 'animate-spin' : ''
                }`}
              />
              {isLoading ? 'Syncing Boards...' : 'Refresh Sources'}
            </button>

            <button
              type="button"
              onClick={() => setShowFullCvDrawer((prev) => !prev)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-white px-3.5 py-2 text-xs font-semibold text-[#44403C] shadow-sm transition hover:bg-[#F5F2EB] dark:border-[#262A3B] dark:bg-[#12141D] dark:text-zinc-200 dark:hover:bg-[#191C28]"
            >
              <Briefcase className="h-3.5 w-3.5 text-[#78716C]" />
              CV Profile
              {showFullCvDrawer ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>

            <button
              type="button"
              onClick={onOpenCustomModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#18181B] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#27272A] dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              <FilePlus2 className="h-3.5 w-3.5" />
              + Custom JD Match
            </button>
          </div>
        </div>

        {/* Nordic Editorial KPI Strip */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-[#E5E0D8] bg-white px-4 py-3 shadow-sm dark:border-[#1F2230] dark:bg-[#0F111A]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#78716C] dark:text-zinc-400">
              Active Matching Roles
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#18181B] dark:text-white">
                {totalMatches}
              </span>
              <span className="text-xs font-medium text-[#0F766E] dark:text-emerald-400">
                100% verified open
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E0D8] bg-white px-4 py-3 shadow-sm dark:border-[#1F2230] dark:bg-[#0F111A]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#78716C] dark:text-zinc-400">
              Average CV Match
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#0F766E] dark:text-emerald-400">
                {avgMatchScore}%
              </span>
              <span className="text-xs text-[#78716C] dark:text-zinc-400">
                stack & seniority fit
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E0D8] bg-white px-4 py-3 shadow-sm dark:border-[#1F2230] dark:bg-[#0F111A]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#78716C] dark:text-zinc-400">
              Posted Last 24 Hours
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#18181B] dark:text-white">
                {freshLast24hCount}
              </span>
              <span className="text-xs font-medium text-[#0F766E] dark:text-emerald-400">
                fresh today
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-[#C8E6C9] bg-[#E8F5E9]/50 px-4 py-3 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-950/20">
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#1B5E20] dark:text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5 text-[#0F766E] dark:text-emerald-400" />
              Expiration Guard
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#1B5E20] dark:text-emerald-400">
                {expiredFilteredCount}
              </span>
              <span className="text-xs text-[#44403C] dark:text-zinc-400">
                expired postings blocked
              </span>
            </div>
          </div>
        </div>

        {/* Collapsible Full CV Experience Drawer */}
        {showFullCvDrawer && (
          <div className="mt-4 rounded-xl border border-[#E5E0D8] bg-white p-5 shadow-sm dark:border-[#1F2230] dark:bg-[#0F111A]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E0D8] pb-3 dark:border-[#1F2230]">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-emerald-400">
                  Parsed CV Experience & Links
                </h2>
                <p className="text-xs text-[#78716C] dark:text-zinc-400">
                  Used as the baseline for calculating skill-match scores and
                  role evidence.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <a
                  href={SACHILA_CV_PROFILE.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-[#18181B] underline decoration-[#E5E0D8] underline-offset-4 hover:text-[#0F766E] dark:text-zinc-200"
                >
                  Portfolio <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href={SACHILA_CV_PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-[#18181B] underline decoration-[#E5E0D8] underline-offset-4 hover:text-[#0F766E] dark:text-zinc-200"
                >
                  LinkedIn <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {SACHILA_CV_PROFILE.experience.map((exp) => (
                <div
                  key={`${exp.company}-${exp.period}`}
                  className="rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] p-3.5 dark:border-[#1F2230] dark:bg-[#090A0F]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#18181B] dark:text-white">
                      {exp.role}
                    </span>
                    <span className="text-[11px] font-semibold text-[#0F766E] dark:text-emerald-400">
                      {exp.period}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-[#57534E] dark:text-zinc-400">
                    {exp.company} • {exp.location}
                  </div>
                  <ul className="mt-2.5 space-y-1.5 text-xs text-[#44403C] dark:text-zinc-300">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="leading-relaxed">
                        • {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Quick CV Skill Pills inside drawer */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-[#E5E0D8] pt-3 dark:border-[#1F2230]">
              <span className="mr-1 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#78716C]">
                <Sparkles className="h-3.5 w-3.5 text-[#0F766E]" />
                All CV Skills:
              </span>
              {CV_SKILLS.map((skill) => {
                const isSelected = selectedSkillFilter === skill.name;
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() =>
                      onSelectSkillFilter(isSelected ? null : skill.name)
                    }
                    className={`rounded-md px-2 py-0.5 text-xs font-medium transition ${
                      isSelected
                        ? 'bg-[#18181B] text-white dark:bg-emerald-600'
                        : 'bg-[#F3EFEA] text-[#44403C] hover:bg-[#E5E0D8] dark:bg-[#141722] dark:text-zinc-300'
                    }`}
                  >
                    {skill.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
