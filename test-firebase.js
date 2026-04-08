import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3NKszufveErqGq1YZNCSCggQ1b19Rlxc",
  authDomain: "webchat-9c3b9.firebaseapp.com",
  projectId: "webchat-9c3b9",
  storageBucket: "webchat-9c3b9.firebasestorage.app",
  messagingSenderId: "640710004264",
  appId: "1:640710004264:web:aa12d61dac15fae9632f1d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "default"); // testing "default" instead of "(default)"

async function test() {
  try {
    const testRef = collection(db, "test_collection");
    const docRef = await addDoc(testRef, { test: "success", time: new Date().toISOString() });
    console.log("SUCCESS! Wrote doc ID:", docRef.id);
    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err.message);
    process.exit(1);
  }
}
test();
