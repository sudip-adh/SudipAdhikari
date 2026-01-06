/* ==========================================================================
   MAIN JAVASCRIPT
   ==========================================================================
   AUTHOR:      Sudip Adhikari
   DESCRIPTION: Handles navigation logic, animations, scroll effects, and
                interactive elements. Synchronized with styles.css.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ========================================================================
     1. VARIABLES & CONSTANTS
     ======================================================================== */
  const navbar = document.querySelector(".navbar");
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const headerOverlay = document.querySelector(".header-overlay");
  const progressBar = document.getElementById("scroll-progress");
  const backToTop = document.getElementById("backToTop");
  
  // State variables
  let lastScrollTop = 0;
  let menuOpenedAtScroll = 0;


  /* ========================================================================
     2. NAVBAR AUTO-HIDE (Desktop Only)
     ======================================================================== */
  // Hides navbar when scrolling down to give more reading space.
  // Shows navbar immediately when scrolling up.
  // Disabled on mobile/tablet (< 1024px) where the menu needs to stay fixed.
  
  function handleNavbarHide() {
    if (!navbar) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Only active on Desktop (> 1024px matches CSS breakpoint)
    if (window.innerWidth > 1024) {
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.classList.add("nav-hide");
      } else {
        navbar.classList.remove("nav-hide");
      }
    } else {
      // Always show on mobile to prevent losing access to the hamburger
      navbar.classList.remove("nav-hide");
    }
    
    lastScrollTop = Math.max(scrollTop, 0);
  }


  /* ========================================================================
     3. MOBILE NAVIGATION (Smart Logic)
     ======================================================================== */
  
  if (hamburger && navMenu) {
    
    // Toggle Menu on Hamburger Click
    hamburger.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("show");
      hamburger.classList.toggle("menu-open");
      
      // Capture scroll position when opening to detect "intent" later
      if (isOpen) {
        menuOpenedAtScroll = window.scrollY;
      }
    });

    // Close Menu when clicking a Link
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });

    // Reset on Window Resize (switching from Mobile to Desktop)
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) {
        closeMobileMenu();
      }
    });
  }

  // Helper to close menu cleanly
  function closeMobileMenu() {
    if (navMenu && navMenu.classList.contains("show")) {
      navMenu.classList.remove("show");
      if (hamburger) hamburger.classList.remove("menu-open");
    }
  }

  // Smart Scroll Collapse Logic
  // Only closes the menu if the user scrolls significantly (> 80px)
  // This prevents accidental closures when trying to scroll the menu itself.
  function handleMobileMenuScroll() {
    if (!navMenu || !navMenu.classList.contains("show")) return;

    const currentScroll = window.scrollY;
    const scrollDistance = Math.abs(currentScroll - menuOpenedAtScroll);

    if (scrollDistance > 80) {
      closeMobileMenu();
    }
  }


  /* ========================================================================
     4. SCROLL PROGRESS & BACK TO TOP
     ======================================================================== */
  
  function handleScrollProgress() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Update Progress Bar Width
    if (scrollHeight > 0) {
      const progress = (scrollTop / scrollHeight) * 100;
      if (progressBar) progressBar.style.width = `${progress}%`;
    }

    // Toggle Back to Top Button
    if (backToTop) {
      // Add 'visible' class if scrolled more than 300px
      backToTop.classList.toggle("visible", scrollTop > 300);
    }
  }

  // Back to Top Click Action
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }


  /* ========================================================================
     5. HEADER LIGHT EFFECT (Visual Polish)
     ======================================================================== */
  // Subtle effect: lightens the header overlay as you scroll down
  
  function handleHeaderEffect() {
    if (!headerOverlay) return;
    
    // Calculate a subtle transparency shift based on scroll
    // Max reduction is 0.35 opacity
    const value = Math.min(window.scrollY / 600, 0.35);
    
    // Base color matches CSS variables (rgb(11, 60, 93))
    // We adjust the alpha channel dynamically
    headerOverlay.style.background = 
      `linear-gradient(180deg, rgba(11,60,93,${0.65 - value}), rgba(11,60,93,${0.35 - value}))`;
  }


  /* ========================================================================
     6. MAIN SCROLL LISTENER (Performance Optimized)
     ======================================================================== */
  // We consolidate all scroll events here to keep the browser happy
  
  window.addEventListener("scroll", () => {
    handleNavbarHide();
    handleMobileMenuScroll();
    handleScrollProgress();
    handleHeaderEffect();
  });


  /* ========================================================================
     7. FADE-IN ANIMATIONS (Intersection Observer)
     ======================================================================== */
  const animatedElements = document.querySelectorAll(".animate");

  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          // Stop observing once shown so it doesn't animate again
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 }); // Trigger when 15% visible

    animatedElements.forEach(el => observer.observe(el));
  }


  /* ========================================================================
     8. HEADER BACKGROUND SLIDER
     ======================================================================== */
  const header = document.querySelector(".header");
  // Make sure these images exist in your folder!
  const headerImages = [
    "assets/hero.jpg",      // Default
    "assets/gallery/img1.jpg", 
    "assets/gallery/img2.jpg"
  ];

  let currentHeaderIndex = 0;

  function rotateHeaderImage() {
    if (!header || headerImages.length < 2) return; // Need at least 2 images to rotate

    currentHeaderIndex = (currentHeaderIndex + 1) % headerImages.length;
    
    // Preload next image for smoothness (optional optimization)
    const img = new Image();
    img.src = headerImages[currentHeaderIndex];
    
    img.onload = () => {
      header.style.backgroundImage = `url('${headerImages[currentHeaderIndex]}')`;
    };
  }

  // Start rotation if header exists
  if (header) {
    // Change image every 5 seconds
    setInterval(rotateHeaderImage, 5000);
  }


  /* ========================================================================
     9. TYPEWRITER EFFECT
     ======================================================================== */
  const typeTarget = document.querySelector(".typewriter");
  const typeText = "Sudip Adhikari"; // The text to type
  let charIndex = 0;

  function typeWriter() {
    if (!typeTarget) return;

    if (charIndex < typeText.length) {
      typeTarget.textContent += typeText.charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, 110); // Typing speed (ms)
    }
  }

  // Start typing after a short delay
  if (typeTarget) {
    typeTarget.textContent = ""; // Clear initial text
    setTimeout(typeWriter, 500);
  }

  /* ========================================================================
     10. SMOOTH SCROLL FOR NAV LINKS (Cross-browser compatibility)
     ======================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

});