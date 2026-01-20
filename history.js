import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, getDocs, query, where, orderBy, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const historyBody = document.getElementById("historyBody");

// --- Home redirection function ---
async function goHome() {
  const user = auth.currentUser;
  if (!user) return window.location.href = "login.html";

  const userDoc = await getDoc(doc(db, "users", user.uid));
  const grade = userDoc.data()?.grade;
  const homePage = (grade >= 9 && grade <= 10) ? "home910.html" : "home38.html";
  window.location.href = homePage;
}

// Make it global
window.goHome = goHome;

async function loadHistory(uid) {
    try {
        let rows = [];

        /* ---------- 1. QUIZ HISTORY ---------- */
        const quizRef = collection(db, "users", uid, "activities");
        const quizQuery = query(quizRef, where("type", "==", "quiz"));
        const quizSnap = await getDocs(quizQuery);
        quizSnap.forEach(docSnap => {
            const d = docSnap.data();
            rows.push({
                timestamp: d.completedAt?.toDate() || new Date(0),
                dateStr: d.completedAt?.toDate?.()?.toLocaleString() || "Unknown",
                type: "Quiz",
                title: "Quiz Completion",
                detail: `Chapter ${d.chapterId || 'N/A'}: Score ${d.score || 0} / ${d.total || 0}`
            });
        });

       /* ---------- 2. ACTIVITY HISTORY (Chapters, Notes, Chat) ---------- */
const activityRef = collection(db, "users", uid, "activities");
const activitySnap = await getDocs(activityRef);

activitySnap.forEach(docSnap => {
    const d = docSnap.data();
    const typeLabel = d.type || "Activity";

    // --- UPDATED TITLE & DETAIL LOGIC ---
    let displayTitle = typeLabel;
    let displayDetail = "";

    if (typeLabel === "Note") {
        displayTitle = "New Note Added";
        displayDetail = d.activity || "Note content";
    } else if (typeLabel === "Chat") {
        displayTitle = "Chatbot Interaction";
        displayDetail = d.activity || "Chat performed";
    } else if (typeLabel === "chapter") {
        displayTitle = `Lesson ${d.chapterId}: ${d.chapterTitle}`;
        displayDetail = `Completed ${d.totalSlides} slides`;
    } else {
        displayTitle = typeLabel;
        displayDetail = d.activity || "Action performed";
    }

    rows.push({
        timestamp: d.completedAt?.toDate() || d.date?.toDate() || new Date(0),
        dateStr: (d.completedAt?.toDate() || d.date?.toDate() || new Date()).toLocaleString(),
        type: typeLabel,
        title: displayTitle,
        detail: displayDetail
    });
});


        /* ---------- SORT & RENDER ---------- */
        rows.sort((a, b) => b.timestamp - a.timestamp);
        historyBody.innerHTML = "";

        if (rows.length === 0) {
            historyBody.innerHTML = `<div class="card" style="text-align:center;"><h2>No activity found yet.</h2></div>`;
            return;
        }

        rows.forEach(item => {
            const card = document.createElement("div");
            card.className = "activity-card";
            const typeClass = item.type.toLowerCase();
            
            card.innerHTML = `
                <div class="activity-info">
                    <span class="activity-date">${item.dateStr}</span>
                    <div class="activity-title">${item.title}</div>
                    <div class="activity-details">${item.detail}</div>
                </div>
                <span class="badge type-${typeClass}">
                    ${item.type}
                </span>
            `;
            historyBody.appendChild(card);
        });

    } catch (err) {
        console.error("History load error:", err);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, user => {
        if (user) loadHistory(user.uid);
        else window.location.href = "login.html";
    });
});