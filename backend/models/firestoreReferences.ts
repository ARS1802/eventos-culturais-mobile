import { db } from "../firebase/firebaseConfig.js";

import { collection, doc } from "firebase/firestore";
import { culturalEventConverter } from "./CulturalEvent";
import { reviewConverter } from "./Review";
import { userProfileConverter } from "./UserProfile";

export const usersCollection = collection(db, "users").withConverter(
  userProfileConverter,
);
export const eventsCollection = collection(db, "events").withConverter(
  culturalEventConverter,
);
export const reviewsCollection = collection(db, "reviews").withConverter(
  reviewConverter,
);
export function userDoc(uid: string) {
  return doc(db, "users", uid).withConverter(userProfileConverter);
}

export function eventDoc(eventId: string) {
  return doc(db, "events", eventId).withConverter(culturalEventConverter);
}

export function reviewDoc(reviewId: string) {
  return doc(db, "reviews", reviewId).withConverter(reviewConverter);
}
