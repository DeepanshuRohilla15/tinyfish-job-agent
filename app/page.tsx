import Navbar from "./components/Navbar";
import JobForm from "./components/JobForm";
import JobTable from "./components/JobTable";
import ActivityPanel from "./components/ActivityPanel";

export default function Home() {
  const dummyJobs = [
    {
      title: "Backend Engineer",
      company: "Amazon",
      status: "Applied",
    },
    {
      title: "Software Engineer",
      company: "Google",
      status: "Pending",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">
            Autonomous Job Hunter 🤖
          </h1>
          <p className="text-gray-400 mt-2">
            Your AI agent finds & applies to jobs automatically
          </p>
        </div>

        {/* Form */}
        <JobForm />

        {/* Activity */}
        <ActivityPanel />

        {/* Table */}
        <JobTable jobs={dummyJobs} />
      </div>
    </div>
  );
}