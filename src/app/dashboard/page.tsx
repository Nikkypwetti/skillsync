  import DashboardClient from "./index";

export default function DashboardPage() {
  
  const user = { name: "Baseerah" }; 

  return (
    <main className="min-h-screen p-8 space-y-6 bg-gray-50">
      <h1 className="text-3xl font-bold">Welcome, {user.name} 👋</h1>
      
      <DashboardClient />
    </main>
  );
}

    
  

