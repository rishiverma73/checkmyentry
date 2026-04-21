"use client";

import { useEffect, useState, use } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, collection, setDoc, getDocs, query, where } from "firebase/firestore";
import jsPDF from "jspdf";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Ticket, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  QrCode,
  User,
  Phone,
  Mail
} from "lucide-react";
import Link from "next/link";

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;
  
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFull, setIsFull] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const docRef = doc(db, "events", eventId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const evData = docSnap.data();
        setEventData({ id: docSnap.id, ...evData });
        
        // Check Capacity
        if (evData.maxAttendees && evData.maxAttendees > 0) {
          const regQ = query(collection(db, "registrations"), where("eventId", "==", eventId));
          const regSnap = await getDocs(regQ);
          if (regSnap.docs.length >= evData.maxAttendees) {
            setIsFull(true);
          }
        }
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (!name || !phone || !email) {
      setErrorMsg("Please provide your name, phone and email address for ticket delivery.");
      return;
    }

    setSubmitting(true);
    try {
      const newTicketId = Math.random().toString(36).substring(2, 12).toUpperCase();
      
      const regDocRef = doc(collection(db, "registrations"));
      await setDoc(regDocRef, {
        ticketId: newTicketId,
        eventId: eventId,
        eventName: eventData.eventName,
        attendeeName: name,
        phone,
        email,
        status: "Registered", // 'Registered' vs 'Checked In'
        createdAt: new Date().toISOString()
      });

      setTicketId(newTicketId);
      setSuccess(true);
      
      // AUTO DISPATCH EMAIL TICKET
      sendTicketEmail(newTicketId, name, email, eventData);
      
      setTimeout(() => {
        downloadTicketPDF(newTicketId, name, eventData);
      }, 500);

    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to complete registration. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const sendTicketEmail = async (tid: string, attendee: string, attendeeEmail: string, eventInfo: any) => {
    try {
      // Configuration Placeholders - User must fill these in EmailJS Dashboard
      const serviceID = "service_xxxxxxx"; // Replace with your Service ID
      const templateID = "template_xxxxxxx"; // Replace with your Template ID
      const publicKey = "xxxxxxxxxxxxxxxxx"; // Replace with your Public Key

      const templateParams = {
        to_email: attendeeEmail,
        to_name: attendee,
        event_name: eventInfo.eventName,
        ticket_id: tid,
        event_date: eventInfo.date,
        event_time: eventInfo.time,
        event_location: eventInfo.location,
        qr_link: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${tid}`
      };

      await emailjs.send(serviceID, templateID, templateParams, publicKey);
      console.log("Ticket email sent successfully!");
    } catch (error) {
      console.error("EmailJS Error:", error);
    }
  };

  const downloadTicketPDF = (tid: string, attendee: string, eventInfo: any) => {
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 150] });

    pdf.setFillColor(30, 41, 59);
    pdf.rect(0, 0, 100, 150, "F");

    // Blue banner
    pdf.setFillColor(37, 99, 235);
    pdf.rect(0, 0, 100, 30, "F");
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text(eventInfo.eventName.substring(0, 25), 50, 18, { align: "center" });
    
    // Card
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(10, 25, 80, 105, 3, 3, "F");

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${tid}`;
    const img = new Image();
    img.src = qrUrl;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(attendee, 50, 40, { align: "center" });
      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      pdf.text(`${eventInfo.date} • ${eventInfo.time}`, 50, 47, { align: "center" });

      pdf.addImage(img, "PNG", 30, 55, 40, 40);

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(`ID: ${tid}`, 50, 105, { align: "center" });
      
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      pdf.text(eventInfo.location, 50, 115, { align: "center" });
      
      pdf.text(`Status: VALID`, 50, 122, { align: "center" });

      pdf.save(`${attendee.replace(/\s+/g, '_')}_Ticket.pdf`);
    };
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-6">
        <AlertCircle className="w-16 h-16 text-slate-300 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Event Not Found</h1>
        <p className="text-slate-500 mb-6">The link might be broken or the event might have been removed.</p>
        <Link href="/" className="text-blue-600 hover:underline">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-8 bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Event Details Side */}
        <div className="md:col-span-2 bg-slate-900 text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
          
          <div className="relative z-10 space-y-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 mb-4 border border-blue-500/30">
                {eventData.isPaid ? 'Paid Entry' : 'Free Registration'}
              </span>
              <h1 className="text-3xl font-bold tracking-tight mb-4 leading-snug">{eventData.eventName}</h1>
              <p className="text-slate-400 text-sm leading-relaxed">{eventData.description}</p>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-700/50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Date</p>
                  <p className="font-semibold">{eventData.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Time</p>
                  <p className="font-semibold">{eventData.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Location</p>
                  <p className="font-semibold text-sm leading-tight max-w-[200px]">{eventData.location}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 pt-10 mt-10 border-t border-slate-700/50 flex items-center gap-3">
             <QrCode className="w-5 h-5 text-slate-500" />
             <p className="text-xs text-slate-500">Organized by <span className="text-slate-300 font-medium">{eventData.organizerName}</span></p>
          </div>
        </div>

        {/* Form Side */}
        <div className="md:col-span-3 p-8 md:p-10 md:pr-12">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-6 py-10"
            >
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">You're In!</h2>
                <p className="text-slate-500 max-w-sm mb-6">Your registration is confirmed. Your PDF ticket is downloading automatically.</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl w-full max-w-sm">
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Ticket ID</p>
                <p className="text-2xl font-mono font-bold text-slate-900 tracking-widest">{ticketId}</p>
              </div>
              <button 
                onClick={() => downloadTicketPDF(ticketId, name, eventData)}
                className="text-blue-600 font-medium hover:underline text-sm"
              >
                Download PDF Again
              </button>
            </motion.div>
          ) : isFull ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10">
              <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-2">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Sold Out</h2>
              <p className="text-slate-500 max-w-sm">
                We're sorry, but this event has reached its maximum capacity of {eventData.maxAttendees} attendees.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Secure Your Spot</h2>
                <p className="text-slate-500">Fill in your details below to register.</p>
              </div>

              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 font-medium"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 font-medium"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Email Address * (For Ticket)</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 font-medium"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] mt-4 disabled:opacity-70 disabled:active:scale-100"
                >
                  {submitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Ticket className="w-5 h-5" />
                      Get Free Ticket
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-8 text-center">
                <p className="text-xs text-slate-400">
                  By registering, you agree to the platform terms and event conditions.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
