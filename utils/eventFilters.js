import { normalizeThemeSelection } from "./eventThemes";

export function normalizeFilterDate(value) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function serializeFilterDate(value) {
  const date = normalizeFilterDate(value);

  return date ? date.toISOString() : null;
}

export function normalizeFeedFilters(filters = {}) {
  return {
    themes: normalizeThemeSelection(filters.themes),
    startDate: normalizeFilterDate(filters.startDate),
    endDate: normalizeFilterDate(filters.endDate),
  };
}
