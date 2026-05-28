import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI as string;

// Singleton pattern — reuse connection across hot-reloads in dev
let client: MongoClient | null = null;
let dbInstance: Db | null = null;

export async function getDb(): Promise<Db> {
  if (dbInstance) return dbInstance;
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  dbInstance = client.db(process.env.MONGODB_DB || "asd_drones");
  return dbInstance;
}
