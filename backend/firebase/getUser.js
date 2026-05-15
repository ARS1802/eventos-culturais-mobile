import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig.js";

function formatUserProfile(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() ?? data.createdAt,
    updatedAt: data.updatedAt?.toDate?.() ?? data.updatedAt,
  };
}

/**
 * Busca um usuário no Firestore pelo id (UID) ou email
 * @param {Object} options - Opções de busca
 * @param {string} [options.id] - UID do usuário (busca direta)
 * @param {string} [options.email] - Email do usuário (busca por query)
 * @returns {Promise<UserProfile|null>} Objeto UserProfile convertido ou null se não encontrado
 */

export async function getUser({ id, email } = {}) {
  try {
    if (id) {
      // Busca direta pelo UID
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return formatUserProfile(docSnap);
      }
      return null;
    }

    if (email) {
      // Busca por email usando query
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return formatUserProfile(querySnapshot.docs[0]);
      }
      return null;
    }

    throw new Error("Deve ser fornecido id ou email para buscar o usuário");
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
}
