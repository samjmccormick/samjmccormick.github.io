// Modern, minimal JS (ES module style)
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* NAV TOGGLE */
const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");
if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const expanded =
      navToggle.getAttribute("aria-expanded") === "true" || false;
    navToggle.setAttribute("aria-expanded", String(!expanded));
    const visible = !(nav.getAttribute("data-visible") === "true");
    nav.setAttribute("data-visible", String(visible));
  });
}

/* DIALOG (native) openers */
document.querySelectorAll("[data-open-dialog]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const id = btn.getAttribute("data-open-dialog");
    const dialog = document.getElementById(id);
    if (!dialog) return;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
      trapFocus(dialog);
    } else {
      // fallback: simple visible panel if dialog unsupported
      dialog.style.display = "block";
    }
  });
});

/* Close dialogs when clicking backdrop or pressing ESC */
document.querySelectorAll("dialog.dialog").forEach((dialog) => {
  dialog.addEventListener("click", (ev) => {
    // click on backdrop
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      ev.clientX >= rect.left &&
      ev.clientX <= rect.right &&
      ev.clientY >= rect.top &&
      ev.clientY <= rect.bottom;
    if (!isInDialog) dialog.close();
  });
  dialog.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") dialog.close();
  });
});

/* Simple focus trap for accessibility (basic) */
function trapFocus(dialog) {
  const focusable = dialog.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first) return;
  first.focus();
  dialog.addEventListener(
    "keydown",
    (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    { once: true }
  );
}

/* IntersectionObserver to reveal animated elements on scroll */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll("[data-animate]").forEach((el) => {
  el.classList.add("fade-up");
  observer.observe(el);
});

/* Improve keyboard: close dialogs with Escape globally */
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll("dialog.dialog").forEach((d) => {
      if (d.open) d.close();
    });
  }
});
