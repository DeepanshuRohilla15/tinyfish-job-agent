"use client";

import { useEffect, useRef, useState } from "react";

type Job = {
  title: string;
  company: string;
  status: string;
  link: string;
};

export default function JobTable({ jobs }: { jobs: Job[] }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "running" | "completed">("idle");

  const logEndRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);


  useEffect(() => {
    if (!runId) return;

    let isActive = true;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/logs?runId=${runId}`);
        const data = await res.json();

        if (!isActive) return;

        setLogs(data.logs || []);
        setStatus(data.status);

        if (data.status === "completed") {
          clearInterval(interval);
          setLoading(false);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 1500); // ⚡ slightly faster for smoother feel

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [runId]);

  const handleAutoApply = async (link: string) => {
    setLogs([]);
    setLoading(true);
    setStatus("running");
    setRunId(null); // reset previous run

    try {
      const res = await fetch("/api/auto-apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ link }),
      });

      const data = await res.json();

      console.log(data);

      if (data.runId) {
        setRunId(data.runId); // 🔥 triggers polling
      }

      if (data.status === "login_required") {
        setLogs([
          "🔐 Login required",
          "👉 Redirecting you to job page...",
        ]);

        window.open(link, "_blank", "noopener,noreferrer");

        setLoading(false);
        setStatus("idle");

      } else if (data.status === "applied_started") {
        setLogs(["🚀 Starting auto-apply process..."]);
      } else {
        setLogs(["⚠️ Unknown response from agent"]);
        setLoading(false);
        setStatus("idle");
      }

    } catch (err) {
      console.error(err);
      setLogs(["❌ Something went wrong"]);
      setLoading(false);
      setStatus("idle");
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4">Applications</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/10 text-gray-400">
            <th className="pb-2">Role</th>
            <th className="pb-2">Company</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job, index) => (
            <tr key={index} className="border-b border-white/5">
              <td className="py-3">{job.title}</td>
              <td>{job.company}</td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    job.status === "Applied"
                      ? "bg-green-500/20 text-green-400"
                      : job.status === "Found"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {job.status}
                </span>
              </td>

              <td className="flex gap-2">
                {/* Direct Apply */}
                <button
                  disabled={!job.link || job.link === "#"}
                  onClick={() =>
                    window.open(job.link, "_blank", "noopener,noreferrer")
                  }
                  className={`px-3 py-1 rounded-lg transition ${
                    job.link
                      ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                      : "bg-gray-500/20 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Apply 🔗
                </button>

                {/* Auto Apply */}
                <button
                  disabled={loading}
                  onClick={() => handleAutoApply(job.link)}
                  className={`px-3 py-1 rounded-lg ${
                    loading
                      ? "bg-gray-500/20 text-gray-500"
                      : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                  }`}
                >
                  {loading ? "Running..." : "🤖 Auto Apply"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔥 AGENT LOGS */}
      {(logs.length > 0 || status === "running") && (
        <div className="mt-6 bg-black/40 border border-white/10 rounded-2xl p-4">
          <h3 className="text-sm text-gray-400 mb-3 flex justify-between">
            <span>Agent Logs</span>
            <span>
              {status === "running" && "⏳ Running..."}
              {status === "completed" && "✅ Completed"}
            </span>
          </h3>

          <div className="text-sm font-mono max-h-60 overflow-y-auto text-green-400 whitespace-pre-wrap">
            {logs.length === 0 ? (
              <p>Waiting for logs...</p>
            ) : (
              logs.join("\n")
            )}
            <div ref={logEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}