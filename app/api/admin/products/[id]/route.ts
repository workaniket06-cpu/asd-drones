import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/adminData";
import { requireAdmin } from "@/lib/adminAuth";

const VALID_CATEGORIES = ["Radio & Receiver","FPV Equipment","Motors","Electronics","Frames","Propellers","Battery & Charging","Accessories"];

interface Product { id: number; name: string; category: string; sku: string; price: number; originalPrice: number; stock: number; status: string; description: string; createdAt: string; }

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Single product is public (needed for product detail page)
  const { id } = await params;
  const products = await readDB<Product>("products");
  const product = products.find((p) => p.id === parseInt(id));
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const products = await readDB<Product>("products");
  const idx = products.findIndex((p) => p.id === parseInt(id));
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Validate fields — only allow known fields
  const name = String(body.name || products[idx].name).trim();
  const sku  = String(body.sku  || products[idx].sku).trim();
  const category    = VALID_CATEGORIES.includes(body.category) ? body.category : products[idx].category;
  const price       = body.price !== undefined ? Math.max(0, parseFloat(body.price) || 0) : products[idx].price;
  const origPrice   = body.originalPrice !== undefined ? Math.max(0, parseFloat(body.originalPrice) || 0) : products[idx].originalPrice;
  const stock       = body.stock !== undefined ? Math.max(0, parseInt(body.stock) || 0) : products[idx].stock;
  const description = body.description !== undefined ? String(body.description).trim().slice(0, 2000) : products[idx].description;
  const status      = stock === 0 ? "out_of_stock" : stock <= 10 ? "low_stock" : "active";

  products[idx] = { ...products[idx], name, sku, category, price, originalPrice: origPrice, stock, status, description };
  await writeDB("products", products);
  return NextResponse.json(products[idx]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { id } = await params;
  const products = await readDB<Product>("products");
  const filtered = products.filter((p) => p.id !== parseInt(id));
  if (filtered.length === products.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await writeDB("products", filtered);
  return NextResponse.json({ success: true });
}
