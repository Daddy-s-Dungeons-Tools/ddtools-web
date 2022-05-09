import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const config = {
  apiKey: "AIzaSyBB8lNoP6fYltMVOeDw3AQpOW9sRulLqW0",
  authDomain: "dungeons-3e3ed.firebaseapp.com",
  projectId: "dungeons-3e3ed",
  storageBucket: "dungeons-3e3ed.appspot.com",
  messagingSenderId: "739030061477",
  appId: "1:739030061477:web:fdc02fcf12c763cd0d184c",
};

const firebaseApp = initializeApp(config);

export const firestore = getFirestore(firebaseApp);

export const auth = getAuth(firebaseApp);

export const functions = getFunctions(firebaseApp);

// Use local emulators
if (process.env.NODE_ENV === "development") {
  connectFirestoreEmulator(firestore, "localhost", 8080);
  connectAuthEmulator(auth, "http://localhost:9099/");
  connectFunctionsEmulator(functions, "localhost", 5001);
}
