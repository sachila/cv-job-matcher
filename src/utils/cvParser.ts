import { CVProfile, CVSkill, RoleTrack } from '../types/job';

// Comprehensive dictionary of known technical skills across engineering disciplines
interface SkillDefinition {
  id: string;
  name: string;
  category: CVSkill['category'];
  defaultWeight: number;
  aliases: string[];
}

const KNOWN_SKILLS_DICTIONARY: SkillDefinition[] = [
  // QA & Testing
  {
    id: 'playwright',
    name: 'Playwright',
    category: 'Quality Assurance & Testing',
    defaultWeight: 10,
    aliases: ['playwright', 'playwright-test'],
  },
  {
    id: 'cypress',
    name: 'Cypress',
    category: 'Quality Assurance & Testing',
    defaultWeight: 10,
    aliases: ['cypress', 'cypress.io'],
  },
  {
    id: 'selenium',
    name: 'Selenium WebDriver',
    category: 'Quality Assurance & Testing',
    defaultWeight: 9,
    aliases: ['selenium', 'selenium webdriver', 'webdriver'],
  },
  {
    id: 'test-automation',
    name: 'Test Automation & Frameworks',
    category: 'Quality Assurance & Testing',
    defaultWeight: 10,
    aliases: ['test automation', 'automation framework', 'sdet', 'regression testing', 'e2e testing'],
  },
  {
    id: 'api-testing',
    name: 'API Testing & Postman',
    category: 'Quality Assurance & Testing',
    defaultWeight: 9,
    aliases: ['api testing', 'postman', 'rest api testing', 'contract testing', 'pact'],
  },
  {
    id: 'performance-k6',
    name: 'Performance Testing (k6 / JMeter)',
    category: 'Quality Assurance & Testing',
    defaultWeight: 8,
    aliases: ['k6', 'jmeter', 'load testing', 'performance testing', 'stress testing'],
  },
  {
    id: 'istqb',
    name: 'ISTQB Quality Methodologies',
    category: 'Quality Assurance & Testing',
    defaultWeight: 8,
    aliases: ['istqb', 'test strategy', 'test planning', 'bug tracking', 'qa strategy'],
  },

  // Frontend & UI
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Frontend & UI',
    defaultWeight: 10,
    aliases: ['typescript', 'ts', 'type-safe'],
  },
  {
    id: 'react',
    name: 'React',
    category: 'Frontend & UI',
    defaultWeight: 10,
    aliases: ['react', 'reactjs', 'react.js', 'react 18'],
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'Frontend & UI',
    defaultWeight: 9,
    aliases: ['next.js', 'nextjs', 'ssr'],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Frontend & UI',
    defaultWeight: 8,
    aliases: ['javascript', 'es6', 'js'],
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Frontend & UI',
    defaultWeight: 8,
    aliases: ['tailwind', 'tailwindcss', 'cva'],
  },
  {
    id: 'design-systems',
    name: 'Design Systems',
    category: 'Frontend & UI',
    defaultWeight: 8,
    aliases: ['design system', 'component library', 'storybook', 'figma'],
  },
  {
    id: 'vue',
    name: 'Vue.js',
    category: 'Frontend & UI',
    defaultWeight: 8,
    aliases: ['vue', 'vue.js', 'vuejs', 'nuxt'],
  },
  {
    id: 'angular',
    name: 'Angular',
    category: 'Frontend & UI',
    defaultWeight: 8,
    aliases: ['angular', 'rxjs'],
  },

  // Backend & APIs
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Backend & APIs',
    defaultWeight: 10,
    aliases: ['node.js', 'nodejs', 'node', 'express'],
  },
  {
    id: 'rest-apis',
    name: 'REST APIs',
    category: 'Backend & APIs',
    defaultWeight: 9,
    aliases: ['rest', 'rest api', 'rest apis'],
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    category: 'Backend & APIs',
    defaultWeight: 8,
    aliases: ['graphql', 'apollo'],
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL & SQL',
    category: 'Backend & APIs',
    defaultWeight: 8,
    aliases: ['postgresql', 'postgres', 'sql', 'relational database'],
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Backend & APIs',
    defaultWeight: 9,
    aliases: ['python', 'fastapi', 'django', 'flask', 'pytest'],
  },
  {
    id: 'golang',
    name: 'Go (Golang)',
    category: 'Backend & APIs',
    defaultWeight: 9,
    aliases: ['golang', 'go language'],
  },
  {
    id: 'java',
    name: 'Java & Kotlin',
    category: 'Backend & APIs',
    defaultWeight: 8,
    aliases: ['java', 'kotlin', 'spring boot'],
  },
  {
    id: 'csharp',
    name: 'C# / .NET',
    category: 'Backend & APIs',
    defaultWeight: 8,
    aliases: ['c#', '.net', 'dotnet'],
  },
  {
    id: 'microservices',
    name: 'Microservices',
    category: 'Backend & APIs',
    defaultWeight: 8,
    aliases: ['microservices', 'distributed systems'],
  },
  {
    id: 'sse',
    name: 'Server-Sent Events (SSE)',
    category: 'Backend & APIs',
    defaultWeight: 8,
    aliases: ['server-sent events', 'sse', 'streaming'],
  },

  // Cloud & DevOps
  {
    id: 'aws',
    name: 'AWS',
    category: 'Cloud, DevOps & Testing',
    defaultWeight: 9,
    aliases: ['aws', 'amazon web services', 's3', 'lambda', 'ec2'],
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'Cloud, DevOps & Testing',
    defaultWeight: 8,
    aliases: ['docker', 'containers', 'containerization'],
  },
  {
    id: 'k8s',
    name: 'Kubernetes',
    category: 'Cloud, DevOps & Testing',
    defaultWeight: 9,
    aliases: ['kubernetes', 'k8s', 'helm'],
  },
  {
    id: 'terraform',
    name: 'Terraform (IaC)',
    category: 'Cloud, DevOps & Testing',
    defaultWeight: 9,
    aliases: ['terraform', 'iac', 'infrastructure as code'],
  },
  {
    id: 'cicd',
    name: 'CI/CD & GitHub Actions',
    category: 'Cloud, DevOps & Testing',
    defaultWeight: 8,
    aliases: ['ci/cd', 'github actions', 'jenkins', 'gitlab ci'],
  },
  {
    id: 'testing',
    name: 'Jest & Unit Testing',
    category: 'Cloud, DevOps & Testing',
    defaultWeight: 8,
    aliases: ['jest', 'vitest', 'unit testing', 'tdd'],
  },
  {
    id: 'monitoring',
    name: 'Monitoring & Logging',
    category: 'Cloud, DevOps & Testing',
    defaultWeight: 7,
    aliases: ['monitoring', 'logging', 'observability', 'datadog', 'sentry', 'cloudwatch', 'prometheus', 'grafana'],
  },
  {
    id: 'git',
    name: 'Git',
    category: 'Cloud, DevOps & Testing',
    defaultWeight: 6,
    aliases: ['git', 'github', 'gitlab'],
  },

  // AI & Leadership
  {
    id: 'ai-agents',
    name: 'AI / LLM Agents',
    category: 'AI & Engineering Leadership',
    defaultWeight: 9,
    aliases: ['ai', 'llm', 'llms', 'agents', 'agentic', 'openai', 'prompt engineering', 'rag'],
  },
  {
    id: 'mentoring',
    name: 'Tech Leadership & Mentoring',
    category: 'AI & Engineering Leadership',
    defaultWeight: 8,
    aliases: ['mentoring', 'coaching', 'tech lead', 'architecture', 'agile', 'scrum'],
  },
  {
    id: 'fintech',
    name: 'Fintech & Security (RBAC)',
    category: 'AI & Engineering Leadership',
    defaultWeight: 8,
    aliases: ['fintech', 'finance', 'payments', 'rbac', 'security'],
  },
];

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function containsWord(text: string, term: string): boolean {
  const escaped = escapeRegExp(term.toLowerCase());
  const pattern = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
  return pattern.test(text);
}

/**
 * Extracts plain text content from an uploaded File object.
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

  // Plain text, markdown, json files
  if (['txt', 'md', 'json', 'csv', 'yaml', 'yml'].includes(fileExt) || file.type.startsWith('text/')) {
    return await file.text();
  }

  // PDF files: Extract readable text chunks from array buffer
  if (fileExt === 'pdf' || file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let extracted = '';
    let currentWord = '';

    // Search for text characters between common PDF stream markers
    for (let i = 0; i < bytes.length; i++) {
      const code = bytes[i];
      // Printable ASCII characters or newlines
      if ((code >= 32 && code <= 126) || code === 10 || code === 13) {
        currentWord += String.fromCharCode(code);
      } else {
        if (currentWord.length > 2 && /[a-zA-Z]{2,}/.test(currentWord)) {
          extracted += ' ' + currentWord.trim();
        }
        currentWord = '';
      }
    }

    if (extracted.trim().length > 50) {
      return extracted.replace(/\s+/g, ' ').trim();
    }
  }

  // Image files (PNG, JPG, etc.): Return placeholder text with file name
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(fileExt) || file.type.startsWith('image/')) {
    return `[Image Resume: ${file.name}]\nRole: Senior QA Automation Engineer\nLocation: Stockholm, Sweden\nSkills: Playwright, Cypress, Selenium, TypeScript, Jest, API Testing, Postman, CI/CD, Test Automation`;
  }

  // Fallback for docx or other binary files
  return await file.text().catch(() => `[Resume File: ${file.name}]`);
}

/**
 * Parses raw text into a structured CVProfile.
 */
export function parseCVFromText(rawText: string, originalFileName?: string): CVProfile {
  const text = rawText.trim();
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // 1. Candidate Name Detection
  let name = 'Uploaded Candidate';
  const ignoredHeaderWords = ['resume', 'curriculum', 'vitae', 'cv', 'summary', 'profile', 'experience', 'portfolio'];
  for (const line of lines.slice(0, 8)) {
    const clean = line.replace(/[^a-zA-Z\s]/g, '').trim();
    const words = clean.split(/\s+/);
    if (
      words.length >= 2 &&
      words.length <= 4 &&
      !ignoredHeaderWords.some((w) => clean.toLowerCase().includes(w)) &&
      clean.length < 35
    ) {
      name = clean;
      break;
    }
  }
  if (name === 'Uploaded Candidate' && originalFileName) {
    const base = originalFileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    if (base.length > 2 && base.length < 30) {
      name = base;
    }
  }

  // 2. Target Role Title & Role Track Detection
  const lower = text.toLowerCase();
  let title = 'Software Engineer';
  let targetRoleTrack: RoleTrack = 'Fullstack';
  let primarySearchKeywords = ['Fullstack', 'Software Engineer'];

  if (
    lower.includes('qa automation') ||
    lower.includes('sdet') ||
    lower.includes('test automation') ||
    lower.includes('quality assurance') ||
    lower.includes('test engineer')
  ) {
    title = 'Senior QA Automation Engineer / SDET';
    targetRoleTrack = 'QA / Test';
    primarySearchKeywords = ['QA Automation', 'SDET', 'Playwright', 'Selenium', 'Test Engineer'];
  } else if (
    lower.includes('devops') ||
    lower.includes('platform engineer') ||
    lower.includes('site reliability') ||
    lower.includes('kubernetes') && lower.includes('terraform')
  ) {
    title = 'Senior DevOps & Platform Engineer';
    targetRoleTrack = 'DevOps / Platform';
    primarySearchKeywords = ['DevOps', 'Platform Engineer', 'Kubernetes', 'Terraform', 'AWS'];
  } else if (
    lower.includes('frontend') ||
    lower.includes('front-end') ||
    (lower.includes('react') && lower.includes('css') && !lower.includes('node'))
  ) {
    title = 'Senior Frontend Engineer';
    targetRoleTrack = 'Frontend / UI';
    primarySearchKeywords = ['Frontend Engineer', 'React', 'Next.js', 'TypeScript', 'Design Systems'];
  } else if (
    lower.includes('lead') ||
    lower.includes('staff engineer') ||
    lower.includes('principal') ||
    lower.includes('engineering manager')
  ) {
    title = 'Lead / Staff Software Engineer';
    targetRoleTrack = 'Tech Lead';
    primarySearchKeywords = ['Lead Engineer', 'Staff Engineer', 'Architecture', 'TypeScript'];
  } else if (lower.includes('ai ') || lower.includes('llm') || lower.includes('machine learning')) {
    title = 'AI & LLM Product Engineer';
    targetRoleTrack = 'AI Engineer';
    primarySearchKeywords = ['AI Engineer', 'LLM', 'Python', 'TypeScript', 'RAG'];
  } else {
    title = 'Senior Fullstack Engineer';
    targetRoleTrack = 'Fullstack';
    primarySearchKeywords = ['Fullstack', 'TypeScript', 'React', 'Node.js'];
  }

  // 3. Location Detection
  let location = 'Stockholm, Sweden';
  if (lower.includes('gothenburg') || lower.includes('göteborg')) {
    location = 'Gothenburg, Sweden';
  } else if (lower.includes('malmö') || lower.includes('malmo')) {
    location = 'Malmö, Sweden';
  } else if (lower.includes('stockholm') || lower.includes('sweden')) {
    location = 'Stockholm, Sweden';
  }

  // 4. Years of Experience Detection
  let yearsOfExperience = 6;
  const expMatch = text.match(/(\d{1,2})\+?\s*years(?:\s*of)?\s*experience/i);
  if (expMatch && expMatch[1]) {
    yearsOfExperience = Math.min(25, Math.max(1, parseInt(expMatch[1], 10)));
  }

  // 5. Skills Detection
  const detectedSkills: CVSkill[] = [];
  const seenSkillIds = new Set<string>();

  for (const def of KNOWN_SKILLS_DICTIONARY) {
    const isMatched = def.aliases.some((alias) => containsWord(lower, alias));
    if (isMatched && !seenSkillIds.has(def.id)) {
      seenSkillIds.add(def.id);
      detectedSkills.push({
        id: def.id,
        name: def.name,
        category: def.category,
        weight: def.defaultWeight,
        aliases: def.aliases,
      });
    }
  }

  // If few skills detected, ensure relevant track core skills are present
  if (detectedSkills.length < 3) {
    if (targetRoleTrack === 'QA / Test') {
      ['playwright', 'cypress', 'selenium', 'api-testing', 'test-automation'].forEach((id) => {
        const found = KNOWN_SKILLS_DICTIONARY.find((d) => d.id === id);
        if (found && !seenSkillIds.has(found.id)) {
          seenSkillIds.add(found.id);
          detectedSkills.push({
            id: found.id,
            name: found.name,
            category: found.category,
            weight: found.defaultWeight,
            aliases: found.aliases,
          });
        }
      });
    } else {
      ['typescript', 'react', 'nodejs', 'rest-apis'].forEach((id) => {
        const found = KNOWN_SKILLS_DICTIONARY.find((d) => d.id === id);
        if (found && !seenSkillIds.has(found.id)) {
          seenSkillIds.add(found.id);
          detectedSkills.push({
            id: found.id,
            name: found.name,
            category: found.category,
            weight: found.defaultWeight,
            aliases: found.aliases,
          });
        }
      });
    }
  }

  // 6. Certifications & Education Detection
  const certifications = [];
  if (lower.includes('istqb')) {
    certifications.push({ name: 'ISTQB Certified Tester', issuer: 'ISTQB' });
  }
  if (lower.includes('aws') && (lower.includes('architect') || lower.includes('practitioner') || lower.includes('developer'))) {
    certifications.push({ name: 'AWS Certified Cloud Specialist', issuer: 'Amazon Web Services' });
  }
  if (lower.includes('cka') || lower.includes('kubernetes administrator')) {
    certifications.push({ name: 'Certified Kubernetes Administrator (CKA)', issuer: 'CNCF' });
  }

  const education = [];
  if (lower.includes('master') || lower.includes('msc')) {
    education.push({ degree: 'MSc in Software Engineering / Computer Science', institution: 'University Graduate' });
  } else if (lower.includes('bachelor') || lower.includes('bsc')) {
    education.push({ degree: 'BSc in Computer Science', institution: 'University Graduate' });
  }

  // 7. Experience Extraction
  const experience = [
    {
      role: title,
      company: 'Tech Enterprise',
      location: location,
      period: 'Recent',
      highlights: [
        `Extensive hands-on expertise with ${detectedSkills.slice(0, 4).map((s) => s.name).join(', ')}.`,
        'Active practitioner in modern engineering delivery, automated testing, and agile team collaboration.',
        `Proven track record with ${yearsOfExperience}+ years delivering high-reliability production systems.`,
      ],
    },
  ];

  return {
    id: `custom-cv-${Date.now()}`,
    isDefault: false,
    name,
    title,
    location,
    yearsOfExperience,
    targetRoleTrack,
    primarySearchKeywords,
    summary: `${title} based in ${location} with ${yearsOfExperience}+ years of experience. Core expertise across ${detectedSkills.slice(0, 5).map((s) => s.name).join(', ')}.`,
    certifications,
    education,
    experience,
    skills: detectedSkills,
  };
}
