import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// Added getDoc and doc here
import { collection, getDocs, query, where, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let myChart = null; 
const homeBtn = document.getElementById("homeBtn"); // Reference the button

async function loadProgress(uid) {
    try {
        const countsByDate = {};
        const dateLabels = [];

        // ---------- 1. SETUP LAST 7 DAYS ----------
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
            dateLabels.push(key);
            countsByDate[key] = { quiz: 0, activity: 0, lesson: 0 };
        }

        let quizAttempts = 0;
        let totalScorePercent = 0;
        let totalActivityCount = 0;

        // ---------- 2. FETCH QUIZ DATA ----------
        const quizRef = collection(db, "users", uid, "activities");
        const quizQuery = query(quizRef, where("type", "==", "quiz"));
        const quizSnap = await getDocs(quizQuery);
        quizSnap.forEach(docSnap => {
            const data = docSnap.data();
            if (!data.completedAt) return;
            const dateObj = data.completedAt.toDate();
            const dateKey = dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" });

            if (countsByDate[dateKey]) {
                countsByDate[dateKey].quiz++;
                quizAttempts++;
                if (data.score && data.total) totalScorePercent += (data.score / data.total) * 100;
            }
        });

        // ---------- 3. FETCH ACTIVITIES ----------
        const activitySnap = await getDocs(collection(db, "users", uid, "activities"));
        activitySnap.forEach(docSnap => {
            const data = docSnap.data();
            if (!data.date) return;
            const dateObj = data.date.toDate();
            const dateKey = dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" });

            if (countsByDate[dateKey]) {
                countsByDate[dateKey].activity++;
                totalActivityCount++;
            }
        });

        // ---------- 4. FETCH APTITUDE LESSONS ----------
        const activitySnap2 = await getDocs(collection(db, "users", uid, "activities"));
        activitySnap2.forEach(docSnap => {
            const data = docSnap.data();
            if (data.type === "chapter" && data.completedAt) {
                const date = data.completedAt.toDate();
                const dateKey = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
                if (countsByDate[dateKey]) countsByDate[dateKey].lesson++;
            }
        });

        // ---------- 5. UPDATE UI STATS ----------
        document.getElementById("totalAttempts").innerText = quizAttempts;
        document.getElementById("avgScore").innerText =
            quizAttempts ? Math.round(totalScorePercent / quizAttempts) + "%" : "0%";

        const dailyTotals = dateLabels.map(label =>
            countsByDate[label].quiz + countsByDate[label].activity + countsByDate[label].lesson
        );
        document.getElementById("bestDay").innerText = Math.max(...dailyTotals, 0);

        // ---------- 6. RENDER CHART ----------
        const quizData = dateLabels.map(label => countsByDate[label].quiz);
        const activityData = dateLabels.map(label => countsByDate[label].activity);
        const lessonData = dateLabels.map(label => countsByDate[label].lesson);

        renderChart(dateLabels, quizData, activityData, lessonData);

    } catch (err) {
        console.error("Progress load error:", err);
    }
}

function renderChart(labels, quizData, activityData, lessonData) {
    const ctx = document.getElementById("taskChart").getContext("2d");
    if (myChart) myChart.destroy(); 

    myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Quizzes",
                    data: quizData,
                    borderColor: "#4e73df",
                    backgroundColor: "rgba(78, 115, 223, 0.1)",
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: "#4e73df"
                },
                {
                    label: "Notes & Activity",
                    data: activityData,
                    borderColor: "#1cc88a",
                    backgroundColor: "rgba(28, 200, 138, 0.1)",
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: "#1cc88a"
                },
                {
                    label: "Lessons Completed",
                    data: lessonData,
                    borderColor: "#f6c23e",
                    backgroundColor: "rgba(246, 194, 62, 0.1)",
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: "#f6c23e"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, precision: 0 },
                    grid: { color: "#f8f9fc" }
                },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: { position: "top" },
                tooltip: { mode: "index", intersect: false }
            }
        }
    });
}

// ---------- AUTH OBSERVER ----------
onAuthStateChanged(auth, async (user) => {
    if (user) {
        loadProgress(user.uid);

        // --- NEW REDIRECT LOGIC FOR HOME BUTTON ---
        if (homeBtn) {
            homeBtn.addEventListener("click", async () => {
                const userDocRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userDocRef);

                if (userSnap.exists()) {
                    const grade = parseInt(userSnap.data().grade);
                    if (grade >= 3 && grade <= 8) {
                        window.location.href = "home38.html";
                    } else if (grade >= 9 && grade <= 10) {
                        window.location.href = "home910.html";
                    }
                }
            });
        }
    } else {
        window.location.href = "login.html";
    }
});