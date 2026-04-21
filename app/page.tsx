"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  QrCode,
  Zap,
  ArrowRight,
  Scan,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-slate-900 selection:bg-blue-200">
      {/* Dynamic Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#fafafa]/70 backdrop-blur-xl border-b border-white/20 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
               <QrCode className="w-5 h-5 text-white" />
             </div>
             <span className="font-semibold text-lg tracking-tight">CheckMyEntry</span>
          </div>
          <div className="flex items-center gap-3">
            {!loading && user ? (
              <Link href="/dashboard">
                <button className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-transform active:scale-95 shadow-lg shadow-black/10">
                  Go to Dashboard
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-transform active:scale-95 shadow-lg shadow-black/10">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Abstract Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-neutral-200 text-neutral-600 text-xs font-semibold tracking-wide mb-8 shadow-sm">
               <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
               Introducing the new Entry System
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95] text-neutral-900 mb-8">
              Run events without <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">the chaos.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
              We reimagined event check-ins. No more clunky spreadsheets or hardware. Just seamless, instant QR entry straight from your device.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               {!loading && user ? (
                  <Link href="/dashboard">
                    <button className="h-14 px-8 rounded-full bg-black text-white font-medium hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 text-lg w-full sm:w-auto hover:shadow-xl hover:-translate-y-0.5">
                      Open Dashboard <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
               ) : (
                  <>
                    <Link href="/signup">
                      <button className="h-14 px-8 rounded-full bg-black text-white font-medium hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 text-lg w-full sm:w-auto hover:shadow-xl hover:-translate-y-0.5">
                        Start for free
                      </button>
                    </Link>
                    <Link href="#features">
                      <button className="h-14 px-8 rounded-full bg-white border border-neutral-200 text-neutral-700 font-medium hover:bg-neutral-50 transition-all flex items-center justify-center w-full sm:w-auto">
                        See how it works
                      </button>
                    </Link>
                  </>
               )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-24 px-6 relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Radically simple.</h2>
          <p className="text-neutral-500 font-medium text-lg">Everything you need, built intuitively.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 md:p-10 border border-neutral-200/60 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full group-hover:bg-blue-500/10 transition-colors" />
            <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6">
               <Scan className="w-6 h-6 text-neutral-700" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight">Instant Scanner Mode</h3>
            <p className="text-neutral-500 text-lg leading-relaxed max-w-md">
              Turn any smartphone into a lightning-fast ticket scanner. Works globally, instantly validating entries without expensive hardware.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-neutral-200/60 shadow-sm relative overflow-hidden">
             <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6">
               <Zap className="w-6 h-6 text-neutral-700" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight">Frictionless</h3>
            <p className="text-neutral-500 leading-relaxed">
              Attendees don't need to create accounts or download apps. One link, one form, instant pass.
            </p>
          </div>

          {/* Card 3 */}
           <div className="bg-neutral-900 rounded-3xl p-8 md:p-10 border border-neutral-800 shadow-xl relative overflow-hidden text-white">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/0" />
             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 relative z-10 backdrop-blur-md">
               <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight relative z-10">Secure Verification</h3>
            <p className="text-neutral-400 leading-relaxed relative z-10">
              Each QR code is cryptographically unique. Once scanned, it cannot be reused, completely eliminating ticket fraud and double entries.
            </p>
          </div>

          {/* Card 4 */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 md:p-10 border border-neutral-200/60 shadow-sm flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-3 tracking-tight">Real-time Analytics Dashboard</h3>
            <p className="text-neutral-500 text-lg leading-relaxed mb-6">
              Watch your attendee count grow in real-time. Know exactly who has arrived and who hasn't.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Live Synchronisation
              </div>
              <div className="px-4 py-2 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> PDF Exports
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
               <QrCode className="w-3.5 h-3.5 text-white" />
             </div>
             <span className="font-semibold tracking-tight text-black">CheckMyEntry</span>
          </div>
          <p className="text-neutral-500 text-sm font-medium">© {new Date().getFullYear()} CheckMyEntry. Crafted with precision.</p>
        </div>
      </footer>
    </div>
  );
}