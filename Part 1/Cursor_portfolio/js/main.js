(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.querySelector(".site-nav");
  var navLinks = siteNav ? siteNav.querySelectorAll('a[href^="#"]') : [];

  function setNavOpen(open) {
    if (!siteNav || !navToggle) return;
    siteNav.classList.toggle("is-open", open);
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      setNavOpen(!siteNav.classList.contains("is-open"));
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 720px)").matches) {
          setNavOpen(false);
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && siteNav.classList.contains("is-open")) {
        setNavOpen(false);
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    var id = anchor.getAttribute("href");
    if (!id || id === "#") return;
    anchor.addEventListener("click", function (e) {
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY;
      var offset = header ? header.offsetHeight : 0;
      window.scrollTo({ top: top - offset - 8, behavior: "smooth" });
    });
  });

  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReduced) {
    var revealEls = document.querySelectorAll(".reveal");
    if (revealEls.length && "IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
      );
      revealEls.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  var form = document.getElementById("contact-form");
  if (form) {
    var nameInput = document.getElementById("name");
    var emailInput = document.getElementById("email");
    var messageInput = document.getElementById("message");
    var nameError = document.getElementById("name-error");
    var emailError = document.getElementById("email-error");
    var messageError = document.getElementById("message-error");
    var formStatus = document.getElementById("form-status");

    function clearErrors() {
      [nameError, emailError, messageError].forEach(function (el) {
        if (el) el.textContent = "";
      });
      [nameInput, emailInput, messageInput].forEach(function (input) {
        if (input) input.setAttribute("aria-invalid", "false");
      });
    }

    function showFieldError(input, errorEl, message) {
      if (errorEl) errorEl.textContent = message;
      if (input) input.setAttribute("aria-invalid", "true");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();
      if (formStatus) formStatus.textContent = "";

      var valid = true;
      var nameVal = nameInput ? nameInput.value.trim() : "";
      var emailVal = emailInput ? emailInput.value.trim() : "";
      var messageVal = messageInput ? messageInput.value.trim() : "";

      if (nameVal.length < 2) {
        showFieldError(
          nameInput,
          nameError,
          "Please enter at least 2 characters."
        );
        valid = false;
      }

      if (!emailVal) {
        showFieldError(emailInput, emailError, "Email is required.");
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        showFieldError(emailInput, emailError, "Please enter a valid email.");
        valid = false;
      }

      if (messageVal.length < 10) {
        showFieldError(
          messageInput,
          messageError,
          "Please write at least 10 characters."
        );
        valid = false;
      }

      if (!valid) return;

      if (formStatus) {
        formStatus.textContent =
          "Thanks — your message passes validation. Connect a backend or mailto to send it for real.";
      }
      form.reset();
    });
  }
})();
