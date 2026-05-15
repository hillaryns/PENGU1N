LEARNING HUB is an interactive learning platform designed for students to learn, practice, and track progress in programming and technical subjects.
The project focuses on clean UI, smooth animations, and real-world frontend logic using HTML, CSS, and JavaScript — no frameworks.

🚀 Features

🔐 Authentication System

Sign Up & Sign In using JavaScript + LocalStorage

Persistent login state across sessions

🎨 Modern UI & Animations

Animated hero text with hover and proximity effects

Starfield & shooting-star background effects

Custom black hole page transition

SVG penguin runner animation during navigation & login

📊 Dashboard

User statistics (Notes Read, Questions Solved, Tests Taken, Badges)

Quick access cards

Responsive grid-based layout

📚 Learning Structure

Subjects → Notes → Practice → Tests

Structured notes layout

Practice questions & progress tracking

📱 Responsive Design

Fully responsive across desktop and mobile

Custom mobile navigation menu

🧠 Technologies Used

HTML5 – Structure & semantic layout

CSS3 – Styling, animations, transitions, responsive design

JavaScript (Vanilla) –

Authentication logic

Page transitions

Animations & interactions

LocalStorage-based state management

No external frameworks or libraries were used for core logic.

🐧 Special Animations

SVG Penguin Runner

Custom SVG animated using CSS keyframes

Runs during page transitions and authentication flow

Black Hole Transition

CSS radial gradients + rotation animation

Triggered via JavaScript before navigation

Interactive Hover Effects





PROJECT STRUCTURE 

PENGU1N/
│
├── index.html
├── about.html
├── signin.html
├── signup.html
├── dashboard.html
├── subjects.html
│
├── css/
│   └── style.css
│
├── js/
│   └── main.js
│
├── assets/
│   └── penguins.gif
│
└── README.md




🧪 How It Works (JavaScript Overview)

Auth Object

Handles login, signup, logout

Stores users in localStorage

Updates UI based on auth state

Page Transitions

JavaScript adds .active class

CSS handles animation timing (2.6s)

Navigation happens after animation completes

Animations

CSS handles visuals

JavaScript only triggers states

Clean separation of logic & UI

🎯 Learning Outcome

This project demonstrates:

Strong understanding of DOM manipulation

Clean separation of logic, styling, and structure

Real-world frontend patterns without frameworks

Advanced CSS animations and SVG handling

📝 Future Improvements

Backend authentication

Database integration

User progress sync

Admin panel for content management
