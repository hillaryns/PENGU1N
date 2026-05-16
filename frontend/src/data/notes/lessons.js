/** Structured lesson content — original educational material */
export const lessonCatalog = [
  {
    category: 'HTML',
    topics: [
      { id: 'html-intro', label: 'Introduction to HTML', chapter: 1 },
      { id: 'html-elements', label: 'HTML Elements', chapter: 1 },
      { id: 'html-forms', label: 'HTML Forms', chapter: 2 },
      { id: 'html-semantic', label: 'Semantic HTML', chapter: 2 },
    ],
  },
  {
    category: 'CSS',
    topics: [
      { id: 'css-intro', label: 'CSS Basics', chapter: 1 },
      { id: 'css-flexbox', label: 'Flexbox Layout', chapter: 2 },
      { id: 'css-grid', label: 'CSS Grid', chapter: 2 },
      { id: 'css-animations', label: 'Animations & Transitions', chapter: 3 },
    ],
  },
  {
    category: 'JavaScript',
    topics: [
      { id: 'js-intro', label: 'JavaScript Fundamentals', chapter: 1 },
      { id: 'js-functions', label: 'Functions & Scope', chapter: 2 },
      { id: 'js-dom', label: 'DOM Manipulation', chapter: 3 },
      { id: 'js-async', label: 'Async JavaScript', chapter: 4 },
    ],
  },
  {
    category: 'Python',
    topics: [
      { id: 'py-intro', label: 'Python Basics', chapter: 1 },
      { id: 'py-data', label: 'Data Structures', chapter: 2 },
      { id: 'py-oop', label: 'OOP in Python', chapter: 3 },
    ],
  },
  {
    category: 'React',
    topics: [
      { id: 'react-intro', label: 'React Components', chapter: 1 },
      { id: 'react-hooks', label: 'Hooks Deep Dive', chapter: 2 },
    ],
  },
  {
    category: 'Node.js',
    topics: [
      { id: 'node-intro', label: 'Node.js Fundamentals', chapter: 1 },
      { id: 'node-express', label: 'Express APIs', chapter: 2 },
    ],
  },
  {
    category: 'SQL',
    topics: [
      { id: 'sql-intro', label: 'SQL Queries', chapter: 1 },
      { id: 'sql-joins', label: 'Joins & Relations', chapter: 2 },
    ],
  },
  {
    category: 'Linux',
    topics: [
      { id: 'linux-intro', label: 'Linux CLI Basics', chapter: 1 },
      { id: 'linux-perms', label: 'Permissions & Users', chapter: 2 },
    ],
  },
  {
    category: 'Git/GitHub',
    topics: [
      { id: 'git-intro', label: 'Git Essentials', chapter: 1 },
      { id: 'git-branch', label: 'Branching & Merging', chapter: 2 },
    ],
  },
  {
    category: 'AI/ML',
    topics: [
      { id: 'ml-intro', label: 'ML Fundamentals', chapter: 1 },
      { id: 'ml-neural', label: 'Neural Networks Intro', chapter: 2 },
    ],
  },
];

export const lessons = {
  'html-intro': {
    title: 'Introduction to HTML',
    category: 'HTML',
    sections: [
      {
        heading: 'What is HTML?',
        body: 'HTML (HyperText Markup Language) structures content on the web. Browsers parse HTML to build the DOM — the tree of elements users see and interact with.',
        tip: 'Think of HTML as the skeleton of a webpage; CSS adds style and JavaScript adds behavior.',
      },
      {
        heading: 'Document structure',
        body: 'Every HTML5 document should declare a doctype and wrap content in html, head, and body elements.',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
</head>
<body>
  <h1>Hello, PENGU1N!</h1>
</body>
</html>`,
        language: 'html',
      },
    ],
    exercise: 'Add a paragraph and a link below the heading.',
    playground: { html: '<h1>Hello</h1>\n<p>Learning HTML on PENGU1N</p>', css: 'body { font-family: sans-serif; color: #e0e7ff; background: #0B1E3F; }', js: '' },
    quiz: { question: 'Which tag wraps the visible page content?', options: ['<head>', '<body>', '<meta>', '<link>'], correct: 1 },
    mistake: 'Forgetting to close tags or nesting incorrectly breaks layout and accessibility.',
  },
  'js-intro': {
    title: 'JavaScript Fundamentals',
    category: 'JavaScript',
    sections: [
      {
        heading: 'Variables',
        body: 'Use const for values that won\'t be reassigned, let for block-scoped variables, and avoid var in modern code.',
        code: `const platform = 'PENGU1N';
let score = 0;
score += 10;
console.log(platform, score);`,
        language: 'javascript',
      },
      {
        heading: 'Functions',
        body: 'Functions encapsulate logic. Arrow functions are concise and inherit lexical this.',
        code: `const greet = (name) => \`Hello, \${name}!\`;
console.log(greet('Learner'));`,
        language: 'javascript',
      },
    ],
    exercise: 'Write a function that returns the sum of two numbers.',
    playground: { html: '<p id="out">Run the code</p>', css: '', js: "document.getElementById('out').textContent = 'Sum: ' + (5 + 7);" },
    quiz: { question: 'Which keyword declares a block-scoped variable?', options: ['var', 'let', 'function', 'static'], correct: 1 },
    mistake: 'Using == instead of === causes unexpected type coercion bugs.',
  },
  'react-intro': {
    title: 'React Components',
    category: 'React',
    sections: [
      {
        heading: 'Components',
        body: 'React apps are built from components — reusable functions that return JSX describing UI.',
        code: `function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}`,
        language: 'javascript',
      },
    ],
    exercise: 'Create a component that displays your favorite course.',
    playground: { html: '<div id="root">Try JS below</div>', css: '', js: "document.getElementById('root').innerHTML = '<strong>UI = f(state)</strong>';" },
    quiz: { question: 'JSX is:', options: ['A database', 'Syntax extension for UI', 'A CSS framework', 'A browser'], correct: 1 },
    mistake: 'Mutating state directly instead of using setState/useState updater.',
  },
};

import legacyNotes from '../notesData.raw.js';

export function getLesson(id) {
  if (lessons[id]) return lessons[id];
  if (legacyNotes[id]) {
    return {
      title: id.replace(/-/g, ' '),
      category: 'Reference',
      legacyHtml: legacyNotes[id],
    };
  }
  return {
    title: id.replace(/-/g, ' '),
    category: 'General',
    sections: [{ heading: 'Content', body: 'Select a topic from the sidebar. More lessons are being added continuously.' }],
    playground: { html: '<p>Edit me!</p>', css: 'p { color: #3FA9FF; }', js: '' },
  };
}

export function getFlatTopics() {
  return lessonCatalog.flatMap((c) =>
    c.topics.map((t) => ({ ...t, category: c.category })),
  );
}

export function getAdjacentTopics(currentId) {
  const flat = getFlatTopics();
  const idx = flat.findIndex((t) => t.id === currentId);
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}
