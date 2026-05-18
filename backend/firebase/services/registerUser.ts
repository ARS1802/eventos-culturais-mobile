import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig.js";
import type { UserRole, UserProfile } from "../../models/UserProfile.js";
/**
 * Essa função é assíncrona!
 * Portanto, use ela com a keyword await para evitar que o Node fique         esperando por comandos ao invés de continuar!
 */
export async function registerUser(params: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}): Promise<string> {
  try {
    const newUserCredentials = await createUserWithEmailAndPassword(
      auth,
      params.email,
      params.password,
    );

    const uid = newUserCredentials.user.uid;
    const today = new Date();
    const newUser: UserProfile = {
      id: uid,
      name: params.name,
      email: params.email,
      role: params.role,
      createdAt: today,
      updatedAt: today,
    };

    try {
      await setDoc(doc(db, "users", uid), {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      });
    } catch (e) {
      console.log("ERRO no Firestore!\n" + e);
      return "FIRESTORE_ERROR";
    }
    return uid;
  } catch (e: any) {
    console.log("ERRO no Auth!\n" + e);
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
