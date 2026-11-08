/* Khadim Sweets & Bakers — mobile menu, active nav, lightbox, reveal */
(function () {
  "use strict";

  /* ---- Mobile menu: instant open/close, no transitions on the menu ---- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");
  if (toggle && menu) {
    var setOpen = function (open) {
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () {
      setOpen(menu.hidden);
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) setOpen(false);
    });
  }

  /* ---- Active nav highlighting ---- */
  var navLinks = document.querySelectorAll(".desktop-nav a");
  var sections = [];
  navLinks.forEach(function (link) {
    var target = document.querySelector(link.getAttribute("href"));
    if (target) sections.push({ link: link, el: target });
  });
  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sections.forEach(function (s) {
          s.link.classList.toggle("active", s.el === entry.target);
        });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach(function (s) { observer.observe(s.el); });
  }

  /* ---- Lightbox ---- */
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var caption = document.getElementById("lightbox-caption");
  var current = 0;
  var show = function (index) {
    current = (index + items.length) % items.length;
    var item = items[current];
    lightboxImg.src = item.getAttribute("data-full");
    lightboxImg.alt = item.getAttribute("data-alt") || "";
    caption.textContent = item.getAttribute("data-alt") || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  };
  var hide = function () {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  };
  items.forEach(function (item, i) {
    item.addEventListener("click", function () { show(i); });
  });
  if (lightbox) {
    lightbox.querySelector("[data-lightbox-close]").addEventListener("click", hide);
    lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", function () { show(current - 1); });
    lightbox.querySelector("[data-lightbox-next]").addEventListener("click", function () { show(current + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) hide();
    });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") hide();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll(".board-card, .cake-card, .occasion-card, .why-card, .gallery-item, .visit-card");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) {
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
  }
})();
