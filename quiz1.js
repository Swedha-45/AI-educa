import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= QUESTION BANK ================= */
const QUESTIONS = [

/* -------- Chapter 1 : Arithmetic -------- */
{ chapter:1, topic:"Arithmetic", q:"What is 25% of 200?", o:["25","50","75","100"], c:1 },
{ chapter:1, topic:"Arithmetic", q:"LCM of 4 and 6 is:", o:["6","12","24","36"], c:1 },
{ chapter:1, topic:"Arithmetic", q:"Average of 6, 8 and 10 is:", o:["6","7","8","9"], c:2 },
{ chapter:1, topic:"Arithmetic", q:"3/4 expressed as percentage is:", o:["65%","70%","75%","80%"], c:2 },
{ chapter:1, topic:"Arithmetic", q:"GCD of 24 and 36 is:", o:["6","12","18","24"], c:1 },
{ chapter:1, topic:"Arithmetic", q:"If CP = ₹100 and SP = ₹120, profit is:", o:["₹10","₹15","₹20","₹25"], c:2 },
{ chapter:1, topic:"Arithmetic", q:"Which is a prime number?", o:["9","15","17","21"], c:2 },
{ chapter:1, topic:"Arithmetic", q:"0.5 written as a fraction is:", o:["1/4","1/3","1/2","2/3"], c:2 },
{ chapter:1, topic:"Arithmetic", q:"Ratio of 10:20 in simplest form is:", o:["1:2","2:3","3:4","2:5"], c:0 },
{ chapter:1, topic:"Arithmetic", q:"20% discount on ₹500 equals:", o:["₹50","₹75","₹100","₹150"], c:2 },

/* -------- Chapter 2 : Speed Math -------- */
{ chapter:2, topic:"Speed Math", q:"CP ₹400, SP ₹520. Profit?", o:["₹100","₹120","₹150","₹80"], c:1 },
{ chapter:2, topic:"Speed Math", q:"Simple Interest on ₹2000 at 10% for 1 year:", o:["₹100","₹150","₹200","₹250"], c:2 },
{ chapter:2, topic:"Speed Math", q:"Speed = Distance ÷ ?", o:["Time","Work","Force","Energy"], c:0 },
{ chapter:2, topic:"Speed Math", q:"25% of 80 equals:", o:["10","15","20","25"], c:2 },
{ chapter:2, topic:"Speed Math", q:"10% of 450 is:", o:["40","45","50","55"], c:1 },
{ chapter:2, topic:"Speed Math", q:"Loss occurs when:", o:["SP > CP","SP = CP","SP < CP","Discount"], c:2 },
{ chapter:2, topic:"Speed Math", q:"A train travels 60 km in 1 hour. Speed is:", o:["30","40","50","60"], c:3 },
{ chapter:2, topic:"Speed Math", q:"A can do work in 10 days. One day work = ?", o:["1/5","1/8","1/10","1/12"], c:2 },
{ chapter:2, topic:"Speed Math", q:"Which helps fast calculation?", o:["Estimation","Guessing","Counting","Skipping"], c:0 },
{ chapter:2, topic:"Speed Math", q:"If distance is 120 km and speed is 60 km/h, time is:", o:["1 hr","2 hr","3 hr","4 hr"], c:1 },

/* -------- Chapter 3 : Logical Reasoning -------- */
{ chapter:3, topic:"Logical Reasoning", q:"Next number: 2, 6, 18, ?", o:["24","36","54","72"], c:2 },
{ chapter:3, topic:"Logical Reasoning", q:"CAT → DBU, DOG → ?", o:["EPH","EOG","DPH","EPG"], c:0 },
{ chapter:3, topic:"Logical Reasoning", q:"Facing North, turn right. Direction?", o:["West","East","South","North"], c:1 },
{ chapter:3, topic:"Logical Reasoning", q:"Mother’s brother is:", o:["Uncle","Nephew","Cousin","Father"], c:0 },
{ chapter:3, topic:"Logical Reasoning", q:"Odd one out:", o:["2","3","5","9"], c:3 },
{ chapter:3, topic:"Logical Reasoning", q:"A taller than B, B taller than C. Tallest?", o:["A","B","C","Cannot say"], c:0 },
{ chapter:3, topic:"Logical Reasoning", q:"Next letter: A, C, E, G, ?", o:["H","I","J","K"], c:1 },
{ chapter:3, topic:"Logical Reasoning", q:"All roses are flowers. Roses are:", o:["Plants","Trees","Leaves","Fruits"], c:0 },
{ chapter:3, topic:"Logical Reasoning", q:"If today is Monday, after 7 days?", o:["Sunday","Monday","Tuesday","Friday"], c:1 },
{ chapter:3, topic:"Logical Reasoning", q:"Find missing: 3, 7, 15, 31, ?", o:["62","63","64","65"], c:1 },

/* -------- Chapter 4 : Verbal Ability -------- */
{ chapter:4, topic:"Verbal Ability", q:"Which is a noun?", o:["Run","Happy","Book","Quickly"], c:2 },
{ chapter:4, topic:"Verbal Ability", q:"She ___ to school daily.", o:["go","goes","gone","going"], c:1 },
{ chapter:4, topic:"Verbal Ability", q:"Antonym of 'Hot' is:", o:["Warm","Cold","Heat","Fire"], c:1 },
{ chapter:4, topic:"Verbal Ability", q:"Synonym of 'Happy'?", o:["Sad","Joyful","Angry","Cry"], c:1 },
{ chapter:4, topic:"Verbal Ability", q:"Identify adjective: Red apple", o:["Red","Apple","Is","The"], c:0 },
{ chapter:4, topic:"Verbal Ability", q:"He ___ playing football.", o:["is","was","has","will"], c:0 },
{ chapter:4, topic:"Verbal Ability", q:"Which is punctuation?", o:["Noun","Verb","Comma","Adjective"], c:2 },
{ chapter:4, topic:"Verbal Ability", q:"Idiom meaning 'change for better'?", o:["Turn leaf","Turn new leaf","New book","Fresh page"], c:1 },
{ chapter:4, topic:"Verbal Ability", q:"Which is an adverb?", o:["Fast","Quick","Quickly","Speed"], c:2 },
{ chapter:4, topic:"Verbal Ability", q:"Article for 'honest man'?", o:["a","an","the","no article"], c:1 },

/* -------- Chapter 5 : Non-Verbal & DI -------- */
{ chapter:5, topic:"Non-Verbal & DI", q:"90° in pie chart equals?", o:["20%","25%","33%","50%"], c:1 },
{ chapter:5, topic:"Non-Verbal & DI", q:"Cube cut into 64 pieces, unpainted cubes?", o:["4","8","16","27"], c:1 },
{ chapter:5, topic:"Non-Verbal & DI", q:"Opposite face of 1 on dice?", o:["2","3","4","6"], c:3 },
{ chapter:5, topic:"Non-Verbal & DI", q:"Downward line graph shows:", o:["Increase","Decrease","Constant","Random"], c:1 },
{ chapter:5, topic:"Non-Verbal & DI", q:"Next: 1, 8, 27, 64, ?", o:["100","121","125","144"], c:2 },
{ chapter:5, topic:"Non-Verbal & DI", q:"Bar graph scale 1=50, bar of 4?", o:["100","150","200","250"], c:2 },
{ chapter:5, topic:"Non-Verbal & DI", q:"Mirror image of BOX?", o:["XOB","BOX","XOB reversed","None"], c:2 },
{ chapter:5, topic:"Non-Verbal & DI", q:"Triangles in square with diagonals?", o:["4","6","8","10"], c:2 },
{ chapter:5, topic:"Non-Verbal & DI", q:"Picture data representation is:", o:["Histogram","Pictograph","Line graph","Pie chart"], c:1 },
{ chapter:5, topic:"Non-Verbal & DI", q:"Best chart for parts of whole?", o:["Bar","Line","Pie","Scatter"], c:2 }
];

/* ================= QUIZ LOGIC ================= */
const $ = id => document.getElementById(id);
let quiz = { chapter:null, questions:[], index:0, score:0 };

document.querySelectorAll(".quiz-btn").forEach(btn=>{
  btn.onclick=()=>startQuiz(Number(btn.dataset.chapter));
});

function startQuiz(ch){
  quiz.chapter=ch;
  quiz.questions = ch===0 ? QUESTIONS : QUESTIONS.filter(q=>q.chapter===ch);
  quiz.index=0; quiz.score=0;
  $("chapterButtons").classList.add("hidden");
  $("quiz").classList.remove("hidden");
  $("totalQ").textContent=quiz.questions.length;
  showQuestion();
}

function showQuestion(){
  const q=quiz.questions[quiz.index];
  if(!q) return showResult();
  $("category").textContent=q.topic;
  $("question").textContent=q.q;
  $("qNo").textContent=quiz.index+1;
  const a=$("answers"); a.innerHTML="";
  q.o.forEach((opt,i)=>{
    const b=document.createElement("button");
    b.textContent=opt;
    b.onclick=()=>checkAnswer(i,b);
    a.appendChild(b);
  });
  $("nextBtn").disabled=true;
}

function checkAnswer(i,btn){
  const c=quiz.questions[quiz.index].c;
  document.querySelectorAll("#answers button").forEach((b,idx)=>{
    b.disabled=true;
    if(idx===c)b.classList.add("correct");
  });
  if(i===c) quiz.score++;
  else btn.classList.add("wrong");
  $("nextBtn").disabled=false;
}

$("nextBtn").onclick=()=>{
  quiz.index++;
  showQuestion();
};

async function showResult(){
  $("quiz").classList.add("hidden");
  $("result").classList.remove("hidden");
  $("score").textContent=`Score: ${quiz.score} / ${quiz.questions.length}`;
  if(auth.currentUser){
    await addDoc(collection(db,"users",auth.currentUser.uid,"activities"),{
      type:"quiz",
      chapterId:quiz.chapter,
      score:quiz.score,
      total:quiz.questions.length,
      completedAt:serverTimestamp()
    });
  }
}

async function goHome() {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {
        // Fetch user data to check grade
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const grade = Number(userData.grade || userData.standard);

            // Redirect based on grade range
            if (grade >= 9 && grade <= 10) {
                window.location.href = "home910.html";
            } else {
                // Default for 3-8 or other grades
                window.location.href = "home38.html";
            }
        } else {
            // Fallback if no user document exists
            window.location.href = "home38.html";
        }
    } catch (err) {
        console.error("Home redirection error:", err);
        window.location.href = "home38.html"; // Safe fallback
    }
}

// Make it global so the HTML onclick can find it
window.goHome = goHome;

/* ================= AUTH ================= */
/* ================= AUTH & LOCKING LOGIC ================= */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // 1. Fetch all completed activities for this user
  const snap = await getDocs(collection(db, "users", user.uid, "activities"));
  
  // 2. Create a list of Chapter IDs where the type is "lesson" (or "chapter")
  const completedLessons = snap.docs
    .filter(doc => doc.data().type === "chapter") // Adjust "chapter" to "lesson" if that's your tag
    .map(doc => doc.data().chapterId);

  // 3. Loop through buttons and enable/disable
  document.querySelectorAll(".quiz-btn").forEach(btn => {
    const chapId = Number(btn.dataset.chapter);

    if (chapId === 0) {
      // Logic for "Full Quiz": Only unlock if all 5 chapters are done
      const allDone = [1, 2, 3, 4, 5].every(id => completedLessons.includes(id));
      btn.disabled = !allDone;
    } else {
      // Logic for Chapter Quizzes: Unlock only if the lesson for this chapter is done
      const lessonDone = completedLessons.includes(chapId);
      btn.disabled = !lessonDone;
    }

    // Visual feedback: Add a class if locked
    if (btn.disabled) {
      btn.classList.add("locked");
      btn.title = "Complete the lesson to unlock this quiz";
    } else {
      btn.classList.remove("locked");
      btn.title = "";
    }
  });
});