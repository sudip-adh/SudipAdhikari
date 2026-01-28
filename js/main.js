/* ==========================================================================
   MAIN JAVASCRIPT FILE
   AUTHOR: Sudip Adhikari
   DESCRIPTION: Handles mobile menu, animations, typewriter, and scroll logic.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  /* ========================================================================
     1. MOBILE NAVIGATION (HAMBURGER MENU)
     ======================================================================== */
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Safety check: Ensure elements exist before adding listeners
  if (hamburger && navMenu) {
    
    // Toggle Menu on Hamburger Click
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevents click from bubbling to document
      hamburger.classList.toggle("menu-open");
      navMenu.classList.toggle("show");
    });

    // Close Menu when a Nav Link is clicked
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("menu-open");
        navMenu.classList.remove("show");
      });
    });

    // Close Menu when clicking anywhere outside the menu
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove("menu-open");
        navMenu.classList.remove("show");
      }
    });
  }

  /* ========================================================================
     2. TYPEWRITER EFFECT (Fixed: No Double Typing)
     ======================================================================== */
  const typeText = "Sudip Adhikari";
  const typeElement = document.querySelector(".typewriter");
  let typeIndex = 0;
  let isTyping = false; // Lock to prevent multiple instances

  function typeWriter() {
    if (!typeElement) return;

    if (typeIndex < typeText.length) {
      typeElement.textContent += typeText.charAt(typeIndex);
      typeIndex++;
      setTimeout(typeWriter, 150); // Typing speed in ms
    } else {
      isTyping = false; // Reset lock when done
    }
  }

  // Init Typewriter only if element exists and not already running
  if (typeElement && !isTyping) {
    typeElement.textContent = ""; // Clear text first
    isTyping = true;
    setTimeout(typeWriter, 500); // Small delay before starting
  }

  /* ========================================================================
     3. SCROLL PROGRESS BAR
     ======================================================================== */
  const progressBar = document.getElementById("scroll-progress");
  
  window.addEventListener("scroll", () => {
    if (progressBar) {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + "%";
    }
  });

  /* ========================================================================
     4. NAVBAR SCROLL EFFECT (Hide on Scroll Down / Show on Up)
     ======================================================================== */
  let lastScrollTop = 0;
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (!navbar) return;
    
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling DOWN -> Hide Navbar
      navbar.classList.add("nav-hide");
    } else {
      // Scrolling UP -> Show Navbar
      navbar.classList.remove("nav-hide");
    }
    lastScrollTop = scrollTop;
  });

  /* ========================================================================
     5. SCROLL ANIMATIONS (Fade In Elements)
     ======================================================================== */
  // Select all elements with the class 'animate'
  const animatedElements = document.querySelectorAll(".animate");

  const observerOptions = {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: "0px 0px -50px 0px" // Offset slightly so it triggers before bottom
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target); // Run animation only once
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  /* ========================================================================
     6. BACK TO TOP BUTTON
     ======================================================================== */
  const backToTopBtn = document.getElementById("backToTop");

  if (backToTopBtn) {
    // Show/Hide button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });

    // Smooth scroll to top on click
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

});