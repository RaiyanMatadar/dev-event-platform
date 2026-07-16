import mongoose from "mongoose";

/**
 * Global type declaration for the cached mongoose connection.
 *
 * In development, module hot-reloading can create multiple connections.
 * Caching the connection on the global object prevents this.
 *
 * - `conn`: Holds the active mongoose connection instance.
 * - `promise`: Stores the connection promise while it's being established,
 *   preventing duplicate connection attempts during concurrent calls.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

/** Retrieve the MongoDB connection string from environment variables. */
const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

/**
 * Throws a descriptive error when the required environment variable is missing.
 */
function throwMissingUriError(): never {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Connects to MongoDB using Mongoose.
 *
 * - Caches the connection on `globalThis` to avoid re-initialising during
 *   Next.js hot-reloading in development.
 * - If a connection already exists, it returns the cached instance immediately.
 *
 * @returns The connected Mongoose instance.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (globalThis.mongooseCache?.conn) {
    return globalThis.mongooseCache.conn;
  }

  if (!MONGODB_URI) {
    throwMissingUriError();
  }

  if (!globalThis.mongooseCache) {
    globalThis.mongooseCache = { conn: null, promise: null };
  }

  if (!globalThis.mongooseCache.promise) {
    globalThis.mongooseCache.promise = mongoose
      .connect(MONGODB_URI, {
        // Helps avoid deprecation warnings and ensures stable behaviour
      })
      .then((m) => m);
  }

  // Await the promise and cache the connection
  globalThis.mongooseCache.conn = await globalThis.mongooseCache.promise;
  return globalThis.mongooseCache.conn;
}

export default connectToDatabase;