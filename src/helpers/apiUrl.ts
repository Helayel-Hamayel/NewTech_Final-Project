const apiBaseUrl = (
  import.meta.env.PROD
    ? "/api"
    : import.meta.env.VITE_API_URL?.trim() || "http://localhost:4000"
).replace(/\/+$/, "");

export function apiUrl(path: string): string {
  return `${apiBaseUrl}/${path.replace(/^\/+/, "")}`;
}
