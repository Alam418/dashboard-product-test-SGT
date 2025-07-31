import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const search = searchParams.get("search") || "";

  try {
    const res = await api.get("/products", {
      params: { page, limit, search },
    });
    return NextResponse.json(res.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
