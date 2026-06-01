import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import { uploadPoster } from "./uploadPoster.js";
import { userDoc } from "../../models/firestoreReferences";
import type {
  CulturalEvent,
  EventPoster,
  EventStatus,
  EventTheme,
} from "../../models/CulturalEvent";

/**
 * Registra um evento no Firestore criando um novo documento em `events/{id}`.
 * Se `asset` for informado, faz upload para o Storage via `uploadPoster.js`
 * e anexa um `EventPoster` ao documento do evento.
 */
export async function registerEvent(
  params: {
    organizerId: string;
    title: string;
    description: string;
    address: string;
    themes: EventTheme[];
    startAt: Date;
    endAt?: Date | null;
    status: EventStatus;
  },
  asset?: any,
): Promise<string> {
  const organizerId = params.organizerId?.trim();
  const title = params.title?.trim();
  const description = params.description?.trim();
  const address = params.address?.trim();

  if (!organizerId) {
    throw new Error("organizerId é obrigatório");
  }

  if (!title) {
    throw new Error("Título do evento é obrigatório");
  }

  if (!description) {
    throw new Error("Descrição do evento é obrigatória");
  }

  if (!address) {
    throw new Error("Endereço do evento é obrigatório");
  }

  if (!Array.isArray(params.themes) || params.themes.length === 0) {
    throw new Error("O evento deve ter ao menos um tema");
  }

  if (
    !(params.startAt instanceof Date) ||
    Number.isNaN(params.startAt.getTime())
  ) {
    throw new Error("Data de início inválida");
  }

  try {
    const organizerSnap = await getDoc(userDoc(organizerId));

    if (!organizerSnap.exists()) {
      throw new Error("Organizador não encontrado");
    }

    const organizer = organizerSnap.data();

    if (organizer.role !== "organizer") {
      throw new Error("Apenas usuários organizadores podem criar eventos");
    }

    const organizerName = organizer.name?.trim();

    if (!organizerName) {
      throw new Error("Nome do organizador não encontrado");
    }

    const eventsColl = collection(db, "events");
    const eventRef = doc(eventsColl); // novo doc com id automático
    const eventId = eventRef.id;

    let poster: EventPoster | null = null;

    if (asset) {
      // uploadPoster espera (asset, evento { id, organizerId })
      const uploadResult = await uploadPoster(asset, {
        id: eventId,
        organizerId,
      });

      poster = {
        url: uploadResult.url,
        path: uploadResult.path,
        width: uploadResult.width ?? 0,
        height: uploadResult.height ?? 0,
        mimeType: uploadResult.mimeType ?? "image/jpeg",
        updatedAt: new Date(),
      };
      console.log(poster);
    }

    const now = new Date();
    const eventData: Omit<CulturalEvent, "id"> = {
      organizerId,
      organizerName,
      title,
      description,
      address,
      themes: params.themes,
      startAt: params.startAt,
      endAt: params.endAt ?? null,
      poster: poster ?? null,
      status: params.status,
      reviewStats: {
        count: 0,
        ratingSum: 0,
        ratingAverage: 0,
      },
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(eventRef, eventData);
    return eventId;
  } catch (e) {
    console.error("ERRO ao registrar evento no Firestore:", e);
    return "FIRESTORE_ERROR";
  }
}
