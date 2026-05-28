import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: "Only JPG, PNG, WebP, or GIF files are allowed" }, { status: 400 });

  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: "File must be under 5 MB" }, { status: 400 });

  const ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  const filename = `product_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "images", "products");

  await mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ url: `/images/products/${filename}` });
}
