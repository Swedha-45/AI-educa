import { auth, db } from "./firebase.js";
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- Auth Check ---


// --- DOM Elements ---
const indexView = document.getElementById('indexView');
const chapterContent = document.getElementById('chapterContent');
const homeBtn = document.getElementById('homeBtn');
const slidesContainer = document.getElementById('slidesContainer');
const progressBar = document.getElementById("progressBar");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");

// --- Variables ---
let currentChapter = null;
let currentSlide = 0;

// --- Chapter Data ---
export const chapters = [
{
lesson: 1,
title:"Basic Arithmetic",
slides:[
{title:"Introduction to Arithmetic", content:["Arithmetic is the study of numbers.","Foundation for math.","Used in daily life like shopping."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917242.png", text:"5 apples cost ₹50 → 1 apple = ₹10"}},
{title:"Percentages", content:["Means per hundred.","Formula: (Part ÷ Whole) × 100","Used in discounts."], example:{img:"https://cdn-icons-png.flaticon.com/512/1828/1828919.png", text:"20% of 100 = 20"}},
{title:"Profit & Loss", content:["Profit = Selling Price - Cost Price","Loss = Cost Price - Selling Price","Important in business."], example:{img:"https://cdn-icons-png.flaticon.com/512/3135/3135715.png", text:"CP ₹100, SP ₹120 → Profit ₹20"}},
{title:"Ratio & Proportion", content:["Compares quantities.","Simplify by dividing.","Used in sharing."], example:{img:"https://cdn-icons-png.flaticon.com/512/2942/2942065.png", text:"10 : 20 → 1 : 2"}},
{title:"Simple Interest", content:["Extra money for borrowing.","Formula: (P×R×T)/100","Used in banks."], example:{img:"https://cdn-icons-png.flaticon.com/512/3135/3135706.png", text:"SI on ₹200 @10% for 1 yr = ₹20"}}
]
},
{
lesson: 2,
title:"Speed Math",
slides:[
{title:"Introduction to Speed Math", content:["Fast calculations.","Helps in exams.","Practice daily."], example:{img:"https://cdn-icons-png.flaticon.com/512/2103/2103658.png", text:"10 + 15 = 25"}},
{title:"Time and Distance", content:["Speed = Distance ÷ Time","Time = Distance ÷ Speed","Distance = Speed × Time"], example:{img:"https://cdn-icons-png.flaticon.com/512/2942/2942065.png", text:"Speed 50 km/h, Time 2 hrs → Distance 100 km"}},
{title:"Work and Time", content:["Work done in days.","One day work = 1 ÷ Total days","Used in group work."], example:{img:"https://cdn-icons-png.flaticon.com/512/3135/3135706.png", text:"A does work in 5 days → 1 day work = 1/5"}},
{title:"Estimation", content:["Approximate calculations.","Round numbers.","Quick checks."], example:{img:"https://cdn-icons-png.flaticon.com/512/3063/3063821.png", text:"Estimate 49 + 51 ≈ 100"}},
{title:"Applications", content:["Use in real life.","Practice problems.","Accuracy matters."], example:{img:"https://cdn-icons-png.flaticon.com/512/1995/1995574.png", text:"Train speed problems"}}
]
},
{
lesson: 3,
title:"Logical Reasoning",
slides:[
{title:"Introduction to Logical Reasoning", content:["Solve problems with thinking.","Used in puzzles.","Improves brain."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917260.png", text:"If A > B and B > C, then A > C"}},
{title:"Patterns", content:["Find next in series.","Numbers or shapes.","Common in exams."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917270.png", text:"1, 3, 5, ? → 7"}},
{title:"Directions", content:["North, South, East, West.","Turn left or right.","Find final direction."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917252.png", text:"Face North, turn right → East"}},
{title:"Odd One Out", content:["Find different item.","Compare all.","Think why."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917258.png", text:"Apple, Banana, Carrot, Orange → Carrot"}},
{title:"Simple Puzzles", content:["Easy brain teasers.","Step by step.","Practice fun."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917262.png", text:"Arrange numbers 1-3"}}
]
},
{
lesson: 4,
title:"Verbal Ability",
slides:[
{title:"Introduction to Verbal Ability", content:["Words and language.","Helps in reading.","Key for tests."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917280.png", text:"Read and understand."}},
{title:"Grammar Basics", content:["Nouns, Verbs, Adjectives.","Sentence parts.","Correct usage."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917281.png", text:"The cat runs. (Noun: cat, Verb: runs)"}},
{title:"Synonyms", content:["Words with same meaning.","Like happy = joyful.","Used in vocab."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917282.png", text:"Big = Large"}},
{title:"Antonyms", content:["Words with opposite meaning.","Hot = Cold.","Practice pairs."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917283.png", text:"Fast = Slow"}},
{title:"Simple Sentences", content:["Make correct sentences.","Punctuation.","Read aloud."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917284.png", text:"I like apples."}}
]
},
{
lesson: 5,
title:"Non-Verbal & DI",
slides:[
{title:"Introduction to Non-Verbal", content:["Visual problems.","Shapes and figures.","Observe carefully."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917280.png", text:"Find next shape."}},
{title:"Basic Graphs", content:["Bar charts.","Show comparisons.","Read heights."], example:{img:"https://cdn-icons-png.flaticon.com/512/992/992651.png", text:"Tallest bar is highest."}},
{title:"Shapes", content:["Triangles, squares.","Count sides.","Mirror images."], example:{img:"https://cdn-icons-png.flaticon.com/512/2920/2920245.png", text:"Square has 4 sides."}},
{title:"Simple Series", content:["Next number or shape.","Find pattern.","Easy ones."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917262.png", text:"1, 2, 3, ? → 4"}},
{title:"Data Interpretation", content:["Look at tables.","Find answers.","Basic sums."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917290.png", text:"Table of scores."}}
]
}
    
];

// --- FIRESTORE: Log Chapter Completion ---
async function logChapterCompletion(uid, chapter) {
  try {
    const historyRef = collection(db, "users", uid, "activities");

    const q = query(historyRef, where("chapterId", "==", chapter.lesson));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      alert("This chapter is already completed!");
      return false;
    }

    await addDoc(historyRef, {
      type: "chapter",
      chapterId: chapter.lesson,
      chapterTitle: chapter.title,
      totalSlides: chapter.slides.length,
      completedAt: serverTimestamp()
    });

    alert("Chapter marked as completed!");
    return true;
  } catch (err) {
    console.error("Firestore Error:", err);
    alert("Error saving chapter completion. Try again!");
    return false;
  }
}

// --- Chapter Navigation ---
export function openChapter(index) {
  currentChapter = chapters.find(c => c.lesson === index);
  currentSlide = 0;

  indexView.style.display = "none";
  chapterContent.style.display = "block";
  homeBtn.style.display = "block";

  loadSlides(currentChapter);
  showSlide(currentSlide);
}

function loadSlides(chapter) {
  slidesContainer.innerHTML = "";
  chapter.slides.forEach(sl => {
    const div = document.createElement("div");
    div.className = "slide";
    div.innerHTML = `
      <h2>${sl.title}</h2>
      <ul>${sl.content.map(item => `<li>${item}</li>`).join('')}</ul>
      <div class="example">
        <img src="${sl.example.img}" alt="Example">
        <p>${sl.example.text}</p>
      </div>
    `;
    slidesContainer.appendChild(div);
  });
}

function showSlide(i) {
  const slides = document.querySelectorAll(".slide");
  slides.forEach(s => s.classList.remove("active"));
  slides[i].classList.add("active");

  progressBar.style.width = ((i + 1) / slides.length * 100) + "%";
  prevBtn.disabled = (i === 0);

  if (i === slides.length - 1) {
    nextBtn.style.display = "none";
    submitBtn.style.display = "inline-block";
  } else {
    nextBtn.style.display = "inline-block";
    submitBtn.style.display = "none";
  }
}

function nextSlide() {
  const slides = document.querySelectorAll(".slide");
  if (currentSlide < slides.length - 1) {
    currentSlide++;
    showSlide(currentSlide);
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    showSlide(currentSlide);
  } else {
    goHome();
  }
}

function goHome() {
  chapterContent.style.display = "none";
  indexView.style.display = "block";
  homeBtn.style.display = "none";
}

// --- Submit Chapter ---
async function submitChapter() {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to save your progress!");
    return;
  }

  const success = await logChapterCompletion(user.uid, currentChapter);
  if (success) goHome();
}

// --- Optional: Redirect to results page ---
function hometime() {
  window.location.href = "home38.html";
}

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Fetch user grade
  const userDoc = await getDoc(doc(db, "users", user.uid));
  const grade = Number(userDoc.data()?.grade);
  const allowedGrades = [6, 7, 8]; // For grades 6-8
  if (!allowedGrades.includes(grade)) {
    alert("This learning module is not available for your grade.");
    const homePage = (grade >= 9 && grade <= 10) ? "home910.html" : "home38.html";
    window.location.href = homePage;
  }
});

// --- Event Listeners ---
nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);
submitBtn.addEventListener("click", submitChapter);
homeBtn.addEventListener("click", goHome);

window.openChapter = openChapter;
window.goHome = goHome;
window.submitChapter = submitChapter;
window.hometime = hometime;
