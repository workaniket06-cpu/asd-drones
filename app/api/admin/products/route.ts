import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB, nextId } from "@/lib/adminData";
import { requireAdmin } from "@/lib/adminAuth";

const VALID_CATEGORIES = ["Radio & Receiver","FPV Equipment","Motors","Electronics","Frames","Propellers","Battery & Charging","Accessories"];
const VALID_STATUSES   = ["active","draft","out_of_stock","low_stock"];

interface Product { id: number; name: string; category: string; sku: string; price: number; originalPrice: number; stock: number; status: string; description: string; createdAt: string; }

export async function GET(req: NextRequest) {
  // Products list is public (needed for shop page)
  return NextResponse.json(await readDB<Product>("products"));
}

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  // ── Strict input validation ──
  const name = String(body.name || "").trim();
  const sku  = String(body.sku  || "").trim();
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!sku)  return NextResponse.json({ error: "SKU is required" }, { status: 400 });

  const category = VALID_CATEGORIES.includes(body.category) ? body.category : "Accessories";
  const price         = Math.max(0, parseFloat(body.price)         || 0);
  const originalPrice = Math.max(0, parseFloat(body.originalPrice) || price);
  const stock         = Math.max(0, parseInt(body.stock)            || 0);

  const status = stock === 0 ? "out_of_stock" : stock <= 10 ? "low_stock" : "active";

  const products = await readDB<Product>("products");

  // Duplicate SKU check
  if (products.find(p => p.sku.toLowerCase() === sku.toLowerCase()))
    return NextResponse.json({ error: "SKU already exists" }, { status: 409 });

  const product: Product = {
    id: nextId(products),
    name, sku, category, price, originalPrice, stock, status,
    description: String(body.description || "").trim().slice(0, 2000),
    createdAt: new Date().toISOString(),
  };

  products.push(product);
  await writeDB("products", products);
  return NextResponse.json(product, { status: 201 });
}
