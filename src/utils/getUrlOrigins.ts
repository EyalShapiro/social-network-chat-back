export function getUrlOrigins(url?: string | null) {
  try {
    if (!url) return '';
    return new URL(url).origin;
  } catch {
    return '';
  }
}
