export const EVENT_THEME_OPTIONS = [
  { label: "Música", value: "musica" },
  { label: "Teatro", value: "teatro" },
  { label: "Cinema", value: "cinema" },
  { label: "Dança", value: "danca" },
  { label: "Literatura", value: "literatura" },
  { label: "Cultura local", value: "cultura_local" },
  { label: "Exposição", value: "exposicao" },
  { label: "Outros", value: "outros" },
];

const EVENT_THEME_VALUES = new Set(
  EVENT_THEME_OPTIONS.map((theme) => theme.value),
);

export function normalizeThemeSelection(themes = []) {
  if (!Array.isArray(themes)) {
    return [];
  }

  return Array.from(
    new Set(
      themes
        .map((theme) => theme?.trim?.())
        .filter((theme) => theme && EVENT_THEME_VALUES.has(theme)),
    ),
  );
}
