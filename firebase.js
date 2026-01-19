
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCaSeSjpWQ2I6Cr31SrcKbEk1Z_U9ZWYGE",
  authDomain: "ai-educa-4e94d.firebaseapp.com",
  projectId: "ai-educa-4e94d",
  storageBucket: "ai-educa-4e94d.firebasestorage.app",
  messagingSenderId: "869287769880",
  appId: "1:869287769880:web:ecde37fff346535619506d"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);



//npm install firebase
/*// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaSeSjpWQ2I6Cr31SrcKbEk1Z_U9ZWYGE",
  authDomain: "ai-educa-4e94d.firebaseapp.com",
  projectId: "ai-educa-4e94d",
  storageBucket: "ai-educa-4e94d.firebasestorage.app",
  messagingSenderId: "869287769880",
  appId: "1:869287769880:web:ecde37fff346535619506d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);*/