import { auth, db } from "./firebase.js";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const q = query(
    collection(db, "quizResults"),
    where("uid", "==", user.uid),
    orderBy("createdAt", "desc"),
    limit(1)
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    alert("No quiz result found");
    return;
  }

  const data = snap.docs[0].data();

  document.getElementById("grade").textContent = data.grade;
  document.getElementById("score").textContent =
    `${data.score} / ${data.total}`;
  document.getElementById("percentage").textContent = data.percentage;
});

window.goDashboard = () => {
  window.location.href = "dashboard.html";
};
