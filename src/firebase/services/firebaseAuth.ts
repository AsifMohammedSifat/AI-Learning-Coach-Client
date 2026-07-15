import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebaseConfig";

export const loginWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const signUpWithEmailPassword = (email:string,password:string) =>{
    return createUserWithEmailAndPassword(auth, email, password);
}
export const signInWithEmailPassword = (email:string,password:string) =>{
    return signInWithEmailAndPassword(auth, email, password);
}




