import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc } from "firebase/firestore";
import { auth } from "./firebaseConfig.js";
import { userDoc } from "../models/firestoreReferences.js";
import { UserRole, UserProfile } from "../models/UserProfile.js";
/**
 * Essa função é assíncrona!
 * Portanto, use ela com a keyword await para evitar que o Node fique         esperando por comandos ao invés de continuar!
 */
export async function registerUser(params: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  console.log(auth);
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
    await setDoc(userDoc(uid), newUser);
  } catch (e) {
    console.log("ERRO!\n" + e);
    return "ERRO!\n" + e;
  }
  return uid;
}
