// auth.js
import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


/* -------------------- GET USER GRADE -------------------- */
window.getUserGrade = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) throw new Error("User profile not found");

  const grade = Number(snap.data().grade); // or .standard
  if (grade < 1 || grade > 12 || isNaN(grade)) throw new Error("Invalid grade");

  return grade;
};


/* -------------------- LOGIN -------------------- */
window.loginUser = async () => {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
};

/* -------------------- REGISTER -------------------- */
window.registerUser = async () => {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  const username = document.getElementById("username")?.value.trim();
  const grade = Number(document.getElementById("standard")?.value);
  const board = document.getElementById("board")?.value.trim();

  if (!email || !password || !username) {
    throw new Error("Username, email, and password are mandatory");
  }

  if (!grade || isNaN(grade) || grade < 1 || grade > 12) {
    throw new Error("Please select a valid Grade (1–12)");
  }

  const allowedBoards = ["CBSE", "State", "ICSE"];
  if (!allowedBoards.includes(board)) {
    throw new Error("Please select a valid Board");
  }

  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", userCred.user.uid), {
    uid: userCred.user.uid,
    username,
    email,
    grade, // ✅ single source of truth
    board,
    createdAt: serverTimestamp(),
  });

  return userCred.user;
};
