import { doc, runTransaction } from "firebase/firestore";

import { db } from "../firebaseConfig.js";
import { eventDoc, reviewsCollection } from "../../models/firestoreReferences";
import type { ReviewStats } from "../../models/CulturalEvent";
import type { Review } from "../../models/Review";

type RegisterReviewParams = Omit<Review, "id" | "createdAt" | "updatedAt"> & {
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Registra uma nova avaliação em `reviews/{id}` usando o converter do modelo.
 */
export async function registerReview(
  params: RegisterReviewParams,
): Promise<string> {
  const eventId = params.eventId?.trim();
  const visitorId = params.visitorId?.trim();
  const organizerId = params.organizerId?.trim();
  const visitorName = params.visitorName?.trim();
  const comment = params.comment?.trim() ?? "";

  if (!eventId) {
    throw new Error("eventId é obrigatório");
  }

  if (!visitorId) {
    throw new Error("visitorId é obrigatório");
  }

  if (!organizerId) {
    throw new Error("organizerId é obrigatório");
  }

  if (!visitorName) {
    throw new Error("visitorName é obrigatório");
  }

  if (
    typeof params.rating !== "number" ||
    !Number.isInteger(params.rating) ||
    params.rating < 1 ||
    params.rating > 5
  ) {
    throw new Error("rating deve ser um número inteiro entre 1 e 5");
  }

  try {
    const reviewRef = doc(reviewsCollection);
    const now = new Date();
    const review: Review = {
      id: reviewRef.id,
      eventId,
      visitorId,
      organizerId,
      rating: params.rating,
      comment,
      visitorName,
      createdAt: params.createdAt ?? now,
      updatedAt: params.updatedAt ?? now,
    };

    await runTransaction(db, async (transaction) => {
      const eventRef = eventDoc(eventId);
      const eventSnap = await transaction.get(eventRef);

      if (!eventSnap.exists()) {
        throw new Error("Evento não encontrado para registrar avaliação");
      }

      const event = eventSnap.data();

      if (event.organizerId !== organizerId) {
        throw new Error("organizerId não corresponde ao evento informado");
      }

      const currentStats = event.reviewStats ?? {
        count: 0,
        ratingSum: 0,
        ratingAverage: 0,
      };
      const nextCount = currentStats.count + 1;
      const nextRatingSum = currentStats.ratingSum + params.rating;
      const nextStats: ReviewStats = {
        count: nextCount,
        ratingSum: nextRatingSum,
        ratingAverage: nextRatingSum / nextCount,
      };

      transaction.set(reviewRef, review);
      transaction.update(eventRef, {
        reviewStats: nextStats,
        updatedAt: now,
      });
    });

    return reviewRef.id;
  } catch (error) {
    console.error("ERRO ao registrar avaliação no Firestore:", error);
    return "FIRESTORE_ERROR";
  }
}
