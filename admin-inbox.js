import { db, ref, onValue, remove, update } from "./firebase-config.js";

const wrapper = document.getElementById("inbox-list-wrapper");
const quotesRef = ref(db, "quoteRequests");

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.verifyAdmin = function () {
  const key = document.getElementById("passkey-input").value;

  if (key === "SABB2026") {
    document.getElementById("lock-screen").style.opacity = "0";
    setTimeout(() => {
      document.getElementById("lock-screen").style.display = "none";
    }, 500);
  } else {
    alert("Invalid access key. Protection active.");
  }
};

document.getElementById("passkey-input")?.addEventListener("keypress", function (e) {
  if (e.key === "Enter") window.verifyAdmin();
});

function renderInbox(quotes) {
  if (!quotes.length) {
    wrapper.innerHTML = `<p style="color: rgba(255,255,255,0.3); text-align:center; padding: 70px 10px; margin: 0; font-size: 0.95rem; font-style: italic; letter-spacing: 0.02em;">No active quote requests found.</p>`;
    return;
  }

  wrapper.innerHTML = quotes.map((item) => `
    <div class="mail-item ${item.completed ? "processed" : ""}" id="quote-${item.id}">
      <div>
        <button class="delete-btn" onclick="deleteEntry('${item.id}')" title="Purge record permanently">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>

      <div style="padding: 0 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span class="source-badge">${escapeHtml(item.source)}</span>
          <span style="color: rgba(255,255,255,0.35); font-size: 0.78rem; font-weight:500;">${escapeHtml(item.timestamp)}</span>
        </div>

        <h3 style="margin: 0 0 10px; color: #fff; font-size:1.35rem; font-weight: 400; font-family:'Playfair Display', serif; letter-spacing: 0.01em;">${escapeHtml(item.name)}</h3>

        <div class="mail-meta"><strong>Phone</strong> · ${escapeHtml(item.phone)} &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Email</strong> · ${escapeHtml(item.email)}</div>
        <div class="mail-meta"><strong>Coverage</strong> · ${escapeHtml(item.type)} &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Limit Target</strong> · ${escapeHtml(item.limit)}</div>

        <div style="margin-top: 18px; font-size: 0.92rem; line-height: 1.6; padding: 16px 20px; background: rgba(3, 10, 14, 0.6); border-radius: 12px; border-left: 3px solid var(--gold-bright); color: rgba(255,255,255,0.8);">
          ${escapeHtml(item.details || "No extra message added.")}
        </div>
      </div>

      <div class="checkbox-container">
        <div class="check-box ${item.completed ? "checked" : ""}" onclick="toggleStatus('${item.id}', ${item.completed ? "false" : "true"})" title="Toggle archive visibility">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>
    </div>
  `).join("");
}

onValue(quotesRef, (snapshot) => {
  const quotes = [];

  snapshot.forEach((child) => {
    quotes.push({
      id: child.key,
      ...child.val()
    });
  });

  quotes.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  renderInbox(quotes);
});

window.toggleStatus = async function (id, completed) {
  await update(ref(db, `quoteRequests/${id}`), { completed });
};

window.deleteEntry = async function (id) {
  if (confirm("Confirm deletion? This removes the quote request permanently.")) {
    await remove(ref(db, `quoteRequests/${id}`));
  }
};