"use client";
import Link from "next/link";
import { QrCode, Users, Zap, ShieldCheck, Heart } from "lucide-react";
import { ThemeToggle } from "../../components/ThemeToggle";
export default function AboutUs() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F1A] text-slate-900 dark:text-white font-sans">
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00E5FF]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#8B5CF6]/10 blur-[150px] rounded-full pointer-events-none" />
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-[#0B0F1A]/70 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center shadow-lg">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">ScanMyEntry</span>
          </Link>
          <ThemeToggle />
        </div>
      </nav>
      <main className="pt-32 pb-24 px-6 relative z-10 max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-xs font-bold tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] mr-2 animate-pulse" />
            Built in India for India
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6]">ScanMyEntry</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Built for event organizers across India — a platform that makes check-in fast, seamless, and professional.
          </p>
        </div>
        {/* Mission */}
        <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-12 mb-10 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Heart className="w-6 h-6 text-rose-500" /> Our Mission
          </h2>
          <p className="text-slate-600 dark:text-neutral-400 leading-relaxed text-lg">
            ScanMyEntry was born from a simple frustration — event management in India still relies heavily on manual processes.
            Long queues, paper lists, and Excel sheets have caused headaches for countless organizers.
            We wanted to change that.
          </p>
          <p className="text-slate-600 dark:text-neutral-400 leading-relaxed text-lg mt-4">
            That is why we built a fully digital, QR-based event entry system that works for events of any size —
            whether it is a college festival, a corporate seminar, or a wedding reception.
          </p>
        </div>
        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: Zap, title: "Speed First", desc: "QR scanning completes in seconds with zero waiting time. Your entry gate never gets jammed.", color: "text-amber-400" },
            { icon: ShieldCheck, title: "Data Security", desc: "Attendee data is stored securely on Firebase infrastructure with industry-standard encryption.", color: "text-emerald-400" },
            { icon: Users, title: "Organizer Centric", desc: "Every feature is built with the event organizer's needs as the top priority.", color: "text-[#8B5CF6]" },
          ].map((v, i) => (
            <div key={i} className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <v.icon className={`w-8 h-8 ${v.color} mb-4`} />
              <h3 className="font-bold text-lg mb-2">{v.title}</h3>
              <p className="text-slate-500 dark:text-neutral-400 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
        {/* Team */}
        <div className="bg-gradient-to-br from-[#00E5FF]/10 to-[#8B5CF6]/10 border border-[#00E5FF]/20 rounded-3xl p-8 md:p-12 mb-10">
          <h2 className="text-2xl font-bold mb-6">About the Team</h2>
          <p className="text-slate-600 dark:text-neutral-400 leading-relaxed text-lg">
            We are a team of passionate developers from Jodhpur, Rajasthan who believe technology can solve everyday problems.
            ScanMyEntry is our flagship product, built to be equally effective for organizers in tier-2 and tier-3 cities across India.
          </p>
          <div className="mt-6 flex items-center gap-3 text-sm text-slate-500 dark:text-neutral-400">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center text-white text-xs font-bold">R</div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-white">Rocky Singh Dangi</p>
              <p>Founder &amp; Lead Developer &middot; Jodhpur, Rajasthan</p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <Link href="/">
            <button className="h-12 px-8 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] text-white font-bold shadow-lg hover:scale-105 transition-transform">
              Back to Home
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
