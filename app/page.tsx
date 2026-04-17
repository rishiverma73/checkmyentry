"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 px-4">

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:p-10 w-full max-w-md text-center shadow-xl">

        {/* Logo / Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          CheckMyEntry
        </h1>

        <p className="text-sm sm:text-base text-gray-200 mb-6">
          Smart QR Based Event Entry System
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">

          <Link href="/register" className="w-full">
            <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Register Now
            </button>
          </Link>

          <Link href="/scanner" className="w-full">
            <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
              Scan Entry
            </button>
          </Link>

        </div>

        {/* Footer */}
        <p className="mt-6 text-xs text-gray-300">
          Secure • Fast • Reliable
        </p>

      </div>

    </div>
  );
}