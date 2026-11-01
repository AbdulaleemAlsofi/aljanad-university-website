/* ============================================================
   JANAD UNIVERSITY — MAIN SCRIPT
   Sections:
   1. Mobile Nav
   2. Sticky Navbar & Back-to-top
   3. Active Link
   4. Reveal on Scroll
   5. Animated Counters
   6. Form Validation (Register + Contact)
   7. Year auto-update
   ============================================================ */

(function () {
  "use strict";

  /* ==========================================================
     1. MOBILE NAV
     ========================================================== */
  const nav = document.querySelector(".site-nav");
  const navLinks = document.querySelector(".nav-links");
  const navToggle = document.querySelector(".nav-toggle");
  const navClose = document.querySelector(".nav-close");
  const backdrop = document.querySelector(".nav-backdrop");

  function openMenu() {
    navLinks && navLinks.classList.add("open");
    backdrop && backdrop.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    navLinks && navLinks.classList.remove("open");
    backdrop && backdrop.classList.remove("show");
    document.body.style.overflow = "";
  }

  navToggle && navToggle.addEventListener("click", openMenu);
  navClose && navClose.addEventListener("click", closeMenu);
  backdrop && backdrop.addEventListener("click", closeMenu);

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ==========================================================
     2. STICKY NAV & BACK-TO-TOP
     ========================================================== */
  const toTop = document.querySelector(".to-top");

  function onScroll() {
    const y = window.scrollY;
    nav && nav.classList.toggle("scrolled", y > 40);
    toTop && toTop.classList.toggle("show", y > 500);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop &&
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

  /* ==========================================================
     3. ACTIVE LINK
     ========================================================== */
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });

  /* ==========================================================
     4. REVEAL ON SCROLL
     ========================================================== */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ==========================================================
     5. ANIMATED COUNTERS
     ========================================================== */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10) || 0;
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 60));
          const tick = () => {
            current = Math.min(current + step, target);
            el.textContent = current;
            if (current < target) requestAnimationFrame(tick);
          };
          tick();
          cio.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => cio.observe(c));
  }

  /* ==========================================================
     6. FORM VALIDATION
     ========================================================== */
  function setError(field, message) {
    field.classList.add("error");
    field.classList.remove("success");
    const msg = field.querySelector(".error-msg");
    if (msg) msg.textContent = message;
  }

  function setSuccess(field) {
    field.classList.remove("error");
    field.classList.add("success");
  }

  function clearState(field) {
    field.classList.remove("error", "success");
  }

  /* --- Register form --- */
  const registerForm = document.querySelector("#registerForm");

  if (registerForm) {
    const nameField = registerForm.querySelector("#field-name");
    const phoneField = registerForm.querySelector("#field-phone");
    const passField = registerForm.querySelector("#field-password");
    const confirmField = registerForm.querySelector("#field-confirm");

    const nameInput = registerForm.querySelector("#name");
    const phoneInput = registerForm.querySelector("#phone");
    const passInput = registerForm.querySelector("#password");
    const confirmInput = registerForm.querySelector("#confirmPassword");
    const successBox = registerForm.querySelector(".form-success");

    const nameRe = /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF\s_]{1,49}$/;
    const phoneRe = /^\+?\d{7,14}$/;
    const passRe = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    function validateName() {
      const v = nameInput.value.trim();
      if (!v) { setError(nameField, "الرجاء إدخال الاسم."); return false; }
      if (!nameRe.test(v)) {
        setError(nameField, "اسم غير صالح (حروف فقط، بدون أرقام أو رموز).");
        return false;
      }
      setSuccess(nameField);
      return true;
    }

    function validatePhone() {
      const v = phoneInput.value.trim();
      if (!v) { setError(phoneField, "الرجاء إدخال رقم الهاتف."); return false; }
      if (!phoneRe.test(v)) {
        setError(phoneField, "رقم غير صالح (أرقام فقط، ويمكن + في البداية، 7–14 رقماً).");
        return false;
      }
      setSuccess(phoneField);
      return true;
    }

    function validatePass() {
      const v = passInput.value;
      if (!v) { setError(passField, "الرجاء إدخال كلمة المرور."); return false; }
      if (!passRe.test(v)) {
        setError(passField, "كلمة المرور يجب أن تكون 6+ أحرف وتحتوي حرفاً ورقماً على الأقل.");
        return false;
      }
      setSuccess(passField);
      return true;
    }

    function validateConfirm() {
      if (!confirmInput.value) {
        setError(confirmField, "الرجاء تأكيد كلمة المرور.");
        return false;
      }
      if (confirmInput.value !== passInput.value) {
        setError(confirmField, "كلمتا المرور غير متطابقتين.");
        return false;
      }
      setSuccess(confirmField);
      return true;
    }

    nameInput.addEventListener("blur", validateName);
    phoneInput.addEventListener("blur", validatePhone);
    passInput.addEventListener("blur", validatePass);
    confirmInput.addEventListener("blur", validateConfirm);

    [nameInput, phoneInput, passInput, confirmInput].forEach((inp) => {
      inp.addEventListener("input", () => {
        const f = inp.closest(".field");
        f && clearState(f);
      });
    });

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = [validateName(), validatePhone(), validatePass(), validateConfirm()].every(Boolean);
      if (!ok) return;
      if (successBox) {
        successBox.hidden = false;
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      registerForm.reset();
      [nameField, phoneField, passField, confirmField].forEach(clearState);
    });
  }

  /* --- Contact / comment form --- */
  const contactForm = document.querySelector("#contactForm");
  if (contactForm) {
    const emailField = contactForm.querySelector("#field-email");
    const emailInput = contactForm.querySelector("#email");
    const msgField = contactForm.querySelector("#field-message");
    const msgInput = contactForm.querySelector("#message");
    const successBox = contactForm.querySelector(".form-success");
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function validateEmail() {
      const v = emailInput.value.trim();
      if (!v) { setError(emailField, "الرجاء إدخال البريد الإلكتروني."); return false; }
      if (!emailRe.test(v)) { setError(emailField, "بريد إلكتروني غير صالح."); return false; }
      setSuccess(emailField);
      return true;
    }

    function validateMessage() {
      const v = msgInput.value.trim();
      if (v.length < 10) {
        setError(msgField, "الرسالة قصيرة جداً (10 أحرف على الأقل).");
        return false;
      }
      setSuccess(msgField);
      return true;
    }

    emailInput.addEventListener("blur", validateEmail);
    msgInput.addEventListener("blur", validateMessage);

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = [validateEmail(), validateMessage()].every(Boolean);
      if (!ok) return;
      if (successBox) {
        successBox.hidden = false;
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      contactForm.reset();
      clearState(emailField);
      clearState(msgField);
    });
  }

  /* ==========================================================
     7. YEAR AUTO-UPDATE
     ========================================================== */
  document.querySelectorAll(".year, #year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();