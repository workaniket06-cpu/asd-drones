import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB, nextId } from "@/lib/adminData";

interface Product { id: number; name: string; category: string; sku: string; price: number; originalPrice: number; stock: number; status: string; description: string; createdAt: string; }

export async function GET() {
  return NextResponse.json(await readDB<Product>("products"));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const products = await readDB<Product>("products");
  const stock = parseInt(body.stock) || 0;
  const product: Product = {
    ...body, id: nextId(products),
    createdAt: new Date().toISOString(),
    status: stock === 0 ? "out_of_stock" : stock <= 10 ? "low_stock" : "active",
  };
  products.push(product);
  await writeDB("products", products);
  return NextResponse.json(product, { status: 201 });
}
