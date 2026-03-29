"use client"

import { useState } from "react";
import Navbar from "./components/Navbar";
import JobForm from "./components/JobForm";
import JobTable from "./components/JobTable";
import ActivityPanel from "./components/ActivityPanel";

export default function Home() {

  const [jobs, setJobs] = useState([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">
            Autonomous Job Hunter 🤖
          </h1>
          <p className="text-gray-400 mt-2">
            Your AI agent finds & applies to jobs automatically
          </p>
        </div>

        <JobForm setJobs={setJobs} />
        <ActivityPanel />
        <JobTable jobs={jobs} />
      </div>
    </div>
  );
}