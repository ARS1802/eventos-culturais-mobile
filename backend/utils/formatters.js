export function safeTitle(string) {
  return string.trim().replace(/\s+/g, "_");
}
