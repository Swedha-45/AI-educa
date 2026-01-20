import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc, collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ---------------- QUESTION BANK ---------------- */
const QUESTIONS = [
  
  { "chapter": 1, "topic": "Advanced Arithmetic", "q": "If 12 machines can produce 480 units, how many units can 7 machines produce?", "o": ["240", "280", "300", "320"], "c": 1 },
  { "chapter": 1, "topic": "Advanced Arithmetic", "q": "A price increases from ₹800 to ₹1000. What is the percentage increase?", "o": ["20%", "25%", "30%", "40%"], "c": 1 },
  { "chapter": 1, "topic": "Advanced Arithmetic", "q": "By selling an item for ₹960, a man gains 20%. What was the Cost Price?", "o": ["₹750", "₹800", "₹850", "₹900"], "c": 1 },
  { "chapter": 1, "topic": "Advanced Arithmetic", "q": "Find the Compound Interest on ₹10,000 for 2 years at 10% per annum.", "o": ["₹2000", "₹2100", "₹2200", "₹2500"], "c": 1 },
  { "chapter": 1, "topic": "Advanced Arithmetic", "q": "If A:B = 2:3 and B:C = 4:5, find A:C.", "o": ["8:15", "2:5", "6:15", "10:12"], "c": 0 },
  { "chapter": 1, "topic": "Advanced Arithmetic", "q": "Successive discounts of 10% and 10% are equivalent to a single discount of?", "o": ["20%", "18%", "19%", "21%"], "c": 2 },
  { "chapter": 1, "topic": "Advanced Arithmetic", "q": "A sum doubles in 8 years at Simple Interest. What is the rate %?", "o": ["10%", "12.5%", "15%", "20%"], "c": 1 },
  { "chapter": 1, "topic": "Advanced Arithmetic", "q": "The ratio of two numbers is 3:4. If their HCF is 5, find the larger number.", "o": ["15", "20", "25", "30"], "c": 1 },
  { "chapter": 1, "topic": "Advanced Arithmetic", "q": "If 40% of (A + B) = 60% of (A - B), then 2A is equal to how many B?", "o": ["3B", "5B", "10B", "12B"], "c": 2 },
  { "chapter": 1, "topic": "Advanced Arithmetic", "q": "What is the fourth proportional to 4, 9, and 12?", "o": ["18", "21", "24", "27"], "c": 0 },

  { "chapter": 2, "topic": "Algebra", "q": "Solve for x: 3(x - 4) = 2(x + 1)", "o": ["10", "12", "14", "16"], "c": 2 },
  { "chapter": 2, "topic": "Algebra", "q": "What is the discriminant of the quadratic equation x² + 5x + 6 = 0?", "o": ["1", "0", "-1", "25"], "c": 0 },
  { "chapter": 2, "topic": "Algebra", "q": "If α and β are roots of x² - 5x + 6 = 0, find α + β.", "o": ["-5", "5", "6", "-6"], "c": 1 },
  { "chapter": 2, "topic": "Algebra", "q": "Expand: (2x - 3y)²", "o": ["4x²-9y²", "4x²+9y²-12xy", "4x²-12xy-9y²", "4x²+9y²"], "c": 1 },
  { "chapter": 2, "topic": "Algebra", "q": "Find the 10th term of the AP: 2, 7, 12, ...", "o": ["45", "47", "50", "52"], "c": 1 },
  { "chapter": 2, "topic": "Algebra", "q": "Which of these is a factor of x³ - 1?", "o": ["x+1", "x-1", "x²-1", "x+2"], "c": 1 },
  { "chapter": 2, "topic": "Algebra", "q": "Value of k for which x=2 is a root of kx² + 2x - 3 = 0?", "o": ["-1/4", "1/4", "1/2", "-1/2"], "c": 0 },
  { "chapter": 2, "topic": "Algebra", "q": "Simplify: (a + b)² - (a - b)²", "o": ["2a²+2b²", "4ab", "0", "2ab"], "c": 1 },
  { "chapter": 2, "topic": "Algebra", "q": "Degree of a cubic polynomial is?", "o": ["1", "2", "3", "0"], "c": 2 },
  { "chapter": 2, "topic": "Algebra", "q": "If x + 1/x = 3, then x² + 1/x² is?", "o": ["9", "7", "11", "6"], "c": 1 },

  { "chapter": 3, "topic": "Logical Reasoning", "q": "If PAINT is coded as 74128 and EXCEL as 93596, how is ACCEPT coded?", "o": ["455978", "544978", "455908", "733978"], "c": 0 },
  { "chapter": 3, "topic": "Logical Reasoning", "q": "A man walks 5km South, then 3km West, then 5km North. How far is he from the start?", "o": ["3km", "5km", "8km", "13km"], "c": 0 },
  { "chapter": 3, "topic": "Logical Reasoning", "q": "Pointing to a boy, Meena says 'He is the son of my father's only son'. How is the boy related to Meena?", "o": ["Brother", "Cousin", "Nephew", "Uncle"], "c": 2 },
  { "chapter": 3, "topic": "Logical Reasoning", "q": "Statements: All stars are moons. All moons are planets. Conclusion: All stars are planets?", "o": ["True", "False", "Maybe", "None"], "c": 0 },
  { "chapter": 3, "topic": "Logical Reasoning", "q": "Next term in series: 1, 4, 9, 16, 25, ?", "o": ["30", "35", "36", "49"], "c": 2 },
  { "chapter": 3, "topic": "Logical Reasoning", "q": "If '-' means '+', '+' means 'x', 'x' means '÷', then: 10 + 2 - 5 x 1 = ?", "o": ["15", "25", "20", "10"], "c": 1 },
  { "chapter": 3, "topic": "Logical Reasoning", "q": "Odd one out: Square, Rectangle, Circle, Rhombus", "o": ["Square", "Rectangle", "Circle", "Rhombus"], "c": 2 },
  { "chapter": 3, "topic": "Logical Reasoning", "q": "In a row of 20, A is 5th from the left. What is his position from the right?", "o": ["15th", "16th", "17th", "14th"], "c": 1 },
  { "chapter": 3, "topic": "Logical Reasoning", "q": "If Monday is the 1st, what is the 25th day of the same month?", "o": ["Monday", "Tuesday", "Wednesday", "Thursday"], "c": 3 },
  { "chapter": 3, "topic": "Logical Reasoning", "q": "Which number replaces the '?' in: 3, 7, 15, 31, ?", "o": ["62", "63", "64", "65"], "c": 1 },

  { "chapter": 4, "topic": "Verbal Ability", "q": "Choose the correct preposition: He is proficient ___ English.", "o": ["in", "at", "with", "on"], "c": 0 },
  { "chapter": 4, "topic": "Verbal Ability", "q": "Find the correctly spelled word.", "o": ["Occurence", "Occurrence", "Ocurrence", "Occurance"], "c": 1 },
  { "chapter": 4, "topic": "Verbal Ability", "q": "Antonym of 'Artificial' is?", "o": ["Natural", "Synthetic", "Man-made", "Fake"], "c": 0 },
  { "chapter": 4, "topic": "Verbal Ability", "q": "Change to Passive: 'The chef cooked the meal.'", "o": ["The meal is cooked.", "The meal was cooked by the chef.", "Meal was cook by chef.", "Chef had cooked meal."], "c": 1 },
  { "chapter": 4, "topic": "Verbal Ability", "q": "Identify the type of sentence: 'Alas! We lost the match.'", "o": ["Assertive", "Imperative", "Exclamatory", "Interrogative"], "c": 2 },
  { "chapter": 4, "topic": "Verbal Ability", "q": "Synonym of 'Abundant'?", "o": ["Scarce", "Plentiful", "Rare", "Limited"], "c": 1 },
  { "chapter": 4, "topic": "Verbal Ability", "q": "Meaning of idiom 'To turn over a new leaf'?", "o": ["To plant a tree", "To change behavior for better", "To read a book", "To hide something"], "c": 1 },
  { "chapter": 4, "topic": "Verbal Ability", "q": "Which part of speech is 'Quickly'?", "o": ["Adjective", "Adverb", "Verb", "Noun"], "c": 1 },
  { "chapter": 4, "topic": "Verbal Ability", "q": "Identify the clause: 'If it rains, we will stay home.'", "o": ["Noun Clause", "Adverbial Clause", "Adjective Clause", "Main Clause"], "c": 1 },
  { "chapter": 4, "topic": "Verbal Ability", "q": "Choose the correct article: 'He is ___ honest man.'", "o": ["a", "an", "the", "no article"], "c": 1 },

  { "chapter": 5, "topic": "Non-Verbal & DI", "q": "In a pie chart, a sector of 90° represents what percentage of the total?", "o": ["20%", "25%", "33%", "50%"], "c": 1 },
  { "chapter": 5, "topic": "Non-Verbal & DI", "q": "A cube is painted red on all sides and cut into 64 small cubes. How many have no side painted?", "o": ["4", "8", "16", "27"], "c": 1 },
  { "chapter": 5, "topic": "Non-Verbal & DI", "q": "In a dice, if 1 is adjacent to 2, 3, 4, and 5, which number is opposite to 1?", "o": ["2", "3", "4", "6"], "c": 3 },
  { "chapter": 5, "topic": "Non-Verbal & DI", "q": "A line graph showing a downward slope indicates?", "o": ["Increase", "Decrease", "Constant", "Fluctuation"], "c": 1 },
  { "chapter": 5, "topic": "Non-Verbal & DI", "q": "Identify the pattern: 1, 8, 27, 64, ?", "o": ["100", "121", "125", "144"], "c": 2 },
  { "chapter": 5, "topic": "Non-Verbal & DI", "q": "If a bar graph scale is 1 unit = 50 units, a bar of 4 units represents?", "o": ["100", "150", "200", "250"], "c": 2 },
  { "chapter": 5, "topic": "Non-Verbal & DI", "q": "A mirror image of the word 'BOX' would look like?", "o": ["XOB", "BOX (inverted)", "XOB (letters reversed)", "None"], "c": 2 },
  { "chapter": 5, "topic": "Non-Verbal & DI", "q": "Number of triangles in a square with both diagonals drawn?", "o": ["4", "6", "8", "10"], "c": 2 },
  { "chapter": 5, "topic": "Non-Verbal & DI", "q": "Data represented using pictures is called?", "o": ["Histogram", "Pictograph", "Line graph", "Pie chart"], "c": 1 },
  { "chapter": 5, "topic": "Non-Verbal & DI", "q": "Which chart is best for showing 'parts of a whole'?", "o": ["Bar chart", "Line graph", "Pie chart", "Scatter plot"], "c": 2 }

];

/* ---------------- DOM ---------------- */
const $ = id => document.getElementById(id);
const nextBtn = $("nextBtn");
const progressBar = $("progressBar").firstElementChild;

let quiz = { chapter: null, questions: [], index: 0, score: 0, timer: null, time: 20 };

/* ---------------- QUIZ LOGIC ---------------- */
function startQuiz(chapter) {
  quiz.chapter = chapter;
  quiz.questions = (chapter===0) ? QUESTIONS : QUESTIONS.filter(q=>q.chapter===chapter);
  quiz.index = 0;
  quiz.score = 0;

  $("chapterButtons").classList.add("hidden");
  $("quiz").classList.remove("hidden");
  $("totalQ").textContent = quiz.questions.length;

  showQuestion();
}

function showQuestion() {
  clearInterval(quiz.timer);
  quiz.time = 20;
  const q = quiz.questions[quiz.index];
  if (!q) return showResult();

  $("category").textContent = q.topic;
  $("question").textContent = q.q;
  $("qNo").textContent = quiz.index+1;

  const ansDiv = $("answers");
  ansDiv.innerHTML = "";
  q.o.forEach((opt, i)=>{
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = ()=> checkAnswer(i, btn);
    ansDiv.appendChild(btn);
  });

  nextBtn.disabled = true;
  nextBtn.textContent = (quiz.index === quiz.questions.length -1) ? 'Submit' : 'Next';
  updateTimeBar();
  startTimer();
}

function checkAnswer(i, btn){
  clearInterval(quiz.timer);
  const correct = quiz.questions[quiz.index].c;
  document.querySelectorAll("#answers button").forEach((b, idx)=>{
    b.disabled=true;
    if(idx===correct)b.classList.add("correct");
  });
  if(i===correct) quiz.score++;
  btn.classList.add(i===correct ? "correct":"wrong");
  nextBtn.disabled=false;
}

nextBtn.addEventListener('click', ()=>{
  if(quiz.index < quiz.questions.length -1){ quiz.index++; showQuestion(); }
  else showResult();
});

function startTimer(){
  $("timer").textContent=quiz.time+"s";
  quiz.timer=setInterval(()=>{
    quiz.time--;
    $("timer").textContent=quiz.time+"s";
    updateTimeBar();
    if(quiz.time<=0){ clearInterval(quiz.timer); nextBtn.disabled=false; 
      const correct = quiz.questions[quiz.index].c;
      document.querySelectorAll("#answers button")[correct].classList.add("correct");
      document.querySelectorAll("#answers button").forEach(b=>b.disabled=true);
    }
  },1000);
}

function updateTimeBar(){ progressBar.style.width=((quiz.time/20)*100)+"%"; }

async function showResult(){
  clearInterval(quiz.timer);
  $("quiz").classList.add("hidden");
  $("result").classList.remove("hidden");
  $("score").textContent=`Score: ${quiz.score} / ${quiz.questions.length}`;

  const user = auth.currentUser;
  if(user){
    // Save quiz result to activities
    try{
      await addDoc(collection(db,"users",user.uid,"activities"),{
        type: "quiz",
        chapterId: quiz.chapter,
        score: quiz.score,
        total: quiz.questions.length,
        completedAt: serverTimestamp()
      });
    }catch(err){ console.error(err); }
  }
}

/* ---------------- Home redirection function ---------------- */
async function goHome() {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        
        // Check for 'grade' or 'standard' and convert to Number
        const grade = Number(userData?.grade || userData?.standard);
        
        if (grade >= 9 && grade <= 10) {
            window.location.href = "home910.html";
        } else {
            // Default for grades 3-8 or if grade is not found
            window.location.href = "home38.html";
        }
    } catch (err) {
        console.error("Redirection error:", err);
        window.location.href = "home38.html"; // Safe fallback
    }
}

// Make it global for the onclick attribute
window.goHome = goHome;
/* ---------------- AUTH + BUTTON ENABLE ---------------- */
onAuthStateChanged(auth, async (user)=>{
  if(!user) return window.location.href="login.html";

  // Fetch user grade
  const userDoc = await getDoc(doc(db, "users", user.uid));
  const grade = Number(userDoc.data()?.grade);
  const allowedGrades = [9, 10]; // For quiz3
  if (!allowedGrades.includes(grade)) {
    alert("This quiz is not available for your grade.");
    const homePage = (grade >= 9 && grade <= 10) ? "home910.html" : "home38.html";
    return window.location.href = homePage;
  }

  const snap = await getDocs(collection(db,"users",user.uid,"activities"));
  const completedChapters = snap.docs
    .filter(doc => doc.data().type === "chapter")
    .map(doc => doc.data().chapterId);

  document.querySelectorAll(".quiz-btn").forEach(btn=>{
    const chap = Number(btn.dataset.chapter);
    let disabled = false;
    if (chap === 0) {
      // Full quiz enabled only after all chapters 1-5 are completed
      disabled = ![1,2,3,4,5].every(ch => completedChapters.includes(ch));
    } else {
      // Other chapters enabled only if their lesson is completed
      disabled = !completedChapters.includes(chap);
    }
    btn.disabled = disabled;
    btn.onclick = ()=> startQuiz(chap);
  });
});
