type Job = {
  title: string;
  company: string;
  status: string;
  link: string;
};

export default function JobTable({ jobs }: { jobs: Job[] }) {

  const handleAutoApply = async (link: string) => {
  try {
    const res = await fetch("/api/auto-apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ link }),
    });

    const data = await res.json();

    console.log("Auto Apply Result:", data);
    alert("🤖 Agent is applying...");
  } catch (err) {
    console.error(err);
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
              <td>
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

                 
                <button
                  onClick={() => handleAutoApply(job.link)}
                  className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                >
                  🤖 Auto Apply
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}