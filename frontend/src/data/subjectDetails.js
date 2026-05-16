import { courses } from './courses';
import { videos } from './videos';
import { tests } from './tests';

const RELATED_MAP = {
  'react-mastery': ['typescript-pro', 'js', 'nodejs-backend'],
  'nodejs-backend': ['mongodb-nosql', 'rest-apis', 'devops-pipeline'],
  'typescript-pro': ['react-mastery', 'js'],
  'js': ['react-mastery', 'typescript-pro', 'nodejs-backend'],
  python: ['python-advanced', 'ai-ml-fundamentals', 'dsa-algorithms'],
  'ai-ml-fundamentals': ['python-advanced', 'dsa-algorithms'],
  'linux-essentials': ['cybersecurity-ops', 'devops-pipeline', 'cloud-aws'],
  'git-github': ['devops-pipeline', 'nodejs-backend'],
};

function defaultDetail(course) {
  const cat = course.bannerClass || 'general';
  const categoryVideoMap = {
    react: 'react',
    node: 'nodejs',
    js: 'javascript',
    python: 'python',
    ai: 'ai-ml',
    cyber: 'cybersecurity',
    linux: 'linux',
    git: 'git',
    devops: 'devops',
    html: 'html',
    css: 'css',
  };
  const videoCat = categoryVideoMap[cat] || 'javascript';
  const subjectVideos = videos.filter((v) => v.category === videoCat).slice(0, 4);
  const subjectTests = tests.filter((t) =>
    t.topic?.toLowerCase().includes(course.title.split(' ')[0].toLowerCase()) || t.tags?.some((tag) => course.tags?.includes(tag)),
  ).slice(0, 3);

  return {
    slug: course.slug,
    title: course.title,
    overview: course.description,
    roadmap: [
      { step: 1, title: 'Fundamentals', desc: 'Core concepts and syntax', weeks: 1 },
      { step: 2, title: 'Hands-on Practice', desc: 'Build mini projects', weeks: 2 },
      { step: 3, title: 'Advanced Patterns', desc: 'Production-ready skills', weeks: 2 },
      { step: 4, title: 'Capstone', desc: 'Portfolio project', weeks: 1 },
    ],
    prerequisites: course.prerequisites?.length ? course.prerequisites : ['Willingness to learn consistently'],
    career: {
      roles: ['Software Engineer', 'Full Stack Developer', 'Technical Specialist'],
      salary: '$65k – $140k (varies by region & experience)',
      growth: 'High demand across startups and enterprise',
    },
    tools: course.tags || ['Industry-standard tooling'],
    projects: [
      'Build a portfolio-ready capstone',
      'Contribute to an open-source issue',
      'Document your learning in PENGU1N notes',
    ],
    estimatedCompletion: course.estimatedCompletion,
    videos: subjectVideos,
    tests: subjectTests.length ? subjectTests : tests.slice(0, 2),
    relatedSlugs: RELATED_MAP[course.slug] || courses.filter((c) => c.slug !== course.slug).slice(0, 3).map((c) => c.slug),
    notesTopic: course.slug.includes('html') ? 'html-intro' : course.slug.includes('js') ? 'js-intro' : 'js-intro',
    practicePath: '/practice',
  };
}

export function getSubjectDetail(slug) {
  const course = courses.find((c) => c.slug === slug);
  if (!course) return null;
  return { ...defaultDetail(course), course };
}

export function getAllSubjectSlugs() {
  return courses.map((c) => c.slug);
}
