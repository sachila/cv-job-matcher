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
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  UploadCloud,
  UserCheck,
} from 'lucide-react';
import { SACHILA_CV_PROFILE } from '../data/cvProfile';
import { CVProfile } from '../types/job';

interface CVProfileHeaderProps {
  profile?: CVProfile;
  isCustomProfile?: boolean;
  onOpenUploadModal: () => void;
  onResetToDefault: () => void;
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
  profile = SACHILA_CV_PROFILE,
  isCustomProfile = false,
  onOpenUploadModal,
  onResetToDefault,
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
              {isCustomProfile ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 ring-1 ring-inset ring-amber-300 dark:bg-amber-500/20 dark:text-amber-200 dark:ring-amber-500/40">
                  <UserCheck className="h-3.5 w-3.5 text-amber-700 dark:text-amber-300" />
                  Custom CV Active ({profile.name})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-semibold text-[#1B5E20] ring-1 ring-inset ring-[#C8E6C9] dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30">
                  <UserCheck className="h-3.5 w-3.5" />
                  Default Profile (Sachila Ranawaka)
                </span>
              )}

              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3EFEA] px-3 py-1 text-xs font-medium text-[#44403C] ring-1 ring-inset ring-[#E5E0D8] dark:bg-[#141722] dark:text-zinc-300 dark:ring-[#262A3B]">
                <MapPin className="h-3.5 w-3.5 text-[#0F766E] dark:text-emerald-400" />
                {profile.location}
              </span>

              {profile.certifications && profile.certifications.length > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7]/80 px-3 py-1 text-xs font-medium text-[#92400E] ring-1 ring-inset ring-[#FDE68A] dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30">
                  <Award className="h-3.5 w-3.5" />
                  {profile.certifications[0].name}
                  {profile.certifications[0].year || profile.certifications[0].date
                    ? ` (${profile.certifications[0].year || profile.certifications[0].date})`
                    : ''}
                </span>
              )}

              {profile.education && profile.education.length > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3EFEA] px-3 py-1 text-xs font-medium text-[#57534E] ring-1 ring-inset ring-[#E5E0D8] dark:bg-[#141722] dark:text-zinc-300 dark:ring-[#262A3B]">
                  <GraduationCap className="h-3.5 w-3.5 text-[#78716C]" />
                  {profile.education[0].degree}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-baseline gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl dark:text-white">
                {profile.name}
              </h1>
              <span className="text-base font-medium text-[#0F766E] sm:text-lg dark:text-emerald-400">
                · {profile.title} Job Radar
              </span>
            </div>

            <p className="max-w-3xl text-xs leading-relaxed text-[#57534E] sm:text-sm dark:text-zinc-400">
              Verified non-expired Stockholm roles across{' '}
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
              — dynamically matched against {profile.name}&apos;s profile ({profile.targetRoleTrack}) and sorted chronologically.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Upload / Switch CV Button */}
            <button
              type="button"
              onClick={onOpenUploadModal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#0F766E] bg-[#E6F4F1] px-3.5 py-2 text-xs font-bold text-[#0F766E] shadow-2xs transition hover:bg-[#D4ECE6] dark:border-teal-500/40 dark:bg-teal-500/20 dark:text-teal-300 dark:hover:bg-teal-500/30"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Upload / Switch CV</span>
            </button>

            {/* Reset to Default Button (only shown when custom profile active) */}
            {isCustomProfile && (
              <button
                type="button"
                onClick={onResetToDefault}
                title="Reset to Sachila's default profile"
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 shadow-2xs transition hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-200"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset to Default CV</span>
              </button>
            )}

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
                  Parsed Profile: {profile.name} ({profile.title})
                </h2>
                <p className="text-xs text-[#78716C] dark:text-zinc-400">
                  {profile.summary}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                {profile.portfolio && (
                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#18181B] underline decoration-[#E5E0D8] underline-offset-4 hover:text-[#0F766E] dark:text-zinc-200"
                  >
                    Portfolio <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#18181B] underline decoration-[#E5E0D8] underline-offset-4 hover:text-[#0F766E] dark:text-zinc-200"
                  >
                    LinkedIn <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {(profile.experience || []).map((exp) => (
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
                    {(exp.highlights || []).map((h, i) => (
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
                {profile.name}&apos;s CV Skills:
              </span>
              {(profile.skills || []).map((skill) => {
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

