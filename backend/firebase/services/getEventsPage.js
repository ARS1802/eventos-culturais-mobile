import {
  documentId,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";

import { eventsCollection } from "../../models/firestoreReferences";

export const DEFAULT_EVENTS_PAGE_SIZE = 10;
const DEFAULT_MINIMUM_START_AT = new Date(0);

function normalizePageSize(pageSize) {
  const numericPageSize = Number(pageSize);

  if (!Number.isFinite(numericPageSize) || numericPageSize <= 0) {
    return DEFAULT_EVENTS_PAGE_SIZE;
  }

  return Math.floor(numericPageSize);
}

/**
 * Busca uma página de eventos usando cursor do Firestore.
 *
 * @param {Object} options
 * @param {number} [options.pageSize]
 * @param {import("firebase/firestore").QueryDocumentSnapshot|null} [options.lastDoc]
 * @param {string|null} [options.status]
 * @param {string|null} [options.organizerId]
 * @param {Date} [options.minimumStartAt]
 * @param {"startAt"|"documentId"} [options.orderByField]
 * @returns {Promise<{
 *   events: import("../../models/CulturalEvent").CulturalEvent[],
 *   lastDoc: import("firebase/firestore").QueryDocumentSnapshot|null,
 *   hasMore: boolean
 * }>}
 */
export async function getEventsPage({
  pageSize = DEFAULT_EVENTS_PAGE_SIZE,
  lastDoc = null,
  status = null,
  organizerId = null,
  minimumStartAt = DEFAULT_MINIMUM_START_AT,
  orderByField = "startAt",
} = {}) {
  const constraints = [];
  const normalizedOrganizerId = organizerId?.trim?.();
  const normalizedPageSize = normalizePageSize(pageSize);

  if (normalizedOrganizerId) {
    constraints.push(where("organizerId", "==", normalizedOrganizerId));
  }

  if (status) {
    constraints.push(where("status", "==", status));
  }

  if (!normalizedOrganizerId && !status && orderByField === "startAt") {
    constraints.push(where("startAt", ">=", minimumStartAt));
  }

  if (orderByField === "documentId") {
    constraints.push(orderBy(documentId(), "asc"));
  } else {
    constraints.push(orderBy("startAt", "asc"));
  }

  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  constraints.push(limit(normalizedPageSize));

  const eventsQuery = query(eventsCollection, ...constraints);
  const snapshot = await getDocs(eventsQuery);
  const docs = snapshot.docs;

  return {
    events: docs.map((docSnapshot) => docSnapshot.data()),
    lastDoc: docs.length > 0 ? docs[docs.length - 1] : null,
    hasMore: docs.length === normalizedPageSize,
  };
}

export const getEventosPage = getEventsPage;
