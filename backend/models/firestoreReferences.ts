import type { FirestoreDataConverter } from "firebase-admin/firestore";

import { adminDb } from "../firebase/adminConfig.js";
import { db } from "../firebase/firebaseConfig.js";

import type { CulturalEvent } from "./CulturalEvent.js";
import { culturalEventConverter } from "./CulturalEvent.js";
import type { Review } from "./Review.js";
import { reviewConverter } from "./Review.js";
import type { UserProfile } from "./UserProfile.js";
import { userProfileConverter } from "./UserProfile.js";
import { collection, doc } from "firebase/firestore";

// Web and Admin SDK converters use different TypeScript types, but this
// project only relies on their shared runtime contract.
function asAdminConverter<T>(converter: unknown): FirestoreDataConverter<T> {
  return converter as FirestoreDataConverter<T>;
}

export const adimin_usersCollection = adminDb
  .collection("users")
  .withConverter(asAdminConverter<UserProfile>(userProfileConverter));

export const adimin_eventsCollection = adminDb
  .collection("events")
  .withConverter(asAdminConverter<CulturalEvent>(culturalEventConverter));

export const adimin_reviewsCollection = adminDb
  .collection("reviews")
  .withConverter(asAdminConverter<Review>(reviewConverter));

export function adimin_userDoc(uid: string) {
  return adimin_usersCollection.doc(uid);
}

export function adimin_eventDoc(eventId: string) {
  return adimin_eventsCollection.doc(eventId);
}

export function adimin_reviewDoc(reviewId: string) {
  return adimin_reviewsCollection.doc(reviewId);
}
//=========================================================================

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
