# Sachila Ranawaka — CV Job Matcher & Multi-Source Radar

A React + TypeScript web application that matches active job postings against **Sachila Ranawaka's CV**, calculates a multi-factor **CV Skill-Match Breakdown**, filters out expired/closed listings, and sorts jobs chronologically by **Posted Date**.

## Features

- **Multi-Source Job Aggregation**: Aggregates active postings across **LinkedIn**, **Indeed**, **JobTech Sweden (Platsbanken)**, **Arbeitnow EU**, **Remotive**, and **Himalayas EU**.
- **Strict Expiration Guard (`isJobExpired`)**: Automatically hides expired or closed job postings based on application deadlines (`expiresAt`), `removed` flags, >30-day staleness, and closed-status text indicators.
- **Chronological Sorting by Posted Date**: Sorts jobs by **Posted Date: Newest First** by default, with toggles for **Posted Date: Oldest First** and **CV Match Score**.
- **CV Skill-Match Breakdown**:
  - Overall Fit %, Tech Stack Alignment %, Role & Seniority Fit %, and Location & Work Mode Fit %.
  - Highlights **Matched Skills from Your CV** vs. **Missing / Bonus Skills**.
  - Generates tailored **CV Evidence Bullets** referencing experience at Qvalia (Stockholm), Creative Software, IFS, MSc in Advanced Software Engineering, and AWS Certified Solutions Architect.
- **Custom JD Matcher**: Paste any custom job description to compute its CV match breakdown and insert it into the list.

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Build Tool**: Vite 5

## Getting Started

```bash
npm install
npm run dev
```
