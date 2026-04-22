"use client";

import { useEffect, useState, use } from "react";
import { db, storage } from "../../../lib/firebase";
import { doc, getDoc, collection, setDoc, getDocs, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import jsPDF from "jspdf";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import * as XLSX from 'xlsx';
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
  Mail,
  UploadCloud,
  FileText
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "../../../components/ThemeToggle";

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;
  
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFull, setIsFull] = useState(false);

  // Cached Verification Data
  const [validRegNumbers, setValidRegNumbers] = useState<Set<string> | null>(null);
  const [isParsingExcel, setIsParsingExcel] = useState(false);

  // Basic Details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Dynamic Custom Responses: key=fieldId, value=string | File
  const [responses, setResponses] = useState<Record<string, any>>({});
  
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
        
        // Capacity checking
        if (evData.maxAttendees && evData.maxAttendees > 0) {
          const regQ = query(collection(db, "registrations"), where("eventId", "==", eventId));
          const regSnap = await getDocs(regQ);
          if (regSnap.docs.length >= evData.maxAttendees) {
             setIsFull(true);
          }
        }

        // Fetch & Parse Excel if exists
        if (evData.verificationFileUrl) {
           setIsParsingExcel(true);
           try {
              const fileRes = await fetch(evData.verificationFileUrl);
              const arrayBuffer = await fileRes.arrayBuffer();
              const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
              
              if (workbook.SheetNames.length > 0) {
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonSheet = XLSX.utils.sheet_to_json(worksheet);
                
                const validSet = new Set<string>();
                jsonSheet.forEach((row: any) => {
                  const val = row['Registration Number'] || row['registration number'] || row['Registration_Number'] || row['ID'];
                  if (val) validSet.add(String(val).trim().toLowerCase());
                });
                
                setValidRegNumbers(validSet);
              }
           } catch (e) {
              console.error("Error parsing validation excel", e);
           } finally {
              setIsParsingExcel(false);
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

  const handleDynamicChange = (fieldId: string, val: any) => {
    setResponses(prev => ({ ...prev, [fieldId]: val }));
  };

  const isFieldVisible = (field: any) => {
    if (!field.condition || !field.condition.dependsOn) return true;
    const parentVal = responses[field.condition.dependsOn];
    return parentVal === field.condition.value;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (!name || !phone || !email) {
      setErrorMsg("Please provide your basic details (Name, Phone, Email).");
      return;
    }

    // Checking dynamically required visible fields
    let verificationValue = null;
    let verificationFieldLabel = "Registration Number";
    
    if (eventData.customFields) {
      for (const field of eventData.customFields) {
        if (!isFieldVisible(field)) continue;
        
        if (field.required && !responses[field.id]) {
          setErrorMsg(`Please fill out the "${field.label}" field.`);
          return;
        }

        if (field.type === 'verification') {
           verificationValue = responses[field.id];
           verificationFieldLabel = field.label;
        }
      }
    }

    // EXCEL VERIFICATION LOGIC
    let isVerified = false;
    if (verificationValue && validRegNumbers) {
       if (!validRegNumbers.has(String(verificationValue).trim().toLowerCase())) {
          setErrorMsg(`Verification Failed: ${verificationValue} is an Invalid ${verificationFieldLabel}.`);
          return;
       }
       isVerified = true;
    }

    setSubmitting(true);
    try {
      // Duplicate Registration Check
      const phoneCheckQ = query(collection(db, "registrations"), where("eventId", "==", eventId), where("phone", "==", phone));
      const phoneCheckSnap = await getDocs(phoneCheckQ);
      if (!phoneCheckSnap.empty) {
        setErrorMsg("A registration with this phone number already exists.");
        setSubmitting(false); return;
      }

      // Upload Any Custom Files
      const finalResponses: Record<string, any> = {};
      if (eventData.customFields) {
        for (const field of eventData.customFields) {
          if (!isFieldVisible(field)) continue;
          
          if (field.type === 'file' && responses[field.id] instanceof File) {
             // Upload
             const fileObj = responses[field.id];
             const fileRef = ref(storage, `proofs/${eventId}_${Date.now()}_${fileObj.name}`);
             await uploadBytes(fileRef, fileObj);
             const url = await getDownloadURL(fileRef);
             finalResponses[field.label] = url; // Store by label for easy reading
          } else {
             finalResponses[field.label] = responses[field.id];
          }
        }
      }

      const newTicketId = Math.random().toString(36).substring(2, 12).toUpperCase();
      const regDocRef = doc(collection(db, "registrations"));
      
      await setDoc(regDocRef, {
        ticketId: newTicketId,
        eventId: eventId,
        eventName: eventData.eventName,
        attendeeName: name,
        phone,
        email,
        responses: finalResponses,
        verified: isVerified,
        status: "Registered",
        createdAt: new Date().toISOString()
      });

      setTicketId(newTicketId);
      setSuccess(true);
      sendTicketEmail(newTicketId, name, email, eventData);
      setTimeout(() => downloadTicketPDF(newTicketId, name, eventData), 500);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to complete registration.");
    } finally {
      setSubmitting(false);
    }
  };

  const sendTicketEmail = async (tid: string, attendee: string, attendeeEmail: string, eventInfo: any) => {
    try {
      const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_9y37lip";
      const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_e9rgdnq";
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "cyNr94OU4b_fwtLPB";

      if (!serviceID || !templateID || !publicKey) {
        console.error("EmailJS Config Missing! Added fallbacks should prevent this.", { serviceID, templateID, publicKey });
        return;
      }

      console.log("Sending email to:", attendeeEmail, "Ticket ID:", tid);
      const templateParams = {
        to_email: attendeeEmail, 
        email: attendeeEmail, 
        user_email: attendeeEmail, 
        to: attendeeEmail,
        reply_to: attendeeEmail,
        to_name: attendee, event_name: eventInfo.eventName, ticket_id: tid,
        event_date: eventInfo.date, event_time: eventInfo.time, event_location: eventInfo.location,
        qr_link: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${tid}`
      };
      const response = await emailjs.send(serviceID, templateID, templateParams, publicKey);
      console.log("EmailJS Success:", response);
    } catch (error) {
      console.error("EmailJS Error details:", error);
    }
  };

  const downloadTicketPDF = (tid: string, attendee: string, eventInfo: any) => {
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 150] });
    pdf.setFillColor(30, 41, 59); pdf.rect(0, 0, 100, 150, "F");
    pdf.setFillColor(37, 99, 235); pdf.rect(0, 0, 100, 30, "F");
    pdf.setTextColor(255, 255, 255); pdf.setFont("helvetica", "bold"); pdf.setFontSize(14);
    pdf.text(eventInfo.eventName.substring(0, 25), 50, 18, { align: "center" });
    pdf.setFillColor(255, 255, 255); pdf.roundedRect(10, 25, 80, 105, 3, 3, "F");

    const img = new Image();
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${tid}`;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      pdf.setTextColor(0, 0, 0); pdf.setFontSize(12); pdf.setFont("helvetica", "bold"); pdf.text(attendee, 50, 40, { align: "center" });
      pdf.setFontSize(10); pdf.setFont("helvetica", "normal"); pdf.setTextColor(100, 100, 100); pdf.text(`${eventInfo.date} • ${eventInfo.time}`, 50, 47, { align: "center" });
      pdf.addImage(img, "PNG", 30, 55, 40, 40);
      pdf.setTextColor(0, 0, 0); pdf.setFontSize(14); pdf.setFont("helvetica", "bold"); pdf.text(`ID: ${tid}`, 50, 105, { align: "center" });
      pdf.setFontSize(9); pdf.setFont("helvetica", "normal"); pdf.setTextColor(100, 100, 100); pdf.text(eventInfo.location, 50, 115, { align: "center" });
      pdf.text(`Status: VALID`, 50, 122, { align: "center" });
      pdf.save(`${attendee.replace(/\s+/g, '_')}_Ticket.pdf`);
    };
  };

  if (loading || isParsingExcel) {
    return <div className="min-h-screen bg-slate-50 dark:bg-[#05050A] text-slate-900 dark:text-white flex flex-col items-center justify-center gap-4 transition-colors duration-300">
       <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
       {isParsingExcel && <p className="text-blue-500 dark:text-blue-300 font-medium">Synchronizing Verification Database...</p>}
    </div>;
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#05050A] flex flex-col items-center justify-center text-center p-6 text-slate-900 dark:text-white transition-colors duration-300">
        <AlertCircle className="w-16 h-16 text-slate-300 dark:text-white/30 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
        <p className="text-slate-500 dark:text-neutral-400 mb-6">The link might be broken or the event might have been removed.</p>
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05050A] font-sans selection:bg-blue-200 dark:selection:bg-purple-500/30 py-12 md:py-20 px-4 relative overflow-x-hidden text-slate-900 dark:text-white transition-colors duration-300">
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 dark:bg-blue-600/20 blur-[150px] rounded-full pointer-events-none transition-colors duration-500" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-400/10 dark:bg-purple-600/20 blur-[150px] rounded-full pointer-events-none transition-colors duration-500" />

      <div className="absolute top-4 right-4 z-50">
         <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-0 bg-white dark:bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] shadow-xl dark:shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden relative z-10 transition-colors duration-300">
        
        {/* Event Details Side */}
        <div className="md:col-span-2 bg-slate-100 dark:bg-gradient-to-br dark:from-blue-900/20 dark:to-purple-900/20 text-slate-900 dark:text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden border-r border-slate-200 dark:border-white/5 transition-colors duration-300">
          <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-10 dark:opacity-30"></div>
          
          <div className="relative z-10 space-y-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 mb-4 border border-blue-200 dark:border-blue-500/20 shadow-sm dark:shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                {eventData.isPaid ? 'Paid Entry' : 'Free Registration'}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight mb-4 leading-snug">{eventData.eventName}</h1>
              <p className="text-slate-600 dark:text-neutral-400 text-sm leading-relaxed font-medium">{eventData.description}</p>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-white/5 flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none"><CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
                <div><p className="text-xs text-slate-500 dark:text-neutral-500 font-medium">Date</p><p className="font-semibold text-slate-800 dark:text-neutral-200">{eventData.date}</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-white/5 flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none"><Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" /></div>
                <div><p className="text-xs text-slate-500 dark:text-neutral-500 font-medium">Time</p><p className="font-semibold text-slate-800 dark:text-neutral-200">{eventData.time}</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-white/5 flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none"><MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /></div>
                <div><p className="text-xs text-slate-500 dark:text-neutral-500 font-medium">Location</p><p className="font-semibold text-sm leading-tight max-w-[200px] text-slate-800 dark:text-neutral-200">{eventData.location}</p></div>
              </div>
            </div>
          </div>
          <div className="relative z-10 pt-10 mt-10 border-t border-slate-200 dark:border-white/10 flex items-center gap-3">
             <QrCode className="w-5 h-5 text-slate-400 dark:text-neutral-500" />
             <p className="text-xs text-slate-500 dark:text-neutral-500 font-medium">Organized by <span className="text-slate-800 dark:text-neutral-300">{eventData.organizerName}</span></p>
          </div>
        </div>

        {/* Form Side */}
        <div className="md:col-span-3 p-8 md:p-10 md:pr-12 relative">
          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center space-y-6 py-10 relative z-10">
              <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
              <div className="w-24 h-24 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]"><CheckCircle2 className="w-12 h-12" /></div>
              <div><h2 className="text-3xl font-extrabold text-white mb-2">You're In!</h2><p className="text-neutral-400 max-w-sm mb-6 font-medium">Your registration is confirmed. Screenshot your code or check your email.</p></div>
              <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-2xl w-full max-w-sm flex flex-col items-center shadow-xl">
                <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">Your Entry Code</p>
                <div className="bg-white p-3 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-4 inline-block">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketId}`} alt="QR Code" className="w-[150px] h-[150px]" />
                </div>
                <p className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-widest drop-shadow-md">{ticketId}</p>
              </div>
              <button onClick={() => downloadTicketPDF(ticketId, name, eventData)} className="text-blue-400 font-semibold hover:text-blue-300 transition-colors text-sm flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">Download PDF Again</button>
            </motion.div>
          ) : isFull ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10">
              <div className="w-20 h-20 bg-white/5 text-neutral-400 rounded-full flex items-center justify-center mb-2 border border-white/10"><AlertCircle className="w-10 h-10" /></div>
              <h2 className="text-3xl font-bold text-white">Sold Out</h2>
              <p className="text-neutral-400 max-w-sm font-medium">This event has reached its maximum capacity of {eventData.maxAttendees} attendees.</p>
            </div>
          ) : (
            <>
              <div className="mb-8 relative z-10">
                <h2 className="text-3xl font-extrabold text-white mb-2">Secure Your Spot</h2>
                <p className="text-neutral-400 font-medium">Fill in your details below to register.</p>
              </div>
              {errorMsg && (
                <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm mb-6 border border-red-500/20 flex items-center gap-3 backdrop-blur-sm relative z-10 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" /><span className="font-medium">{errorMsg}</span>
                </div>
              )}
              <form onSubmit={handleRegister} className="space-y-5 relative z-10">
                {/* Standard Basic Fields */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-300 ml-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input type="text" className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/10 transition-all font-medium text-white placeholder-neutral-500" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-300 ml-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input type="tel" className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/10 transition-all font-medium text-white placeholder-neutral-500" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-300 ml-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input type="email" className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/10 transition-all font-medium text-white placeholder-neutral-500" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>

                {/* Dynamic Custom Fields */}
                {eventData.customFields && eventData.customFields.map((field: any) => {
                   if (!isFieldVisible(field)) return null;
                   return (
                     <div key={field.id} className="space-y-2 border-t border-white/10 pt-5 mt-5">
                       <label className="text-sm font-semibold text-neutral-300 ml-1">
                         {field.label} {field.required && '*'}
                       </label>
                       
                       {field.type === 'text' && (
                         <input type="text" className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all font-medium text-white placeholder-neutral-500" onChange={(e) => handleDynamicChange(field.id, e.target.value)} />
                       )}
                       {field.type === 'verification' && (
                         <div className="relative">
                           <FileText className="w-5 h-5 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" />
                           <input type="text" placeholder="Enter Registration ID..." className="w-full pl-12 pr-4 py-3.5 bg-purple-500/5 border border-purple-500/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-purple-500/10 transition-all font-medium text-white placeholder-purple-300/50" onChange={(e) => handleDynamicChange(field.id, e.target.value)} />
                         </div>
                       )}
                       {field.type === 'radio' && (
                         <div className="flex flex-wrap gap-4 pt-1">
                           {field.options?.map((opt: string) => (
                             <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                               <div className="relative flex items-center justify-center">
                                 <input type="radio" name={field.id} value={opt} className="peer appearance-none w-5 h-5 border-2 border-neutral-500 rounded-full checked:border-blue-500 transition-colors" onChange={(e) => handleDynamicChange(field.id, e.target.value)} />
                                 <div className="absolute w-2.5 h-2.5 rounded-full bg-blue-500 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                               </div>
                               <span className="text-neutral-300 font-medium text-sm group-hover:text-white transition-colors">{opt}</span>
                             </label>
                           ))}
                         </div>
                       )}
                       {field.type === 'dropdown' && (
                         <select className="w-full px-4 py-3.5 bg-[#0A0A0F] border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-white appearance-none" onChange={(e) => handleDynamicChange(field.id, e.target.value)}>
                           <option value="" className="bg-[#0A0A0F] text-neutral-500">Select an option</option>
                           {field.options?.map((opt: string) => <option key={opt} value={opt} className="bg-[#0A0A0F]">{opt}</option>)}
                         </select>
                       )}
                       {field.type === 'file' && (
                         <div className="border border-dashed border-white/20 rounded-2xl p-4 bg-white/5 relative hover:bg-white/10 transition-colors group">
                           <input type="file" accept="image/*,.pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => { 
                             if (e.target.files) handleDynamicChange(field.id, e.target.files[0]); 
                           }} />
                           <div className="flex items-center justify-center gap-3 pointer-events-none">
                             <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                               <UploadCloud className="w-5 h-5 text-blue-400" />
                             </div>
                             <span className="text-sm font-medium text-neutral-300">{responses[field.id] ? responses[field.id].name : "Upload Proof (PDF/Image)"}</span>
                           </div>
                         </div>
                       )}
                     </div>
                   );
                })}

                <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all active:scale-[0.98] mt-6 disabled:opacity-70 disabled:active:scale-100 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                  {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Ticket className="w-5 h-5" /> Submit Registration</>}
                </button>
              </form>
              <div className="mt-8 text-center text-xs text-neutral-500 font-medium relative z-10"><p>By registering, you agree to the platform terms and event conditions.</p></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
