import { deleteDoc, getDoc } from "firebase/firestore";
import { deleteUser as deleteAuthUser } from "firebase/auth";

import { auth } from "../firebaseConfig.js";
import { userDoc } from "../../models/firestoreReferences";

const RECENT_LOGIN_MAX_AGE_MS = 5 * 60 * 1000;

function requiresRecentLogin(user) {
  const lastSignInTime = user.metadata?.lastSignInTime;

  if (!lastSignInTime) {
    return false;
  }

  const lastSignInMs = Date.parse(lastSignInTime);

  if (Number.isNaN(lastSignInMs)) {
    return false;
  }

  return Date.now() - lastSignInMs > RECENT_LOGIN_MAX_AGE_MS;
}

/**
 * Remove o perfil do usuário no Firestore e a conta correspondente no Auth.
 *
 * No SDK client do Firebase, usado pelo Expo, só é possível deletar de forma
 * segura o `auth.currentUser`. Remover outra conta por UID exige Admin SDK em
 * um ambiente confiável, como Cloud Functions ou um backend Node.
 */

export async function deleteUser(userId) {
  const validUserId = userId?.trim?.();

  if (!validUserId) {
    throw new Error("userId é obrigatório");
  }

  const currentUser = auth.currentUser;

  if (!currentUser) {
    return "AUTH_USER_NOT_FOUND";
  }

  if (currentUser.uid !== validUserId) {
    return "AUTH_USER_MISMATCH";
  }

  if (requiresRecentLogin(currentUser)) {
    return "REQUIRES_RECENT_LOGIN";
  }

  try {
    const docRef = userDoc(validUserId);
    const userSnap = await getDoc(docRef);

    if (!userSnap.exists()) {
      return "USER_NOT_FOUND";
    }

    await deleteDoc(docRef);
    await deleteAuthUser(currentUser);

    return "USER_DELETED";
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);

    if (error?.code === "auth/requires-recent-login") {
      return "REQUIRES_RECENT_LOGIN";
    }

    throw error;
  }
}
