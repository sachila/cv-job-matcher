import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileCheck,
  FileText,
  Layers,
  Sparkles,
  UploadCloud,
  UserCheck,
  X,
} from 'lucide-react';
import { SAMPLE_CV_PROFILES } from '../data/cvProfile';
import { CVProfile } from '../types/job';
import { extractTextFromFile, parseCVFromText } from '../utils/cvParser';

interface CVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: CVProfile;
  onApplyProfile: (profile: CVProfile) => void;
}

export const CVUploadModal: React.FC<CVUploadModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  onApplyProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'paste'>(
    'presets'
  );
  const [previewProfile, setPreviewProfile] = useState<CVProfile>(activeProfile);
  const [pastedText, setPastedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: CVProfile) => {
    setPreviewProfile(preset);
    setErrorMessage(null);
  };

  const handleFileChange = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setFileName(file.name);

    // Yield to event loop so the UI immediately renders the processing state
    await new Promise((resolve) => setTimeout(resolve, 60));

    try {
      const text = await extractTextFromFile(file);
      const parsed = parseCVFromText(text || '', file.name);
      setPreviewProfile(parsed);
    } catch (err: any) {
      console.error('File parsing error:', err);
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const fallback = parseCVFromText(
        `[CV: ${cleanName}]\nRole: Software Engineer\nLocation: Stockholm, Sweden`,
        file.name
      );
      setPreviewProfile(fallback);
      setErrorMessage(
        'Could not fully extract text from this file format. Generated a profile preview — you can also paste your CV text directly in the "Paste Text" tab.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleParsePasted = () => {
    if (!pastedText.trim() || pastedText.trim().length < 25) {
      setErrorMessage('Please paste at least 25 characters of CV text.');
      return;
    }
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const parsed = parseCVFromText(pastedText, 'pasted_cv.txt');
      setPreviewProfile(parsed);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to parse text.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    onApplyProfile(previewProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] shadow-2xl dark:border-[#1F2230] dark:bg-[#0E1017]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E0D8] px-6 py-4 dark:border-[#1F2230]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F766E]/10 text-[#0F766E] dark:bg-emerald-500/15 dark:text-emerald-400">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#18181B] sm:text-lg dark:text-white">
                Upload & Switch CV Profile
              </h2>
              <p className="text-xs text-[#57534E] dark:text-zinc-400">
                Change the active candidate profile to dynamically recalculate all
                Stockholm job matches and evidence.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#78716C] hover:bg-[#E5E0D8] hover:text-[#18181B] dark:hover:bg-[#1A1D2A] dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E5E0D8] px-6 pt-3 dark:border-[#1F2230]">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'presets'
                ? 'border-[#0F766E] text-[#0F766E] dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-[#78716C] hover:text-[#18181B] dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            1-Click Profiles (QA, DevOps, Fullstack)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'upload'
                ? 'border-[#0F766E] text-[#0F766E] dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-[#78716C] hover:text-[#18181B] dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <UploadCloud className="h-3.5 w-3.5" />
            Upload File (PDF / TXT / MD / Img)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'paste'
                ? 'border-[#0F766E] text-[#0F766E] dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-[#78716C] hover:text-[#18181B] dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Paste CV Text / Markdown
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[68vh] overflow-y-auto p-6 space-y-5">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: 1-Click Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-[#57534E] dark:text-zinc-400">
                Choose a pre-configured candidate profile to test how job matching,
                skills filtering, and evidence reasons instantly re-calibrate:
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {SAMPLE_CV_PROFILES.map((preset) => {
                  const isSelected = previewProfile.id === preset.id;
                  const isCurrentActive = activeProfile.id === preset.id;

                  return (
                    <button
                      type="button"
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`text-left w-full cursor-pointer rounded-xl border p-4 transition ${
                        isSelected
                          ? 'border-[#0F766E] bg-white ring-2 ring-[#0F766E]/20 shadow-sm dark:border-emerald-400 dark:bg-[#141722] dark:ring-emerald-400/20'
                          : 'border-[#E5E0D8] bg-white/70 hover:border-[#A8A29E] hover:bg-white dark:border-[#1F2230] dark:bg-[#10121A] dark:hover:bg-[#141722]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-[#18181B] dark:text-white">
                              {preset.name}
                            </span>
                            {preset.isDefault && (
                              <span className="rounded bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-bold text-[#1B5E20] dark:bg-emerald-500/20 dark:text-emerald-300">
                                Default CV
                              </span>
                            )}
                            {isCurrentActive && (
                              <span className="rounded bg-[#0F766E] px-2 py-0.5 text-[10px] font-bold text-white dark:bg-emerald-500 dark:text-zinc-950">
                                Active Now
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 text-xs font-semibold text-[#0F766E] dark:text-emerald-400">
                            {preset.title}
                          </div>
                        </div>

                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            isSelected
                              ? 'border-[#0F766E] bg-[#0F766E] text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-zinc-950'
                              : 'border-[#D6D3D1] dark:border-[#333748]'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="h-4 w-4" />}
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-[#57534E] line-clamp-2 dark:text-zinc-400">
                        {preset.summary}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {preset.skills.slice(0, 5).map((skill) => (
                          <span
                            key={skill.id}
                            className="rounded bg-[#F3EFEA] px-2 py-0.5 text-[10px] font-medium text-[#44403C] dark:bg-[#1A1D2B] dark:text-zinc-300"
                          >
                            {skill.name}
                          </span>
                        ))}
                        {preset.skills.length > 5 && (
                          <span className="text-[10px] font-medium text-[#78716C] self-center">
                            +{preset.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${
                  isDragging
                    ? 'border-[#0F766E] bg-[#0F766E]/5 dark:border-emerald-400 dark:bg-emerald-500/10'
                    : 'border-[#D6D3D1] bg-white/50 hover:border-[#0F766E] hover:bg-white dark:border-[#262A3B] dark:bg-[#12141D] dark:hover:border-emerald-400'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.md,.json,image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D8]/60 text-[#0F766E] dark:bg-[#1A1D2A] dark:text-emerald-400">
                  <UploadCloud className="h-6 w-6" />
                </div>

                <div className="mt-3 text-sm font-bold text-[#18181B] dark:text-white">
                  {fileName ? (
                    <span className="flex items-center gap-1.5 text-[#0F766E] dark:text-emerald-400">
                      <FileCheck className="h-4 w-4" />
                      Uploaded: {fileName}
                    </span>
                  ) : (
                    'Click to upload or drag & drop your CV'
                  )}
                </div>

                <p className="mt-1 text-xs text-[#78716C] dark:text-zinc-400">
                  Supports PDF resumes, text documents, markdown, or image files
                  (Max 5MB)
                </p>

                {isProcessing && (
                  <div className="mt-3 text-xs font-semibold text-[#0F766E] animate-pulse dark:text-emerald-400">
                    Extracting skills and analyzing profile...
                  </div>
                )}
              </div>

              <div className="rounded-lg bg-[#F3EFEA] p-3 text-xs text-[#57534E] dark:bg-[#141722] dark:text-zinc-400">
                <strong className="text-[#18181B] dark:text-zinc-200">
                  Tip:
                </strong>{' '}
                The built-in parser automatically extracts your candidate name,
                job title, role track (QA, DevOps, Fullstack, Frontend), skills
                matrix, and experience highlights.
              </div>
            </div>
          )}

          {/* TAB 3: Paste Text */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#57534E] dark:text-zinc-300">
                Paste your CV text, resume markdown, or LinkedIn profile summary:
              </label>
              <textarea
                rows={7}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Example:
Alex Lindqvist
Senior QA Automation Engineer | Stockholm, Sweden
Over 6 years of experience in test automation using Playwright, Cypress, Selenium, TypeScript, Jest, CI/CD, and Docker.
Experience:
- Senior QA Engineer at Klarna (2022 - Present): Designed Playwright test framework...
- Test Automation Engineer at King (2019 - 2022): Cypress, API testing with Postman..."
                className="w-full rounded-xl border border-[#E5E0D8] bg-white p-3 font-mono text-xs text-[#18181B] focus:border-[#0F766E] focus:outline-none dark:border-[#262A3B] dark:bg-[#12141D] dark:text-zinc-200"
              />
              <button
                type="button"
                onClick={handleParsePasted}
                disabled={isProcessing || !pastedText.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#18181B] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#27272A] disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isProcessing ? 'Analyzing...' : 'Parse & Preview Profile'}
              </button>
            </div>
          )}

          {/* PARSED PROFILE PREVIEW CARD */}
          <div className="rounded-xl border border-[#E5E0D8] bg-white p-4 shadow-sm dark:border-[#1F2230] dark:bg-[#10121A]">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-2.5 dark:border-[#1F2230]">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-emerald-400">
                <UserCheck className="h-3.5 w-3.5" />
                Target Profile Preview
              </span>
              <span className="rounded bg-[#F3EFEA] px-2 py-0.5 text-[11px] font-semibold text-[#57534E] dark:bg-[#1A1D2A] dark:text-zinc-300">
                Track: {previewProfile.targetRoleTrack}
              </span>
            </div>

            <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#18181B] dark:text-white">
                  {previewProfile.name}
                </h3>
                <div className="text-xs font-medium text-[#0F766E] dark:text-emerald-400">
                  {previewProfile.title} · {previewProfile.yearsOfExperience}+ Years
                  Experience · {previewProfile.location}
                </div>
              </div>
              <div className="text-xs text-[#78716C] dark:text-zinc-400">
                {(previewProfile?.skills || []).length} Extracted Skills
              </div>
            </div>

            <p className="mt-2 text-xs text-[#57534E] dark:text-zinc-400">
              {previewProfile?.summary || ''}
            </p>

            <div className="mt-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#78716C] dark:text-zinc-400">
                Extracted Skills Matrix:
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {(previewProfile?.skills || []).map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-md border border-[#E5E0D8] bg-[#FAF8F5] px-2 py-0.5 text-[11px] font-medium text-[#18181B] dark:border-[#262A3B] dark:bg-[#141722] dark:text-zinc-200"
                  >
                    {skill.name}{' '}
                    <span className="font-mono text-[9px] text-[#78716C]">
                      w:{skill.weight || 5}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-[#E5E0D8] bg-[#FAF8F5] px-6 py-4 rounded-b-2xl dark:border-[#1F2230] dark:bg-[#0E1017]">
          <div className="text-xs text-[#78716C] dark:text-zinc-400">
            Selected:{' '}
            <strong className="text-[#18181B] dark:text-white">
              {previewProfile.name} ({previewProfile.title})
            </strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E5E0D8] bg-white px-4 py-2 text-xs font-semibold text-[#57534E] hover:bg-[#F3EFEA] dark:border-[#262A3B] dark:bg-[#141722] dark:text-zinc-300 dark:hover:bg-[#1A1D2A]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F766E] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#0D655E] dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              <span>Apply CV to Job Matcher</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
