import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB, nextId } from "@/lib/adminData";
import { requireAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const VALID_CATEGORIES = [
  "Radio & Receiver","FPV Equipment","Motors","Electronics",
  "Frames","Propellers","Battery & Charging","Accessories",
];

interface Product {
  id: number; name: string; category: string; sku: string;
  price: number; originalPrice: number; stock: number;
  status: string; description: string; createdAt: string; image?: string;
}

// GET — public (shop page needs this)
export async function GET() {
  try {
    const products = await readDB<Product>("products");
    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
      },
    });
  } catch (err) {
    console.error("Products GET error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST — admin only
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
    const price       = Math.max(0, parseFloat(body.price)         || 0);
    const originalPrice = Math.max(0, parseFloat(body.originalPrice) || price);
    const stock       = Math.max(0, parseInt(body.stock)            || 0);
    const status      = stock === 0 ? "out_of_stock" : stock <= 10 ? "low_stock" : "active";

    const products = await readDB<Product>("products");

    if (products.find(p => p.sku.toLowerCase() === sku.toLowerCase()))
      return NextResponse.json({ error: "SKU already exists" }, { status: 409 });

    const product: Product = {
      id: nextId(products), name, sku, category, price, originalPrice, stock, status,
      description: String(body.description || "").trim().slice(0, 2000),
      image: body.image || "",
      createdAt: new Date().toISOString(),
    };

    products.push(product);
    await writeDB("products", products);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("Products POST error:", err);
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}
