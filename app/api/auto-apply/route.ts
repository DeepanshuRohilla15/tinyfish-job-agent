import { NextRequest, NextResponse } from "next/server";
import { logStore } from "@/server/logStore";

export async function POST(req: NextRequest) {
  try {
    const { link } = await req.json();

    
    const runId = crypto.randomUUID();

   
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

          console.log("Agent:", chunk);

         
          const lines = chunk.split("\n");

          for (let line of lines) {
            line = line.trim();

            
            if (!line || line === "data: [DONE]") continue;

           
            if (line.startsWith("data:")) {
              line = line.replace("data:", "").trim();
            }

            if (!line) continue;

           
            const lower = line.toLowerCase();

            if (lower.includes("open")) {
              addLog("🔍 Opening job page...");
            } else if (lower.includes("click")) {
              addLog("🖱 Clicking apply button...");
            } else if (lower.includes("form")) {
              addLog("📄 Filling application form...");
            } else if (lower.includes("resume")) {
              addLog("📎 Uploading resume...");
            } else {
              addLog(line);
            }
          }
        }

       
        if (fullText.includes("login_required")) {
          addLog("🔐 Login required");
          logStore[runId].status = "completed";
        } else if (fullText.includes("applied_started")) {
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