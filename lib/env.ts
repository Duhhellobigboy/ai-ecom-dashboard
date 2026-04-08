export function isLocalFilePersistenceEnabled(): boolean {
  // Enable local file writes only for localhost development.
  return process.env.NODE_ENV === "development" && !process.env.VERCEL_ENV;
}
