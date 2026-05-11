import { auth } from "./firebaseConfig.js";
import { sendPasswordResetEmail } from "firebase/auth";
export async function resetPassword(email) {
  //small check:
  const validEmail = email.trim().toLowerCase();

  if (!validEmail) {
    throw new Error("Digite seu e-mail.");
  }
  try {
    const obj = await sendPasswordResetEmail(auth, validEmail);
    console.log(obj);
    console.log(validEmail);
  } catch (error) {
    if (e.code === "auth/email-already-in-use") {
      return "EMAIL_EXISTS";
    } else if (e.code === "auth/invalid-email") {
      return "INVALID_EMAIL";
    } else if (e.code === "auth/weak-password") {
      return "WEAK_PASSWORD";
    } else if (e.code === "auth/configuration-not-found") {
      return "AUTH_CONFIG_ERROR";
    } else {
      return "AUTH_ERROR";
    }
  }
}
