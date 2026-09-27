import { NextResponse } from "next/server";
import { getStoriesByIds } from "@/lib/stories";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");
  if (!idsParam) {
    return NextResponse.json([]);
  }

  const ids = idsParam.split(",").filter(Boolean);
  const stories = await getStoriesByIds(ids);
  const order = new Map(ids.map((id, i) => [id, i]));
  stories.sort(
    (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
  );

  return NextResponse.json(stories);
}
