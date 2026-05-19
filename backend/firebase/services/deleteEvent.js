import { deleteDoc, getDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

import { storage } from "../firebaseConfig.js";
import { eventDoc } from "../../models/firestoreReferences";

/**
 * Remove um evento cultural e o cartaz correspondente no Storage.
 *
 * A leitura inicial usa `eventDoc`, preservando o FirestoreDataConverter do
 * modelo CulturalEvent e garantindo acesso consistente ao campo `poster.path`.
 */
export async function deleteEvent(eventId) {
  const validEventId = eventId?.trim?.();

  if (!validEventId) {
    throw new Error("eventId é obrigatório");
  }

  try {
    const docRef = eventDoc(validEventId);
    const eventSnap = await getDoc(docRef);

    if (!eventSnap.exists()) {
      return "EVENT_NOT_FOUND";
    }

    const event = eventSnap.data();
    const posterPath = event.poster?.path;

    if (posterPath) {
      try {
        await deleteObject(ref(storage, posterPath));
      } catch (error) {
        if (error?.code !== "storage/object-not-found") {
          throw error;
        }
      }
    }

    await deleteDoc(docRef);
    return "EVENT_DELETED";
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    throw error;
  }
}
