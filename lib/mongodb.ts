import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI as string;

// Vercel serverless: cache client on the global object to reuse across warm invocations
declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

async function getClient(): Promise<MongoClient> {
  if (global._mongoClient) return global._mongoClient;
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
  });
  await client.connect();
  global._mongoClient = client;
  return client;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(process.env.MONGODB_DB || "asd_drones");
}
