import { NextResponse, NextRequest } from "next/server";
import api from "@/lib/api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 500 });

  try {
    const res = await api.get("/product", { params: { id } });
    return NextResponse.json(res.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get product" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const res = await api.post("/product", body);
    return NextResponse.json(res.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  try {
    const res = await api.put("/product", body);
    return NextResponse.json(res.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  try {
    const res = await api.delete("/product", { params: { product_id: id } });
    return NextResponse.json(res.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete the product" },
      { status: 500 }
    );
  }
}
