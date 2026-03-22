export default function Navbar() {
  return (
    <div className="w-full border-b border-white/10 px-6 py-4 flex justify-between items-center backdrop-blur-md">
      <h1 className="text-xl font-bold">JobAgent 🚀</h1>

      <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition">
        Dashboard
      </button>
    </div>
  );
}