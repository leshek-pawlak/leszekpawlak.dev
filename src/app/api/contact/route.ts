import { NextResponse } from "next/server";
import { resolveWeb3FormsAccessKey } from "@/lib/contactConfig";

export async function GET() {
  const accessKey = resolveWeb3FormsAccessKey();

  if (!accessKey) {
    return NextResponse.json(
      { error: "Contact service unavailable" },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  return NextResponse.json(
    { accessKey },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
