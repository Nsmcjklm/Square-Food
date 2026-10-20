/* =========================================================
   Square Food, Béziers
   ========================================================= */
(() => {
  "use strict";

  document.documentElement.classList.add("js");
  requestAnimationFrame(() => document.body.classList.add("loaded"));

  /* Menu mobile */
  const burger = document.getElementById("burger");
  const links = document.getElementById("navLinks");
  const setMenu = (open) => {
    links.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  };
  burger.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* Header : se cache en descendant, revient en remontant */
  const header = document.getElementById("header");
  let lastY = scrollY;
  addEventListener("scroll", () => {
    const y = scrollY;
    header.classList.toggle("hidden", !links.classList.contains("open") && y > lastY && y > 240);
    lastY = y;
  }, { passive: true });

  /* Lien actif dans le menu */
  const navAnchors = [...links.querySelectorAll("a")];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) navAnchors.forEach((a) => a.classList.toggle("active", a.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["carte", "etudiants", "kiosque", "infos"].forEach((id) => spy.observe(document.getElementById(id)));

  /* Onglets de la carte */
  const tabs = [...document.querySelectorAll(".tab")];
  const panels = [...document.querySelectorAll(".panel")];
  const showCat = (cat) => {
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.cat === cat)));
    panels.forEach((p) => p.classList.toggle("is-active", p.dataset.panel === cat));
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => showCat(t.dataset.cat));
    // flèches gauche / droite au clavier
    t.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
      next.focus();
      showCat(next.dataset.cat);
    });
  });
  showCat("burgers");

  /* Apparition au scroll */
  const revealEls = [...document.querySelectorAll("[data-reveal]")];
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
  revealEls.forEach((el) => revealObs.observe(el));
  addEventListener("scroll", () => {
    revealEls.forEach((el) => {
      if (!el.classList.contains("in") && el.getBoundingClientRect().top < innerHeight) {
        el.classList.add("in");
        revealObs.unobserve(el);
      }
    });
  }, { passive: true });

  /* Ouvert / fermé (12h-23h tous les jours, heure de Paris) */
  const status = document.getElementById("openStatus");
  const update = () => {
    const parts = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    const h = Number(parts.find((p) => p.type === "hour").value);
    const open = h >= 12 && h < 23;
    status.textContent = open ? "Ouvert en ce moment" : "Fermé en ce moment";
    status.className = `open ${open ? "is-open" : "is-closed"}`;
  };
  update();
  setInterval(update, 60_000);

  /* Plan Google Maps chargé seulement au clic */
  document.getElementById("loadMap").addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.title = "Plan d'accès : Square Food, 7 avenue des Martyrs de la Résistance, Béziers";
    iframe.src = "https://www.google.com/maps?q=7+avenue+des+Martyrs+de+la+R%C3%A9sistance,+34500+B%C3%A9ziers&z=16&output=embed";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    document.getElementById("map").replaceChildren(iframe);
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
