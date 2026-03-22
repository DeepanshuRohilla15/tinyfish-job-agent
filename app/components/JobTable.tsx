"use client";

import { useState } from "react";

type Job = {
  title: string;
  company: string;
  status: string;
  link: string;
};

export default function JobTable({ jobs }: { jobs: Job[] }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAutoApply = async (link: string) => {
    setLogs([]);
    setLoading(true);

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

      if (data.status === "login_required") {
        setLogs([
          "🔐 Login required",
          "👉 Redirecting you to job page...",
        ]);

        window.open(link, "_blank", "noopener,noreferrer");

      } else if (data.status === "applied_started") {
        setLogs([
          "🔍 Opening job page...",
          "🖱 Clicking Apply button...",
          "📄 Filling form...",
          "✅ Application process started",
        ]);

      } else {
        setLogs(["⚠️ Unknown response from agent"]);
      }

    } catch (err) {
      console.error(err);
      setLogs(["❌ Something went wrong"]);
    }

    setLoading(false);
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

      {/* Agent Logs */}
      {logs.length > 0 && (
        <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-4">
          <h3 className="text-sm text-gray-400 mb-3">Agent Logs</h3>

          <div className="space-y-2 text-sm">
            {logs.map((log, index) => (
              <p key={index}>{log}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}