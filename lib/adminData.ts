import { readFileSync, writeFileSync } from "fs";
import path from "path";

// ─── Local JSON helpers ───────────────────────────────────────────────────────
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
export async function readDB<T>(name: string): Promise<T[]> {
  if (!process.env.MONGODB_URI) {
    return readLocalJSON<T>(name);
  }

  try {
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
  } catch (err) {
    console.error(`readDB(${name}) MongoDB error:`, err);
    // Fallback to local JSON if MongoDB fails
    return readLocalJSON<T>(name);
  }
}

export async function writeDB<T extends object>(name: string, data: T[]): Promise<void> {
  if (!process.env.MONGODB_URI) {
    writeLocalJSON(name, data);
    return;
  }

  try {
    const { getDb } = await import("./mongodb");
    const db = await getDb();
    await db.collection(name).deleteMany({});
    if (data.length > 0) {
      await db.collection(name).insertMany(data as object[]);
    }
  } catch (err) {
    console.error(`writeDB(${name}) MongoDB error:`, err);
    throw err; // re-throw so callers know the write failed
  }
}

export function nextId(items: { id: number }[]): number {
  return items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
}

// ─── Legacy sync aliases ──────────────────────────────────────────────────────
export const readJSON  = <T>(name: string): T[] => readLocalJSON<T>(name);
export const writeJSON = <T>(name: string, data: T[]) => writeLocalJSON(name, data);
