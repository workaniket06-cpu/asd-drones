import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/adminData";

interface Product { id: number; name: string; category: string; sku: string; price: number; originalPrice: number; stock: number; status: string; description: string; createdAt: string; }

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await readDB<Product>("products");
  const product = products.find((p) => p.id === parseInt(id));
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const products = await readDB<Product>("products");
  const idx = products.findIndex((p) => p.id === parseInt(id));
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const stock = parseInt(body.stock) || 0;
  products[idx] = {
    ...products[idx], ...body, stock,
    status: stock === 0 ? "out_of_stock" : stock <= 10 ? "low_stock" : "active",
  };
  await writeDB("products", products);
  return NextResponse.json(products[idx]);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await readDB<Product>("products");
  const filtered = products.filter((p) => p.id !== parseInt(id));
  if (filtered.length === products.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await writeDB("products", filtered);
  return NextResponse.json({ success: true });
}
