import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    onSnapshot, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let currentUser = null;

// 1. AUTH CHECK & REAL-TIME LOAD
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    currentUser = user;
    loadChat(); 
});

// 2. LOAD CHAT (Pulling from Firestore so it stays after refresh)
function loadChat() {
    const chatRef = collection(db, "users", currentUser.uid, "chats");
    const q = query(chatRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (snapshot) => {
        chatBox.innerHTML = ""; 
        snapshot.forEach(docSnap => {
            const msg = docSnap.data();
            appendMessage(msg.role === "user" ? "You" : "AI", msg.text);
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

// 3. SEND MESSAGE
sendBtn.onclick = async () => {
    const msg = input.value.trim();
    if (!msg || !currentUser) return;

    input.value = ""; 

    try {
        // A. Save User message to Firestore (Persist in Chat)
        await addDoc(collection(db, "users", currentUser.uid, "chats"), {
            role: "user",
            text: msg,
            createdAt: serverTimestamp()
        });

        // B. Save to Activity Log (For History Page)
        await addDoc(collection(db, "users", currentUser.uid, "activities"), {
            type: "Chat",
            activity: `Asked AI: "${msg}"`,
            date: serverTimestamp()
        });

        // C. Call Backend
        const res = await fetch("https://chat-bot-i6ig.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                uid: currentUser.uid, 
                message: msg 
            })
        });

        const data = await res.json();

        // D. Save AI reply to Firestore (Persist in Chat)
        if (data.reply) {
            await addDoc(collection(db, "users", currentUser.uid, "chats"), {
                role: "bot",
                text: data.reply,
                createdAt: serverTimestamp()
            });
        }

    } catch (err) {
        console.error("Chat Error:", err);
    }
};

function appendMessage(sender, text) {
    const div = document.createElement("div");
    div.className = sender === "AI" ? "ai-msg" : "user-msg";
    div.innerHTML = `<b>${sender}:</b> ${text}`;
    chatBox.appendChild(div);
}