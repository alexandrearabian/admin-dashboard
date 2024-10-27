// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDiHilpuWMVNN0MtkTstdJoapGbHbl4VKY",
    authDomain: "tadron-web.firebaseapp.com",
    projectId: "tadron-web",
    storageBucket: "tadron-web.appspot.com",
    messagingSenderId: "977101553380",
    appId: "1:977101553380:web:3226e1f3971d2e2e3576f1",
    measurementId: "G-MNVXR5J5TT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { db, analytics, storage };