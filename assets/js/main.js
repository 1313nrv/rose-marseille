/* ROSE — Marseille · vanilla JS */
(function () {
  "use strict";

  // ---------- Config centralisée
  const CONFIG = {
    opentable: "https://www.opentable.fr/r/rose-marseille",
    instagram: "https://www.instagram.com/rose.castellane",
    email:     "bonjour@rose-marseille.fr"
  };
  window.ROSE = CONFIG;

  const lang = document.documentElement.lang && document.documentElement.lang.startsWith("en") ? "en" : "fr";
  const T = {
    fr: {
      required:  "Ce champ est requis.",
      email:     "Adresse email invalide.",
      consent:   "Merci d’accepter pour continuer.",
      sending:   "Envoi en cours…",
      ok_contact:"Message bien reçu. Nous vous répondons sous 24 h.",
      ok_news:   "Merci, vous êtes inscrit·e à notre courrier.",
      err:       "Une erreur est survenue. Merci de réessayer.",
      back_top:  "Retour en haut"
    },
    en: {
      required:  "This field is required.",
      email:     "Invalid email address.",
      consent:   "Please accept to continue.",
      sending:   "Sending…",
      ok_contact:"Message received. We’ll reply within 24 hours.",
      ok_news:   "Thanks, you’re subscribed to our letter.",
      err:       "Something went wrong. Please try again.",
      back_top:  "Back to top"
    }
  }[lang];

  // ---------- Year injection
  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ---------- OpenTable URL centralisée
  document.querySelectorAll("[data-opentable]").forEach(a => {
    a.href = CONFIG.opentable;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });

  // ---------- Header shadow on scroll
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---------- Reveal (IntersectionObserver)
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("is-visible"));
  }

  // ---------- Back-to-top
  const backTop = document.querySelector(".back-top");
  if (backTop) {
    backTop.setAttribute("aria-label", T.back_top);
    const onScroll = () => backTop.classList.toggle("is-visible", window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // ---------- Form validation
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setFieldError(field, msg) {
    if (!field) return;
    const wrap = field.closest(".form-field");
    if (!wrap) return;
    const err = wrap.querySelector(".field-error");
    if (msg) {
      wrap.classList.add("form-field--invalid");
      field.setAttribute("aria-invalid", "true");
      if (err) err.textContent = msg;
    } else {
      wrap.classList.remove("form-field--invalid");
      field.removeAttribute("aria-invalid");
      if (err) err.textContent = "";
    }
  }

  function validateContact(form) {
    let ok = true;
    ["name", "email", "subject", "message"].forEach(n => {
      const f = form.elements[n];
      if (!f) return;
      const v = (f.value || "").trim();
      if (!v) { setFieldError(f, T.required); ok = false; }
      else if (n === "email" && !emailRe.test(v)) { setFieldError(f, T.email); ok = false; }
      else setFieldError(f, "");
    });
    const consent = form.elements.consent;
    if (consent && !consent.checked) { setFieldError(consent, T.consent); ok = false; }
    else if (consent) setFieldError(consent, "");
    return ok;
  }

  // Contact form (no backend — simulated success)
  const contactForm = document.querySelector("[data-form='contact']");
  if (contactForm) {
    const status = contactForm.querySelector(".form-status");
    contactForm.setAttribute("novalidate", "novalidate");
    contactForm.addEventListener("submit", e => {
      e.preventDefault();
      if (!validateContact(contactForm)) {
        if (status) { status.dataset.state = "error"; status.textContent = T.err; }
        const firstInvalid = contactForm.querySelector(".form-field--invalid input, .form-field--invalid textarea, .form-field--invalid select");
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      if (status) { status.dataset.state = ""; status.textContent = T.sending; }
      // Simulation : en prod, remplacer par un fetch() vers votre endpoint
      setTimeout(() => {
        contactForm.reset();
        if (status) { status.dataset.state = "ok"; status.textContent = T.ok_contact; }
      }, 700);
    });
  }

  // Newsletter
  document.querySelectorAll("[data-form='newsletter']").forEach(form => {
    const status = form.querySelector(".newsletter-msg");
    form.setAttribute("novalidate", "novalidate");
    form.addEventListener("submit", e => {
      e.preventDefault();
      const email = form.elements.email;
      const v = (email.value || "").trim();
      if (!v || !emailRe.test(v)) {
        if (status) status.textContent = T.email;
        email.focus();
        return;
      }
      if (status) status.textContent = T.sending;
      setTimeout(() => {
        form.reset();
        if (status) status.textContent = T.ok_news;
      }, 600);
    });
  });

})();
