import { getDoc, getDocs, query, where } from "firebase/firestore";
import { eventDoc, eventsCollection } from "../../models/firestoreReferences";

function formatCulturalEvent(snapshot) {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    ...data,
    organizerName: data.organizerName ?? "",
    address: data.address ?? "",
    startAt: data.startAt?.toDate?.() ?? data.startAt,
    endAt: data.endAt?.toDate?.() ?? data.endAt ?? null,
    poster: data.poster
      ? {
          ...data.poster,
          updatedAt: data.poster.updatedAt?.toDate?.() ?? data.poster.updatedAt,
        }
      : null,
    createdAt: data.createdAt?.toDate?.() ?? data.createdAt,
    updatedAt: data.updatedAt?.toDate?.() ?? data.updatedAt,
  };
}

/**
 * Busca evento(s) no Firestore pelo id do evento ou pelo id do organizador.
 * @param {Object} options - Opções de busca
 * @param {string} [options.eventoId] - ID do evento (busca direta)
 * @param {string} [options.organizerId] - UID do organizador (busca por query)
 * @returns {Promise<CulturalEvent|CulturalEvent[]|null>} Evento convertido, lista de eventos ou null se não encontrado
 */
export async function getEvento({ eventoId, organizerId } = {}) {
  try {
    if (eventoId) {
      const docRef = eventDoc(eventoId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return formatCulturalEvent(docSnap);
      }
      return null;
    }

    if (organizerId) {
      const q = query(
        eventsCollection,
        where("organizerId", "==", organizerId),
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(formatCulturalEvent);
    }

    throw new Error(
      "Deve ser fornecido eventoId ou organizerId para buscar evento(s)",
    );
  } catch (error) {
    console.error("Erro ao buscar evento(s):", error);
    throw error;
  }
}

export const getEvent = getEvento;
