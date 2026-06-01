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

function normalizeDate(value) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function startOfDay(value) {
  const date = normalizeDate(value);

  if (!date) {
    return null;
  }

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

function endOfDay(value) {
  const date = normalizeDate(value);

  if (!date) {
    return null;
  }

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

function maxDate(...dates) {
  const validDates = dates.filter(Boolean);

  if (validDates.length === 0) {
    return null;
  }

  return new Date(Math.max(...validDates.map((date) => date.getTime())));
}

function normalizeText(value) {
  return value?.trim?.() ?? "";
}

function normalizeThemeFilters(themeFilters = []) {
  if (!Array.isArray(themeFilters)) {
    return [];
  }

  return Array.from(
    new Set(themeFilters.map(normalizeText).filter(Boolean)),
  );
}

function eventMatchesClientFilters(event, filters) {
  const eventStartAt = normalizeDate(event.startAt);

  if (
    filters.startDate &&
    (!eventStartAt || eventStartAt.getTime() < filters.startDate.getTime())
  ) {
    return false;
  }

  if (
    filters.endDate &&
    (!eventStartAt || eventStartAt.getTime() > filters.endDate.getTime())
  ) {
    return false;
  }

  if (filters.organizerId && event.organizerId !== filters.organizerId) {
    return false;
  }

  if (filters.status && event.status !== filters.status) {
    return false;
  }

  if (filters.themeFilters.length > 0) {
    const eventThemes = Array.isArray(event.themes) ? event.themes : [];
    const hasSelectedTheme = filters.themeFilters.some((theme) =>
      eventThemes.includes(theme),
    );

    if (!hasSelectedTheme) {
      return false;
    }
  }

  return true;
}

/**
 * Busca uma página de eventos usando cursor do Firestore.
 *
 * A query enviada ao Firestore filtra somente por `startAt`, que usa índice
 * simples automático. Os filtros de tema/organizador/status são aplicados aqui
 * no service para evitar erros recorrentes de índice composto no app.
 *
 * @param {Object} options
 * @param {number} [options.pageSize]
 * @param {import("firebase/firestore").QueryDocumentSnapshot|null} [options.lastDoc]
 * @param {string|null} [options.status]
 * @param {string|null} [options.organizerId]
 * @param {Date} [options.minimumStartAt]
 * @param {Date|string|null} [options.startDate]
 * @param {Date|string|null} [options.endDate]
 * @param {string[]} [options.themeFilters]
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
  startDate = null,
  endDate = null,
  themeFilters = [],
  orderByField = "startAt",
} = {}) {
  const normalizedOrganizerId = organizerId?.trim?.();
  const normalizedStatus = status?.trim?.() || null;
  const normalizedPageSize = normalizePageSize(pageSize);
  const normalizedThemeFilters = normalizeThemeFilters(themeFilters);
  const normalizedStartDate = startOfDay(startDate);
  const normalizedEndDate = endOfDay(endDate);
  const normalizedMinimumStartAt = normalizeDate(minimumStartAt);
  const lowerStartAt = maxDate(normalizedMinimumStartAt, normalizedStartDate);
  const rawPageSize = normalizedPageSize;
  const filteredEvents = [];
  let currentLastDoc = lastDoc;
  let hasMore = true;

  if (
    lowerStartAt &&
    normalizedEndDate &&
    lowerStartAt.getTime() > normalizedEndDate.getTime()
  ) {
    return {
      events: [],
      lastDoc,
      hasMore: false,
    };
  }

  while (filteredEvents.length < normalizedPageSize && hasMore) {
    const constraints = [];

    if (orderByField === "documentId") {
      constraints.push(orderBy(documentId(), "asc"));
    } else {
      if (lowerStartAt) {
        constraints.push(where("startAt", ">=", lowerStartAt));
      }

      if (normalizedEndDate) {
        constraints.push(where("startAt", "<=", normalizedEndDate));
      }

      constraints.push(orderBy("startAt", "asc"));
    }

    if (currentLastDoc) {
      constraints.push(startAfter(currentLastDoc));
    }

    constraints.push(limit(rawPageSize));

    const eventsQuery = query(eventsCollection, ...constraints);
    const snapshot = await getDocs(eventsQuery);
    const docs = snapshot.docs;

    if (docs.length === 0) {
      hasMore = false;
      break;
    }

    hasMore = docs.length === rawPageSize;

    for (let index = 0; index < docs.length; index += 1) {
      const docSnapshot = docs[index];
      currentLastDoc = docSnapshot;

      if (
        eventMatchesClientFilters(docSnapshot.data(), {
          organizerId: normalizedOrganizerId,
          status: normalizedStatus,
          themeFilters: normalizedThemeFilters,
          startDate: lowerStartAt,
          endDate: normalizedEndDate,
        })
      ) {
        filteredEvents.push(docSnapshot.data());
      }

      if (filteredEvents.length === normalizedPageSize) {
        hasMore = index < docs.length - 1 || docs.length === rawPageSize;
        break;
      }
    }
  }

  return {
    events: filteredEvents.slice(0, normalizedPageSize),
    lastDoc: currentLastDoc,
    hasMore,
  };
}

export const getEventosPage = getEventsPage;
