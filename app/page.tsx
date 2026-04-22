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
  CalendarPlus,
  Compass
} from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05050A] text-slate-900 dark:text-white selection:bg-blue-200 dark:selection:bg-purple-500/30 font-sans overflow-x-hidden transition-colors duration-300">
      {/* Abstract Neon Glows (Only visible in dark mode or subtler in light mode) */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 dark:bg-blue-600/20 blur-[120px] dark:blur-[150px] rounded-full pointer-events-none transition-all duration-500" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 dark:bg-purple-600/20 blur-[120px] dark:blur-[150px] rounded-full pointer-events-none transition-all duration-500" />

      {/* Dynamic Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-[#05050A]/40 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-6 py-4 transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
               <QrCode className="w-5 h-5 text-white" />
             </div>
             <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-neutral-400">
               CheckMyEntry
             </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <button className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white transition-colors">
                Sign In
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white/10 dark:hover:bg-white/20 border border-transparent dark:border-white/10 px-5 py-2.5 rounded-full text-sm font-medium transition-all backdrop-blur-md shadow-sm dark:shadow-none">
                Dashboard
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 dark:text-blue-400 text-xs font-semibold tracking-wide mb-8 shadow-sm dark:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-colors duration-300">
               <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
               Next-Gen Event OS
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[1.05] text-slate-900 dark:text-white mb-8 transition-colors duration-300">
              Create, Manage & Scan <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-500">
                Event Entries Seamlessly.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-12 font-medium transition-colors duration-300">
              The ultimate futuristic ticketing platform. Build dynamic registration forms, generate secure QR passes, and scan attendees at lightning speed.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/dashboard/create-event">
                <button className="h-14 px-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center gap-2 text-lg w-full sm:w-auto hover:-translate-y-1">
                  <CalendarPlus className="w-5 h-5" /> Create Event
                </button>
              </Link>
              <Link href="#explore">
                <button className="h-14 px-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-semibold hover:bg-slate-50 dark:hover:bg-white/10 backdrop-blur-md transition-all flex items-center justify-center gap-2 text-lg w-full sm:w-auto hover:-translate-y-1 shadow-sm dark:shadow-none">
                  <Compass className="w-5 h-5" /> Explore Events
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="explore" className="py-24 px-6 relative max-w-6xl mx-auto z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white transition-colors duration-300">Engineered for the future.</h2>
          <p className="text-slate-500 dark:text-neutral-400 font-medium text-lg transition-colors duration-300">Powerful tools packed in a stunning intuitive interface.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-white dark:bg-white/[0.03] rounded-3xl p-8 md:p-10 border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-2xl dark:backdrop-blur-xl relative overflow-hidden group dark:hover:border-blue-500/30 transition-colors"
          >
            <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/10 dark:group-hover:bg-blue-500/20 transition-colors" />
            <div className="w-14 h-14 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:border dark:border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 relative z-10">
               <Scan className="w-7 h-7 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight text-slate-900 dark:text-white relative z-10 transition-colors duration-300">Global QR Scanner</h3>
            <p className="text-slate-600 dark:text-neutral-400 text-lg leading-relaxed max-w-md relative z-10 transition-colors duration-300">
              Validate attendees instantly with our lightning-fast built-in scanner. Military-grade cryptography ensures tickets cannot be duplicated.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-white/[0.03] rounded-3xl p-8 md:p-10 border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-2xl dark:backdrop-blur-xl relative overflow-hidden group dark:hover:border-purple-500/30 transition-colors"
          >
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/5 dark:bg-purple-500/10 blur-[50px] rounded-full group-hover:bg-purple-500/10 dark:group-hover:bg-purple-500/20 transition-colors" />
             <div className="w-14 h-14 bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:border dark:border-purple-500/20 rounded-2xl flex items-center justify-center mb-6 relative z-10">
               <Zap className="w-7 h-7 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight text-slate-900 dark:text-white relative z-10 transition-colors duration-300">Frictionless Flow</h3>
            <p className="text-slate-600 dark:text-neutral-400 leading-relaxed relative z-10 transition-colors duration-300">
              No app downloads. Attendees register via dynamic forms and receive an instant QR pass.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 dark:bg-gradient-to-br dark:from-blue-900/40 dark:to-purple-900/40 rounded-3xl p-8 md:p-10 border border-slate-800 dark:border-white/10 shadow-xl dark:shadow-2xl dark:backdrop-blur-xl relative overflow-hidden text-white group"
          >
             <div className="absolute inset-0 bg-white/[0.01] group-hover:bg-white/[0.03] transition-colors" />
             <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 relative z-10 backdrop-blur-md border border-white/5">
               <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight relative z-10">Absolute Security</h3>
            <p className="text-slate-300 dark:text-neutral-300 leading-relaxed relative z-10">
              End-to-end encrypted infrastructure protecting your attendee data.
            </p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 bg-white dark:bg-white/[0.03] rounded-3xl p-8 md:p-10 border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-2xl dark:backdrop-blur-xl flex flex-col justify-center relative overflow-hidden group dark:hover:border-indigo-500/30 transition-colors"
          >
            <div className="absolute left-0 bottom-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/10 dark:group-hover:bg-indigo-500/20 transition-colors" />
            <h3 className="text-2xl font-bold mb-3 tracking-tight text-slate-900 dark:text-white relative z-10 transition-colors duration-300">Dynamic Dashboard</h3>
            <p className="text-slate-600 dark:text-neutral-400 text-lg leading-relaxed mb-6 relative z-10 transition-colors duration-300">
              Track revenue, live attendee counts, and scan analytics from a mission-control command center.
            </p>
            <div className="flex flex-wrap gap-4 relative z-10">
              <div className="px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 flex items-center gap-2 font-medium text-sm text-slate-600 dark:text-neutral-300 dark:backdrop-blur-md transition-colors duration-300">
                <CheckCircle2 className="w-4 h-4 text-blue-500 dark:text-blue-400" /> Live Data Sync
              </div>
              <div className="px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 flex items-center gap-2 font-medium text-sm text-slate-600 dark:text-neutral-300 dark:backdrop-blur-md transition-colors duration-300">
                <CheckCircle2 className="w-4 h-4 text-purple-500 dark:text-purple-400" /> Granular Control
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#05050A] relative z-10 mt-20 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
               <QrCode className="w-4 h-4 text-white" />
             </div>
             <span className="font-semibold tracking-tight text-slate-900 dark:text-neutral-200 transition-colors duration-300">CheckMyEntry</span>
          </div>
          <p className="text-slate-500 dark:text-neutral-500 text-sm font-medium transition-colors duration-300">© {new Date().getFullYear()} CheckMyEntry. Next-Gen Ticketing.</p>
        </div>
      </footer>
    </div>
  );
}