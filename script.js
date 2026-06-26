/* SABB Insurance — interactions */
document.addEventListener("DOMContentLoaded", () => {

  // Loader
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) setTimeout(() => loader.classList.add("hidden"), 600);
  });

  // Year
  const y = document.getElementById("year"); 
  if (y) y.textContent = new Date().getFullYear();

  // Nav scroll state
  const nav = document.querySelector(".nav");
  const onScroll = () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 30);
    
    // SAFE CHECK: Only toggle back-to-top if it exists on this page
    const toTopBtn = document.getElementById("toTop");
    if (toTopBtn) toTopBtn.classList.toggle("show", window.scrollY > 500);
    
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
    document.querySelector(".nav-links")?.classList.toggle("open");
  });
  document.querySelectorAll(".nav-links a").forEach(a => {
    a.addEventListener("click", () => document.querySelector(".nav-links")?.classList.remove("open"));
  });

  // SAFE CHECK: Back to top
  const toTop = document.getElementById("toTop");
  if (toTop) {
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // SAFE CHECK: Cursor glow (Stops error if element is missing)
  const glow = document.getElementById("cursor-glow");
  if (glow) {
    window.addEventListener("mousemove", (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
  }

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
    const q = item.querySelector(".faq-q");
    if (q) {
      q.addEventListener("click", () => {
        const open = item.classList.contains("open");
        document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
        if (!open) item.classList.add("open");
      });
    }
  });

  // SAFE CHECK: Testimonials carousel (Guarded against missing containers on secondary pages)
  const track = document.querySelector(".t-track");
  const slides = document.querySelectorAll(".t-slide");
  const dotsWrap = document.querySelector(".t-dots");
  
  if (track && slides.length && dotsWrap) {
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
  }

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

  // =========================================================================
  // UNIFIED PREMIUM SUBMISSION VAULT ENGINE
  // =========================================================================
  const form = document.getElementById('quoteForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Stop any native page reloads

      // Extract raw data fields safely matching your crisp HTML IDs
      const name = document.getElementById('clientName')?.value || '';
      const phone = document.getElementById('clientPhone')?.value || '';
      const email = document.getElementById('clientEmail')?.value || '';
      const type = document.getElementById('insuranceType')?.value || '';
      const limit = document.getElementById('coverageLimit')?.value || 'Not Specified';
      const details = document.getElementById('clientMessage')?.value || '';

      // Generate pristine timestamp metadata
      const options = { dateStyle: 'medium', timeStyle: 'short' };
      const formattedTime = new Date().toLocaleString('en-US', options);

      // Construct a single, highly integrated data structure object
      const dataRecord = {
        id: Date.now(),
        name: name,
        phone: phone,
        email: email,
        type: type,
        limit: limit,
        details: details,
        source: 'Web Portal', // Flags the unified origin inside the admin console
        timestamp: formattedTime,
        completed: false
      };

      // Pull current vault items or initiate a blank queue
      const existingQuotes = JSON.parse(localStorage.getItem('sabb_quotes') || '[]');
      
      // Inject entry cleanly onto the front of the queue array
      existingQuotes.unshift(dataRecord);
      localStorage.setItem('sabb_quotes', JSON.stringify(existingQuotes));

      // Executive UI transformation state feedback replacing ugly alerts
      form.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      form.style.opacity = '0';
      form.style.transform = 'translateY(10px)';
      
      setTimeout(() => {
        form.innerHTML = `
          <div style="text-align: center; padding: 48px 24px; background: rgba(6, 28, 35, 0.2); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 20px; backdrop-filter: blur(20px);">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#e5c158" stroke-width="2.5" style="margin-bottom: 20px; filter: drop-shadow(0 0 8px rgba(229,193,88,0.3));">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <h3 style="margin: 0 0 10px; font-family: 'Playfair Display', serif; font-size: 1.6rem; color: #fff; font-weight: 400;">Transmission Secure</h3>
            <p style="margin: 0; font-size: 0.9rem; color: rgba(255,255,255,0.6); line-height: 1.6;">Your executive quote request has been completely routed to the SABB Vault ledger.</p>
          </div>
        `;
        form.style.opacity = '1';
        form.style.transform = 'translateY(0)';
      }, 300);
    });
  }

  // Ensure initial nav calculations trigger properly
  onScroll();
});