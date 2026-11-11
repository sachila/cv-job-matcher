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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <FilePlus2 className="h-5 w-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              Test Custom Job Description Against Your CV
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Job Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Senior Fullstack Engineer (React/Node)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Company Name
              </label>
              <input
                type="text"
                placeholder="e.g., Spotify / Klarna / Bambuser"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Work Mode
              </label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
                <option value="Remote EU">Remote EU</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">
                Job URL (optional)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300">
              Paste Full Job Description *
            </label>
            <textarea
              required
              rows={6}
              placeholder="Paste the job requirements, tech stack, and responsibilities here to compute your % skill match, matched CV skills, and missing keywords..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs leading-relaxed text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-500"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Calculate CV Match & Add to List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
