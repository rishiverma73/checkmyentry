"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  QrCode,
  Zap,
  LayoutDashboard,
  Users,
  ArrowRight,
  User as UserIcon,
  CheckCircle2,
  ScanLine
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-inner">
               <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">CheckMyEntry</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <Link href="#features" className="hover:text-slate-900 transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-slate-900 transition-colors">How it Works</Link>
          </div>
          <div className="flex items-center gap-4">
            {!loading && user ? (
              <Link href="/dashboard">
                <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm">
                  <UserIcon className="w-4 h-4" />
                  Organizer Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - Asymmetrical */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left pr-0 lg:pr-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide border border-blue-100 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                Event Checking Platform v2.0
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
                Create Events. <br /> Manage Entry. <span className="text-blue-600">Scan Instantly.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                A simple and powerful event system with QR-based entry. Ditch the clipboards and modernize your front gate experience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {!loading && user ? (
                  <Link href="/dashboard">
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                      Enter Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link href="/signup">
                      <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                        Create Event
                      </button>
                    </Link>
                    <Link href="/login">
                      <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3.5 rounded-xl font-medium transition-all active:scale-95 shadow-sm">
                        Login
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
             {/* Dashboard Mockup */}
             <div className="w-full bg-slate-900 rounded-2xl md:rounded-[2rem] shadow-2xl overflow-hidden border border-slate-800 rotate-1 hover:rotate-0 transition-transform duration-500 hover:shadow-blue-900/20">
               <div className="h-10 bg-slate-800/50 flex items-center px-4 gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-400"></div>
                 <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                 <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
               </div>
               <div className="p-6">
                 <div className="flex justify-between items-center mb-6">
                   <div className="h-4 w-32 bg-slate-800 rounded-md"></div>
                   <div className="h-8 w-24 bg-blue-600 rounded-lg"></div>
                 </div>
                 <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="h-24 bg-slate-800/80 rounded-xl p-4">
                     <div className="h-3 w-16 bg-slate-700 rounded mb-2"></div>
                     <div className="h-8 w-10 bg-slate-700 rounded"></div>
                   </div>
                   <div className="h-24 bg-slate-800/80 rounded-xl p-4">
                     <div className="h-3 w-20 bg-slate-700 rounded mb-2"></div>
                     <div className="h-8 w-12 bg-emerald-500/50 rounded"></div>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <div className="h-12 w-full bg-slate-800/50 rounded-lg flex items-center px-4">
                     <div className="w-6 h-6 rounded-md bg-slate-700 mr-3"></div>
                     <div className="h-3 w-32 bg-slate-700 rounded"></div>
                   </div>
                   <div className="h-12 w-full bg-slate-800/50 rounded-lg flex items-center px-4">
                     <div className="w-6 h-6 rounded-md bg-slate-700 mr-3"></div>
                     <div className="h-3 w-24 bg-slate-700 rounded"></div>
                   </div>
                 </div>
               </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Stats Section */}
      <section className="py-10 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-24 opacity-80">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-slate-900">1000+</p>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Registrations</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-slate-200"></div>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-blue-600">50+</p>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Events Managed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Built for organizers.</h2>
            <p className="text-slate-600 text-lg">Stop relying on spreadsheets. We offer a completely unified flow from registration to ticket scanning.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-5 text-slate-700">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">The seamless workflow</h2>
            <p className="text-slate-500 text-lg">Ready in seconds, no technical knowledge needed.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col">
                <div className="text-5xl font-black text-slate-100 mb-4">0{index + 1}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
               <QrCode className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-white">CheckMyEntry</span>
          </div>
          
          <div className="flex gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-white transition-colors">About</Link>
            <Link href="/login" className="hover:text-white transition-colors">Organizer Login</Link>
            <a href="mailto:contact@example.com" className="hover:text-white transition-colors">Contact</a>
          </div>
          
          <div className="text-sm">
            © {new Date().getFullYear()} CheckMyEntry.
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "QR-Based Entry",
    desc: "Generate scannable digital tickets directly to user's devices instantly.",
    icon: <QrCode className="w-5 h-5" />
  },
  {
    title: "Fast Registration",
    desc: "No accounts needed for attendees. They simply fill a form and get a ticket.",
    icon: <Zap className="w-5 h-5" />
  },
  {
    title: "Real-Time Dashboard",
    desc: "Monitor your registrations and live check-in counts as they happen.",
    icon: <LayoutDashboard className="w-5 h-5" />
  },
  {
    title: "Global Scanning",
    desc: "Scan tickets directly from your dashboard using your phone's camera.",
    icon: <ScanLine className="w-5 h-5" />
  }
];

const steps = [
  {
    title: "Create Event",
    desc: "Sign up as an organizer and create your event. You'll get a unique public link."
  },
  {
    title: "Share Link",
    desc: "Distribute your event link to your audience via social media or email."
  },
  {
    title: "Users Register",
    desc: "Attendees fill out the frictionless form and instantly receive their QR ticket."
  },
  {
    title: "Scan at Entry",
    desc: "Use the dashboard scanner module to verify tickets at the door."
  }
];