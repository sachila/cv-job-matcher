import { CVSkill } from '../types/job';

export const SACHILA_CV_PROFILE = {
  name: 'Sachila Ranawaka',
  title: 'Senior Fullstack Engineer',
  location: 'Stockholm, Sweden',
  email: 'sachilaranawaka@gmail.com',
  phone: '+46 76 245 2397',
  linkedin: 'https://www.linkedin.com/in/sachila-ranawaka-1bb571104',
  portfolio: 'https://sachila-portfolio.sachilaranawaka.workers.dev',
  yearsOfExperience: 9,
  summary:
    'Full-stack engineer specializing in React, Next.js, Node.js, and TypeScript, focused on customer-facing portals. End-to-end ownership from prototyping and UX collaboration to implementation, automated testing, CI/CD, production releases, and AI-powered LLM agent integrations.',
  certifications: [
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services (AWS)',
      date: 'Jan 2026',
    },
  ],
  education: [
    {
      degree: 'MSc in Advanced Software Engineering',
      institution: 'University of Westminster / IIT',
      period: 'Feb 2017 – Feb 2019',
    },
  ],
  experience: [
    {
      role: 'Senior Developer',
      company: 'Qvalia',
      location: 'Stockholm, Sweden',
      period: 'Oct 2021 – Present',
      highlights: [
        'Built fintech/finance applications using React, TypeScript, Node.js (Express), and AWS for secure customer portals.',
        'Integrated a real-time AI analytics assistant using Server-Sent Events (SSE), custom agent skills, and LLM suggestion validation.',
        'Designed and deployed scalable microservices, REST & GraphQL APIs, RBAC authentication, and monitoring.',
        'Optimized Webpack build tooling, CI/CD pipelines, and mentored engineers across a cross-functional Agile team.',
      ],
    },
    {
      role: 'Senior Developer',
      company: 'Creative Software',
      location: 'Sri Lanka',
      period: 'Oct 2020 – Oct 2021',
      highlights: [
        'Led frontend development with Next.js, React, and TypeScript using SSR patterns for high-performance, SEO-optimized UIs.',
        'Implemented Tailwind CSS and class-variance-authority (cva) for a shared, type-safe component library and design system.',
        'Established unit and E2E test automation with Jest and TestCafe and implemented A/B testing strategies.',
      ],
    },
    {
      role: 'Software Engineer / Senior Software Engineer',
      company: 'IFS',
      location: 'Sri Lanka',
      period: 'Sep 2017 – Oct 2020',
      highlights: [
        'Built a Selenium-based regression automation framework across the stack.',
        'Applied networking and integration expertise to connect external partners and troubleshoot production systems.',
      ],
    },
  ],
};

export const CV_SKILLS: CVSkill[] = [
  // Frontend & UI
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Frontend & UI',
    weight: 10,
    aliases: ['typescript', 'ts', 'type-safe'],
  },
  {
    id: 'react',
    name: 'React',
    category: 'Frontend & UI',
    weight: 10,
    aliases: ['react', 'reactjs', 'react.js', 'react 18', 'react hooks'],
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'Frontend & UI',
    weight: 9,
    aliases: ['next.js', 'nextjs', 'ssr', 'server-side rendering'],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Frontend & UI',
    weight: 8,
    aliases: ['javascript', 'es6', 'ecmascript', 'js'],
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Frontend & UI',
    weight: 8,
    aliases: ['tailwind', 'tailwindcss', 'cva', 'class-variance-authority'],
  },
  {
    id: 'design-systems',
    name: 'Design Systems',
    category: 'Frontend & UI',
    weight: 8,
    aliases: ['design system', 'design systems', 'component library', 'component libraries', 'ui library', 'storybook'],
  },

  // Backend & APIs
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Backend & APIs',
    weight: 10,
    aliases: ['node.js', 'nodejs', 'node'],
  },
  {
    id: 'express',
    name: 'Express.js',
    category: 'Backend & APIs',
    weight: 8,
    aliases: ['express', 'express.js', 'expressjs'],
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    category: 'Backend & APIs',
    weight: 8,
    aliases: ['graphql', 'apollo', 'gql'],
  },
  {
    id: 'rest-apis',
    name: 'REST APIs',
    category: 'Backend & APIs',
    weight: 8,
    aliases: ['rest', 'rest api', 'rest apis', 'restful', 'api integration', 'apis'],
  },
  {
    id: 'microservices',
    name: 'Microservices',
    category: 'Backend & APIs',
    weight: 8,
    aliases: ['microservice', 'microservices', 'distributed systems'],
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'Backend & APIs',
    weight: 8,
    aliases: ['postgresql', 'postgres', 'sql', 'relational database'],
  },
  {
    id: 'sse',
    name: 'Server-Sent Events (SSE)',
    category: 'Backend & APIs',
    weight: 8,
    aliases: ['sse', 'server-sent events', 'real-time streaming', 'streaming', 'websockets', 'real-time'],
  },

  // Cloud, DevOps & Testing
  {
    id: 'aws',
    name: 'AWS',
    category: 'Cloud, DevOps & Testing',
    weight: 9,
    aliases: ['aws', 'amazon web services', 'cloud architecture', 'lambda', 's3', 'cloudformation', 'solutions architect'],
  },
  {
    id: 'cicd',
    name: 'CI/CD & GitHub Actions',
    category: 'Cloud, DevOps & Testing',
    weight: 8,
    aliases: ['ci/cd', 'cicd', 'github actions', 'continuous integration', 'deployment pipelines', 'webpack'],
  },
  {
    id: 'automated-testing',
    name: 'Jest / E2E Testing',
    category: 'Cloud, DevOps & Testing',
    weight: 8,
    aliases: ['jest', 'testcafe', 'selenium', 'automated testing', 'e2e', 'end-to-end testing', 'unit testing', 'tdd'],
  },
  {
    id: 'monitoring',
    name: 'Monitoring & Logging',
    category: 'Cloud, DevOps & Testing',
    weight: 7,
    aliases: ['monitoring', 'logging', 'observability', 'datadog', 'sentry', 'cloudwatch'],
  },
  {
    id: 'git',
    name: 'Git',
    category: 'Cloud, DevOps & Testing',
    weight: 6,
    aliases: ['git', 'github', 'gitlab', 'version control'],
  },

  // AI & Engineering Leadership
  {
    id: 'ai-agents',
    name: 'AI / LLM Agents',
    category: 'AI & Engineering Leadership',
    weight: 9,
    aliases: ['ai', 'llm', 'llms', 'agents', 'agentic', 'openai', 'generative ai', 'genai', 'ai assistant', 'prompt engineering', 'rag', 'anthropic'],
  },
  {
    id: 'mentoring',
    name: 'Tech Leadership & Mentoring',
    category: 'AI & Engineering Leadership',
    weight: 8,
    aliases: ['mentoring', 'coaching', 'pair programming', 'code review', 'tech lead', 'architecture', 'agile'],
  },
  {
    id: 'fintech',
    name: 'Fintech & Security (RBAC)',
    category: 'AI & Engineering Leadership',
    weight: 8,
    aliases: ['fintech', 'finance', 'accounting', 'payments', 'authentication', 'rbac', 'role-based access', 'security'],
  },
];

/**
 * Common industry skills that are NOT listed as primary skills on Sachila's CV.
 * When a job mentions these, we surface them transparently under "Missing / Stretch Skills".
 */
export const NON_CV_TECH_KEYWORDS: { name: string; aliases: string[] }[] = [
  { name: 'Python', aliases: ['python', 'fastapi', 'django', 'flask'] },
  { name: 'Go (Golang)', aliases: ['golang', 'go language'] },
  { name: 'Kubernetes', aliases: ['kubernetes', 'k8s', 'helm'] },
  { name: 'Docker', aliases: ['docker', 'containerization', 'containers'] },
  { name: 'Terraform', aliases: ['terraform', 'iac', 'infrastructure as code'] },
  { name: 'Java / Kotlin', aliases: ['java', 'kotlin', 'spring boot'] },
  { name: 'C# / .NET', aliases: ['c#', '.net', 'dotnet'] },
  { name: 'Vue.js', aliases: ['vue', 'vue.js', 'vuejs', 'nuxt'] },
  { name: 'Angular', aliases: ['angular', 'angularjs', 'rxjs'] },
  { name: 'Kafka / Event Queues', aliases: ['kafka', 'rabbitmq', 'eventbridge'] },
  { name: 'Redis', aliases: ['redis', 'caching'] },
  { name: 'React Native', aliases: ['react native', 'mobile app', 'ios', 'android'] },
  { name: 'GCP / Azure', aliases: ['gcp', 'google cloud', 'azure'] },
  { name: 'Playwright / Cypress', aliases: ['playwright', 'cypress'] },
];
