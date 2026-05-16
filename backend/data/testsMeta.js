/** Test id → topic for Subject Master badge checks */
const TESTS = [
  { id: 'react-hooks', topic: 'React' },
  { id: 'node-api', topic: 'Node.js' },
  { id: 'typescript-types', topic: 'TypeScript' },
  { id: 'ml-basics', topic: 'AI/ML' },
  { id: 'security-owasp', topic: 'Cybersecurity' },
  { id: 'linux-shell', topic: 'Linux' },
  { id: 'dsa-trees', topic: 'DSA' },
  { id: 'mongo-queries', topic: 'MongoDB' },
  { id: 'devops-docker', topic: 'DevOps' },
  { id: 'cloud-aws', topic: 'Cloud Computing' },
  { id: 'git-workflow', topic: 'Git/GitHub' },
  { id: 'ux-heuristics', topic: 'UI/UX' },
  { id: 'api-rest', topic: 'APIs' },
  { id: 'python-advanced', topic: 'Python Advanced' },
  { id: 'cp-timed', topic: 'Competitive Programming' },
  { id: 'html-basics', topic: 'HTML' },
  { id: 'css-basics', topic: 'CSS' },
  { id: 'js-basics', topic: 'JavaScript' },
  { id: 'fullstack', topic: 'Full Stack' },
];

const testsByTopic = TESTS.reduce((acc, t) => {
  if (!acc[t.topic]) acc[t.topic] = [];
  acc[t.topic].push(t.id);
  return acc;
}, {});

module.exports = { TESTS, testsByTopic };
