"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OldRegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new user dashboard where registration lives now
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-500">Redirecting to new dashboard...</p>
    </div>
  );
}