import { NextRequest, NextResponse } from "next/server";
import { readDB } from "@/lib/adminData";
import { requireAdmin } from "@/lib/adminAuth";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const VALID_CATEGORIES = [
  "Radio & Receiver","FPV Equipment","Motors","Electronics",
  "Frames","Propellers","Battery & Charging","Accessories",
];

interface Product {
  id: number; name: string; category: string; sku: string;
  price: number; originalPrice: number; stock: number;
  status: string; description: string; createdAt: string; image?: string;
  descriptionImages?: string[];
}

function getStatus(stock: number) {
  return stock === 0 ? "out_of_stock" : stock <= 10 ? "low_stock" : "active";
}

// GET — public
export async function GET() {
  try {
    const products = await readDB<Product>("products");
    return NextResponse.json(products, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (err) {
    console.error("Products GET error:", err);
    return NextResponse.json([], { headers: { "Cache-Control": "no-store" } });
  }
}

// POST — admin only — uses insertOne (safe, no replace-all)
export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const name = String(body.name || "").trim();
    const sku  = String(body.sku  || "").trim();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!sku)  return NextResponse.json({ error: "SKU is required" }, { status: 400 });

    const category    = VALID_CATEGORIES.includes(body.category) ? body.category : "Accessories";
    const price       = Math.max(0, parseFloat(body.price)       || 0);
    const origPrice   = Math.max(0, parseFloat(body.originalPrice) || price);
    const stock       = Math.max(0, parseInt(body.stock)           || 0);

    // Check duplicate SKU
    const db = process.env.MONGODB_URI ? await getDb() : null;

    if (db) {
      const exists = await db.collection("products").findOne({ sku: { $regex: new RegExp(`^${sku}$`, "i") } });
      if (exists) return NextResponse.json({ error: "SKU already exists" }, { status: 409 });

      // Get max id
      const [last] = await db.collection("products").find({}, { projection: { id: 1 } }).sort({ id: -1 }).limit(1).toArray();
      const newId = last ? (last.id as number) + 1 : 1;

      const product: Product = {
        id: newId, name, sku, category, price, originalPrice: origPrice, stock,
        status: getStatus(stock),
        description: String(body.description || "").trim().slice(0, 2000),
        image: body.image || "",
        descriptionImages: Array.isArray(body.descriptionImages) ? body.descriptionImages.filter((u: unknown) => typeof u === "string").slice(0, 10) : [],
        createdAt: new Date().toISOString(),
      };

      await db.collection("products").insertOne({ ...product });
      return NextResponse.json(product, { status: 201 });
    } else {
      // Local dev fallback
      const { readDB: rDB, writeDB, nextId } = await import("@/lib/adminData");
      const products = await rDB<Product>("products");
      if (products.find(p => p.sku.toLowerCase() === sku.toLowerCase()))
        return NextResponse.json({ error: "SKU already exists" }, { status: 409 });
      const product: Product = {
        id: nextId(products), name, sku, category, price, originalPrice: origPrice, stock,
        status: getStatus(stock),
        description: String(body.description || "").trim().slice(0, 2000),
        image: body.image || "",
        descriptionImages: Array.isArray(body.descriptionImages) ? body.descriptionImages.filter((u: unknown) => typeof u === "string").slice(0, 10) : [],
        createdAt: new Date().toISOString(),
      };
      products.push(product);
      await writeDB("products", products);
      return NextResponse.json(product, { status: 201 });
    }
  } catch (err) {
    console.error("Products POST error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
