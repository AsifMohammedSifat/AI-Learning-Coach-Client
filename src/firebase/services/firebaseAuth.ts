import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebaseConfig";
import {
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  getAuth,
} from "firebase/auth";

export const loginWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const signUpWithEmailPassword = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};
export const signInWithEmailPassword = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email, {
    url: `${window.location.origin}/login`,
  });
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw { code: "auth/no-current-user" };
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);

  await updatePassword(user, newPassword);
}
