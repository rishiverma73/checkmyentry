"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-white text-center">
      
      <h1 className="text-5xl font-bold mb-4">CheckMyEntry</h1>
      
      <p className="mb-6 text-lg">
        Smart QR Based Event Entry System
      </p>

      <div className="flex gap-4">
        <Link href="/register">
          <button className="bg-white text-blue-600 px-6 py-2 rounded font-semibold">
            Register Now
          </button>
        </Link>

        <Link href="/scanner">
          <button className="bg-black px-6 py-2 rounded">
            Scan Entry
          </button>
        </Link>
      </div>

    </div>
  );
}