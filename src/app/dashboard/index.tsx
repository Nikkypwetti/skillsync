"use client"; // 👈 This makes it a client component

import { useState } from "react";

export default function DashboardClient() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6 bg-white shadow-sm rounded-xl">
      <h2 className="mb-4 text-2xl font-semibold">Client Component Example</h2>
      <p className="mb-2 text-gray-700">Count: {count}</p>
      <button
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
      >
        Increment
      </button>
    </div>
  );
}
