"use client";

import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";

export default function Dashboard() {

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <p>Welcome to CheckMyEntry 🚀</p>

      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

    </div>
  );
}