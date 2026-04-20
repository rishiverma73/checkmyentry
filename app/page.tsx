"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  QrCode,
  Mail,
  ScanLine,
  ShieldCheck,
  Ticket,
  CheckCircle2,
  Building2,
  GraduationCap,
  ArrowRight,
  User as UserIcon,
  LayoutDashboard
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl tracking-tight text-slate-900">CheckMyEntry</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</Link>
          </div>
          <div className="flex items-center gap-4">
            {!loading && user ? (
              <Link href="/dashboard">
                <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm">
                  <UserIcon className="w-4 h-4" />
                  Organizer Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden relative">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "4s" }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-6 border border-blue-100">
                Premium Event Management
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
                Smart QR <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Event Entry</span> System
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
                Generate QR-based tickets, prevent fake entries, and manage your event seamlessly. The modern way to handle admissions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {!loading && user ? (
                  <Link href="/dashboard">
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3.5 rounded-full font-semibold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                ) : (
                  <Link href="/signup">
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3.5 rounded-full font-semibold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">
                      Get Started Free
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                )}
                  <Link href="/scanner">
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3.5 rounded-full font-semibold shadow-sm transition-all hover:-translate-y-0.5">
                      Open Scanner
                      <ScanLine className="w-4 h-4" />
                    </button>
                  </Link>
              </div>
              
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:ml-auto"
          >
            {/* Abstract UI Mockup */}
            <div className="w-full max-w-md mx-auto aspect-[4/5] bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-purple-600"></div>
              
              <div className="relative z-10 flex flex-col h-full mt-10">
                <div className="bg-white rounded-2xl shadow-lg p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="font-bold text-xl text-slate-900">Tech Summit 2026</h3>
                      <p className="text-sm text-slate-500 mt-1">General Admission</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      <Ticket className="w-5 h-5 text-slate-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 relative group">
                    <QrCode className="w-32 h-32 text-slate-800" />
                    
                    {/* Scanning animation effect */}
                    <motion.div 
                      className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  
                  <div className="mt-8 flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Name</p>
                      <p className="font-medium text-slate-900">Alex Walker</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase font-semibold">Gate</p>
                      <p className="font-medium text-slate-900 text-lg">A12</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 border-y border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">
            Trusted by colleges and event organizers
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 mix-blend-luminosity">
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><Building2 className="w-6 h-6"/> TechCorp</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><GraduationCap className="w-6 h-6"/> Stanford Univ</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><Ticket className="w-6 h-6"/> EventBrite</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800"><Building2 className="w-6 h-6"/> Innovate LLC</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Everything you need for flawless entry</h2>
            <p className="text-slate-600 text-lg">Our streamlined tools help you process attendees faster while completely eliminating ticket fraud.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">How it works</h2>
            <p className="text-slate-600 text-lg">Get started in minutes without any complex setup.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative max-w-4xl mx-auto">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-0.5 bg-slate-100 -z-10"></div>
            
            {steps.map((step, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white border border-slate-100 shadow-md rounded-2xl flex items-center justify-center mb-6 relative group hover:border-blue-200 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative text-blue-600">{step.icon}</div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-4 ring-white">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-white opacity-10"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Start Managing Your Event Smarter</h2>
            <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Join hundreds of organizers utilizing secure QR-based entry. Prevent fraud, speed up queues, and give attendees a premium experience.
            </p>
            <Link href="/register">
              <button className="bg-white text-blue-600 hover:bg-slate-50 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:-translate-y-1 transition-all">
                Generate Entry Pass
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-lg tracking-tight text-slate-900">CheckMyEntry</span>
          </div>
          
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <Link href="/login" className="hover:text-slate-900 transition-colors">Login</Link>
            <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link>
          </div>
          
          <div className="text-slate-400 text-sm">
            © {new Date().getFullYear()} CheckMyEntry. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "QR Ticket Generation",
    desc: "Instant QR-based entry passes generated automatically.",
    icon: <QrCode className="w-6 h-6" />
  },
  {
    title: "Email Delivery",
    desc: "Automatic email ticket delivery straight to the attendee's inbox.",
    icon: <Mail className="w-6 h-6" />
  },
  {
    title: "Live QR Scanner",
    desc: "Real-time entry verification using any smartphone camera.",
    icon: <ScanLine className="w-6 h-6" />
  },
  {
    title: "Anti-Fraud System",
    desc: "Prevent duplicate & fake entries. One scan, one entry.",
    icon: <ShieldCheck className="w-6 h-6" />
  }
];

const steps = [
  {
    title: "Fill Registration Form",
    desc: "User inputs details to register.",
    icon: <Ticket className="w-8 h-8" />
  },
  {
    title: "Get QR Ticket on Email",
    desc: "Pass is generated and securely sent.",
    icon: <Mail className="w-8 h-8" />
  },
  {
    title: "Scan at Entry Gate",
    desc: "Staff verifies tickets instantly.",
    icon: <CheckCircle2 className="w-8 h-8" />
  }
];