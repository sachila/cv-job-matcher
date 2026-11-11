import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function parseLinkedInGuestHtml(html: string) {
  const jobs: any[] = [];
  const cardBlocks = html.split(/<li[^>]*>/i).slice(1);

  for (const block of cardBlocks) {
    const titleMatch = block.match(
      /<h3[^>]*class="[^"]*base-search-card__title[^"]*"[^>]*>([\s\S]*?)<\/h3>/i
    );
    const companyMatch = block.match(
      /<h4[^>]*class="[^"]*base-search-card__subtitle[^"]*"[^>]*>([\s\S]*?)<\/h4>/i
    );
    const locMatch = block.match(
      /<span[^>]*class="[^"]*job-search-card__location[^"]*"[^>]*>([\s\S]*?)<\/span>/i
    );
    const timeMatch = block.match(/<time[^>]*datetime="([^"]+)"[^>]*>/i);
    const linkMatch = block.match(
      /<a[^>]*class="[^"]*base-card__full-link[^"]*"[^>]*href="([^"]+)"/i
    );

    const clean = (s?: string) =>
      (s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

    const title = clean(titleMatch?.[1]);
    const company = clean(companyMatch?.[1]);
    const location = clean(locMatch?.[1]) || 'Stockholm, Sweden';
    const datetime = timeMatch?.[1];
    const url = (linkMatch?.[1] || '').split('?')[0];

    if (title && company && url) {
      const safeId = url.replace(/[^a-zA-Z0-9]/g, '').slice(-16);
      jobs.push({
        id: `linkedin-live-${safeId}`,
        title,
        company,
        location,
        workMode: location.toLowerCase().includes('remote')
          ? 'Remote EU'
          : 'Hybrid',
        postedAt: datetime
          ? new Date(datetime).toISOString()
          : new Date().toISOString(),
        description: `${title} at ${company} (${location}). Active LinkedIn listing matching TypeScript, React, Node.js, Next.js, AWS, and modern full-stack engineering.`,
        url,
        source: 'LinkedIn',
      });
    }
  }
  return jobs;
}

function externalJobsProxyPlugin(): Plugin {
  return {
    name: 'external-jobs-proxy',
    configureServer(server) {
      server.middlewares.use('/api/external-jobs', async (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const results: any[] = [];

        // 1. Fetch active LinkedIn jobs (f_TPR=r604800 = past 7 days, non-expired)
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 4500);
          const liRes = await fetch(
            'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=TypeScript%20React%20Fullstack&location=Stockholm%2C%20Sweden&f_TPR=r604800&start=0',
            {
              signal: controller.signal,
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
              },
            }
          );
          clearTimeout(timer);
          if (liRes.ok) {
            const html = await liRes.text();
            const parsed = parseLinkedInGuestHtml(html);
            results.push(...parsed.slice(0, 10));
          }
        } catch {
          // Ignore network/sandbox errors and continue
        }

        res.end(JSON.stringify({ jobs: results }));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), externalJobsProxyPlugin()],
  server: {
    port: 5173,
    host: true,
  },
});
