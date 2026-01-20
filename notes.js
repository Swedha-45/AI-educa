import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  getDoc, // Added this
  doc,    // Added this
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const saveBtn = document.getElementById("saveNote");
const notesList = document.getElementById("notesList");
const homeBtn = document.getElementById("homeBtn"); // Reference to home button

// Helper function for history
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

  // --- REDIRECT LOGIC START ---
  homeBtn.addEventListener("click", async () => {
    try {
      // Fetch the user's document to get their grade
      const userDocRef = doc(db, "users", uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const grade = parseInt(userData.grade); // Ensure it's a number

        if (grade >= 3 && grade <= 8) {
          window.location.href = "home38.html";
        } else if (grade >= 9 && grade <= 10) {
          window.location.href = "home910.html";
        } else {
          console.error("Grade outside of range or not set");
        }
      } else {
        console.error("No user profile found in Firestore!");
      }
    } catch (error) {
      console.error("Error fetching grade:", error);
    }
  });
  // --- REDIRECT LOGIC END ---

  await loadNotes(notesRef);

  saveBtn.addEventListener("click", async () => {
    const title = titleInput.value;
    const content = contentInput.value;

    if (!title || !content) {
      alert("Title and content required");
      return;
    }

    await addDoc(notesRef, {
      title: title,
      content: content,
      createdAt: serverTimestamp()
    });

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