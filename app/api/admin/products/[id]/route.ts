import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getDb } from "@/lib/mongodb";
import { readDB, writeDB } from "@/lib/adminData";

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

// GET single product — public
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = parseInt(id);
  const products = await readDB<Product>("products");
  const product = products.find(p => p.id === numId);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

// PUT — admin only — uses findOneAndUpdate
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { id } = await params;
  const numId = parseInt(id);
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  try {
    const name        = String(body.name || "").trim();
    const sku         = String(body.sku  || "").trim();
    const category    = VALID_CATEGORIES.includes(body.category) ? body.category : "Accessories";
    const price       = Math.max(0, parseFloat(body.price)         || 0);
    const origPrice   = Math.max(0, parseFloat(body.originalPrice) || price);
    const stock       = Math.max(0, parseInt(body.stock)            || 0);
    const description       = String(body.description || "").trim().slice(0, 2000);
    const image             = body.image || "";
    const images            = Array.isArray(body.images)
      ? body.images.filter((u: unknown) => typeof u === "string").slice(0, 10)
      : [];
    const descriptionImages = Array.isArray(body.descriptionImages)
      ? body.descriptionImages.filter((u: unknown) => typeof u === "string").slice(0, 10)
      : [];

    const update = {
      name, sku, category, price, originalPrice: origPrice, stock,
      status: getStatus(stock), description, image, images, descriptionImages,
    };

    if (process.env.MONGODB_URI) {
      const db = await getDb();
      const result = await db.collection("products").findOneAndUpdate(
        { id: numId },
        { $set: update },
        { returnDocument: "after", projection: { _id: 0 } }
      );
      if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(result);
    } else {
      const products = await readDB<Product>("products");
      const idx = products.findIndex(p => p.id === numId);
      if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
      products[idx] = { ...products[idx], ...update };
      await writeDB("products", products);
      return NextResponse.json(products[idx]);
    }
  } catch (err) {
    console.error("Products PUT error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// DELETE — admin only — uses deleteOne
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { id } = await params;
  const numId = parseInt(id);

  try {
    if (process.env.MONGODB_URI) {
      const db = await getDb();
      const result = await db.collection("products").deleteOne({ id: numId });
      if (result.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ success: true });
    } else {
      const products = await readDB<Product>("products");
      const filtered = products.filter(p => p.id !== numId);
      if (filtered.length === products.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
      await writeDB("products", filtered);
      return NextResponse.json({ success: true });
    }
  } catch (err) {
    console.error("Products DELETE error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
