"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "../../components/ThemeToggle";
import { 
  ArrowRight, QrCode, MessageSquare, Smartphone, Mail,
  Phone, MapPin, Send, Check, Clock, Globe, HelpCircle,
  ChevronRight, Calendar, ArrowUpRight, Link as LinkIcon
} from "lucide-react";
import { useState, useEffect } from "react";

export default function PricingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [currency, setCurrency] = useState("INR");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ticketData = [
    { price: 100, razorpay: 2.36, system: 2.00 },
    { price: 500, razorpay: 11.80, system: 10.00 },
    { price: 1000, razorpay: 23.60, system: 20.00 },
    { price: 5000, razorpay: 118.00, system: 100.00 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F1A] text-slate-900 dark:text-white font-sans overflow-x-hidden selection:bg-[#00E5FF]/30 transition-colors duration-300">
      
      {/* Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00E5FF]/10 dark:bg-[#00E5FF]/15 blur-[150px] rounded-full pointer-events-none transition-all duration-500 z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/15 blur-[150px] rounded-full pointer-events-none transition-all duration-500 z-0" />

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/70 dark:bg-[#0B0F1A]/70 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 py-4 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-[#00E5FF]/20">
               <QrCode className="w-5 h-5 text-white" />
             </div>
             <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
               CheckMyEntry
             </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600 dark:text-neutral-300">
             <Link href="/#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</Link>
             <Link href="/pricing" className="text-[#00E5FF] font-semibold transition-colors">Pricing</Link>
             <Link href="/#testimonials" className="hover:text-slate-900 dark:hover:text-white transition-colors">Reviews</Link>
             <Link href="/#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/dashboard/create-event">
              <button className="relative group overflow-hidden px-6 py-2.5 rounded-full font-semibold text-sm text-white bg-slate-900 dark:bg-white/10 border border-transparent dark:border-white/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all duration-300">
                 <span className="relative z-10">Create Event</span>
                 <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] opacity-0 group-hover:opacity-100 dark:opacity-20 dark:group-hover:opacity-40 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000" alt="Event Crowd" className="w-full h-full object-cover opacity-20 dark:opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-50/90 to-slate-50 dark:from-[#0B0F1A] dark:via-[#0B0F1A]/80 dark:to-[#0B0F1A]"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
             <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
               Pricing
             </h1>
             <p className="text-xl md:text-2xl font-medium text-slate-600 dark:text-neutral-300">
               Simple, transparent pricing for your events. <br className="hidden md:block" /> No hidden fees. No surprises.
             </p>
           </motion.div>
        </div>
      </section>

      {/* 2. COMMISSION HERO CARD */}
      <section className="py-12 px-6 relative z-10 -mt-20">
        <div className="max-w-6xl mx-auto">
           <motion.div 
             initial={{ opacity: 0, y: 30 }} 
             animate={{ opacity: 1, y: 0 }} 
             transition={{ duration: 0.8, delay: 0.2 }}
             className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-gradient-to-r from-blue-600 to-purple-700 p-1 md:p-[2px]"
           >
             <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] opacity-30 blur-xl"></div>
             
             <div className="bg-slate-900/40 dark:bg-[#0B0F1A]/80 backdrop-blur-2xl rounded-[2.4rem] overflow-hidden flex flex-col md:flex-row relative z-10 border border-white/20">
               {/* Left Content */}
               <div className="flex-1 p-10 md:p-16 flex flex-col justify-center">
                 <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold tracking-wide mb-8 w-max shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></div>
                   2% per ticket
                 </div>
                 
                 <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                   Lowest Commission on <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6]">E-Ticketing</span>
                 </h2>
                 
                 <p className="text-lg text-slate-300 font-medium mb-4 max-w-md">
                   Create an event for free. We charge only when you sell tickets.
                 </p>
                 <p className="text-sm text-slate-400 font-medium mb-10 flex items-center gap-2">
                   <Check className="w-5 h-5 text-emerald-400" /> Zero commission for free events
                 </p>
                 
                 <Link href="/dashboard/create-event">
                   <button className="w-full sm:w-auto h-14 px-8 rounded-full bg-white text-slate-900 font-bold hover:scale-105 transition-transform flex items-center justify-center gap-3 text-lg shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                     Create Event <ArrowRight className="w-5 h-5" />
                   </button>
                 </Link>
               </div>
               
               {/* Right Image */}
               <div className="flex-1 relative min-h-[300px] md:min-h-[500px] flex items-end justify-center md:justify-end pr-0 md:pr-10 pt-10 overflow-hidden">
                 {/* Decorative Glow Behind Person */}
                 <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#8B5CF6]/40 blur-[100px] rounded-full pointer-events-none"></div>
                 {/* The Person Image (cutout style) */}
                 <img 
                   src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800&h=800" 
                   alt="Happy Organizer" 
                   className="w-[85%] max-w-[400px] object-cover rounded-tl-full rounded-tr-full border-t-8 border-l-8 border-r-8 border-white/10 relative z-10 shadow-2xl mask-image-bottom"
                   style={{ maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)" }}
                 />
                 {/* Floating Elements */}
                 <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-20 right-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl z-20">
                   <div className="text-xs text-slate-300 mb-1">Total Sales</div>
                   <div className="text-xl font-bold text-[#00E5FF]">₹1,24,500</div>
                 </motion.div>
               </div>
             </div>
           </motion.div>
        </div>
      </section>

      {/* 3. E-TICKETING COMMISSION TABLE */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              E-Ticketing Commission
            </h3>
            {/* Toggle INR/USD */}
            <div className="flex bg-slate-200 dark:bg-white/5 p-1 rounded-xl border border-slate-300 dark:border-white/10">
              <button onClick={() => setCurrency("INR")} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${currency === "INR" ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-white"}`}>INR (₹)</button>
              <button onClick={() => setCurrency("USD")} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${currency === "USD" ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-white"}`}>USD ($)</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px] bg-white dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                    <th className="p-6 text-sm font-bold text-slate-600 dark:text-neutral-300 uppercase tracking-wider">Ticket Price</th>
                    <th className="p-6 text-sm font-bold text-slate-600 dark:text-neutral-300 uppercase tracking-wider">Razorpay Fee</th>
                    <th className="p-6 text-sm font-bold text-slate-600 dark:text-neutral-300 uppercase tracking-wider">System Charge (2%)</th>
                    <th className="p-6 text-sm font-bold text-slate-600 dark:text-neutral-300 uppercase tracking-wider">Total Paid</th>
                    <th className="p-6 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 border-l border-slate-200 dark:border-emerald-500/20">Amount Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {ticketData.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="p-6 text-lg font-semibold text-slate-900 dark:text-white group-hover:text-[#00E5FF] transition-colors">
                        {currency === "INR" ? '₹' : '$'}{currency === "USD" ? (row.price / 83).toFixed(2) : row.price}
                      </td>
                      <td className="p-6 text-slate-600 dark:text-neutral-400 font-medium">
                        {currency === "INR" ? '₹' : '$'}{currency === "USD" ? (row.razorpay / 83).toFixed(2) : row.razorpay}
                      </td>
                      <td className="p-6 text-slate-600 dark:text-neutral-400 font-medium">
                        {currency === "INR" ? '₹' : '$'}{currency === "USD" ? (row.system / 83).toFixed(2) : row.system}
                      </td>
                      <td className="p-6 text-slate-600 dark:text-neutral-400 font-medium">
                        {currency === "INR" ? '₹' : '$'}{currency === "USD" ? (row.price / 83).toFixed(2) : row.price}
                      </td>
                      <td className="p-6 text-lg font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/5 border-l border-slate-200 dark:border-emerald-500/10">
                        {currency === "INR" ? '₹' : '$'}{currency === "USD" ? ((row.price - row.razorpay - row.system) / 83).toFixed(2) : (row.price - row.razorpay - row.system).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-neutral-500 font-medium flex items-center gap-2">
            <HelpCircle className="w-4 h-4" /> Gateway charges (like Razorpay) are subject to your provider's terms. Above is an estimation.
          </p>
        </div>
      </section>

      {/* 4. QR CODE CHARGES TABLE & 5. OTHER CHARGES */}
      <section className="py-10 px-6 relative z-10">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
          
          {/* QR CODE CHARGES */}
          <div>
             <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
               <div className="p-2 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20"><QrCode className="w-6 h-6 text-[#8B5CF6]" /></div>
               QR Code Charges
             </h3>
             <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                      <th className="p-5 text-sm font-bold text-slate-600 dark:text-neutral-300 uppercase">Volume (Guests)</th>
                      <th className="p-5 text-sm font-bold text-slate-600 dark:text-neutral-300 uppercase">Cost Per Guest</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-5 font-semibold text-slate-900 dark:text-white">Up to 100</td>
                      <td className="p-5 font-bold text-[#00E5FF]">₹5 <span className="text-sm font-medium text-slate-500">/ guest</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-5 font-semibold text-slate-900 dark:text-white">101 – 500</td>
                      <td className="p-5 font-bold text-slate-700 dark:text-white">₹4 <span className="text-sm font-medium text-slate-500">/ guest</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-5 font-semibold text-slate-900 dark:text-white">501 – 1000</td>
                      <td className="p-5 font-bold text-slate-700 dark:text-white">₹3 <span className="text-sm font-medium text-slate-500">/ guest</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-5 font-semibold text-slate-900 dark:text-white">1000+</td>
                      <td className="p-5 font-bold text-emerald-500">₹2 <span className="text-sm font-medium text-slate-500">/ guest</span></td>
                    </tr>
                  </tbody>
                </table>
             </div>
             <p className="mt-4 text-sm text-slate-500 dark:text-neutral-500 font-medium">Volume discounts applied automatically. Valid for single event execution.</p>
          </div>

          {/* OTHER CHARGES */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">
               Other Add-on Charges
            </h3>
            <div className="grid gap-4">
              <div className="group bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-xl dark:hover:bg-white/[0.05] transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 blur-2xl rounded-full group-hover:bg-green-500/20 transition-colors"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center border border-green-100 dark:border-green-500/20">
                    <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">WhatsApp Notification</h4>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Automated ticket delivery</p>
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <span className="font-extrabold text-lg text-slate-900 dark:text-white">₹0.89</span>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider">+ GST / msg</p>
                </div>
              </div>

              <div className="group bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-xl dark:hover:bg-white/[0.05] transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 blur-2xl rounded-full group-hover:bg-blue-500/20 transition-colors"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                    <Smartphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">SMS Notification</h4>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Direct text alerts</p>
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <span className="font-extrabold text-lg text-slate-900 dark:text-white">₹0.25</span>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider">+ GST / msg</p>
                </div>
              </div>

              <div className="group bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-xl dark:hover:bg-white/[0.05] transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 blur-2xl rounded-full group-hover:bg-orange-500/20 transition-colors"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center border border-orange-100 dark:border-orange-500/20">
                    <Mail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Email Delivery</h4>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Standard email passes</p>
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <span className="font-extrabold text-lg text-slate-900 dark:text-white">₹0.11</span>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider">+ GST / email</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. PAYMENT SETTLEMENT SECTION */}
      <section className="py-24 px-6 relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center mb-16">
           <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
             Quick & Easy <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6]">Payment Settlement</span>
           </h2>
           <p className="text-slate-600 dark:text-neutral-400 font-medium text-lg max-w-2xl mx-auto">
             Get your funds transferred directly to your bank account without the hassle.
           </p>
        </div>

        <div className="relative max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Node 1 */}
          <div className="flex flex-col items-center text-center max-w-[200px] relative z-10">
            <div className="w-20 h-20 rounded-full bg-white dark:bg-white/5 border-2 border-[#00E5FF] shadow-[0_0_30px_rgba(0,229,255,0.2)] flex items-center justify-center mb-4 z-10 relative">
              <QrCode className="w-8 h-8 text-[#00E5FF]" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Payment Processing</h4>
            <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium">Ticket sales are collected securely via our gateway.</p>
          </div>
          
          {/* Connector */}
          <div className="hidden md:block w-32 h-[2px] bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] relative z-0">
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]"></div>
          </div>

          {/* Node 2 - Center */}
          <div className="flex flex-col items-center text-center max-w-[250px] relative z-10 scale-110">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] shadow-[0_0_50px_rgba(139,92,246,0.4)] flex items-center justify-center mb-6 z-10 relative p-1">
               <div className="w-full h-full bg-slate-900 rounded-full flex flex-col items-center justify-center text-white border-4 border-slate-900">
                  <Clock className="w-8 h-8 text-white mb-1" />
                  <span className="text-xs font-bold uppercase tracking-widest">T + 3 Days</span>
               </div>
            </div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xl mb-2">Settlement Timeline</h4>
            <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium">Funds hit your bank account 3 days post transaction.</p>
          </div>

          {/* Connector */}
          <div className="hidden md:block w-32 h-[2px] bg-gradient-to-r from-[#8B5CF6] to-pink-500 relative z-0">
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_pink]"></div>
          </div>

          {/* Node 3 */}
          <div className="flex flex-col items-center text-center max-w-[200px] relative z-10">
            <div className="w-20 h-20 rounded-full bg-white dark:bg-white/5 border-2 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.2)] flex items-center justify-center mb-4 z-10 relative">
              <Calendar className="w-8 h-8 text-pink-500" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Bank Holidays</h4>
            <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium">Timeline excludes weekends and national bank holidays.</p>
          </div>
        </div>
      </section>

      {/* 7. CONTACT SECTION */}
      <section className="py-24 px-6 bg-slate-100/50 dark:bg-white/[0.01] border-y border-slate-200 dark:border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
           <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                Have questions about enterprise volume?
              </h2>
              <p className="text-lg text-slate-600 dark:text-neutral-400 font-medium mb-10">
                Reach out to our sales team for custom quotations, dedicated account management, and white-labeling options.
              </p>
              
              <div className="space-y-8">
                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center shrink-0 border border-[#00E5FF]/20"><Phone className="w-5 h-5 text-[#00E5FF]" /></div>
                    <div>
                       <h4 className="font-bold text-slate-900 dark:text-white mb-1">Call Us</h4>
                       <p className="text-slate-500 dark:text-neutral-400">+91 92412 77903</p>
                       <p className="text-slate-500 dark:text-neutral-400">+91 95872 54951</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center shrink-0 border border-[#8B5CF6]/20"><Mail className="w-5 h-5 text-[#8B5CF6]" /></div>
                    <div>
                       <h4 className="font-bold text-slate-900 dark:text-white mb-1">Email Us</h4>
                       <p className="text-slate-500 dark:text-neutral-400">hello@scanmyentry.com</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center shrink-0 border border-pink-500/20"><MapPin className="w-5 h-5 text-pink-500" /></div>
                    <div>
                       <h4 className="font-bold text-slate-900 dark:text-white mb-1">Visit Office</h4>
                       <p className="text-slate-500 dark:text-neutral-400 leading-relaxed max-w-xs">3rd floor, Madan Mohan Tower, Manji ka Hatta Paota, Jodhpur (Rajasthan)</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Contact Form */}
           <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00E5FF]/5 to-[#8B5CF6]/5 blur-3xl rounded-full pointer-events-none"></div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 relative z-10">Send us a message</h3>
              <form className="space-y-5 relative z-10">
                 <div className="grid grid-cols-2 gap-5">
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-600 dark:text-neutral-400 uppercase tracking-wider ml-1">First Name</label>
                     <input type="text" className="w-full bg-slate-50 dark:bg-[#0B0F1A]/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00E5FF] transition-all" placeholder="John" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-600 dark:text-neutral-400 uppercase tracking-wider ml-1">Last Name</label>
                     <input type="text" className="w-full bg-slate-50 dark:bg-[#0B0F1A]/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00E5FF] transition-all" placeholder="Doe" />
                   </div>
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-600 dark:text-neutral-400 uppercase tracking-wider ml-1">Email Address</label>
                   <input type="email" className="w-full bg-slate-50 dark:bg-[#0B0F1A]/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00E5FF] transition-all" placeholder="john@example.com" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-600 dark:text-neutral-400 uppercase tracking-wider ml-1">Message</label>
                   <textarea rows={4} className="w-full bg-slate-50 dark:bg-[#0B0F1A]/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00E5FF] transition-all resize-none" placeholder="Tell us about your event scale..."></textarea>
                 </div>
                 <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] text-white font-bold hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all flex items-center justify-center gap-2 group/btn">
                   Send Message <Send className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                 </button>
              </form>
           </div>
        </div>
      </section>

      {/* 8. BLOG SECTION */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                 <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">Latest Insights</h2>
                 <p className="text-slate-600 dark:text-neutral-400 font-medium text-lg">Event management strategies and platform updates.</p>
              </div>
              <button className="flex items-center gap-2 text-slate-900 dark:text-white font-bold hover:text-[#00E5FF] dark:hover:text-[#00E5FF] transition-colors">
                View all articles <ArrowRight className="w-5 h-5" />
              </button>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              {[
                { img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=600", title: "How to maximize ticket sales in 2026", date: "Apr 20, 2026", tag: "Strategy" },
                { img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600", title: "Understanding dynamic QR security", date: "Apr 15, 2026", tag: "Security" },
                { img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600", title: "The ultimate guide to hybrid events", date: "Apr 10, 2026", tag: "Guide" },
              ].map((blog, i) => (
                 <div key={i} className="group cursor-pointer">
                    <div className="w-full h-64 rounded-3xl overflow-hidden mb-6 relative">
                       <img src={blog.img} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500"></div>
                       <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-xs font-bold text-slate-900 dark:text-white">{blog.tag}</div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-neutral-400 font-medium mb-3">
                       <Calendar className="w-4 h-4" /> {blog.date}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#00E5FF] transition-colors">{blog.title}</h3>
                    <div className="flex items-center gap-1 text-[#8B5CF6] font-semibold text-sm">
                       Read full article <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-white dark:bg-[#05050A] border-t border-slate-200 dark:border-white/5 pt-20 pb-10 px-6 relative z-10">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
               <div className="md:col-span-1">
                 <Link href="/" className="flex items-center gap-3 mb-6">
                   <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                     <QrCode className="w-4 h-4 text-white" />
                   </div>
                   <span className="font-bold text-xl text-slate-900 dark:text-white">CheckMyEntry</span>
                 </Link>
                 <p className="text-slate-500 dark:text-neutral-400 text-sm font-medium leading-relaxed mb-6">
                   The premium SaaS platform for managing events, selling tickets, and processing entries seamlessly at scale.
                 </p>
                 <div className="flex gap-4">
                   <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-neutral-400 hover:bg-[#00E5FF] hover:text-white transition-colors"><MessageSquare className="w-4 h-4" /></a>
                   <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-neutral-400 hover:bg-[#8B5CF6] hover:text-white transition-colors"><LinkIcon className="w-4 h-4" /></a>
                   <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-neutral-400 hover:bg-pink-500 hover:text-white transition-colors"><Globe className="w-4 h-4" /></a>
                 </div>
               </div>
               
               <div>
                 <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Product</h4>
                 <ul className="space-y-4 text-slate-500 dark:text-neutral-400 text-sm font-medium">
                   <li><a href="#" className="hover:text-[#00E5FF] transition-colors">Features</a></li>
                   <li><Link href="/pricing" className="hover:text-[#00E5FF] transition-colors">Pricing</Link></li>
                   <li><a href="#" className="hover:text-[#00E5FF] transition-colors">Integrations</a></li>
                   <li><a href="#" className="hover:text-[#00E5FF] transition-colors">Changelog</a></li>
                 </ul>
               </div>

               <div>
                 <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Resources</h4>
                 <ul className="space-y-4 text-slate-500 dark:text-neutral-400 text-sm font-medium">
                   <li><a href="#" className="hover:text-[#00E5FF] transition-colors">Help Center</a></li>
                   <li><a href="#" className="hover:text-[#00E5FF] transition-colors">API Documentation</a></li>
                   <li><a href="#" className="hover:text-[#00E5FF] transition-colors">Community</a></li>
                   <li><a href="#" className="hover:text-[#00E5FF] transition-colors">Blog</a></li>
                 </ul>
               </div>

               <div>
                 <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Legal</h4>
                 <ul className="space-y-4 text-slate-500 dark:text-neutral-400 text-sm font-medium">
                   <li><a href="#" className="hover:text-[#00E5FF] transition-colors">Privacy Policy</a></li>
                   <li><a href="#" className="hover:text-[#00E5FF] transition-colors">Terms of Service</a></li>
                   <li><a href="#" className="hover:text-[#00E5FF] transition-colors">Cookie Policy</a></li>
                   <li><a href="#" className="hover:text-[#00E5FF] transition-colors">Refund Policy</a></li>
                 </ul>
               </div>
            </div>
            
            <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500 dark:text-neutral-500">
               <p>© {new Date().getFullYear()} CheckMyEntry Platform. All rights reserved.</p>
               <p className="flex items-center gap-1">Engineered for <span className="text-white">Event Organizers</span></p>
            </div>
         </div>
      </footer>
    </div>
  );
}
