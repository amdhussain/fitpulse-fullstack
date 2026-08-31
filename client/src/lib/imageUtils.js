const IMAGE_URL_PATTERN = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif|tiff)(\?.*)?$/i;
const DATA_URL_PATTERN = /^data:image\//;
const SUPABASE_STORAGE_PATTERN = /\/storage\/v1\/object\/public\//;

export function isValidImageUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (DATA_URL_PATTERN.test(trimmed)) return true;
  if (SUPABASE_STORAGE_PATTERN.test(trimmed)) return true;
  if (IMAGE_URL_PATTERN.test(trimmed)) return true;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      const pathname = parsed.pathname.toLowerCase();
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico", ".avif", ".tiff"];
      if (imageExtensions.some((ext) => pathname.endsWith(ext))) return true;
      if (pathname.includes("/image") || pathname.includes("/img") || pathname.includes("/photo") || pathname.includes("/avatar")) {
        return true;
      }
    }
  } catch {
    // not a valid URL
  }
  return false;
}

export function getValidImageUrl(url, fallback = null) {
  return isValidImageUrl(url) ? url.trim() : fallback;
}
