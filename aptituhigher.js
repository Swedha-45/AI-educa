import { auth, db } from "./firebase.js";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
title:"Advanced Arithmetic",
slides:[
{title:"Introduction to Arithmetic", content:["Arithmetic is the study of numbers.","Foundation for aptitude exams.","Used in finance, shopping and banking."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917242.png", text:"6 pens cost ₹90 → 1 pen = ₹15"}},
{title:"Percentages", content:["Means per hundred.","Formula: (Part ÷ Whole) × 100","Used in discounts & marks."], example:{img:"https://cdn-icons-png.flaticon.com/512/1828/1828919.png", text:"40% of 250 = 100"}},
{title:"Profit & Loss", content:["Profit = SP − CP","Loss = CP − SP","Important in business maths."], example:{img:"https://cdn-icons-png.flaticon.com/512/3135/3135715.png", text:"CP ₹800, SP ₹920 → Profit ₹120"}},
{title:"Ratio & Proportion", content:["Compares quantities of same unit.","Simplify by common factors.","a : b = c : d ⇒ a×d = b×c","Used in mixtures & sharing."], example:{img:"https://cdn-icons-png.flaticon.com/512/2942/2942065.png", text:"20 : 30 → 2 : 3"}},
{title:"Simple & Compound Interest", content:["Interest = extra money paid.","SI = (P×R×T)/100","CI grows faster than SI","Used in banks & savings."], example:{img:"https://cdn-icons-png.flaticon.com/512/3135/3135706.png", text:"SI on ₹3000 @10% for 2 yrs = ₹600"}}
]
},
{
lesson: 2,
title:"Algebra",
slides:[
{title:"Introduction to Algebra", content:["Algebra uses symbols and letters to represent numbers.","Variables can change their values.","Constants have fixed values.","Used to represent real-life problems mathematically."], example:{img:"https://cdn-icons-png.flaticon.com/512/2103/2103658.png", text:"x + 5 = 12"}},
{title:"Linear Equations", content:["Highest power of variable is 1.","Represents straight-line relationships.","Same operation must be done on both sides.","Used in age and money problems."], example:{img:"https://cdn-icons-png.flaticon.com/512/2942/2942065.png", text:"2x + 4 = 16 → x = 6"}},
{title:"Algebraic Expressions & Identities", content:["Combination of variables and constants.","Identities are always true formulas.","Helps simplify expressions.","Used in competitive exams."], example:{img:"https://cdn-icons-png.flaticon.com/512/3135/3135706.png", text:"(a + b)² = a² + 2ab + b²"}},
{title:"Polynomials", content:["Expression with one or more terms.","Degree is the highest power.","Monomial, binomial, trinomial.","Used in graphing and modeling."], example:{img:"https://cdn-icons-png.flaticon.com/512/3063/3063821.png", text:"3x² + 2x + 7"}},
{title:"Applications & Exam Strategy", content:["Used in age, speed and number problems.","Simplify before solving.","Verify answers by substitution.","Practice word problems daily.","Accuracy is key in exams."], example:{img:"https://cdn-icons-png.flaticon.com/512/1995/1995574.png", text:"Age problems using equations"}}
]
},
{
lesson: 3,
title:"Logical Reasoning",
slides:[
{title:"Introduction to Logical Reasoning", content:["Logical reasoning helps solve problems using deductive thinking.","It is widely used in exams, puzzles, and real-life decision-making.","Improves analytical and critical thinking skills."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917260.png", text:"If all A are B, and all B are C, then all A are C."}},
{title:"Syllogisms", content:["A form of logical reasoning that uses statements to deduce conclusions.","Can be solved using Venn diagrams.","Common in competitive exams."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917270.png", text:"Some cats are dogs. Some dogs are pets. Some cats are pets? (Analyze)"}},
{title:"Puzzle Solving", content:["Puzzles include seating arrangements, ranking, and schedules.","Step-by-step deduction is required.","Focus on clues and eliminate impossibilities."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917252.png", text:"4 friends A,B,C,D sit in a row. B is left of C, D is right of A. Find positions."}},
{title:"Blood Relations & Directions", content:["Blood relations: Deduce relations using clues.","Directions: Solve problems using north, south, east, west.","Often tested in reasoning exams."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917258.png", text:"Point A is north of B, B is west of C. Where is C relative to A?"}},
{title:"Analytical Reasoning & Strategy", content:["Analyze data to make logical conclusions.","Identify patterns in sequences and tables.","Practice daily to improve speed and accuracy.","Check all possibilities before final answer."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917262.png", text:"Series: 2, 6, 12, 20, ? → Find the next number using pattern."}}
]
},
{
lesson: 4,
title:"Verbal Ability",
slides:[
{title:"Introduction to Verbal Ability", content:["Verbal Ability improves communication skills.","Helps in comprehension and writing.","Key for competitive exams."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917280.png", text:"Understand and interpret passages."}},
{title:"Grammar Basics", content:["Nouns, Pronouns, Verbs, Adjectives, Adverbs.","Tenses and their usage.","Sentence structure fundamentals."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917281.png", text:"She goes to school. Identify the verb and subject."}},
{title:"Para Jumbles", content:["Rearranging sentences to form a meaningful paragraph.","Focus on logical sequence.","Identify the starting and ending sentences first."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917282.png", text:"Arrange: C,B,A,D → Correct order: A,B,C,D"}}, 
{title:"Reading Comprehension", content:["Read passages carefully.","Identify main ideas, details and inferences.","Answer questions based on passage."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917283.png", text:"Passage comprehension practice."}},
{title:"Exam Strategies & Tips", content:["Skim the passage first.","Underline keywords.","Eliminate wrong options.","Practice regularly to improve speed and accuracy."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917284.png", text:"Time management during exams."}}
]
},
{
lesson: 5,
title:"Non-Verbal & DI",
slides:[
{title:"Introduction to Non-Verbal & DI", content:["Non-Verbal Ability involves solving problems using visual information.","Data Interpretation (DI) is about analyzing tables, charts, and graphs.","Develops analytical and observation skills for exams."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917280.png", text:"Interpret data from a pie chart to find percentages."}},
{title:"Graphs & Charts", content:["Bar graphs show comparison between categories.","Line graphs represent trends over time.","Pie charts show proportion of parts to a whole.","Practice reading and interpreting graphs carefully."], example:{img:"https://cdn-icons-png.flaticon.com/512/992/992651.png", text:"A bar chart shows sales of 5 products → Find the highest selling product."}},
{title:"Cubes & Dice", content:["Visualize cubes and their faces to solve problems.","Understand opposite faces: sum of opposite faces = 7 for standard dice.","Rotate and mentally visualize positions to find hidden faces."], example:{img:"https://cdn-icons-png.flaticon.com/512/2920/2920245.png", text:"Dice shows 3 on top, 2 in front → Find hidden face numbers."}},
{title:"Series & Patterns", content:["Number series: Identify arithmetic or geometric patterns.","Figure series: Identify rotation, reflection, and scaling patterns.","Solve series questions by finding the logic behind the sequence."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917262.png", text:"Series: 2, 6, 12, 20, ? → Next number = 30."}},
{title:"Analytical Reasoning & Strategy", content:["Combine DI and reasoning to solve complex questions.","Break large problems into smaller manageable parts.","Check calculations and logic before finalizing answers.","Practice regularly to improve speed and accuracy."], example:{img:"https://cdn-icons-png.flaticon.com/512/2917/2917290.png", text:"Table shows sales over 6 months → Determine the month with maximum profit."}}
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
  window.location.href = "home910.html";
}

// --- Event Listeners ---
nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);
submitBtn.addEventListener("click", submitChapter);
homeBtn.addEventListener("click", goHome);

window.openChapter = openChapter;
window.goHome = goHome;
window.submitChapter = submitChapter;
window.hometime = hometime;