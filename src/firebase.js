import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAQbUR-YyRbOKZYBAx6xeq35pQpFi7kM6Y",
    authDomain: "connecting-a6954.firebaseapp.com",
    projectId: "connecting-a6954",
    storageBucket: "connecting-a6954.appspot.com",
    messagingSenderId: "924464572512",
    appId: "1:924464572512:web:7ffecc3c46d194a20d7b05"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage();
export const db = getFirestore();
