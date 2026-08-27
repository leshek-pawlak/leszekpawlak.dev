import { NextResponse } from "next/server";
import { handleContactRequest } from "@/lib/contactRoute";

export async function POST(request: Request) {
  const result = await handleContactRequest(request);
  return NextResponse.json(result.body, {
    status: result.status,
    headers: {
      "Cache-Control": "no-store",
      Vary: "Origin, Sec-Fetch-Site",
      ...result.headers,
    },
  });
}
