import { tests } from '../tests';
import {
  aiPool,
  cssPool,
  dsaPool,
  generalPool,
  gitPool,
  htmlPool,
  jsPool,
  linuxPool,
  nodePool,
  pythonPool,
  reactPool,
  securityPool,
} from './pools';

const TEST_POOL_MAP = {
  'html-basics': htmlPool,
  'css-basics': cssPool,
  'js-basics': jsPool,
  'react-hooks': reactPool,
  'node-api': nodePool,
  'typescript-types': jsPool,
  'ml-basics': aiPool,
  'security-owasp': securityPool,
  'linux-shell': linuxPool,
  'dsa-trees': dsaPool,
  'mongo-queries': generalPool,
  'devops-docker': generalPool,
  'cloud-aws': generalPool,
  'git-workflow': gitPool,
  'ux-heuristics': generalPool,
  'api-rest': nodePool,
  'python-advanced': pythonPool,
  'cp-timed': dsaPool,
  'fullstack': generalPool,
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getQuestionsForTest(testId) {
  const meta = tests.find((t) => t.id === testId);
  const pool = TEST_POOL_MAP[testId] || generalPool;
  const count = Math.min(meta?.questions || 10, pool.length);
  const selected = shuffle(pool).slice(0, count);
  return selected.map((q, i) => ({ ...q, id: `${testId}-q${i}` }));
}

export function getTestById(testId) {
  return tests.find((t) => t.id === testId);
}
