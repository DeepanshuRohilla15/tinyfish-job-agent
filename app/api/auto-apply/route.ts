import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { link } = await req.json();

    console.log("Auto applying to:", link);

    const goal = `
Open this job link: ${link}

Wait for page to load.

Find and click the "Apply" button.

If a form appears:
- Fill dummy name, email
- Scroll through form
- Do NOT submit

Return status like:
{ "status": "applied_started" }
`;

    const response = await fetch(
      "https://agent.tinyfish.ai/v1/automation/run-sse",
      {
        method: "POST",
        headers: {
          "X-API-Key": process.env.TINYFISH_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: link,
          goal,
        }),
      }
    );

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    let fullText = "";

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunk = decoder.decode(value);
      fullText += chunk;

      console.log("Agent:", chunk); // 🔥 logs
    }

    return NextResponse.json({
      success: true,
      message: "Auto apply flow executed",
      raw: fullText,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Auto apply failed" },
      { status: 500 }
    );
  }
}