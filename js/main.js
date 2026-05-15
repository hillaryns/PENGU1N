const Auth = {

  currentUser: null,

  init() {

    const stored =
      localStorage.getItem("user");

    if (stored) {

      this.currentUser =
        JSON.parse(stored);

    }

    this.updateUI();

  },

  login(userData) {
    this.currentUser = userData;
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );
  },

  logout() {

    this.currentUser = null;

    localStorage.removeItem("user");

    window.location.href =
      "signin.html";

  },

  requireAuth() {

    const stored =
      localStorage.getItem("user");

    if (!stored) {

      window.location.href =
        "signin.html";

      return false;

    }
    this.currentUser = 
      JSON.parse(stored);

    return true;

  },

  updateUI() {

    const navLinks =
      document.querySelector(
        ".nav-links"
      );

    if (
      navLinks &&
      this.currentUser
    ) {

      const authButtons =
        navLinks.querySelectorAll(
          'a[href="signin.html"], a[href="signup.html"]'
        );

      authButtons.forEach(btn => {

        btn.style.display =
          "none";

      });

      if (
        !navLinks.querySelector(
          'a[href="dashboard.html"]'
        )
      ) {

        const dashLink =
          document.createElement("a");

        dashLink.href =
          "dashboard.html";

        dashLink.textContent =
          "Dashboard";

        navLinks.insertBefore(
          dashLink,
          navLinks.firstChild
        );

      }

    }

  }

};

// Initialize Auth
Auth.init()

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn")
const mobileMenu = document.getElementById("mobileMenu")

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("active")
    const icon = mobileMenuBtn.querySelector("i")
    icon.classList.toggle("fa-bars")
    icon.classList.toggle("fa-times")
  })
}

// Toast Notifications
function showToast(message, type = "success") {
  let container = document.querySelector(".toast-container")
  if (!container) {
    container = document.createElement("div")
    container.className = "toast-container"
    document.body.appendChild(container)
  }

  const toast = document.createElement("div")
  toast.className = `toast ${type}`
  toast.innerHTML = `
    <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
    <span>${message}</span>
  `

  container.appendChild(toast)

  setTimeout(() => {
    toast.style.animation = "slideIn 0.3s ease reverse"
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

// Copy to Clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("Copied to clipboard!")
  })
}

// Initialize copy buttons
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const codeBlock = this.closest(".code-block")
    const code = codeBlock.querySelector("code").textContent
    copyToClipboard(code)
  })
})

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  })
})

// Intersection Observer for animations
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in")
    }
  })
}, observerOptions)

document.querySelectorAll(".card, .feature-item, .subject-card").forEach((el) => {
  el.style.opacity = "0"
  el.style.transition = "opacity 0.5s ease"
  observer.observe(el)
})

// Add animate-in class styles
const style = document.createElement("style")
style.textContent = `
  .animate-in {
    opacity: 1 !important;
  }
`
document.head.appendChild(style)

// Particle effect for hero (optional enhancement)
function createParticles() {
  const container = document.getElementById("particles")
  if (!container) return

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div")
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 1}px;
      height: ${Math.random() * 4 + 1}px;
      background: rgba(99, 102, 241, ${Math.random() * 0.5});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 10 + 5}s infinite ease-in-out;
    `
    container.appendChild(particle)
  }
}

const particleStyle = document.createElement("style")
particleStyle.textContent = `
  @keyframes float {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px); }
    50% { transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px); }
    75% { transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px); }
  }
  #particles {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }
`
document.head.appendChild(particleStyle)

createParticles()

// Bookmark System
const Bookmarks = {
  get() {
    return JSON.parse(localStorage.getItem("learninghub_bookmarks") || "[]")
  },

  add(item) {
    const bookmarks = this.get()
    if (!bookmarks.find((b) => b.id === item.id)) {
      bookmarks.push(item)
      localStorage.setItem("learninghub_bookmarks", JSON.stringify(bookmarks))
      showToast("Bookmarked!")
    }
  },

  remove(id) {
    let bookmarks = this.get()
    bookmarks = bookmarks.filter((b) => b.id !== id)
    localStorage.setItem("learninghub_bookmarks", JSON.stringify(bookmarks))
    showToast("Bookmark removed")
  },

  isBookmarked(id) {
    return this.get().some((b) => b.id === id)
  },
}

// Search functionality
function initSearch() {
  const searchInput = document.querySelector(".search-input")
  if (!searchInput) return

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase()
    const cards = document.querySelectorAll(".card, .question-card, .topic-link")

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase()
      card.style.display = text.includes(query) ? "" : "none"
    })
  })
}

initSearch()

// Export utilities
window.Auth = Auth
window.showToast = showToast
window.Bookmarks = Bookmarks
window.copyToClipboard = copyToClipboard




const title = document.querySelector(".hero-title");

document.addEventListener("mousemove", (e) => {
  if (!title) return;

  const rect = title.getBoundingClientRect();
  const titleX = rect.left + rect.width / 2;
  const titleY = rect.top + rect.height / 2;

  const distX = e.clientX - titleX;
  const distY = e.clientY - titleY;

  const distance = Math.sqrt(distX * distX + distY * distY);

  const maxDistance = 300; // how far the effect reaches

  if (distance < maxDistance) {
    const strength = (maxDistance - distance) / maxDistance;
    const moveX = distX * strength * 0.15;
    const moveY = distY * strength * 0.15;

    title.style.transform = `translate(${moveX}px, ${moveY}px)`;
  } else {
    title.style.transform = "translate(0, 0)";
  }
});


const container = document.querySelector(".shooting-stars");

function createShootingStar() {
  if (!container) return;

  const star = document.createElement("div");
  star.className = "shooting-star";

  // random start position near top-left
  star.style.top = Math.random() * 30 + "%";
  star.style.left = Math.random() * 30 + "%";

  container.appendChild(star);

  // remove after animation
  setTimeout(() => star.remove(), 1400);
}

// random interval (every 5–10 seconds)
setInterval(() => {
  if (Math.random() > 0.6) createShootingStar();
}, 3000);

document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".hero-title.edge-sparks");
  if (!title) return;

  setInterval(() => {
    title.classList.add("spark-active");
    setTimeout(() => title.classList.remove("spark-active"), 200);
  }, 2500);
});

const transition = document.getElementById("page-transition");
const starContainer = document.querySelector(".blackhole-stars");

function spawnStars() {
  const starContainer = document.querySelector(".blackhole-stars");
  if (!starContainer) return;

  starContainer.innerHTML = "";

  for (let i = 0; i < 40; i++) {
    const star = document.createElement("span");
    star.style.left = Math.random() * window.innerWidth + "px";
    star.style.top = Math.random() * window.innerHeight + "px";
    starContainer.appendChild(star);
  }
}



document.querySelectorAll('a[href="signin.html"], a[href="signup.html"]').forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    const transition = document.getElementById("page-transition");
    if (!transition) {
      window.location.href = link.getAttribute("href");
      return;
    }

    transition.classList.add("active");

    setTimeout(() => {
      window.location.href = link.getAttribute("href");
    }, 2600);
  });
});


function runTransitionThen(url) {
  const transition = document.getElementById("page-transition");
  if (!transition) {
    window.location.href = url;
    return;
  }

  transition.classList.add("active");

  setTimeout(() => {
    window.location.href = url;
  }, 2600);
}


function logoutWithPenguin() {
  localStorage.removeItem("user");
  runTransitionThen("index.html");
}







