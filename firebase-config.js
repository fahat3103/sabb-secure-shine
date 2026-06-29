import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDFzoYxSv1n0vV18ZUG5jyZabcqxbtkJHQ",
  authDomain: "sabb-insurance.firebaseapp.com",
  databaseURL: "https://sabb-insurance-default-rtdb.firebaseio.com",
  projectId: "sabb-insurance",
  storageBucket: "sabb-insurance.firebasestorage.app",
  messagingSenderId: "1083468931332",
  appId: "1:1083468931332:web:028212e4150abcbe71b051"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, push, set, onValue, remove, update };