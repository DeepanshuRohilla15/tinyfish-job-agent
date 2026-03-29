import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { logStore } from "@/server/logStore";


export async function POST(req: NextRequest) {
  try {
    const { link } = await req.json();

    const runId = uuidv4();

    
    logStore[runId] = {
      logs: ["🚀 Starting auto apply..."],
      status: "running",
    };

    const addLog = (msg: string) => {
      logStore[runId].logs.push(msg);
    };

  
    (async () => {
      try {
        addLog("🔍 Opening job page...");

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

         
          addLog("⚙️ Processing step...");
          console.log("Agent:", chunk);
        }

        
        if (fullText.includes("login_required")) {
          addLog("🔐 Login required");
          logStore[runId].status = "completed";
        } else if (fullText.includes("applied_started")) {
          addLog("📄 Filling application form...");
          addLog("✅ Application process started");
          logStore[runId].status = "completed";
        } else {
          addLog("⚠️ Unknown response from agent");
          logStore[runId].status = "completed";
        }

      } catch (err) {
        console.error(err);
        addLog("❌ Agent failed");
        logStore[runId].status = "completed";
      }
    })();

    
    return NextResponse.json({
      success: true,
      status: "applied_started",
      runId,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Auto apply failed" },
      { status: 500 }
    );
  }
}