import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const role = formData.get("role") as string;
    const location = formData.get("location") as string;

    console.log({ role, location });

    const goal = `
Go to LinkedIn Jobs.

Search for "${role}" jobs in "${location}".

Extract top 5 jobs with:
- title
- company
- link

Return STRICT JSON:
[
  { "title": "...", "company": "...", "link": "..." }
]
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
          url: "https://www.linkedin.com/jobs",
          goal,
        }),
      }
    );

    if (!response.body) {
      throw new Error("No response body from agent");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let finalData: any = null;

    // 🔥 READ SSE STREAM
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      console.log("Chunk:", chunk);

      const lines = chunk.split("\n");

      for (let line of lines) {
        line = line.trim();

        if (!line.startsWith("data:")) continue;

        const jsonStr = line.replace("data:", "").trim();

        if (!jsonStr || jsonStr === "[DONE]") continue;

        try {
          const parsed = JSON.parse(jsonStr);

          // ✅ Capture final event
          if (parsed.type === "COMPLETE") {
            finalData = parsed;
          }
        } catch {
          // Ignore partial JSON chunks
        }
      }
    }

    console.log("✅ Final Event:", finalData);

    // 🔥 SAFELY EXTRACT JOBS
    let jobs: any[] = [];

    if (finalData?.result?.result) {
      const result = finalData.result.result;

      console.log("🧠 RAW RESULT:", result);

      if (Array.isArray(result)) {
        // ✅ Already parsed (correct case)
        jobs = result;
      } else if (typeof result === "string") {
        // ⚠️ Fallback if agent ever returns string
        try {
          jobs = JSON.parse(result);
        } catch (err) {
          console.error("❌ JSON parse failed:", result);
        }
      }
    } else {
      console.error("❌ No result found in COMPLETE event");
    }

    // 🔥 FORMAT RESPONSE
    const formattedJobs = jobs.map((job: any) => ({
      title: job?.title || "Unknown Role",
      company: job?.company || "Unknown Company",
      link: job?.link || "#",
      status: "Found",
    }));

    return NextResponse.json({
      success: true,
      jobs: formattedJobs,
    });

  } catch (error) {
    console.error("❌ API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Agent failed",
      },
      { status: 500 }
    );
  }
}