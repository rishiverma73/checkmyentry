"use client";

import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeToggle";
import {
  QrCode, CheckCircle2, MapPin, Phone, Mail, Send,
  RefreshCcw, DollarSign, MessageSquare, MonitorSmartphone
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function Pricing() {
  const [scrolled, setScrolled] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await emailjs.sendForm(
        "service_checkmyentry",
        "template_contact_pricing",
        formRef.current!,
        "user_checkmyentry_public"
      );
      setSent(true);
      formRef.current?.reset();
    } catch {
      // Fallback: use mailto
      const form = formRef.current;
      if (form) {
        const name = (form.querySelector('[name="from_name"]') as HTMLInputElement)?.value || "";
        const email = (form.querySelector('[name="from_email"]') as HTMLInputElement)?.value || "";
        const phone = (form.querySelector('[name="phone"]') as HTMLInputElement)?.value || "";
        const message = (form.querySelector('[name="message"]') as HTMLTextAreaElement)?.value || "";
        window.location.href = `mailto:rockysinghdangi@gmail.com?subject=Pricing Enquiry from ${name}&body=Name: ${name}%0AEmail: ${email}%0APhone: ${phone}%0A%0AMessage:%0A${encodeURIComponent(message)}`;
        setSent(true);
      }
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F1A] text-slate-900 dark:text-white font-sans overflow-x-hidden selection:bg-[#00E5FF]/30">
      {/* Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00E5FF]/10 blur-[150px] rounded-full pointer-events-none transition-all duration-500" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#8B5CF6]/10 blur-[150px] rounded-full pointer-events-none transition-all duration-500" />

      {/* HEADER */}
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
             <Link href="/#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors">How it Works</Link>
             <Link href="/pricing" className="text-[#00E5FF] transition-colors drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]">Pricing</Link>
             <Link href="#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/dashboard">
              <button className="relative group overflow-hidden px-6 py-2.5 rounded-full font-semibold text-sm text-slate-900 dark:text-white bg-slate-900 dark:bg-transparent border border-slate-900 dark:border-[#00E5FF]/30 hover:border-[#00E5FF]/80 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all duration-300">
                 <span className="relative z-10 text-white dark:text-white">Create Event</span>
                 <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] opacity-0 group-hover:opacity-20 dark:opacity-10 dark:group-hover:opacity-30 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* 3. E-TICKETING COMMISSION TABLE */}
          <section className="mb-24">
             <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                   <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">E-Ticketing Commission</h2>
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#00E5FF]/10 to-[#8B5CF6]/10 border border-[#00E5FF]/20 dark:border-[#00E5FF]/30 mt-1">
                     <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse shrink-0"></span>
                     <p className="font-semibold text-sm text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6]">
                       Pay only when you earn. Zero commission for free events.
                     </p>
                   </div>
                </div>
                <div className="flex bg-slate-100 dark:bg-[#121826] p-1.5 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner">
                   <button 
                     onClick={() => setCurrency("INR")}
                     className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${currency === "INR" ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-md border border-slate-200 dark:border-white/10" : "text-slate-500 dark:text-neutral-500 hover:text-slate-900 dark:hover:text-white"}`}
                   >
                     INR
                   </button>
                   <button 
                     onClick={() => setCurrency("USD")}
                     className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${currency === "USD" ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-md border border-slate-200 dark:border-white/10" : "text-slate-500 dark:text-neutral-500 hover:text-slate-900 dark:hover:text-white"}`}
                   >
                     USD
                   </button>
                </div>
             </div>

             <div className="bg-white dark:bg-[#121826]/50 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                         <th className="p-6 text-sm font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">Details</th>
                         <th className="p-6 text-sm font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest text-right">Amount</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group">
                         <td className="p-6 text-slate-600 dark:text-neutral-300 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Ticket Price</td>
                         <td className="p-6 text-right font-medium text-slate-900 dark:text-white">{currency === "INR" ? "₹100.00" : "$100.00"}</td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group">
                         <td className="p-6 text-slate-600 dark:text-neutral-300 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Razorpay Fee (approx)</td>
                         <td className="p-6 text-right font-medium text-rose-400">-{currency === "INR" ? "₹2.36" : "$2.36"}</td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group">
                         <td className="p-6 text-slate-600 dark:text-neutral-300 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">System Charge (2%)</td>
                         <td className="p-6 text-right font-medium text-rose-400">-{currency === "INR" ? "₹2.00" : "$2.00"}</td>
                      </tr>
                      <tr className="bg-[#00E5FF]/5 border-t-2 border-[#00E5FF]/20">
                         <td className="p-8 text-slate-900 dark:text-white font-bold text-xl">Amount Received</td>
                         <td className="p-8 text-right font-bold text-2xl text-[#00E5FF] drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">{currency === "INR" ? "₹95.64" : "$95.64"}</td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </section>

          {/* 4. QR CODE CHARGES & 5. OTHER CHARGES */}
          <div className="grid lg:grid-cols-2 gap-12 mb-32">
             {/* QR Code Charges */}
             <section className="flex flex-col h-full">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight">
                   <div className="p-2 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20"><QrCode className="text-[#8B5CF6] w-6 h-6" /></div>
                   QR Code Charges
                </h2>
                <div className="bg-white dark:bg-[#121826]/50 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl flex-1 flex flex-col shadow-xl">
                   <table className="w-full text-left border-collapse flex-1">
                      <thead>
                         <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                            <th className="p-6 text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">Guests Capacity</th>
                            <th className="p-6 text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest text-right">Cost Per Guest</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                         <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                            <td className="p-6 text-slate-600 dark:text-neutral-300 font-medium">Up to 100 Guests</td>
                            <td className="p-6 text-right font-bold text-emerald-400 bg-emerald-500/10"><span className="px-3 py-1 rounded-md">Free</span></td>
                         </tr>
                         <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                            <td className="p-6 text-slate-600 dark:text-neutral-300 font-medium">101 – 500 Guests</td>
                            <td className="p-6 text-right font-semibold text-white">₹4</td>
                         </tr>
                         <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                            <td className="p-6 text-slate-600 dark:text-neutral-300 font-medium">501 – 1000 Guests</td>
                            <td className="p-6 text-right font-semibold text-white">₹3</td>
                         </tr>
                         <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                            <td className="p-6 text-slate-600 dark:text-neutral-300 font-medium">Above 1000 Guests</td>
                            <td className="p-6 text-right font-semibold text-[#00E5FF]">₹2</td>
                         </tr>
                      </tbody>
                   </table>
                   <div className="p-5 bg-white/[0.02] border-t border-white/10 text-xs text-neutral-500 font-medium text-center">
                      * Billed automatically per successful check-in.
                   </div>
                </div>
             </section>

             {/* Other Charges */}
             <section className="flex flex-col h-full">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight">
                   <div className="p-2 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20"><MonitorSmartphone className="text-[#00E5FF] w-6 h-6" /></div>
                   Other Charges
                </h2>
                <div className="grid gap-4 flex-1">
                   <div className="bg-white dark:bg-[#121826]/50 border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-center justify-between hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(37,211,102,0.1)] hover:border-[#25D366]/30 transition-all group">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center border border-[#25D366]/20 group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-6 h-6 text-[#25D366]" />
                         </div>
                         <span className="font-semibold text-slate-700 dark:text-neutral-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-lg">WhatsApp Charge</span>
                      </div>
                      <div className="text-right">
                         <span className="font-bold text-xl text-slate-900 dark:text-white">₹0.89</span>
                         <span className="text-sm text-slate-400 dark:text-neutral-500 ml-1">+ GST</span>
                      </div>
                   </div>

                   <div className="bg-white dark:bg-[#121826]/50 border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-center justify-between hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(0,229,255,0.1)] hover:border-[#00E5FF]/30 transition-all group">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center border border-[#00E5FF]/20 group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-6 h-6 text-[#00E5FF]" />
                         </div>
                         <span className="font-semibold text-slate-700 dark:text-neutral-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-lg">SMS Charge</span>
                      </div>
                      <div className="text-right">
                         <span className="font-bold text-xl text-slate-900 dark:text-white">₹0.25</span>
                         <span className="text-sm text-slate-400 dark:text-neutral-500 ml-1">+ GST</span>
                      </div>
                   </div>

                   <div className="bg-white dark:bg-[#121826]/50 border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-center justify-between hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] hover:border-orange-500/30 transition-all group">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform">
                            <Mail className="w-6 h-6 text-orange-400" />
                         </div>
                         <span className="font-semibold text-slate-700 dark:text-neutral-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-lg">Email Charge</span>
                      </div>
                      <div className="text-right">
                         <span className="font-bold text-xl text-slate-900 dark:text-white">₹0.11</span>
                         <span className="text-sm text-slate-400 dark:text-neutral-500 ml-1">+ GST</span>
                      </div>
                   </div>
                </div>
             </section>
          </div>

          {/* 6. PAYMENT SETTLEMENT SECTION */}
          <section className="mb-32 bg-slate-100 dark:bg-[#121826]/40 border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 md:p-20 relative overflow-hidden text-center backdrop-blur-2xl shadow-2xl">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00E5FF]/5 via-transparent to-transparent pointer-events-none"></div>
             
             <h2 className="text-3xl md:text-5xl font-bold mb-16 text-slate-900 dark:text-white tracking-tight">Quick & Easy Payment Settlement</h2>
             
             <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto relative z-10">
                {/* Connecting Line for desktop */}
                <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF]/30 to-transparent z-0"></div>

                <div className="flex flex-col items-center relative z-10 bg-white dark:bg-[#121826]/80 p-6 rounded-3xl border border-slate-200 dark:border-white/5 hover:-translate-y-2 transition-transform duration-300">
                   <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-blue-500/20 blur-xl"></div>
                      <DollarSign className="w-10 h-10 text-blue-400 relative z-10" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Payment Processing</h3>
                   <p className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed font-medium">Secure routing via Razorpay ensures your funds are protected and accounted for instantly.</p>
                </div>
                
                <div className="flex flex-col items-center relative z-10 bg-white dark:bg-[#121826]/80 p-6 rounded-3xl border border-[#00E5FF]/20 shadow-[0_0_30px_rgba(0,229,255,0.05)] hover:-translate-y-2 transition-transform duration-300">
                   <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(0,229,255,0.4)] relative">
                      <div className="absolute inset-0 border-2 border-white/50 rounded-2xl animate-ping opacity-20"></div>
                      <RefreshCcw className="w-10 h-10 text-white" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Settlement Timeline</h3>
                   <p className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed font-medium">T+2 days. Funds are automatically credited directly to your registered bank account.</p>
                </div>
                
                <div className="flex flex-col items-center relative z-10 bg-white dark:bg-[#121826]/80 p-6 rounded-3xl border border-slate-200 dark:border-white/5 hover:-translate-y-2 transition-transform duration-300">
                   <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-rose-500/10 blur-xl"></div>
                      <CheckCircle2 className="w-10 h-10 text-rose-400 relative z-10" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Non-working Days</h3>
                   <p className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed font-medium">Bank holidays & weekends are safely excluded from the standard T+2 calculation.</p>
                </div>
             </div>
          </section>

          {/* 7. CONTACT SECTION */}
          <section id="contact" className="border-t border-white/10 pt-24 pb-10">
             <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                   <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">Have pricing questions?</h2>
                   <p className="text-xl text-slate-500 dark:text-neutral-400 mb-12 leading-relaxed">Our team is ready to help you plan the perfect setup for your next major event.</p>
                   
                   <div className="space-y-8">
                      <div className="flex items-center gap-5">
                         <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
                            <Phone className="w-6 h-6 text-[#00E5FF]" />
                         </div>
                         <div>
                            <p className="text-sm text-slate-400 dark:text-neutral-500 font-semibold uppercase tracking-wider mb-1">Phone</p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">+91 9241277903</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-5">
                         <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
                            <Mail className="w-6 h-6 text-[#8B5CF6]" />
                         </div>
                         <div>
                            <p className="text-sm text-slate-400 dark:text-neutral-500 font-semibold uppercase tracking-wider mb-1">Email</p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">support@checkmyentry.com</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-5">
                         <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
                            <MapPin className="w-6 h-6 text-emerald-400" />
                         </div>
                         <div>
                            <p className="text-sm text-slate-400 dark:text-neutral-500 font-semibold uppercase tracking-wider mb-1">Office</p>
                            <p className="font-semibold text-slate-800 dark:text-white max-w-sm leading-relaxed">3rd floor, Madan Mohan Tower, Manji ka Hatta Paota Jodhpur (Rajasthan)</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-white/10 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/10 blur-[50px] pointer-events-none"></div>
                   <form ref={formRef} className="space-y-6 relative z-10" onSubmit={handleSend}>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-sm text-slate-600 dark:text-neutral-300 font-semibold pl-1">First Name</label>
                            <input type="text" name="from_name" required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-[#00E5FF]/50 focus:bg-white dark:focus:bg-white/10 transition-colors" placeholder="John" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-sm text-slate-600 dark:text-neutral-300 font-semibold pl-1">Last Name</label>
                            <input type="text" name="last_name" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-[#00E5FF]/50 focus:bg-white dark:focus:bg-white/10 transition-colors" placeholder="Doe" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm text-slate-600 dark:text-neutral-300 font-semibold pl-1">Email</label>
                         <input type="email" name="from_email" required className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-[#00E5FF]/50 focus:bg-white dark:focus:bg-white/10 transition-colors" placeholder="john@company.com" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm text-slate-600 dark:text-neutral-300 font-semibold pl-1">Phone Number</label>
                         <input type="tel" name="phone" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-[#00E5FF]/50 focus:bg-white dark:focus:bg-white/10 transition-colors" placeholder="+91 00000 00000" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm text-slate-600 dark:text-neutral-300 font-semibold pl-1">Message</label>
                         <textarea name="message" rows={4} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-[#00E5FF]/50 focus:bg-white dark:focus:bg-white/10 transition-colors resize-none" placeholder="Tell us about your event scale..."></textarea>
                      </div>
                      {sent && (
                         <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-medium text-sm flex items-center gap-2">
                           <CheckCircle2 className="w-5 h-5 shrink-0" /> Message sent! We'll get back to you soon.
                         </div>
                       )}
                       {error && (
                         <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 font-medium text-sm">{error}</div>
                       )}
                      <button type="submit" disabled={sending} className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] text-white font-bold shadow-lg hover:shadow-[0_0_25px_rgba(0,229,255,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2 text-base disabled:opacity-60 disabled:cursor-not-allowed">
                         {sending ? "Sending..." : (<>Send Message <Send className="w-5 h-5" /></>)}
                      </button>
                   </form>
                </div>
             </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#05050A] pt-16 pb-8 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center">
                   <QrCode className="w-4 h-4 text-white" />
                 </div>
                 <span className="font-bold text-lg text-slate-900 dark:text-white">CheckMyEntry</span>
               </div>
               
               <div className="flex flex-wrap gap-8 text-sm font-medium text-slate-600 dark:text-neutral-400">
                  <Link href="/" className="hover:text-[#00E5FF] transition-colors text-slate-600 dark:text-neutral-400">Home</Link>
                  <Link href="/pricing" className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">Pricing</Link>
                  <Link href="#contact" className="hover:text-[#00E5FF] transition-colors text-slate-600 dark:text-neutral-400">Contact</Link>
                  <Link href="#" className="hover:text-[#00E5FF] transition-colors text-slate-600 dark:text-neutral-400">Terms of Service</Link>
                  <Link href="#" className="hover:text-[#00E5FF] transition-colors text-slate-600 dark:text-neutral-400">Privacy Policy</Link>
               </div>
            </div>
            
            <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400 dark:text-neutral-600">
               <p>© {new Date().getFullYear()} CheckMyEntry Platform. All rights reserved.</p>
               <p className="flex items-center gap-1">Built for high-performance ticketing.</p>
            </div>
         </div>
      </footer>

    </div>
  );
}
