"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ThemeToggle } from "../components/ThemeToggle";
import {
  QrCode, Zap, ArrowRight, Scan, ShieldCheck, CheckCircle2,
  CalendarPlus, BarChart3, CreditCard, LayoutTemplate,
  Users, Check, Ticket, Settings2, Link as LinkIcon, Shield,
  ChevronRight, Star, Quote
} from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
const STATIC_REVIEWS = [
  { name: "Priya Sharma", role: "College Fest Coordinator · Jaipur", text: "Bhai ekdum mast platform hai! Hamare college fest mein 500+ students the, ek bhi queue nahi laga. QR scan ek second mein ho gaya. Full recommend! 🙌", rating: 5, avatar: "P" },
  { name: "Rahul Verma", role: "Tech Meetup Organizer · Delhi", text: "Excel waitlist upload karke ID verify karna &mdash; ye feature toh kamaal ka hai. Manual check karne mein 2 ghante lagte the, ab 10 minute mein ho jaata hai.", rating: 5, avatar: "R" },
  { name: "Anjali Mehta", role: "Wedding Planner · Mumbai", text: "Shaadi ke reception mein 300 guests ke liye use kiya. Koi bhi duplicate entry nahi aayi. Platform professional dikhta hai aur use karna bahut aasaan hai.", rating: 5, avatar: "A" },
];
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);
  const [liveReviews, setLiveReviews] = useState<any[]>([]);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"), limit(6));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => d.data());
        if (data.length > 0) setLiveReviews(data);
      } catch (e) { /* fallback to static */ }
    };
    fetchReviews();
  }, []);
  const displayReviews = liveReviews.length > 0 ? liveReviews : STATIC_REVIEWS;
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F1A] text-slate-900 dark:text-white font-sans overflow-x-hidden selection:bg-[#00E5FF]/30 transition-colors duration-300">
      {/* Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00E5FF]/10 dark:bg-[#00E5FF]/15 blur-[150px] rounded-full pointer-events-none transition-all duration-500" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/15 blur-[150px] rounded-full pointer-events-none transition-all duration-500" />
      {/* 1. NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/70 dark:bg-[#0B0F1A]/70 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 py-4 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-[#00E5FF]/20">
               <QrCode className="w-5 h-5 text-white" />
             </div>
             <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
               CheckMyEntry
             </span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600 dark:text-neutral-300">
             <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
             <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors">How it Works</a>
             <Link href="/pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</Link>
             <a href="#testimonials" className="hover:text-slate-900 dark:hover:text-white transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/dashboard">
              <button className="relative group overflow-hidden px-6 py-2.5 rounded-full font-semibold text-sm text-white bg-slate-900 dark:bg-white/10 border border-transparent dark:border-white/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all duration-300">
                 <span className="relative z-10">Create Event</span>
                 <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] opacity-0 group-hover:opacity-100 dark:opacity-20 dark:group-hover:opacity-40 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
        </div>
      </nav>
      {/* 2. HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100 text-slate-800 dark:bg-[#00E5FF]/10 border border-slate-200 dark:border-[#00E5FF]/20 dark:text-[#00E5FF] text-xs font-bold tracking-wide mb-6 shadow-sm">
               <span className="w-2 h-2 rounded-full bg-[#00E5FF] mr-2 animate-pulse"></span>
               CheckMyEntry SaaS Platform 2.0
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white mb-6">
              Create, Manage & Scan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6]">
                Event Entries Seamlessly
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-neutral-400 max-w-xl leading-relaxed mb-10 font-medium">
              All-in-one platform for dynamic event registration, intelligent ticketing, and real-time QR-based entry validation. Engineered for scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <button className="h-14 px-8 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] text-white font-bold shadow-lg hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all flex items-center justify-center gap-2 text-base w-full sm:w-auto hover:scale-105">
                  Create Your Event <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="#preview">
                <button className="h-14 px-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-semibold hover:bg-slate-50 dark:hover:bg-white/10 backdrop-blur-md transition-all flex items-center justify-center gap-2 text-base w-full sm:w-auto">
                  View Demo
                </button>
              </Link>
            </div>
          </motion.div>
          {/* Floating UI Mockups */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.2 }}
             className="relative h-[500px] lg:h-[600px] hidden md:block"
          >
             {/* Abstract Grid background */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
             {/* Dashboard Mockup */}
             <motion.div 
               animate={{ y: [0, -10, 0] }} 
               transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
               className="absolute right-0 top-10 w-[80%] bg-white dark:bg-[#121826]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 z-10"
             >
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-white/5 pb-3">
                   <div className="w-3 h-3 rounded-full bg-red-400"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                   <div className="w-3 h-3 rounded-full bg-green-400"></div>
                   <div className="ml-2 h-4 w-32 bg-slate-100 dark:bg-white/5 rounded"></div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                   <div className="h-16 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 p-3 flex flex-col justify-center">
                     <div className="h-2 w-10 bg-slate-200 dark:bg-white/10 rounded mb-2"></div>
                     <div className="h-4 w-16 bg-[#00E5FF] rounded"></div>
                   </div>
                   <div className="h-16 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 p-3 flex flex-col justify-center">
                     <div className="h-2 w-10 bg-slate-200 dark:bg-white/10 rounded mb-2"></div>
                     <div className="h-4 w-12 bg-[#8B5CF6] rounded"></div>
                   </div>
                   <div className="h-16 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 p-3 flex flex-col justify-center">
                     <div className="h-2 w-10 bg-slate-200 dark:bg-white/10 rounded mb-2"></div>
                     <div className="h-4 w-8 bg-emerald-400 rounded"></div>
                   </div>
                </div>
                <div className="h-32 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5"></div>
             </motion.div>
             {/* Ticket Mockup */}
             <motion.div 
               animate={{ y: [0, 15, 0] }} 
               transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
               className="absolute left-0 bottom-20 w-[55%] bg-white dark:bg-white/5 backdrop-blur-2xl border border-slate-200 dark:border-white/20 rounded-3xl shadow-[0_0_40px_rgba(0,229,255,0.15)] p-6 z-20"
             >
                <div className="flex justify-between items-start mb-6">
                   <div>
                     <div className="h-3 w-20 bg-[#00E5FF] rounded mb-2"></div>
                     <div className="h-5 w-32 bg-slate-800 dark:bg-white rounded"></div>
                   </div>
                   <div className="px-2 py-1 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 text-[10px] font-bold rounded">VALID</div>
                </div>
                <div className="bg-slate-50 dark:bg-white/10 aspect-square rounded-2xl mb-4 flex items-center justify-center border border-slate-100 dark:border-white/5 p-4">
                   <QrCode className="w-full h-full text-slate-800 dark:text-white" strokeWidth={1} />
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-white/10 rounded mb-2"></div>
                <div className="h-2 w-2/3 bg-slate-100 dark:bg-white/10 rounded"></div>
             </motion.div>
          </motion.div>
        </div>
      </section>
      {/* 3. TRUST SECTION */}
      <section className="py-10 border-y border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
           <p className="text-sm font-semibold text-slate-500 dark:text-neutral-500 uppercase tracking-widest text-center md:text-left">
             Trusted by event organizers globally
           </p>
           <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-[#00E5FF]" />
                <span className="font-bold text-xl text-slate-800 dark:text-white">10,000+ <span className="text-sm text-slate-500 dark:text-neutral-400 font-medium">Registrations</span></span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarPlus className="w-6 h-6 text-[#8B5CF6]" />
                <span className="font-bold text-xl text-slate-800 dark:text-white">500+ <span className="text-sm text-slate-500 dark:text-neutral-400 font-medium">Events</span></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span className="font-bold text-xl text-slate-800 dark:text-white">99.9% <span className="text-sm text-slate-500 dark:text-neutral-400 font-medium">Uptime</span></span>
              </div>
           </div>
        </div>
      </section>
      {/* 4. FEATURES SECTION (GRID) */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
              Everything you need. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6]">Nothing you don't.</span>
            </h2>
            <p className="text-slate-600 dark:text-neutral-400 font-medium text-lg max-w-2xl mx-auto">
              A complete toolkit designed to eliminate friction from event management.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[
               { icon: CalendarPlus, title: "Smart Event Creation", desc: "Launch an event page in seconds with customizable details and capacity limits.", color: "text-[#00E5FF]" },
               { icon: LayoutTemplate, title: "Dynamic Form Builder", desc: "Collect the exact data you need with custom text, dropdown, and file upload fields.", color: "text-[#8B5CF6]" },
               { icon: Ticket, title: "Instant QR Tickets", desc: "Automatically generate and email unique cryptographic QR tickets to approved attendees.", color: "text-pink-400" },
               { icon: Scan, title: "Real-Time QR Scanning", desc: "Built-in web scanner allows organizers to validate entries instantly at the door.", color: "text-emerald-400" },
               { icon: CreditCard, title: "Secure Payments Integration", desc: "Easily handle paid events and collect secure payments directly via the platform.", color: "text-blue-500" },
               { icon: BarChart3, title: "Advanced Analytics", desc: "Track page views, registration conversions, and live check-in stats on a beautiful dashboard.", color: "text-amber-400" },
             ].map((feature, i) => (
               <div key={i} className="group bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-3xl p-8 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-all duration-300 hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(0,229,255,0.05)] hover:-translate-y-1 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00E5FF]/10 to-[#8B5CF6]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6 border border-slate-200 dark:border-white/10 group-hover:scale-110 transition-transform">
                   <feature.icon className={`w-6 h-6 ${feature.color}`} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                 <p className="text-slate-600 dark:text-neutral-400 text-sm leading-relaxed font-medium">{feature.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>
      {/* 5. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-100/50 dark:bg-[#121826]/50 border-y border-slate-200 dark:border-white/5">
         <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-16 text-slate-900 dark:text-white">
              Manage events in <span className="text-[#00E5FF]">three simple steps</span>
            </h2>
            <div className="flex flex-col md:flex-row items-start justify-center gap-8 md:gap-4 relative">
               {/* Connecting Line */}
               <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6]/30 to-transparent z-0"></div>
               {[
                 { step: "01", title: "Create Event", desc: "Setup your event details and configure custom form fields in 2 minutes." },
                 { step: "02", title: "Share Link", desc: "Distribute your unique event link and watch registrations roll in." },
                 { step: "03", title: "Scan at Entry", desc: "Use our built-in web scanner to validate QR tickets at the door instantly." }
               ].map((item, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center relative z-10 w-full md:w-auto bg-white dark:bg-transparent p-6 rounded-2xl md:p-0 md:bg-transparent shadow-sm md:shadow-none border border-slate-200 dark:border-transparent md:border-transparent">
                    <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-[#0B0F1A] border-4 border-white dark:border-[#121826] shadow-[0_0_20px_rgba(0,229,255,0.2)] flex items-center justify-center text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] mb-6">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-slate-600 dark:text-neutral-400 text-sm font-medium text-center max-w-xs">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>
      {/* 6 & 7. LIVE PREVIEW & DASHBOARD */}
      <section id="preview" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             {/* Left Text */}
             <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
                  A Dashboard that puts you in <span className="text-[#8B5CF6]">total control.</span>
                </h2>
                <p className="text-slate-600 dark:text-neutral-400 font-medium text-lg mb-8 leading-relaxed">
                  Monitor your events from a bird's-eye view. See registration graphs, manage attendees, and access the built-in QR scanner directly from your organizer panel. 
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-slate-700 dark:text-neutral-300 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#00E5FF]" /> Live check-in statistics
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 dark:text-neutral-300 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#00E5FF]" /> Excel waitlist verification
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 dark:text-neutral-300 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#00E5FF]" /> 1-Click attendee management
                  </li>
                </ul>
                <Link href="/dashboard">
                  <button className="flex items-center gap-2 text-[#00E5FF] font-semibold hover:gap-3 transition-all">
                    Explore Dashboard <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
             </div>
             {/* Right Graphic */}
             <div className="relative h-[400px] w-full rounded-3xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/5 to-[#00E5FF]/5"></div>
                {/* Dashboard Window */}
                <div className="w-[110%] h-[110%] bg-white dark:bg-[#121826] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl absolute right-[-10%] bottom-[-15%] p-5 group-hover:scale-[1.02] transition-transform duration-500">
                   <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-white/5 pb-3">
                     <Settings2 className="w-5 h-5 text-slate-400" />
                     <div className="h-4 w-32 bg-slate-100 dark:bg-white/10 rounded"></div>
                   </div>
                   <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="h-20 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-4"><div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 mb-2"></div><div className="h-2 w-16 bg-slate-200 dark:bg-white/10 rounded"></div></div>
                      <div className="h-20 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-4"><div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 mb-2"></div><div className="h-2 w-16 bg-slate-200 dark:bg-white/10 rounded"></div></div>
                      <div className="h-20 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-4"><div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 mb-2"></div><div className="h-2 w-16 bg-slate-200 dark:bg-white/10 rounded"></div></div>
                   </div>
                   <div className="h-32 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-4">
                      <div className="h-4 w-full bg-slate-200 dark:bg-white/10 rounded mb-3"></div>
                      <div className="h-4 w-5/6 bg-slate-200 dark:bg-white/10 rounded mb-3"></div>
                      <div className="h-4 w-full bg-slate-200 dark:bg-white/10 rounded"></div>
                   </div>
                </div>
                {/* Glowing Overlay Ticket */}
                <div className="absolute left-[10%] top-[10%] w-48 bg-white dark:bg-black/60 backdrop-blur-xl border border-slate-200 dark:border-white/20 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.3)] p-4 group-hover:-translate-y-2 transition-transform duration-500">
                   <div className="aspect-square bg-slate-50 dark:bg-white/10 rounded-xl mb-3 flex items-center justify-center border border-slate-100 dark:border-white/5 p-2">
                     <QrCode className="w-full h-full text-slate-800 dark:text-white" strokeWidth={1} />
                   </div>
                   <div className="h-3 w-20 bg-[#8B5CF6] rounded mb-2"></div>
                   <div className="h-2 w-full bg-slate-200 dark:bg-white/20 rounded"></div>
                </div>
             </div>
          </div>
        </div>
      </section>
      {/* 8. TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-6 bg-slate-100/50 dark:bg-white/[0.01] relative overflow-hidden">
         <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/30 to-transparent" />
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-600 dark:text-amber-400 text-xs font-bold tracking-wide mb-5">
                <span className="w-2 h-2 rounded-full bg-amber-400 mr-2 animate-pulse" />
                Real Log, Real Baatein ⭐
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
                Hamare users ki <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6]">sacchi raay</span>
              </h2>
              <p className="text-slate-500 dark:text-neutral-400 font-medium max-w-xl mx-auto">
                Platform use karke khud dekhein &mdash; aur apna experience share bhi karein dashboard se.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayReviews.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group"
                >
                   <Quote className="absolute top-6 right-6 w-8 h-8 text-[#00E5FF]/10 group-hover:text-[#00E5FF]/20 transition-colors" />
                   <div className="flex gap-1 mb-5">
                     {[...Array(t.rating || 5)].map((_,j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                   </div>
                   <p className="text-slate-700 dark:text-neutral-300 font-medium mb-6 leading-relaxed text-sm">
                     &ldquo;{t.text}&rdquo;
                   </p>
                   <div className="flex items-center gap-3 border-t border-slate-100 dark:border-white/5 pt-5">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center text-white text-sm font-bold shrink-0">
                       {(t.avatar || (t.name || 'U')[0]).toUpperCase()}
                     </div>
                     <div>
                       <p className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</p>
                       <p className="text-xs text-slate-500 dark:text-neutral-500 font-medium">{t.role}</p>
                     </div>
                   </div>
                </motion.div>
              ))}
            </div>
         </div>
      </section>
      {/* 9. PRICING */}
      <section id="pricing" className="py-24 px-6 relative z-10 bg-slate-50 dark:bg-transparent border-y border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
              Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6]">transparent</span> pricing.
            </h2>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00E5FF]/10 to-[#8B5CF6]/10 border border-[#00E5FF]/20 dark:border-[#00E5FF]/30 mt-2">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse shrink-0"></span>
              <p className="font-semibold text-base text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6]">
                Pay only when you earn. Zero commission for free events.
              </p>
            </div>
          </div>
          {/* E-Ticketing Commission Table */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="flex flex-col items-center md:flex-row md:justify-between md:items-end mb-6 gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">E-Ticketing Commission</h3>
                <p className="text-slate-500 dark:text-neutral-400 font-medium text-sm">See exactly how much you earn per ticket.</p>
              </div>
              <div className="flex bg-slate-100 dark:bg-[#121826] p-1.5 rounded-xl border border-slate-200 dark:border-white/5">
                <button onClick={() => setIsAnnual(false)} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${!isAnnual ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow border border-slate-200 dark:border-white/10' : 'text-slate-500 hover:text-slate-700 dark:text-neutral-500'}`}>INR</button>
                <button onClick={() => setIsAnnual(true)} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${isAnnual ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow border border-slate-200 dark:border-white/10' : 'text-slate-500 hover:text-slate-700 dark:text-neutral-500'}`}>USD</button>
              </div>
            </div>
            <div className="bg-white dark:bg-[#121826]/50 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                    <th className="p-6 text-sm font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">Details</th>
                    <th className="p-6 text-sm font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="p-6 text-slate-600 dark:text-neutral-300 font-medium">Ticket Price</td>
                    <td className="p-6 text-right font-medium text-slate-900 dark:text-white">{!isAnnual ? '&#8377;100.00' : '$100.00'}</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="p-6 text-slate-600 dark:text-neutral-300 font-medium">Razorpay Fee (approx)</td>
                    <td className="p-6 text-right font-medium text-rose-500">-{!isAnnual ? '&#8377;2.36' : '$2.36'}</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="p-6 text-slate-600 dark:text-neutral-300 font-medium">System Charge (2%)</td>
                    <td className="p-6 text-right font-medium text-rose-500">-{!isAnnual ? '&#8377;2.00' : '$2.00'}</td>
                  </tr>
                  <tr className="bg-[#00E5FF]/5 border-t-2 border-[#00E5FF]/20">
                    <td className="p-6 text-slate-900 dark:text-white font-bold text-lg">Amount Received</td>
                    <td className="p-6 text-right font-bold text-xl text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">{!isAnnual ? '&#8377;95.64' : '$95.64'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* QR Code Charges + Other Charges */}
          <div className="grid lg:grid-cols-2 gap-10 mb-16">
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-3 tracking-tight">
                <div className="p-2 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20"><QrCode className="text-[#8B5CF6] w-5 h-5" /></div>
                QR Code Charges
              </h3>
              <div className="bg-white dark:bg-[#121826]/50 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden flex-1 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                      <th className="p-5 text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">Guests Capacity</th>
                      <th className="p-5 text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest text-right">Cost / Guest</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                      <td className="p-5 text-slate-600 dark:text-neutral-300 font-medium text-sm">Up to 100 Guests</td>
                      <td className="p-5 text-right font-bold text-emerald-600 dark:text-emerald-400 text-sm">Free</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                      <td className="p-5 text-slate-600 dark:text-neutral-300 font-medium text-sm">101 &ndash; 500 Guests</td>
                      <td className="p-5 text-right font-semibold text-slate-900 dark:text-white text-sm">&#8377;4</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                      <td className="p-5 text-slate-600 dark:text-neutral-300 font-medium text-sm">501 &ndash; 1000 Guests</td>
                      <td className="p-5 text-right font-semibold text-slate-900 dark:text-white text-sm">&#8377;3</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                      <td className="p-5 text-slate-600 dark:text-neutral-300 font-medium text-sm">Above 1000 Guests</td>
                      <td className="p-5 text-right font-semibold text-[#00E5FF] text-sm">&#8377;2</td>
                    </tr>
                  </tbody>
                </table>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/10 text-xs text-slate-400 dark:text-neutral-500 font-medium text-center">
                  * Billed per successful check-in via QR scanner.
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-3 tracking-tight">
                <div className="p-2 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20"><CreditCard className="text-[#00E5FF] w-5 h-5" /></div>
                Other Charges
              </h3>
              <div className="grid gap-4 flex-1">
                <div className="bg-white dark:bg-[#121826]/50 border border-slate-200 dark:border-white/10 rounded-2xl p-5 flex items-center justify-between hover:shadow-md dark:hover:bg-white/[0.04] hover:border-[#25D366]/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#25D366]/10 flex items-center justify-center border border-[#25D366]/20 group-hover:scale-110 transition-transform">
                      <Zap className="w-5 h-5 text-[#25D366]" />
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-neutral-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">WhatsApp Charge</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lg text-slate-900 dark:text-white">&#8377;0.89</span>
                    <span className="text-xs text-slate-400 dark:text-neutral-500 ml-1">+ GST</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-[#121826]/50 border border-slate-200 dark:border-white/10 rounded-2xl p-5 flex items-center justify-between hover:shadow-md dark:hover:bg-white/[0.04] hover:border-[#00E5FF]/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center border border-[#00E5FF]/20 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-neutral-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">SMS Charge</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lg text-slate-900 dark:text-white">&#8377;0.25</span>
                    <span className="text-xs text-slate-400 dark:text-neutral-500 ml-1">+ GST</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-[#121826]/50 border border-slate-200 dark:border-white/10 rounded-2xl p-5 flex items-center justify-between hover:shadow-md dark:hover:bg-white/[0.04] hover:border-orange-400/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform">
                      <ChevronRight className="w-5 h-5 text-orange-400" />
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-neutral-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Email Charge</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lg text-slate-900 dark:text-white">&#8377;0.11</span>
                    <span className="text-xs text-slate-400 dark:text-neutral-500 ml-1">+ GST</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-10 border-t border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-neutral-300">
              <div className="w-8 h-8 rounded-full bg-[#00E5FF]/10 flex items-center justify-center border border-[#00E5FF]/20"><Check className="w-4 h-4 text-[#00E5FF]" /></div>
              No hidden charges
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-neutral-300">
              <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center border border-[#8B5CF6]/20"><Zap className="w-4 h-4 text-[#8B5CF6]" /></div>
              Instant payouts
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-neutral-300">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"><ShieldCheck className="w-4 h-4 text-emerald-500" /></div>
              Secure payments
            </div>
          </div>
        </div>
      </section>
      {/* 10. FINAL CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00E5FF]/5 dark:to-[#8B5CF6]/10 pointer-events-none"></div>
         <div className="max-w-4xl mx-auto text-center relative z-10 bg-white/50 dark:bg-white/[0.02] backdrop-blur-3xl border border-slate-200 dark:border-white/10 p-12 md:p-20 rounded-[3rem] shadow-2xl">
            <Shield className="w-12 h-12 text-[#8B5CF6] mx-auto mb-6" />
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white leading-tight">
              Start Managing Your Events <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6]">Like a Pro.</span>
            </h2>
            <p className="text-slate-600 dark:text-neutral-400 font-medium text-lg mb-10 max-w-xl mx-auto">
              Join thousands of organizers who use CheckMyEntry to deliver flawless event experiences.
            </p>
            <Link href="/dashboard">
              <button className="h-16 px-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-3 text-lg mx-auto">
                Create Event Now <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
         </div>
      </section>
      {/* 11. FOOTER */}
      <footer className="border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#0B0F1A] pt-16 pb-8 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center">
                   <QrCode className="w-4 h-4 text-white" />
                 </div>
                 <span className="font-bold text-lg text-slate-900 dark:text-white">CheckMyEntry</span>
               </div>
               <div className="flex flex-wrap gap-8 text-sm font-medium text-slate-600 dark:text-neutral-400">
                  <Link href="/about" className="hover:text-[#00E5FF] transition-colors">About Us</Link>
                  <Link href="/privacy-policy" className="hover:text-[#00E5FF] transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="hover:text-[#00E5FF] transition-colors">Terms of Service</Link>
                  <Link href="/pricing#contact" className="hover:text-[#00E5FF] transition-colors">Contact Support</Link>
               </div>
            </div>
            <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500 dark:text-neutral-600">
               <p>&copy; {new Date().getFullYear()} CheckMyEntry Platform. All rights reserved.</p>
               <p className="flex items-center gap-1">Designed with <span className="text-red-500">&#10084;</span> for Event Organizers</p>
            </div>
         </div>
      </footer>
    </div>
  );
}
