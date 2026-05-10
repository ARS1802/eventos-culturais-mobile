import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
/* 
    ==================================

    FirestoreDataConverter -> converte objetos js em um documento do fs
    QueryDocumentSnapshot & SnapshotOptions -> receber snapshots do documento no fs
        snapshots garantem consistencia.
    
    =================================
 */

export interface Review {
  id: string;

  eventId: string;
  visitorId: string;
  organizerId: string;

  rating: number; // 1 a 5
  //    precisa ser avaliado antes de enviar a avaliação para firestore!
  comment: string;
  visitorName: string;

  createdAt: Date;
  updatedAt: Date;
}

export const reviewConverter: FirestoreDataConverter<Review> = {
  toFirestore(review: Review) {
    return {
      eventId: review.eventId,
      visitorId: review.visitorId,
      organizerId: review.organizerId,
      rating: review.rating,
      comment: review.comment,
      visitorName: review.visitorName,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  },

  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions) {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      eventId: data.eventId,
      visitorId: data.visitorId,
      organizerId: data.organizerId,
      rating: data.rating,
      comment: data.comment,
      visitorName: data.visitorName,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    };
  },
};
