/** Shared MCQ pools — each question: { id, question, options, correctIndex, explanation } */

const mk = (id, question, options, correctIndex, explanation) => ({
  id,
  question,
  options,
  correctIndex,
  explanation,
});

export const htmlPool = [
  mk('h1', 'What does HTML stand for?', ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink Text Model Language'], 0, 'HTML is the standard markup language for documents designed to be displayed in a web browser.'),
  mk('h2', 'Which tag defines the largest heading?', ['<h6>', '<heading>', '<h1>', '<head>'], 2, '<h1> is the top-level heading; headings go from h1 (largest) to h6 (smallest).'),
  mk('h3', 'Which attribute provides alternative text for images?', ['src', 'alt', 'title', 'href'], 1, 'The alt attribute improves accessibility and displays when images fail to load.'),
  mk('h4', 'Which element is semantic for navigation links?', ['<motion.div>', '<nav>', '<navigation>', '<menu>'], 1, '<nav> represents a section of navigation links.'),
  mk('h5', 'What is the correct doctype for HTML5?', ['<!DOCTYPE HTML5>', '<!DOCTYPE html>', '<!HTML5>', '<DOCTYPE html>'], 1, 'HTML5 uses the short doctype: <!DOCTYPE html>.'),
  mk('h6', 'Which input type creates a checkbox?', ['text', 'checkbox', 'check', 'radio'], 1, 'type="checkbox" allows multiple selections; radio allows one per group.'),
  mk('h7', 'Which tag creates a hyperlink?', ['<link>', '<a>', '<href>', '<url>'], 1, 'Anchor tags <a> with href create hyperlinks.'),
  mk('h8', 'Block elements typically:', ['Flow inline with text', 'Start on a new line', 'Cannot contain children', 'Are only for forms'], 1, 'Block elements like <p> and <div> occupy the full width available and start on a new line.'),
  mk('h9', 'The <meta charset="UTF-8"> tag belongs in:', ['<body>', '<footer>', '<head>', '<main>'], 2, 'Metadata including charset belongs in the document head.'),
  mk('h10', 'Which list type shows numbers?', ['<ul>', '<ol>', '<dl>', '<list>'], 1, 'Ordered lists <ol> display numbered items; unordered lists use <ul>.'),
  mk('h11', 'To embed a video in HTML5 you commonly use:', ['<video>', '<movie>', '<media>', '<clip>'], 0, 'The <video> element embeds video with optional controls attribute.'),
  mk('h12', 'The required attribute on an input:', ['Makes the field read-only', 'Forces validation before submit', 'Hides the field', 'Adds a placeholder'], 1, 'required triggers browser validation so the field must be filled.'),
];

export const cssPool = [
  mk('c1', 'Which property changes text color?', ['font-color', 'text-color', 'color', 'foreground'], 2, 'color sets the foreground/text color of an element.'),
  mk('c2', 'Flexbox is enabled with:', ['display: flex', 'flex: on', 'layout: flexbox', 'position: flex'], 0, 'display: flex creates a flex formatting context on the container.'),
  mk('c3', 'Which unit is relative to the root font size?', ['em', 'px', 'rem', '%'], 2, 'rem is relative to the root element (html) font size.'),
  mk('c4', 'CSS Grid is activated with:', ['display: grid', 'grid: true', 'layout: grid', 'display: table'], 0, 'display: grid enables two-dimensional grid layouts.'),
  mk('c5', 'Specificity: which wins?', ['Element selector', 'Class selector', 'Universal selector', 'Inherited styles only'], 1, 'Class selectors beat element selectors; IDs beat classes.'),
  mk('c6', 'box-sizing: border-box means:', ['Padding is ignored', 'Width includes padding and border', 'Borders are removed', 'Margin is inside the box'], 1, 'border-box makes width/height include padding and border.'),
  mk('c7', 'Which pseudo-class styles a visited link?', [':hover', ':active', ':visited', ':focus'], 2, ':visited applies styles to links the user has visited.'),
  mk('c8', 'z-index affects:', ['Font size', 'Stacking order', 'Opacity only', 'Grid columns'], 1, 'z-index controls stacking of positioned elements on the z-axis.'),
  mk('c9', 'Media queries are used for:', ['Database queries', 'Responsive design', 'SQL styling', 'Animation only'], 1, '@media rules apply styles based on viewport/device characteristics.'),
  mk('c10', 'justify-content in flexbox aligns items along:', ['Cross axis', 'Main axis', 'Z axis', 'Grid row'], 1, 'justify-content aligns flex items along the main axis.'),
];

export const jsPool = [
  mk('j1', 'Which keyword declares a block-scoped variable?', ['var', 'let', 'function', 'define'], 1, 'let and const are block-scoped; var is function-scoped.'),
  mk('j2', 'typeof null in JavaScript returns:', ['"null"', '"object"', '"undefined"', '"boolean"'], 1, 'This is a long-standing quirk — typeof null is "object".'),
  mk('j3', 'Array.map() returns:', ['The same array mutated', 'A new array', 'undefined', 'A boolean'], 1, 'map creates a new array with transformed elements.'),
  mk('j4', '=== checks:', ['Value only', 'Value and type', 'Reference only', 'Truthy values'], 1, 'Strict equality compares both value and type without coercion.'),
  mk('j5', 'Promises handle:', ['Synchronous loops', 'Asynchronous operations', 'DOM only', 'CSS animations'], 1, 'Promises represent eventual completion/failure of async work.'),
  mk('j6', 'An arrow function:', ['Has its own this binding', 'Inherits this lexically', 'Cannot return values', 'Must be async'], 1, 'Arrow functions capture this from the enclosing scope.'),
  mk('j7', 'JSON.parse() converts:', ['Object to string', 'String to object', 'Array to Set', 'Number to string'], 1, 'JSON.parse deserializes a JSON string into a JavaScript value.'),
  mk('j8', 'Event delegation uses:', ['Multiple listeners per element', 'Bubbling on a parent', 'Only capture phase', 'No events'], 1, 'Listen on a parent and use event.target to handle child events.'),
  mk('j9', 'const arrays:', ['Cannot be modified ever', 'Cannot be reassigned; contents can change', 'Are hoisted like var', 'Are always frozen'], 1, 'const prevents rebinding the variable, not mutating the array.'),
  mk('j10', 'async/await is built on:', ['Callbacks only', 'Promises', 'Web Workers', 'Generators only'], 1, 'async functions return promises; await pauses until a promise settles.'),
  mk('j11', 'Spread operator (...) can:', ['Only spread arrays', 'Clone/spread iterables and objects', 'Delete properties', 'Create classes'], 1, 'Spread copies elements from iterables or properties from objects.'),
  mk('j12', 'Closure means a function:', ['Has no parameters', 'Remembers its lexical environment', 'Runs only once', 'Must be arrow'], 1, 'Closures retain access to variables from their outer scope.'),
];

export const reactPool = [
  mk('r1', 'React components must return:', ['A string only', 'JSX or null', 'Always a class', 'HTML file'], 1, 'Components return JSX describing UI, or null for nothing.'),
  mk('r2', 'useState returns:', ['Only the state value', '[value, setter]', 'A promise', 'The DOM node'], 1, 'useState returns the current state and a function to update it.'),
  mk('r3', 'useEffect runs after:', ['Every variable change always', 'Paint/render (by default)', 'Before render only', 'Server start'], 1, 'Effects run after render; cleanup runs before re-run or unmount.'),
  mk('r4', 'Keys in lists help React:', ['Style elements', 'Identify stable items for reconciliation', 'Encrypt data', 'Load images'], 1, 'Keys should be stable, unique among siblings.'),
  mk('r5', 'Props are:', ['Mutable by child', 'Read-only inputs to components', 'Global variables', 'CSS classes'], 1, 'Props flow down; components should not mutate props.'),
  mk('r6', 'Virtual DOM helps:', ['Replace the browser DOM entirely', 'Minimize expensive DOM updates', 'Run SQL queries', 'Compile TypeScript'], 1, 'React diffs virtual trees then batches real DOM updates.'),
  mk('r7', 'Lifting state up means:', ['Using Redux always', 'Sharing state in closest common ancestor', 'Deleting state', 'Using refs only'], 1, 'Sibling components share state via a parent.'),
  mk('r8', 'React.Fragment lets you:', ['Group without extra DOM node', 'Create portals', 'Fetch data', 'Add CSS'], 0, 'Fragments avoid unnecessary wrapper divs.'),
  mk('r9', 'Controlled inputs bind value to:', ['localStorage', 'React state', 'window object', 'CSS'], 1, 'Value + onChange sync input with React state.'),
  mk('r10', 'useMemo caches:', ['DOM nodes', 'Computed values between renders', 'Event handlers only', 'Routes'], 1, 'useMemo memoizes expensive calculations when deps unchanged.'),
];

export const pythonPool = [
  mk('p1', 'Python lists are:', ['Immutable', 'Mutable ordered sequences', 'Key-value only', 'Compiled only'], 1, 'Lists are mutable; tuples are immutable sequences.'),
  mk('p2', 'Which defines a function?', ['func name():', 'def name():', 'function name():', 'fn name():'], 1, 'Functions are defined with the def keyword.'),
  mk('p3', 'List comprehension syntax:', ['[x for x in range(5)]', '{x: for x}', '(x if x)', 'for x in []'], 0, 'Comprehensions build lists concisely from iterables.'),
  mk('p4', 'None in Python is like:', ['0', 'False only', 'A null singleton', 'Empty string'], 2, 'None is a singleton representing absence of value.'),
  mk('p5', 'Dictionary keys must be:', ['Only strings', 'Hashable', 'Always integers', 'Lists'], 1, 'Keys must be hashable — immutable types like str, int, tuple.'),
  mk('p6', 'with open() is used for:', ['Context-managed file handling', 'Opening browsers', 'While loops', 'Networking only'], 0, 'Context managers ensure files close properly.'),
  mk('p7', 'lambda creates:', ['A class', 'An anonymous function', 'A module', 'A package'], 1, 'lambda defines small inline functions.'),
  mk('p8', 'pip is used to:', ['Run Python files', 'Install packages', 'Format code', 'Debug only'], 1, 'pip installs packages from PyPI.'),
  mk('p9', '__init__ in a class is:', ['Destructor', 'Constructor initializer', 'Static method', 'Import hook'], 1, '__init__ initializes new instances.'),
  mk('p10', 'f-strings use syntax like:', ['f"{name}"', 'format(name)', '%s', '${name}'], 0, 'f"..." embeds expressions inside braces.'),
];

export const gitPool = [
  mk('g1', 'git commit saves:', ['Remote changes only', 'A snapshot to local history', 'Only unstaged files', 'Branches to cloud'], 1, 'Commits record snapshots in local repository history.'),
  mk('g2', 'git pull is equivalent to:', ['push + merge', 'fetch + merge', 'clone', 'reset --hard'], 1, 'pull fetches remote changes then merges into current branch.'),
  mk('g3', 'A branch in Git is:', ['A separate folder only', 'A movable pointer to commits', 'A backup zip', 'A tag'], 1, 'Branches are lightweight pointers to commit chains.'),
  mk('g4', 'git merge combines:', ['Two commit histories', 'Only remote repos', 'Issues on GitHub', 'SSH keys'], 0, 'Merge integrates changes from another branch.'),
  mk('g5', 'Staging area is used to:', ['Delete commits', 'Prepare commits selectively', 'Run tests', 'Deploy'], 1, 'git add moves changes to the staging area before commit.'),
  mk('g6', '.gitignore tells Git to:', ['Ignore the repo', 'Skip tracking certain files', 'Encrypt files', 'Auto-merge'], 1, 'Patterns in .gitignore exclude files from tracking.'),
  mk('g7', 'git clone:', ['Updates existing repo', 'Copies a remote repository', 'Deletes branches', 'Creates PR'], 1, 'clone downloads a full copy including history.'),
  mk('g8', 'Rebase rewrites:', ['Commit history onto a new base', 'Only README', 'Remote URL', 'License'], 0, 'Rebase replays commits on top of another branch tip.'),
  mk('g9', 'Pull Request on GitHub is for:', ['Requesting code review/merge', 'Pulling only', 'Cloning private repos', 'Deleting issues'], 0, 'PRs propose merging changes after review.'),
  mk('g10', 'git status shows:', ['Only errors', 'Working tree and staging state', 'User passwords', 'npm packages'], 1, 'status displays modified, staged, and untracked files.'),
];

export const linuxPool = [
  mk('l1', 'chmod changes:', ['File owner', 'File permissions', 'File name', 'Directory path'], 1, 'chmod modifies read/write/execute bits.'),
  mk('l2', 'grep is used to:', ['Copy files', 'Search text patterns', 'Mount drives', 'Edit users'], 1, 'grep searches for patterns in text streams.'),
  mk('l3', 'sudo runs commands as:', ['Guest', 'Superuser/root', 'Network only', 'Cron'], 1, 'sudo elevates privileges temporarily.'),
  mk('l4', 'ls -la shows:', ['Hidden files and details', 'Only directories', 'Disk usage', 'Processes'], 0, '-a includes hidden; -l long format.'),
  mk('l5', 'Pipe | passes:', ['Files between folders', 'Output of one command as input to another', 'Environment variables', 'SSH keys'], 1, 'Piping connects stdout to stdin between commands.'),
  mk('l6', 'systemd is primarily:', ['A text editor', 'An init/service manager', 'A shell', 'A package'], 1, 'systemd manages services and boot on many Linux distros.'),
  mk('l7', 'ssh connects:', ['Only locally', 'Securely to remote hosts', 'To databases only', 'Without encryption'], 1, 'SSH provides encrypted remote shell access.'),
  mk('l8', 'df shows:', ['File contents', 'Disk space usage', 'CPU load', 'User list'], 1, 'df reports filesystem disk space.'),
  mk('l9', 'kill sends:', ['Emails', 'Signals to processes', 'Files to trash', 'DNS queries'], 1, 'kill sends signals like SIGTERM to PIDs.'),
  mk('l10', '/etc/passwd stores:', ['Password hashes only in plain text', 'User account info', 'Kernel modules', 'Logs'], 1, 'passwd lists users; shadow often holds password hashes.'),
];

export const nodePool = [
  mk('n1', 'Node.js runs JavaScript on:', ['Browser only', 'Server/runtime outside browser', 'Mobile GPU', 'SQL Server'], 1, 'Node uses V8 to run JS on the server.'),
  mk('n2', 'require() in CommonJS:', ['Exports modules', 'Imports modules', 'Deletes files', 'Creates servers'], 1, 'require loads CommonJS modules.'),
  mk('n3', 'Express is:', ['A database', 'A web framework for Node', 'A browser', 'A bundler'], 1, 'Express simplifies routing and middleware for HTTP servers.'),
  mk('n4', 'Middleware in Express:', ['Runs before route handlers in chain', 'Only serves static files', 'Replaces JSON', 'Is optional only'], 0, 'Middleware functions have access to req, res, next.'),
  mk('n5', 'npm init creates:', ['A server', 'package.json', 'node_modules only', 'Docker image'], 1, 'npm init scaffolds a new package.json.'),
  mk('n6', 'process.env holds:', ['DOM nodes', 'Environment variables', 'CSS files', 'Routes'], 1, 'Access env vars like PORT and API keys safely.'),
  mk('n7', 'REST APIs often use HTTP methods:', ['GET POST PUT DELETE', 'ONLY GET', 'FTP only', 'SMTP'], 0, 'CRUD maps to standard HTTP verbs.'),
  mk('n8', 'JSON in Node is handled with:', ['JSON.parse / JSON.stringify', 'XML only', 'YAML built-in', 'CSV parser only'], 0, 'Native JSON methods serialize and parse data.'),
  mk('n9', 'async route handlers should:', ['Block the event loop', 'Use try/catch or error middleware', 'Avoid promises', 'Use sync only'], 1, 'Forward errors with next(err) or try/catch.'),
  mk('n10', 'CORS headers allow:', ['Cross-origin browser requests', 'SQL injection', 'File deletion', 'SSH'], 0, 'Servers set Access-Control-Allow-Origin for browsers.'),
];

export const securityPool = [
  mk('s1', 'SQL injection is prevented by:', ['String concat in queries', 'Parameterized queries', 'Hiding errors only', 'Using GET only'], 1, 'Prepared statements separate code from data.'),
  mk('s2', 'XSS means:', ['Cross-Site Scripting', 'Extra SQL Syntax', 'XML Transfer', 'Encrypted SSH'], 0, 'XSS injects malicious scripts into pages viewed by others.'),
  mk('s3', 'HTTPS provides:', ['Faster DNS', 'Encryption in transit', 'Free hosting', 'No certificates'], 1, 'TLS encrypts HTTP traffic between client and server.'),
  mk('s4', 'OWASP Top 10 lists:', ['Popular frameworks', 'Common security risks', 'CSS tricks', 'Git commands'], 1, 'OWASP documents critical web application risks.'),
  mk('s5', 'Strong passwords should be:', ['Short and reused', 'Long, unique, and random', 'Written on sticky notes', 'shared'], 1, 'Use password managers and unique credentials.'),
  mk('s6', 'CSRF attacks trick users into:', ['Reading emails', 'Unwanted authenticated actions', 'Installing Linux', 'Compiling code'], 1, 'CSRF exploits the user\'s existing session.'),
  mk('s7', '2FA adds:', ['A second verification factor', 'Two databases', 'Duplicate passwords', 'Extra ads'], 0, 'Something you know + something you have.'),
  mk('s8', 'Hashing passwords should use:', ['MD5 alone', 'bcrypt/Argon2 with salt', 'Base64 only', 'Reversible encryption'], 1, 'Adaptive hashing resists brute force.'),
  mk('s9', 'Principle of least privilege means:', ['Give admin to everyone', 'Minimum access needed', 'Disable all logs', 'Open all ports'], 1, 'Limit accounts and permissions to what\'s required.'),
  mk('s10', 'Security headers like CSP help:', ['Style pages', 'Mitigate XSS and injection', 'Speed up GPU', 'Replace HTTPS'], 1, 'Content-Security-Policy restricts resource loading.'),
];

export const aiPool = [
  mk('a1', 'Supervised learning uses:', ['Unlabeled data only', 'Labeled input-output pairs', 'No training', 'Random weights only'], 1, 'Models learn from labeled examples.'),
  mk('a2', 'Overfitting means:', ['Model generalizes well', 'Model memorizes training data', 'Training is too short', 'Data is too big'], 1, 'High train accuracy but poor test performance.'),
  mk('a3', 'A neural network layer transforms:', ['Only images to text', 'Inputs via weights and activation', 'SQL queries', 'HTML'], 1, 'Layers apply linear transforms + nonlinear activations.'),
  mk('a4', 'Gradient descent:', ['Increases loss', 'Minimizes loss iteratively', 'Deletes datasets', 'Runs without data'], 1, 'Updates weights in direction that reduces loss.'),
  mk('a5', 'Train/validation/test split helps:', ['Evaluate generalization', 'Remove features', 'Encrypt models', 'Skip tuning'], 0, 'Holdout sets estimate real-world performance.'),
  mk('a6', 'Classification predicts:', ['Continuous values', 'Discrete categories', 'Only time series', 'File paths'], 1, 'Regression predicts continuous outputs.'),
  mk('a7', 'Embeddings represent:', ['Only colors', 'Dense vector representations', 'HTTP headers', 'CPU pins'], 1, 'Embeddings capture semantic similarity in vector space.'),
  mk('a8', 'Regularization like L2:', ['Increases overfitting', 'Penalizes large weights', 'Removes labels', 'Stops GPUs'], 1, 'Weight decay encourages simpler models.'),
  mk('a9', 'Batch size affects:', ['Only UI', 'Memory and gradient noise', 'DNS', 'Git history'], 1, 'Larger batches are smoother but need more memory.'),
  mk('a10', 'Precision measures:', ['True positives / predicted positives', 'All accuracy', 'Loss only', 'Recall only'], 0, 'Precision = TP / (TP + FP).'),
];

export const dsaPool = [
  mk('d1', 'Big-O describes:', ['Exact runtime in seconds', 'Growth rate of complexity', 'Memory brand', 'CPU model'], 1, 'Asymptotic complexity ignores constants.'),
  mk('d2', 'Binary search requires:', ['Unsorted array', 'Sorted array', 'Linked list only', 'Hash table'], 1, 'Halving the search space needs sorted order.'),
  mk('d3', 'Stack is:', ['FIFO', 'LIFO', 'Random access', 'Sorted map'], 1, 'Last In, First Out — push/pop at top.'),
  mk('d4', 'Queue is:', ['FIFO', 'LIFO', 'Tree', 'Graph only'], 0, 'First In, First Out — enqueue rear, dequeue front.'),
  mk('d5', 'Hash table average lookup:', ['O(n)', 'O(1)', 'O(log n)', 'O(n!)'], 1, 'Good hash functions give O(1) average case.'),
  mk('d6', 'Merge sort complexity:', ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], 1, 'Divide and conquer merge sort is O(n log n).'),
  mk('d7', 'BFS uses:', ['Stack', 'Queue', 'Heap only', 'Set only'], 1, 'Breadth-first search explores level by level with a queue.'),
  mk('d8', 'DFS uses:', ['Queue', 'Stack/recursion', 'Sorting', 'Hash only'], 1, 'Depth-first goes deep before backtracking.'),
  mk('d9', 'Dynamic programming avoids:', ['Memoization', 'Redundant subproblems', 'All recursion', 'Graphs'], 1, 'DP stores results of overlapping subproblems.'),
  mk('d10', 'A binary tree node has at most:', ['One child', 'Two children', 'Three children', 'Zero children always'], 1, 'Binary trees have left and right child pointers.'),
];

export const generalPool = [
  mk('x1', 'API stands for:', ['Application Programming Interface', 'Automated Program Input', 'Applied Protocol Internet', 'Array Pointer Index'], 0, 'APIs define how software components communicate.'),
  mk('x2', 'DevOps focuses on:', ['Only development', 'Collaboration between dev and operations', 'Hardware sales', 'Graphic design'], 1, 'DevOps integrates development, deployment, and monitoring.'),
  mk('x3', 'Docker containers:', ['Replace the kernel', 'Package apps with dependencies', 'Are physical servers', 'Only run Windows'], 1, 'Containers share the host kernel but isolate processes.'),
  mk('x4', 'Cloud computing offers:', ['On-demand scalable resources', 'Only local storage', 'No networking', 'Manual-only scaling'], 0, 'Cloud provides elastic compute, storage, and services.'),
  mk('x5', 'MongoDB is a:', ['Relational SQL DB', 'Document NoSQL database', 'Spreadsheet', 'Compiler'], 1, 'MongoDB stores BSON documents in collections.'),
  mk('x6', 'TypeScript adds:', ['Runtime speed only', 'Static types to JavaScript', 'CSS modules', 'HTML tags'], 1, 'TypeScript compiles to JavaScript with type checking.'),
  mk('x7', 'CI/CD automates:', ['Only coding', 'Build, test, and deployment pipelines', 'Coffee delivery', 'Manual FTP only'], 1, 'Continuous integration and delivery reduce release risk.'),
  mk('x8', 'UI/UX design concerns:', ['Only backend SQL', 'User interface and experience', 'Kernel drivers', 'Packet routing'], 1, 'UX covers usability; UI covers visual interaction.'),
  mk('x9', 'Version control helps teams:', ['Delete all history', 'Track changes and collaborate', 'Avoid backups', 'Disable branches'], 1, 'VCS like Git manages code history and merges.'),
  mk('x10', 'Learning platforms like PENGU1N aim to:', ['Replace all schools overnight', 'Combine learning, practice, and assessment', 'Only sell hardware', 'Remove the internet'], 1, 'Ed-tech blends content, interactivity, and progress tracking.'),
];
