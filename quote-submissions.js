import { db, ref, push, set } from "./firebase-config.js";

const EMAILJS_PUBLIC_KEY = "llw8oInxUM-hGUKbo";
const EMAILJS_SERVICE_ID = "service_w3u2aab";
const EMAILJS_TEMPLATE_ID = "template_7omw4mb";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quoteForm");
  if (!form) return;

  if (window.emailjs) {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY
    });
  } else {
    console.error("EmailJS script is not loaded.");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector("button[type='submit']");
    const originalText = btn.innerHTML;

    const quoteData = {
      name: document.getElementById("clientName")?.value.trim() || "",
      phone: document.getElementById("clientPhone")?.value.trim() || "",
      email: document.getElementById("clientEmail")?.value.trim() || "",
      type: document.getElementById("insuranceType")?.value || "",
      limit: document.getElementById("coverageLimit")?.value.trim() || "Not specified",
      details: document.getElementById("clientMessage")?.value.trim() || "No message added.",
      source: window.location.pathname.includes("quote") ? "Quote Page" : "Home Page",
      completed: false,
      createdAt: Date.now(),
      timestamp: new Date().toLocaleString()
    };

    btn.disabled = true;
    btn.textContent = "Sending...";

    try {
      const quoteRef = push(ref(db, "quoteRequests"));

      await set(quoteRef, quoteData);

      if (window.emailjs) {
        try {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, quoteData);
        } catch (emailError) {
          console.error("EmailJS failed:", emailError);
        }
      }

      btn.textContent = "Sent Successfully";
      form.reset();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 2200);
    } catch (error) {
      console.error("Firebase failed:", error);
      btn.textContent = "Try Again";
      alert("The quote could not be saved. Please check your connection and try again.");

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 2200);
    }
  });
});