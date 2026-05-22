import { getDoc, getDocs, query, where } from "firebase/firestore";

import { reviewDoc, reviewsCollection } from "../../models/firestoreReferences";

function formatReview(snapshot) {
  return snapshot.data();
}

/**
 * Busca avaliação pelo ID do documento ou pelo ID do visitante.
 *
 * @param {string} [id] - ID do documento da avaliação.
 * @param {string} [visitanteId] - UID do visitante.
 * @returns {Promise<import("../../models/Review").Review|import("../../models/Review").Review[]|null>}
 */
export async function getReview(id, visitanteId) {
  const reviewId = id?.trim?.();
  const visitorId = visitanteId?.trim?.();

  try {
    if (reviewId && !visitorId) {
      const docRef = reviewDoc(reviewId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return formatReview(docSnap);
      }

      return null;
    }

    if (visitorId) {
      const reviewsQuery = query(
        reviewsCollection,
        where("visitorId", "==", visitorId),
      );
      const querySnapshot = await getDocs(reviewsQuery);
      const reviews = querySnapshot.docs.map(formatReview);

      if (reviewId) {
        return reviews.filter((review) => review.id === reviewId);
      }

      return reviews;
    }

    throw new Error(
      "Deve ser fornecido id ou visitanteId para buscar avaliação(ões)",
    );
  } catch (error) {
    console.error("Erro ao buscar avaliação(ões):", error);
    throw error;
  }
}

export async function getReviewsByVisitor(visitanteId) {
  const visitorId = visitanteId?.trim?.();

  if (!visitorId) {
    return [];
  }

  const reviews = await getReview(null, visitorId);

  return Array.isArray(reviews) ? reviews : [];
}
