import { getDocs, query, where, getDoc } from "firebase/firestore";
import {
  usersCollection,
  userDoc,
} from "../models/firestoreReferences.js";

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
      const docRef = userDoc(id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    }

    if (email) {
      // Busca por email usando query
      const q = query(usersCollection, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      }
      return null;
    }

    throw new Error("Deve ser fornecido id ou email para buscar o usuário");
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
}
