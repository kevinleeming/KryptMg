import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyAjI_fLaOGrmkrXzp88EIyRz5PycOHl7Cs",
  authDomain: "social-krypt.firebaseapp.com",
  projectId: "social-krypt",
  storageBucket: "social-krypt.appspot.com",
  messagingSenderId: "611062599758",
  appId: "1:611062599758:web:33685d36f72e12d09fb31f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log(result);

            const name = result.user.displayName;
            const email = result.user.email;
            const profilePic = result.user.photoURL;
            localStorage.setItem("name", name);
            localStorage.setItem("email", email);
            localStorage.setItem("profilePic", profilePic);
            window.location = '/social';
        })
        .catch((error) => {
            console.log(error);
        });
};