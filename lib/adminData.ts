import { readFileSync, writeFileSync } from "fs";
import path from "path";

// ─── Local JSON helpers (used in dev and as seed source) ──────────────────────

function filePath(name: string) {
  return path.join(process.cwd(), "data", `${name}.json`);
}

function readLocalJSON<T>(name: string): T[] {
  try {
    return JSON.parse(readFileSync(filePath(name), "utf-8"));
  } catch {
    return [];
  }
}

function writeLocalJSON<T>(name: string, data: T[]) {
  writeFileSync(filePath(name), JSON.stringify(data, null, 2), "utf-8");
}

// ─── Public async API ─────────────────────────────────────────────────────────

/**
 * Read all documents from a collection (MongoDB) or JSON file (local dev).
 * On first deploy, the "products" collection is auto-seeded from data/products.json.
 */
export async function readDB<T>(name: string): Promise<T[]> {
  if (!process.env.MONGODB_URI) {
    return readLocalJSON<T>(name);
  }

  const { getDb } = await import("./mongodb");
  const db = await getDb();
  const docs = await db
    .collection(name)
    .find({}, { projection: { _id: 0 } })
    .toArray();

  // Auto-seed products from bundled JSON on first deploy
  if (docs.length === 0 && name === "products") {
    const seed = readLocalJSON<T>(name);
    if (seed.length > 0) {
      await db.collection(name).insertMany(seed as object[]);
      return seed;
    }
  }

  return docs as T[];
}

/**
 * Replace the entire collection with the provided array.
 */
export async function writeDB<T extends object>(
  name: string,
  data: T[]
): Promise<void> {
  if (!process.env.MONGODB_URI) {
    writeLocalJSON(name, data);
    return;
  }

  const { getDb } = await import("./mongodb");
  const db = await getDb();
  await db.collection(name).deleteMany({});
  if (data.length > 0) {
    await db.collection(name).insertMany(data);
  }
}

/** Return the next numeric id for a list of records. */
export function nextId(items: { id: number }[]): number {
  return items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
}

// ─── Legacy sync aliases (kept so nothing breaks during migration) ────────────
export const readJSON = <T>(name: string): T[] => readLocalJSON<T>(name);
export const writeJSON = <T>(name: string, data: T[]) =>
  writeLocalJSON(name, data);
