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
          url: "https://jobs.lever.co",
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

      console.log("Chunk:", chunk); 
    }

    console.log("Final Output:", fullText);

    
    let jobs: any[] = [];

    try {
      const jsonMatch = fullText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jobs = JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.error("JSON parse failed");
    }

    
    const formattedJobs = jobs.map((job: any) => ({
        title: job.title || "Unknown Role",
        company: job.company || "Unknown Company",
        link: job.link || "#",  
        status: "Found",
        }));

    return NextResponse.json({
      success: true,
      jobs: formattedJobs,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Agent failed" },
      { status: 500 }
    );
  }
}