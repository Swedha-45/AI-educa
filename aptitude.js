import { auth, db } from "./firebase.js"; // no getAuth() call needed

import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

//import { getUserGrade } from "./auth.js"; // ✅ now works

//mport { auth, db } from "./firebase.js";
//import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

//mport { updateDoc , doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ---------------- QUESTION BANK ---------------- */

const QUESTIONS = [
  // --- GRADE 3 ---
  { grade: 3, subject: "Science", q: "Which part of the plant grows underground?", o: ["Leaf", "Stem", "Root", "Flower"], c: 2 },
  { grade: 3, subject: "Science", q: "What state of matter is water vapor?", o: ["Solid", "Liquid", "Gas", "Plasma"], c: 2 },
  { grade: 3, subject: "Science", q: "Which animal is a carnivore?", o: ["Cow", "Rabbit", "Lion", "Deer"], c: 2 },
  { grade: 3, subject: "Math", q: "What is 5 x 8?", o: ["35", "40", "45", "50"], c: 1 },
  { grade: 3, subject: "Math", q: "How many sides does a pentagon have?", o: ["4", "5", "6", "8"], c: 1 },
  { grade: 3, subject: "Math", q: "Value of 100 - 45?", o: ["65", "55", "45", "50"], c: 1 },
  { grade: 3, subject: "English", q: "Which is a naming word (Noun)?", o: ["Run", "Happy", "London", "Quickly"], c: 2 },
  { grade: 3, subject: "English", q: "Opposite of 'Difficult' is?", o: ["Hard", "Easy", "Soft", "Heavy"], c: 1 },
  { grade: 3, subject: "Social", q: "Which is the smallest continent?", o: ["Asia", "Africa", "Australia", "Europe"], c: 2 },
  { grade: 3, subject: "Social", q: "Who was the first President of the USA?", o: ["Lincoln", "Jefferson", "Washington", "Adams"], c: 2 },

  // --- GRADE 4 ---
  { grade: 4, subject: "Science", q: "Which planet is the largest?", o: ["Mars", "Saturn", "Jupiter", "Neptune"], c: 2 },
  { grade: 4, subject: "Science", q: "What do bees collect from flowers?", o: ["Water", "Nectar", "Soil", "Leaves"], c: 1 },
  { grade: 4, subject: "Science", q: "Which gas do humans breathe out?", o: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], c: 2 },
  { grade: 4, subject: "Math", q: "What is 12 x 12?", o: ["124", "144", "164", "112"], c: 1 },
  { grade: 4, subject: "Math", q: "A right angle is how many degrees?", o: ["45", "90", "180", "360"], c: 1 },
  { grade: 4, subject: "Math", q: "0.5 is equal to which fraction?", o: ["1/2", "1/4", "1/5", "1/10"], c: 0 },
  { grade: 4, subject: "English", q: "Find the verb: 'The bird sings loudly.'", o: ["Bird", "Sings", "Loudly", "The"], c: 1 },
  { grade: 4, subject: "English", q: "Plural of 'Mouse' is?", o: ["Mouses", "Mice", "Mices", "Mouse"], c: 1 },
  { grade: 4, subject: "Social", q: "In which direction does the sun rise?", o: ["West", "North", "South", "East"], c: 3 },
  { grade: 4, subject: "Social", q: "Which is the longest river on Earth?", o: ["Amazon", "Nile", "Mississippi", "Ganges"], c: 1 },

  // --- GRADE 5 ---
  { grade: 5, subject: "Science", q: "Boiling point of water?", o: ["90°C", "100°C", "120°C", "80°C"], c: 1 },
  { grade: 5, subject: "Science", q: "Which organ pumps blood?", o: ["Lungs", "Heart", "Brain", "Kidney"], c: 1 },
  { grade: 5, subject: "Science", q: "Photosynthesis happens in?", o: ["Root", "Leaf", "Stem", "Seed"], c: 1 },
  { grade: 5, subject: "Math", q: "Square root of 81?", o: ["7", "8", "9", "10"], c: 2 },
  { grade: 5, subject: "Math", q: "5 × 6 = ?", o: ["25", "30", "35", "40"], c: 1 },
  { grade: 5, subject: "Math", q: "Prime number?", o: ["9", "10", "11", "12"], c: 2 },
  { grade: 5, subject: "English", q: "Past tense of go?", o: ["Go", "Gone", "Went", "Goed"], c: 2 },
  { grade: 5, subject: "English", q: "Adjective in 'blue sky'?", o: ["Sky", "Blue", "Is", "The"], c: 1 },
  { grade: 5, subject: "Social", q: "Who invented bulb?", o: ["Newton", "Edison", "Tesla", "Einstein"], c: 1 },
  { grade: 5, subject: "Social", q: "Eiffel tower is in?", o: ["Italy", "France", "UK", "Spain"], c: 1 },

  // --- GRADE 6 ---
  { grade: 6, subject: "Science", q: "What is the hardest natural substance?", o: ["Gold", "Iron", "Diamond", "Quartz"], c: 2 },
  { grade: 6, subject: "Science", q: "A magnet attracts which metal?", o: ["Aluminum", "Copper", "Iron", "Silver"], c: 2 },
  { grade: 6, subject: "Science", q: "Unit of Force is?", o: ["Joule", "Watt", "Newton", "Pascal"], c: 2 },
  { grade: 6, subject: "Math", q: "What is 3/4 as a percentage?", o: ["25%", "50%", "75%", "80%"], c: 2 },
  { grade: 6, subject: "Math", q: "If x + 5 = 12, what is x?", o: ["5", "7", "8", "17"], c: 1 },
  { grade: 6, subject: "Math", q: "Value of Pi (approx)?", o: ["2.14", "3.14", "4.14", "1.14"], c: 1 },
  { grade: 6, subject: "English", q: "Find the pronoun: 'She is my friend.'", o: ["Is", "My", "Friend", "She"], c: 3 },
  { grade: 6, subject: "English", q: "Which is a conjunction?", o: ["Because", "Quickly", "Wow", "Under"], c: 0 },
  { grade: 6, subject: "Social", q: "Where were the first Olympic Games?", o: ["Rome", "Athens", "Paris", "London"], c: 1 },
  { grade: 6, subject: "Social", q: "Who wrote the play 'Hamlet'?", o: ["Dickens", "Twain", "Shakespeare", "Orwell"], c: 2 },

  // --- GRADE 7 ---
  { grade: 7, subject: "Science", q: "Chemical symbol for Gold?", o: ["Ag", "Au", "Gd", "Fe"], c: 1 },
  { grade: 7, subject: "Science", q: "What is the speed of light?", o: ["300k km/s", "150k km/s", "500k km/s", "1M km/s"], c: 0 },
  { grade: 7, subject: "Science", q: "Sound cannot travel through...?", o: ["Water", "Air", "Vacuum", "Steel"], c: 2 },
  { grade: 7, subject: "Math", q: "Sum of angles in a triangle?", o: ["90°", "180°", "270°", "360°"], c: 1 },
  { grade: 7, subject: "Math", q: "What is (-5) + (-8)?", o: ["-3", "3", "-13", "13"], c: 2 },
  { grade: 7, subject: "Math", q: "10 to the power of 3?", o: ["30", "100", "300", "1000"], c: 3 },
  { grade: 7, subject: "English", q: "Identify the 'Preposition'?", o: ["Jump", "Under", "Blue", "They"], c: 1 },
  { grade: 7, subject: "English", q: "Which is a synonym for 'Huge'?", o: ["Tiny", "Vast", "Cold", "Slow"], c: 1 },
  { grade: 7, subject: "Social", q: "The Renaissance started in which country?", o: ["France", "England", "Italy", "Germany"], c: 2 },
  { grade: 7, subject: "Social", q: "Which layer of Earth is the hottest?", o: ["Crust", "Mantle", "Outer Core", "Inner Core"], c: 3 },

  // --- GRADE 8 ---
  { grade: 8, subject: "Science", q: "Atomic number of Oxygen?", o: ["6", "7", "8", "16"], c: 2 },
  { grade: 8, subject: "Science", q: "Who proposed the Theory of Evolution?", o: ["Einstein", "Newton", "Darwin", "Mendel"], c: 2 },
  { grade: 8, subject: "Science", q: "Main component of Natural Gas?", o: ["Ethane", "Methane", "Propane", "Butane"], c: 1 },
  { grade: 8, subject: "Math", q: "Value of 2 to the power 5?", o: ["10", "25", "32", "64"], c: 2 },
  { grade: 8, subject: "Math", q: "A hexagon has how many diagonals?", o: ["6", "9", "12", "5"], c: 1 },
  { grade: 8, subject: "Math", q: "Slope of a horizontal line?", o: ["0", "1", "Undefined", "-1"], c: 0 },
  { grade: 8, subject: "English", q: "Which sentence is in Passive Voice?", o: ["He ate cake", "Cake was eaten", "He is eating", "Eat cake"], c: 1 },
  { grade: 8, subject: "English", q: "Meaning of 'Abundant'?", o: ["Scarce", "Plentiful", "Missing", "Old"], c: 1 },
  { grade: 8, subject: "Social", q: "When did World War I start?", o: ["1912", "1914", "1939", "1945"], c: 1 },
  { grade: 8, subject: "Social", q: "Which is the highest mountain peak?", o: ["K2", "Everest", "Kangchenjunga", "Lhotse"], c: 1 },

  // --- GRADE 9 ---
  { grade: 9, subject: "Science", q: "Valency of Carbon?", o: ["2", "3", "4", "6"], c: 2 },
  { grade: 9, subject: "Science", q: "Acceleration due to gravity (g)?", o: ["8.9 m/s²", "9.8 m/s²", "10.2 m/s²", "7.5 m/s²"], c: 1 },
  { grade: 9, subject: "Science", q: "Function of Ribosomes?", o: ["Energy", "Protein Synthesis", "Storage", "Defense"], c: 1 },
  { grade: 9, subject: "Math", q: "Formula for area of a Circle?", o: ["2πr", "πr²", "2πr²", "πd"], c: 1 },
  { grade: 9, subject: "Math", q: "Which is an irrational number?", o: ["2", "0.5", "√2", "2/3"], c: 2 },
  { grade: 9, subject: "Math", q: "Sum of exterior angles of any polygon?", o: ["180°", "360°", "540°", "Varies"], c: 1 },
  { grade: 9, subject: "English", q: "Identify the 'Gerund'?", o: ["Walk", "Walking", "To walk", "Walked"], c: 1 },
  { grade: 9, subject: "English", q: "Who is the protagonist in '1984'?", o: ["O'Brien", "Winston Smith", "Snowball", "Napoleon"], c: 1 },
  { grade: 9, subject: "Social", q: "The French Revolution began in which year?", o: ["1776", "1789", "1812", "1848"], c: 1 },
  { grade: 9, subject: "Social", q: "What is the capital of Japan?", o: ["Seoul", "Beijing", "Tokyo", "Bangkok"], c: 2 },

  // --- GRADE 10 ---
  { grade: 10, subject: "Science", q: "What is the SI unit of Resistivity?", o: ["Ohm", "Ohm-meter", "Volt", "Ampere"], c: 1 },
  { grade: 10, subject: "Science", q: "Which mirror is used as a rear-view mirror?", o: ["Concave", "Convex", "Plane", "Bifocal"], c: 1 },
  { grade: 10, subject: "Science", q: "Process of losing electrons is?", o: ["Reduction", "Oxidation", "Corrosion", "Hydrogenation"], c: 1 },
  { grade: 10, subject: "Math", q: "Value of sin(90°)?", o: ["0", "0.5", "1", "Undefined"], c: 2 },
  { grade: 10, subject: "Math", q: "A quadratic equation has degree?", o: ["1", "2", "3", "4"], c: 1 },
  { grade: 10, subject: "Math", q: "Distance formula between two points?", o: ["Pythagorean", "Section", "Midpoint", "Tangent"], c: 0 },
  { grade: 10, subject: "English", q: "Meaning of the idiom 'Cold Feet'?", o: ["Sick", "Nervous", "Happy", "Cold weather"], c: 1 },
  { grade: 10, subject: "English", q: "Who wrote 'The Great Gatsby'?", o: ["Hemingway", "Fitzgerald", "Steinbeck", "Faulkner"], c: 1 },
  { grade: 10, subject: "Social", q: "Which body regulates global trade?", o: ["UN", "WHO", "WTO", "IMF"], c: 2 },
  { grade: 10, subject: "Social", q: "Magna Carta was signed in which year?", o: ["1066", "1215", "1492", "1776"], c: 1 }
];


/* ---------------- QUIZ STATE ---------------- */
let quiz = { grade: null, questions: [], index: 0, score: 0, timer: null, time: 20 };

/* ---------------- DOM HELPERS ---------------- */
const $ = id => document.getElementById(id);
const nextBtn = $("nextBtn");
const progressBar = $("progressBar");
const totalQSpan = $("totalQ");

const QUOTES = [
  { min: 80, text: "Excellent work! Keep up the great learning momentum." },
  { min: 60, text: "Great job! A little more practice and you'll master this." },
  { min: 40, text: "Nice effort — review the tricky ones and try again." },
  { min: 0,  text: "Keep practicing — every mistake is a step toward learning." }
];

/* ---------------- QUIZ FUNCTIONS ---------------- */
function startQuiz(grade) {
  quiz.grade = grade;
  quiz.questions = QUESTIONS.filter(q => q.grade === grade);
  quiz.index = 0;
  quiz.score = 0;

  $("setup")?.classList.add("hidden");
  $("quiz")?.classList.remove("hidden");

  if (totalQSpan) totalQSpan.textContent = quiz.questions.length;

  showQuestion();
}

function showQuestion() {
  resetTimer();
  const q = quiz.questions[quiz.index];
  if (!q) return showResult();

  $("category").textContent = q.subject;
  $("question").textContent = q.q;
  $("qNo").textContent = quiz.index + 1;

  const ansDiv = $("answers");
  ansDiv.innerHTML = "";
  q.o.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(i, btn);
    ansDiv.appendChild(btn);
  });

  if (nextBtn) {
    nextBtn.disabled = true;
    nextBtn.classList.remove('enabled');
    nextBtn.textContent = (quiz.index === quiz.questions.length - 1) ? 'Submit' : 'Next';
  }

  updateTimeBar();
  startTimer();
}

function checkAnswer(i, btn) {
  clearInterval(quiz.timer);
  const correct = quiz.questions[quiz.index].c;
  document.querySelectorAll("#answers button").forEach(b => b.disabled = true);

  if (i === correct) {
    quiz.score++;
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
    document.querySelectorAll("#answers button")[correct].classList.add("correct");
  }

  if (nextBtn) {
    nextBtn.disabled = false;
    nextBtn.classList.add('enabled');
  }
}

if (nextBtn) nextBtn.addEventListener('click', () => {
  if (nextBtn.disabled) return;
  if (quiz.index < quiz.questions.length - 1) {
    quiz.index++;
    showQuestion();
  } else {
    showResult();
  }
});

/* ---------------- TIMER ---------------- */
function startTimer() {
  quiz.time = 20;
  $("timer").textContent = "20s";
  updateTimeBar();

  quiz.timer = setInterval(() => {
    quiz.time--;
    $("timer").textContent = quiz.time + "s";
    updateTimeBar();

    if (quiz.time === 0) {
      clearInterval(quiz.timer);
      const correct = quiz.questions[quiz.index].c;
      document.querySelectorAll("#answers button").forEach((b, idx) => {
        b.disabled = true;
        if (idx === correct) b.classList.add('correct');
      });
      if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.classList.add('enabled');
      }
    }
  }, 1000);
}

function resetTimer() { clearInterval(quiz.timer); }
function updateTimeBar() {
  if (progressBar) progressBar.style.width = Math.max(0, (quiz.time / 20) * 100) + "%";
}

/* ---------------- RESULT ---------------- */
function showResult() {
  $("quiz")?.classList.add("hidden");
  $("result")?.classList.remove("hidden");
  $("score").textContent = `Score: ${quiz.score} / ${quiz.questions.length}`;

  const pct = Math.round((quiz.score / quiz.questions.length) * 100);
  const matched = QUOTES.find(q => pct >= q.min) || QUOTES[QUOTES.length - 1];
  $("quote").textContent = `${matched.text} (${pct}%)`;

  const user = auth.currentUser;
  if (user) saveQuizResult(user.uid);
}

/* ---------------- FIRESTORE SAVE ---------------- */
async function saveQuizResult(uid) {
  try {
    const quizRef = collection(db, "users", uid, "quizHistory");
    await addDoc(quizRef, {
      grade: quiz.grade,
      score: quiz.score,
      total: quiz.questions.length,
      date: serverTimestamp()
    });
    console.log("Quiz result saved for user:", uid);
  } catch (err) {
    console.error("Error saving quiz:", err);
  }
}

/* ---------------- AUTH STATE ---------------- */
window.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) throw new Error("User not found");

      const userData = snap.data();
      if (!userData.grade) await updateDoc(userRef, { grade: Number(userData.standard) });

      const grade = Number(userData.grade || userData.standard);
      startQuiz(grade);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });
});
