export default function ActivityPanel() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mt-6">
      <h3 className="text-sm text-gray-400 mb-3">Agent Activity</h3>

      <div className="space-y-2 text-sm">
        <p>🔍 Searching jobs...</p>
        <p>📄 Extracting job descriptions...</p>
        <p>🧠 Matching with your profile...</p>
        <p>✍️ Filling applications...</p>
      </div>
    </div>
  );
}