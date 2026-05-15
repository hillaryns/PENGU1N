// Notes content data
window.notesData = {
  "html-intro": `
    <h2 class="note-title">Introduction to HTML</h2>
    <div class="note-section">
      <h3>What is HTML?</h3>
      <p>HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using a series of elements.</p>
    </div>
    <div class="note-section">
      <h3>Basic Structure</h3>
      <div class="code-block">
        <button class="copy-btn"><i class="fas fa-copy"></i> Copy</button>
        <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;Page Title&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Hello World&lt;/h1&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>
      </div>
    </div>
  `,
  "html-elements": `
    <h2 class="note-title">HTML Elements</h2>
    <div class="note-section">
      <h3>What are HTML Elements?</h3>
      <p>An HTML element is defined by a start tag, some content, and an end tag. Elements can be nested inside other elements.</p>
    </div>
    <div class="note-section">
      <h3>Block vs Inline Elements</h3>
      <p><strong>Block elements</strong> start on a new line: &lt;div&gt;, &lt;p&gt;, &lt;h1&gt;-&lt;h6&gt;, &lt;ul&gt;, &lt;ol&gt;</p>
      <p><strong>Inline elements</strong> don't start new lines: &lt;span&gt;, &lt;a&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;img&gt;</p>
    </div>
    <div class="note-section">
      <h3>Semantic Elements</h3>
      <div class="code-block">
        <button class="copy-btn"><i class="fas fa-copy"></i> Copy</button>
        <pre><code>&lt;header&gt;Site header&lt;/header&gt;
&lt;nav&gt;Navigation links&lt;/nav&gt;
&lt;main&gt;Main content&lt;/main&gt;
&lt;article&gt;Independent content&lt;/article&gt;
&lt;section&gt;Grouped content&lt;/section&gt;
&lt;aside&gt;Sidebar content&lt;/aside&gt;
&lt;footer&gt;Site footer&lt;/footer&gt;</code></pre>
      </div>
    </div>
  `,
  "html-forms": `
    <h2 class="note-title">HTML Forms</h2>
    <div class="note-section">
      <h3>Creating Forms</h3>
      <p>Forms are used to collect user input and send it to a server for processing.</p>
    </div>
    <div class="note-section">
      <h3>Form Elements</h3>
      <div class="code-block">
        <button class="copy-btn"><i class="fas fa-copy"></i> Copy</button>
        <pre><code>&lt;form action="/submit" method="POST"&gt;
  &lt;label for="name"&gt;Name:&lt;/label&gt;
  &lt;input type="text" id="name" name="name" required&gt;
  
  &lt;label for="email"&gt;Email:&lt;/label&gt;
  &lt;input type="email" id="email" name="email"&gt;
  
  &lt;label for="message"&gt;Message:&lt;/label&gt;
  &lt;textarea id="message" name="message"&gt;&lt;/textarea&gt;
  
  &lt;button type="submit"&gt;Submit&lt;/button&gt;
&lt;/form&gt;</code></pre>
      </div>
    </div>
  `,
  "css-intro": `
    <h2 class="note-title">CSS Basics</h2>
    <div class="note-section">
      <h3>What is CSS?</h3>
      <p>CSS (Cascading Style Sheets) is used to style and layout web pages. It controls colors, fonts, spacing, and positioning.</p>
    </div>
    <div class="note-section">
      <h3>CSS Syntax</h3>
      <div class="code-block">
        <button class="copy-btn"><i class="fas fa-copy"></i> Copy</button>
        <pre><code>selector {
  property: value;
}

/* Example */
h1 {
  color: blue;
  font-size: 24px;
  margin-bottom: 16px;
}</code></pre>
      </div>
    </div>
    <div class="note-section">
      <h3>Selectors</h3>
      <div class="code-block">
        <button class="copy-btn"><i class="fas fa-copy"></i> Copy</button>
        <pre><code>/* Element selector */
p { color: gray; }

/* Class selector */
.highlight { background: yellow; }

/* ID selector */
#header { height: 80px; }

/* Descendant selector */
nav a { text-decoration: none; }</code></pre>
      </div>
    </div>
  `,
  "css-flexbox": `
    <h2 class="note-title">Flexbox Layout</h2>
    <div class="note-section">
      <h3>What is Flexbox?</h3>
      <p>Flexbox is a one-dimensional layout method for arranging items in rows or columns. It makes it easy to align and distribute space among items.</p>
    </div>
    <div class="note-section">
      <h3>Flex Container Properties</h3>
      <div class="code-block">
        <button class="copy-btn"><i class="fas fa-copy"></i> Copy</button>
        <pre><code>.container {
  display: flex;
  flex-direction: row; /* row, column, row-reverse, column-reverse */
  justify-content: center; /* flex-start, flex-end, space-between, space-around */
  align-items: center; /* flex-start, flex-end, stretch, baseline */
  gap: 16px;
  flex-wrap: wrap;
}</code></pre>
      </div>
    </div>
    <div class="note-section">
      <h3>Flex Item Properties</h3>
      <div class="code-block">
        <button class="copy-btn"><i class="fas fa-copy"></i> Copy</button>
        <pre><code>.item {
  flex-grow: 1; /* How much item should grow */
  flex-shrink: 0; /* How much item should shrink */
  flex-basis: 200px; /* Initial size */
  /* Shorthand: flex: 1 0 200px; */
}</code></pre>
      </div>
    </div>
  `,
  "css-grid": `
    <h2 class="note-title">CSS Grid</h2>
    <div class="note-section">
      <h3>What is CSS Grid?</h3>
      <p>CSS Grid is a two-dimensional layout system. It lets you work with rows and columns simultaneously to create complex layouts.</p>
    </div>
    <div class="note-section">
      <h3>Grid Container</h3>
      <div class="code-block">
        <button class="copy-btn"><i class="fas fa-copy"></i> Copy</button>
        <pre><code>.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
  
  /* Or define explicit columns */
  grid-template-columns: 200px 1fr 200px;
}</code></pre>
      </div>
    </div>
  `,
  "js-intro": `
    <h2 class="note-title">JavaScript Fundamentals</h2>
    <div class="note-section">
      <h3>What is JavaScript?</h3>
      <p>JavaScript is a programming language that adds interactivity to websites. It can update content, validate forms, create animations, and much more.</p>
    </div>
    <div class="note-section">
      <h3>Variables</h3>
      <div class="code-block">
        <button class="copy-btn"><i class="fas fa-copy"></i> Copy</button>
        <pre><code>// Modern variable declarations
let name = "John";        // Can be reassigned
const age = 25;           // Cannot be reassigned
var oldWay = "avoid";     // Old way, use let/const instead

// Data types
let string = "Hello";
let number = 42;
let boolean = true;
let array = [1, 2, 3];
let object = { key: "value" };
let nothing = null;
let notDefined = undefined;</code></pre>
      </div>
    </div>
  `,
  "js-functions": `
    <h2 class="note-title">JavaScript Functions</h2>
    <div class="note-section">
      <h3>Function Declaration</h3>
      <div class="code-block">
        <button class="copy-btn"><i class="fas fa-copy"></i> Copy</button>
        <pre><code>// Function declaration
function greet(name) {
  return "Hello, " + name + "!";
}

// Function expression
const greet = function(name) {
  return "Hello, " + name + "!";
};

// Arrow function
const greet = (name) => "Hello, " + name + "!";

// Arrow function with body
const greet = (name) => {
  const message = "Hello, " + name + "!";
  return message;
};</code></pre>
      </div>
    </div>
  `,
  "js-dom": `
    <h2 class="note-title">DOM Manipulation</h2>
    <div class="note-section">
      <h3>What is the DOM?</h3>
      <p>The Document Object Model (DOM) is a programming interface for web documents. It represents the page so programs can change the document structure, style, and content.</p>
    </div>
    <div class="note-section">
      <h3>Selecting Elements</h3>
      <div class="code-block">
        <button class="copy-btn"><i class="fas fa-copy"></i> Copy</button>
        <pre><code>// Select single element
const element = document.getElementById("myId");
const element = document.querySelector(".myClass");

// Select multiple elements
const elements = document.querySelectorAll("p");
const elements = document.getElementsByClassName("myClass");

// Modifying elements
element.textContent = "New text";
element.innerHTML = "&lt;strong&gt;Bold text&lt;/strong&gt;";
element.style.color = "blue";
element.classList.add("active");</code></pre>
      </div>
    </div>
    <div class="note-section">
      <h3>Event Handling</h3>
      <div class="code-block">
        <button class="copy-btn"><i class="fas fa-copy"></i> Copy</button>
        <pre><code>const button = document.querySelector("button");

button.addEventListener("click", function(event) {
  console.log("Button clicked!");
  event.preventDefault(); // Prevent default behavior
});

// Arrow function version
button.addEventListener("click", (e) => {
  console.log("Clicked!");
});</code></pre>
      </div>
    </div>
  `,
}
