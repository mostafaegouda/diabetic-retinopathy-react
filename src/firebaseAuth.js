import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDCv6O2CUTVi4hF2osUhO2we-mE81eophs",
    authDomain: "diabetic-retinopathy-600a0.firebaseapp.com",
    projectId: "diabetic-retinopathy-600a0",
    storageBucket: "diabetic-retinopathy-600a0.appspot.com",
    messagingSenderId: "48686662979",
    appId: "1:48686662979:web:39fe55621c35badcd51bf6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;