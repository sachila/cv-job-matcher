import { CVProfile, CVSkill } from '../types/job';

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
    aliases: ['design system', 'component library', 'ui components', 'storybook'],
  },

  // Backend & APIs
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Backend & APIs',
    weight: 10,
    aliases: ['node.js', 'nodejs', 'node', 'express', 'express.js'],
  },
  {
    id: 'rest-apis',
    name: 'REST APIs',
    category: 'Backend & APIs',
    weight: 9,
    aliases: ['rest', 'restful', 'rest api', 'rest apis', 'api design'],
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    category: 'Backend & APIs',
    weight: 8,
    aliases: ['graphql', 'apollo'],
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL & SQL',
    category: 'Backend & APIs',
    weight: 8,
    aliases: ['postgresql', 'postgres', 'sql', 'relational database', 'rdbms'],
  },
  {
    id: 'microservices',
    name: 'Microservices',
    category: 'Backend & APIs',
    weight: 8,
    aliases: ['microservices', 'distributed systems', 'service-oriented', 'event-driven'],
  },
  {
    id: 'sse',
    name: 'Server-Sent Events (SSE)',
    category: 'Backend & APIs',
    weight: 8,
    aliases: ['server-sent events', 'sse', 'streaming', 'real-time streaming', 'websockets'],
  },

  // Cloud, DevOps & Testing
  {
    id: 'aws',
    name: 'AWS',
    category: 'Cloud, DevOps & Testing',
    weight: 9,
    aliases: ['aws', 'amazon web services', 'cloud architecture', 's3', 'lambda', 'ec2'],
  },
  {
    id: 'cicd',
    name: 'CI/CD & GitHub Actions',
    category: 'Cloud, DevOps & Testing',
    weight: 8,
    aliases: ['ci/cd', 'github actions', 'continuous integration', 'deployment automation', 'devops'],
  },
  {
    id: 'testing',
    name: 'Jest & Automated Testing',
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

export const SACHILA_CV_PROFILE: CVProfile = {
  id: 'sachila-default',
  isDefault: true,
  name: 'Sachila Ranawaka',
  title: 'Senior Fullstack Engineer',
  location: 'Stockholm, Sweden',
  email: 'sachilaranawaka@gmail.com',
  phone: '+46 76 245 2397',
  linkedin: 'https://www.linkedin.com/in/sachila-ranawaka-1bb571104',
  portfolio: 'https://sachila-portfolio.sachilaranawaka.workers.dev',
  yearsOfExperience: 9,
  targetRoleTrack: 'Fullstack',
  primarySearchKeywords: ['TypeScript', 'React', 'Node.js', 'Fullstack'],
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
  skills: CV_SKILLS,
};

// ================= QA AUTOMATION ENGINEER SAMPLE PROFILE =================
export const QA_AUTOMATION_PROFILE: CVProfile = {
  id: 'qa-sample-alex',
  isDefault: false,
  name: 'Alex Lindqvist',
  title: 'Senior QA Automation Engineer / SDET',
  location: 'Stockholm, Sweden',
  email: 'alex.lindqvist@example.se',
  phone: '+46 70 123 4567',
  linkedin: 'https://www.linkedin.com/in/alex-lindqvist-qa',
  yearsOfExperience: 8,
  targetRoleTrack: 'QA / Test',
  primarySearchKeywords: ['QA Automation', 'SDET', 'Playwright', 'Selenium', 'Test Engineer'],
  summary:
    'Senior Quality Assurance & Test Automation Engineer (SDET) with 8+ years building enterprise E2E automation frameworks, contract API testing suites, and CI/CD quality gates using Playwright, Cypress, Selenium, TypeScript, Python, and Postman.',
  certifications: [
    {
      name: 'ISTQB Certified Tester Advanced Level (Test Automation Engineer)',
      issuer: 'ISTQB',
      date: '2023',
    },
    {
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: '2024',
    },
  ],
  education: [
    {
      degree: 'BSc in Computer Science & Software Engineering',
      institution: 'KTH Royal Institute of Technology',
      period: '2014 – 2017',
    },
  ],
  experience: [
    {
      role: 'Senior QA Automation Engineer (SDET)',
      company: 'Spotify',
      location: 'Stockholm, Sweden',
      period: '2021 – Present',
      highlights: [
        'Architected modern end-to-end test automation framework using Playwright and TypeScript across creator and listener web platforms.',
        'Decreased regression test execution time by 65% through parallelized test execution on GitHub Actions and Docker containers.',
        'Integrated automated API contract testing with Postman and Jest for distributed microservice release verification.',
      ],
    },
    {
      role: 'QA Engineer / Test Lead',
      company: 'Klarna',
      location: 'Stockholm, Sweden',
      period: '2019 – 2021',
      highlights: [
        'Led test automation for merchant checkout payment flows using Cypress, Selenium WebDriver, and TypeScript.',
        'Implemented non-functional performance testing suites with k6 and Grafana observability.',
        'Championed Shift-Left testing practices and mentored 10+ frontend and backend developers in automated test design.',
      ],
    },
    {
      role: 'Software Test Engineer',
      company: 'King (Candy Crush)',
      location: 'Stockholm, Sweden',
      period: '2017 – 2019',
      highlights: [
        'Built automated regression suites for high-concurrency multiplayer backend APIs and mobile web portals.',
        'Maintained test data management systems and automated bug triage workflows with Jira and Git.',
      ],
    },
  ],
  skills: [
    {
      id: 'playwright',
      name: 'Playwright',
      category: 'Quality Assurance & Testing',
      weight: 10,
      aliases: ['playwright', 'playwright-test', 'microsoft playwright'],
    },
    {
      id: 'cypress',
      name: 'Cypress',
      category: 'Quality Assurance & Testing',
      weight: 10,
      aliases: ['cypress', 'cypress.io', 'e2e cypress'],
    },
    {
      id: 'selenium',
      name: 'Selenium WebDriver',
      category: 'Quality Assurance & Testing',
      weight: 9,
      aliases: ['selenium', 'selenium webdriver', 'grid'],
    },
    {
      id: 'test-automation',
      name: 'Test Automation & Strategy',
      category: 'Quality Assurance & Testing',
      weight: 10,
      aliases: ['test automation', 'automation framework', 'qa strategy', 'sdet', 'regression testing', 'e2e testing'],
    },
    {
      id: 'api-testing',
      name: 'API Testing & Postman',
      category: 'Quality Assurance & Testing',
      weight: 9,
      aliases: ['api testing', 'postman', 'rest api testing', 'contract testing', 'pact'],
    },
    {
      id: 'typescript-qa',
      name: 'TypeScript & JavaScript',
      category: 'Frontend & UI',
      weight: 9,
      aliases: ['typescript', 'ts', 'javascript', 'js'],
    },
    {
      id: 'jest-qa',
      name: 'Jest & Unit Testing',
      category: 'Quality Assurance & Testing',
      weight: 8,
      aliases: ['jest', 'unit testing', 'vitest', 'mocha'],
    },
    {
      id: 'cicd-qa',
      name: 'CI/CD & GitHub Actions',
      category: 'Cloud, DevOps & Testing',
      weight: 9,
      aliases: ['ci/cd', 'github actions', 'jenkins', 'gitlab ci', 'pipeline'],
    },
    {
      id: 'python-qa',
      name: 'Python (PyTest)',
      category: 'Backend & APIs',
      weight: 8,
      aliases: ['python', 'pytest', 'robot framework'],
    },
    {
      id: 'performance-k6',
      name: 'Performance Testing (k6)',
      category: 'Quality Assurance & Testing',
      weight: 8,
      aliases: ['k6', 'jmeter', 'load testing', 'performance testing', 'stress testing'],
    },
    {
      id: 'docker-qa',
      name: 'Docker & Containers',
      category: 'Cloud, DevOps & Testing',
      weight: 7,
      aliases: ['docker', 'containers', 'containerization'],
    },
    {
      id: 'istqb',
      name: 'ISTQB Certified Quality Practices',
      category: 'Quality Assurance & Testing',
      weight: 8,
      aliases: ['istqb', 'qa processes', 'defect tracking', 'test planning'],
    },
  ],
};

// ================= DEVOPS / CLOUD ENGINEER SAMPLE PROFILE =================
export const DEVOPS_PROFILE: CVProfile = {
  id: 'devops-sample-elena',
  isDefault: false,
  name: 'Elena Bergström',
  title: 'Senior DevOps & Platform Engineer',
  location: 'Stockholm, Sweden',
  email: 'elena.bergstrom@example.se',
  phone: '+46 72 987 6543',
  linkedin: 'https://www.linkedin.com/in/elena-bergstrom-devops',
  yearsOfExperience: 7,
  targetRoleTrack: 'DevOps / Platform',
  primarySearchKeywords: ['DevOps', 'Platform Engineer', 'Kubernetes', 'Terraform', 'AWS'],
  summary:
    'Senior Platform & DevOps Engineer specializing in Kubernetes, Terraform (IaC), AWS cloud infrastructure, GitOps (ArgoCD), and resilient CI/CD pipelines.',
  certifications: [
    {
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Linux Foundation / CNCF',
      date: '2023',
    },
    {
      name: 'AWS Certified Solutions Architect Professional',
      issuer: 'AWS',
      date: '2024',
    },
  ],
  education: [
    {
      degree: 'MSc in Distributed Systems',
      institution: 'KTH Royal Institute of Technology',
      period: '2015 – 2018',
    },
  ],
  experience: [
    {
      role: 'Senior Platform Engineer',
      company: 'Klarna',
      location: 'Stockholm, Sweden',
      period: '2022 – Present',
      highlights: [
        'Managed multi-cluster Kubernetes infrastructure running 200+ microservices on AWS EKS with zero-downtime upgrades.',
        'Automated enterprise cloud infrastructure using Terraform and Terragrunt across multiple AWS regions.',
        'Implemented GitOps deployment pipelines using ArgoCD, Helm, and GitHub Actions.',
      ],
    },
    {
      role: 'Cloud DevOps Engineer',
      company: 'Voi Technology',
      location: 'Stockholm, Sweden',
      period: '2019 – 2022',
      highlights: [
        'Built telemetry monitoring and alerting platforms using Prometheus, Grafana, and Datadog.',
        'Hardened container security and IAM access controls in accordance with ISO 27001 standards.',
      ],
    },
  ],
  skills: [
    { id: 'k8s', name: 'Kubernetes', category: 'Cloud, DevOps & Testing', weight: 10, aliases: ['kubernetes', 'k8s', 'eks', 'helm'] },
    { id: 'terraform', name: 'Terraform (IaC)', category: 'Cloud, DevOps & Testing', weight: 10, aliases: ['terraform', 'iac', 'infrastructure as code'] },
    { id: 'docker', name: 'Docker', category: 'Cloud, DevOps & Testing', weight: 9, aliases: ['docker', 'containers'] },
    { id: 'aws-devops', name: 'AWS Cloud', category: 'Cloud, DevOps & Testing', weight: 10, aliases: ['aws', 'amazon web services', 'iam', 's3', 'vpc'] },
    { id: 'cicd-devops', name: 'CI/CD & GitHub Actions', category: 'Cloud, DevOps & Testing', weight: 9, aliases: ['ci/cd', 'github actions', 'argocd', 'gitops'] },
    { id: 'monitoring-devops', name: 'Prometheus & Grafana', category: 'Cloud, DevOps & Testing', weight: 9, aliases: ['prometheus', 'grafana', 'datadog', 'observability'] },
    { id: 'linux-devops', name: 'Linux & Bash Scripting', category: 'Cloud, DevOps & Testing', weight: 8, aliases: ['linux', 'bash', 'shell'] },
    { id: 'python-devops', name: 'Python & Go', category: 'Backend & APIs', weight: 8, aliases: ['python', 'golang', 'go'] },
  ],
};

// ================= FRONTEND / UI ENGINEER SAMPLE PROFILE =================
export const FRONTEND_PROFILE: CVProfile = {
  id: 'frontend-sample-liam',
  isDefault: false,
  name: 'Liam Norén',
  title: 'Senior Frontend & UI Systems Engineer',
  location: 'Stockholm, Sweden',
  email: 'liam.noren@example.se',
  phone: '+46 73 555 4321',
  linkedin: 'https://www.linkedin.com/in/liam-noren-ui',
  yearsOfExperience: 8,
  targetRoleTrack: 'Frontend / UI',
  primarySearchKeywords: ['Frontend Engineer', 'React', 'Next.js', 'Design Systems', 'TypeScript'],
  summary:
    'Senior Frontend specialist focused on React 18, Next.js (SSR), Tailwind CSS, TypeScript, and accessible enterprise design systems with exceptional UX craftsmanship.',
  certifications: [],
  education: [
    {
      degree: 'BSc in Interaction Design & Software Engineering',
      institution: 'Stockholm University',
      period: '2014 – 2017',
    },
  ],
  experience: [
    {
      role: 'Staff Frontend Engineer',
      company: 'Epidemic Sound',
      location: 'Stockholm, Sweden',
      period: '2021 – Present',
      highlights: [
        'Built high-performance design system with React, Tailwind CSS, Storybook, and Radix UI primitives.',
        'Boosted Core Web Vitals (LCP, INP, CLS) to 98+ across desktop and mobile discovery platforms.',
      ],
    },
  ],
  skills: [
    { id: 'react-fe', name: 'React 18', category: 'Frontend & UI', weight: 10, aliases: ['react', 'react 18', 'reactjs'] },
    { id: 'typescript-fe', name: 'TypeScript', category: 'Frontend & UI', weight: 10, aliases: ['typescript', 'ts'] },
    { id: 'nextjs-fe', name: 'Next.js (SSR)', category: 'Frontend & UI', weight: 9, aliases: ['next.js', 'nextjs', 'ssr'] },
    { id: 'tailwind-fe', name: 'Tailwind CSS', category: 'Frontend & UI', weight: 9, aliases: ['tailwind', 'tailwindcss'] },
    { id: 'design-systems-fe', name: 'Design Systems', category: 'Frontend & UI', weight: 10, aliases: ['design system', 'storybook', 'figma'] },
    { id: 'testing-fe', name: 'Jest & React Testing Library', category: 'Cloud, DevOps & Testing', weight: 8, aliases: ['jest', 'react testing library', 'rtl'] },
  ],
};

export const SAMPLE_CV_PROFILES: CVProfile[] = [
  SACHILA_CV_PROFILE,
  QA_AUTOMATION_PROFILE,
  DEVOPS_PROFILE,
  FRONTEND_PROFILE,
];

/**
 * Common industry skills that are surfaced under "Missing / Stretch Skills" if not present in the active CV.
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
  { name: 'Selenium WebDriver', aliases: ['selenium', 'selenium webdriver'] },
  { name: 'API Testing / Postman', aliases: ['postman', 'api testing', 'rest api testing'] },
];
