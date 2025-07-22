// firebase.js
// └> 모든 페이지에서 import 해서 사용
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCVTWipZBOv4orTUQiLt1yLl5NP68yDO6E",
  authDomain: "singsingsu.firebaseapp.com",
  projectId: "singsingsu",
  storageBucket: "singsingsu.firebasestorage.app",
  messagingSenderId: "953731200845",
  appId: "1:953731200845:web:f2ef08727436d25abd6904",
  measurementId: "G-8EXHS8777Y"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// 인증(Authentication) & Firestore(Database) 인스턴스
export const auth = getAuth(app);
export const db   = getFirestore(app);
