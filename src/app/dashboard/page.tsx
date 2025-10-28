export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Welcome to SkillSync Dashboard
      </h1>
      <p className="text-gray-600 mb-8">
        TailwindCSS is successfully configured 🎉
      </p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow">
        Explore Skills
      </button>
    </main>
  )
}
