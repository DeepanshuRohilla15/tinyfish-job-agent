import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { link } = await req.json();

    console.log("Auto applying to:", link);

    const goal = `
        Open this job link: ${link}

        Check if login is required.

        IF login page appears:
        - Stop automation
        - Return: { "status": "login_required" }

        ELSE:
        - Click Apply button
        - Start filling form
        - Do NOT submit

        Return:
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

    let status = "unknown";

    if (fullText.includes("login_required")) {
    status = "login_required";
    } else if (fullText.includes("applied_started")) {
    status = "applied_started";
    }

    return NextResponse.json({
        success: true,
        status,
        });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Auto apply failed" },
      { status: 500 }
    );
  }
}