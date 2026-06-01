import { deleteDoc, getDoc } from "firebase/firestore";

import { reviewDoc } from "../../models/firestoreReferences";

/**
 * Remove uma avaliação no Firestore pelo ID do documento.
 *
 * A referência `reviewDoc` aplica o FirestoreDataConverter do modelo Review.
 */
export async function deleteReview(id) {
  const validReviewId = id?.trim?.();

  if (!validReviewId) {
    throw new Error("id da avaliação é obrigatório");
  }

  try {
    const docRef = reviewDoc(validReviewId);
    const reviewSnap = await getDoc(docRef);

    if (!reviewSnap.exists()) {
      return "REVIEW_NOT_FOUND";
    }

    await deleteDoc(docRef);
    return "REVIEW_DELETED";
  } catch (error) {
    console.error("Erro ao deletar avaliação:", error);
    throw error;
  }
}
