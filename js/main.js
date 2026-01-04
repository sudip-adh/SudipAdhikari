/* =========================================================
   main.js
   Author: Sudip Adhikari
   Description: Navigation, animations, UI effects
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     NAVBAR AUTO-HIDE ON SCROLL (DESKTOP ONLY)
  ======================================================= */
  let lastScrollTop = 0;
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (!navbar) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (window.innerWidth > 768) {
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.classList.add("nav-hide");
      } else {
        navbar.classList.remove("nav-hide");
      }
    } else {
      navbar.classList.remove("nav-hide");
    }

    lastScrollTop = Math.max(scrollTop, 0);
  });

  /* ===============================
   MOBILE HAMBURGER MENU (FINAL)
================================ */
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

if (hamburger && navMenu) {

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("show");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      navMenu.classList.remove("show");
    }
  });
}


  /* =======================================================
     SCROLL PROGRESS BAR + BACK TO TOP
  ======================================================= */
  const progressBar = document.getElementById("scroll-progress");
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const progress = (scrollTop / scrollHeight) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;

    if (backToTop) {
      backToTop.classList.toggle("visible", scrollTop > 300);
    }
  });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =======================================================
     SMOOTH SCROLL FOR INTERNAL NAV LINKS
  ======================================================= */
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", e => {
      const targetId = link.getAttribute("href");

      if (targetId && targetId.startsWith("#")) {
        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* =======================================================
     FADE + SLIDE ANIMATION ON SCROLL
  ======================================================= */
  const animatedElements = document.querySelectorAll(".animate");

  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    animatedElements.forEach(el => observer.observe(el));
  }

  /* =======================================================
     HEADER BACKGROUND IMAGE SLIDER
  ======================================================= */
  const header = document.querySelector(".header");
  const headerImages = [
    "assets/header/bg1.jpg",
    "assets/header/bg2.jpg",
    "assets/header/bg3.jpg"
  ];

  let currentHeader = 0;

  function changeHeaderBg() {
    if (!header || headerImages.length === 0) return;

    header.style.backgroundImage =
      `url('${headerImages[currentHeader]}')`;

    currentHeader = (currentHeader + 1) % headerImages.length;
  }

  if (header) {
    changeHeaderBg();
    setInterval(changeHeaderBg, 5000);
  }

  /* =======================================================
     TYPEWRITER EFFECT
  ======================================================= */
  const typeTarget = document.querySelector(".typewriter");
  const typeText = "Sudip Adhikari";
  let charIndex = 0;

  function typeEffect() {
    if (!typeTarget) return;

    if (charIndex < typeText.length) {
      typeTarget.textContent += typeText.charAt(charIndex);
      charIndex++;
      setTimeout(typeEffect, 110);
    }
  }

  if (typeTarget) {
    typeTarget.textContent = "";
    setTimeout(typeEffect, 500);
  }

});
