import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const saveBtn = document.getElementById("saveNote");
const notesList = document.getElementById("notesList");

// --- NEW: Helper function to trigger History update ---
async function logToHistory(uid, title) {
  try {
    const historyRef = collection(db, "users", uid, "activities");
    await addDoc(historyRef, {
      type: "note",
      activity: title,
      date: serverTimestamp()
    });
  } catch (err) {
    console.error("History Log Error:", err);
  }
}

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const uid = user.uid;
  const notesRef = collection(db, "users", uid, "notes");

  await loadNotes(notesRef);

  saveBtn.addEventListener("click", async () => {
    const title = titleInput.value;
    const content = contentInput.value;

    if (!title || !content) {
      alert("Title and content required");
      return;
    }

    // 1. Save to Notes collection
    await addDoc(notesRef, {
      title: title,
      content: content,
      createdAt: serverTimestamp()
    });

    // 2. NEW: Save to Activities (History) collection
    await logToHistory(uid, title);

    titleInput.value = "";
    contentInput.value = "";

    await loadNotes(notesRef); 
    alert("Note saved and added to history!");
  });
});

async function loadNotes(notesRef) {
  notesList.innerHTML = ""; 
  const q = query(notesRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    notesList.innerHTML = "<li>No notes yet</li>";
    return;
  }

  snapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${data.title}</strong><br>
      ${data.content}<br><br>
    `;
    notesList.appendChild(li);
  });
}