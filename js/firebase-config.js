// Import modern Firebase SDK modules directly from Google's content delivery network (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Your verified live cloud project credentials
const firebaseConfig = {
  apiKey: "AIzaSyBpdE4aUdImXNpsM5sj6z4YyJhSIKhxQ2Q",
  authDomain: "ecotrace-sih.firebaseapp.com",
  projectId: "ecotrace-sih",
  storageBucket: "ecotrace-sih.firebasestorage.app",
  messagingSenderId: "496983992068",
  appId: "1:496983992068:web:a2415d5db6f53f043e5251"
};

// Initialize the Firebase Application Instance
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export active modules cleanly so our HTML layout structures can call them
export { 
    auth,
    db, 
    collection, 
    addDoc, 
    onSnapshot, 
    doc, 
    updateDoc,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
};

