/* SABB Insurance — interactions */
document.addEventListener("DOMContentLoaded", () => {

  // Loader
  window.addEventListener("load", () => {
    setTimeout(() => document.getElementById("loader").classList.add("hidden"), 600);
  });

  // Year
  const y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();

  // Nav scroll state
  const nav = document.querySelector(".nav");
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 30);
    document.getElementById("toTop").classList.toggle("show", window.scrollY > 500);
    // Section highlight
    let current = "";
    document.querySelectorAll("section[id]").forEach(s => {
      const top = s.offsetTop - 120;
      if (window.scrollY >= top) current = s.id;
    });
    document.querySelectorAll(".nav-links a").forEach(a => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  document.querySelector(".menu-btn")?.addEventListener("click", () => {
    document.querySelector(".nav-links").classList.toggle("open");
  });
  document.querySelectorAll(".nav-links a").forEach(a => {
    a.addEventListener("click", () => document.querySelector(".nav-links").classList.remove("open"));
  });

  // Back to top
  document.getElementById("toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Cursor glow
  const glow = document.getElementById("cursor-glow");
  window.addEventListener("mousemove", (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // Animated counters
  const counters = document.querySelectorAll("[data-count]");
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = +el.dataset.count;
      const dur = 1800; const start = performance.now();
      const tick = (t) => {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * eased).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => cio.observe(c));

  // FAQ accordion
  document.querySelectorAll(".faq-item").forEach(item => {
    item.querySelector(".faq-q").addEventListener("click", () => {
      const open = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
      if (!open) item.classList.add("open");
    });
  });

  // Testimonials carousel
  const track = document.querySelector(".t-track");
  const slides = document.querySelectorAll(".t-slide");
  const dotsWrap = document.querySelector(".t-dots");
  let idx = 0;
  slides.forEach((_, i) => {
    const d = document.createElement("button");
    d.className = "t-dot" + (i === 0 ? " active" : "");
    d.addEventListener("click", () => go(i));
    dotsWrap.appendChild(d);
  });
  const go = (i) => {
    idx = i; track.style.transform = `translateX(-${i * 100}%)`;
    document.querySelectorAll(".t-dot").forEach((d, j) => d.classList.toggle("active", j === i));
  };
  setInterval(() => go((idx + 1) % slides.length), 6000);

  // Particles
  const pc = document.getElementById("particles");
  if (pc) {
    for (let i = 0; i < 22; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      const s = 3 + Math.random() * 6;
      p.style.width = p.style.height = s + "px";
      p.style.left = Math.random() * 100 + "%";
      p.style.bottom = -20 + "px";
      p.style.animationDuration = (8 + Math.random() * 14) + "s";
      p.style.animationDelay = (-Math.random() * 14) + "s";
      p.style.opacity = (0.2 + Math.random() * 0.5).toString();
      pc.appendChild(p);
    }
  }

  // Parallax shield
  const shield = document.querySelector(".shield");
  if (shield) {
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      shield.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  

  onScroll();
});
