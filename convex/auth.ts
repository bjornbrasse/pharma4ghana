export function assertSyncSecret(syncSecret: string) {
  const expectedSecret = process.env.CONVEX_SYNC_SECRET;

  if (!expectedSecret) {
    throw new Error("Missing CONVEX_SYNC_SECRET in the Convex deployment.");
  }

  if (syncSecret !== expectedSecret) {
    throw new Error("Invalid Convex sync secret.");
  }
}
