import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://actig-gpt.openai.azure.com/openai/realtimeapi/sessions?api-version=2025-04-01-preview",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AZURE_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini-realtime-preview",
        }),
      }
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
