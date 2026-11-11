import React, { useState } from 'react';
import { FilePlus2, Sparkles, X } from 'lucide-react';
import { JobMatchItem, WorkMode } from '../types/job';
import { enrichJobWithMatch } from '../utils/jobMatcher';

interface CustomJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: JobMatchItem) => void;
}

export const CustomJobModal: React.FC<CustomJobModalProps> = ({
  isOpen,
  onClose,
  onAddJob,
}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Stockholm, Sweden');
  const [workMode, setWorkMode] = useState<WorkMode>('Hybrid');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const customJob = enrichJobWithMatch({
      id: `custom-${Date.now()}`,
      title: title.trim(),
      company: company.trim() || 'Target Company',
      location: location.trim() || 'Stockholm, Sweden',
      workMode,
      postedAt: new Date().toISOString(),
      description: description.trim(),
      url: url.trim() || 'https://www.linkedin.com/jobs/',
      source: 'Custom JD',
    });

    onAddJob(customJob);
    setTitle('');
    setCompany('');
    setDescription('');
    setUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18181B]/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] p-6 shadow-2xl dark:border-[#1F2230] dark:bg-[#0F111A]">
        <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4 dark:border-[#1F2230]">
          <div className="flex items-center gap-2">
            <FilePlus2 className="h-5 w-5 text-[#0F766E] dark:text-emerald-400" />
            <h2 className="text-base font-bold text-[#18181B] dark:text-white">
              Test Custom Job Description Against Your CV
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#78716C] hover:bg-[#E5E0D8]/50 hover:text-[#18181B] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#44403C] dark:text-zinc-300">
                Job Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Senior Fullstack Engineer (React/Node)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#E5E0D8] bg-white px-3 py-2 text-xs text-[#18181B] placeholder-[#A8A29E] focus:border-[#18181B] focus:outline-none dark:border-[#262A3B] dark:bg-[#090A0F] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#44403C] dark:text-zinc-300">
                Company Name
              </label>
              <input
                type="text"
                placeholder="e.g., Spotify / Klarna / Bambuser"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#E5E0D8] bg-white px-3 py-2 text-xs text-[#18181B] placeholder-[#A8A29E] focus:border-[#18181B] focus:outline-none dark:border-[#262A3B] dark:bg-[#090A0F] dark:text-white"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-[#44403C] dark:text-zinc-300">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#E5E0D8] bg-white px-3 py-2 text-xs text-[#18181B] focus:border-[#18181B] focus:outline-none dark:border-[#262A3B] dark:bg-[#090A0F] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#44403C] dark:text-zinc-300">
                Work Mode
              </label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                className="mt-1 w-full rounded-lg border border-[#E5E0D8] bg-white px-3 py-2 text-xs text-[#18181B] focus:border-[#18181B] focus:outline-none dark:border-[#262A3B] dark:bg-[#090A0F] dark:text-white"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
                <option value="Remote EU">Remote EU</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#44403C] dark:text-zinc-300">
                Job URL (optional)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#E5E0D8] bg-white px-3 py-2 text-xs text-[#18181B] placeholder-[#A8A29E] focus:border-[#18181B] focus:outline-none dark:border-[#262A3B] dark:bg-[#090A0F] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#44403C] dark:text-zinc-300">
              Paste Full Job Description *
            </label>
            <textarea
              required
              rows={6}
              placeholder="Paste the job requirements, tech stack, and responsibilities here to compute your % skill match, matched CV skills, and missing keywords..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E5E0D8] bg-white p-3 text-xs leading-relaxed text-[#18181B] placeholder-[#A8A29E] focus:border-[#18181B] focus:outline-none dark:border-[#262A3B] dark:bg-[#090A0F] dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-[#E5E0D8] pt-4 dark:border-[#1F2230]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E5E0D8] bg-white px-4 py-2 text-xs font-semibold text-[#44403C] hover:bg-[#F3EFEA] dark:border-[#262A3B] dark:bg-[#141722] dark:text-zinc-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#18181B] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#27272A] dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Calculate CV Match & Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
