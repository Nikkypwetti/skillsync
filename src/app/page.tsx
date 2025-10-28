export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-5xl font-bold text-blue-600 mb-4">
        Welcome to SkillSync
      </h1>
      <p className="text-gray-700 mb-6">
        🚀 TailwindCSS is now working perfectly in your Next.js project!
      </p>
      <a
        href="/dashboard"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Go to Dashboard
      </a>
    </main>
  );
}


