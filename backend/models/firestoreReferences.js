import { collection, doc } from "firebase/firestore";

import { adminDb } from "../firebase/adminConfig";
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ enviando como admn, não como usuario.
import { userProfileConverter } from "UserProfile";
import { culturalEventConverter } from "CulturalEvent";
import { reviewConverter } from "Review";

export const usersCollection = collection(adminDb, "users").withConverter(
  userProfileConverter,
);

export const eventsCollection = collection(adminDb, "events").withConverter(
  culturalEventConverter,
);

export const reviewsCollection = collection(adminDb, "reviews").withConverter(
  reviewConverter,
);

export function userDoc(uid) {
  return doc(adminDb, "users", uid).withConverter(userProfileConverter);
}

export function eventDoc(eventId) {
  return doc(adminDb, "events", eventId).withConverter(culturalEventConverter);
}

export function reviewDoc(reviewId) {
  return doc(adminDb, "reviews", reviewId).withConverter(reviewConverter);
}
