"use client";

import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { db } from "../../lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Scanner() {
  const [result, setResult] = useState("");

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;
    let startPromise: Promise<any> | null = null;
    
    // Add brief timeout to ensure DOM container #reader exists
    const timer = setTimeout(() => {
      html5QrCode = new Html5Qrcode("reader");

      startPromise = html5QrCode
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            try {
              if (html5QrCode && html5QrCode.isScanning) {
                 html5QrCode.pause(true); // Pause scanning to prevent duplicates
              }
              setResult(`🔍 Verifying Ticket...`);

              // Multi-Tenant Lookup: Search all registrations for unique ticket ID
              const q = query(
                collection(db, "registrations"),
                where("ticketId", "==", decodedText)
              );
              
              const querySnapshot = await getDocs(q);

              if (querySnapshot.empty) {
                setResult("❌ Invalid Ticket / Not Found");
                setTimeout(() => html5QrCode?.resume(), 2500);
                return;
              }

              const ticketDoc = querySnapshot.docs[0];
              const data = ticketDoc.data();

              // Check logic respects new unified statuses
              if (data.status === "Used" || data.status === "used" || data.status === "Checked In") {
                setResult(`⚠️ Attendee '${data.attendeeName || data.name}' Already Checked In!`);
                setTimeout(() => html5QrCode?.resume(), 2500);
              } else {
                setResult(`✅ Access Granted: ${data.attendeeName || data.name}`);
                
                await updateDoc(doc(db, "registrations", ticketDoc.id), {
                  status: "Checked In",
                });
                
                setTimeout(() => html5QrCode?.resume(), 3000);
              }
            } catch (error) {
              console.error(error);
              setResult("Error processing scan");
              setTimeout(() => html5QrCode?.resume(), 2500);
            }
          },
          (errorMessage) => {
            // safely ignore internal reader noise
          }
        )
        .catch((err) => {
          console.error("Camera start error:", err);
          setResult("Camera permissions denied or unavailable.");
        });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (startPromise && html5QrCode) {
        // Wait for the scanner to successfully boot up before shutting it down safely
        startPromise
          .then(() => {
            html5QrCode?.stop().then(() => {
              html5QrCode?.clear();
            }).catch(console.error);
          })
          .catch(console.error); // Catch start errors seamlessly 
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6 relative font-sans">
      <Link href="/" className="absolute top-8 left-8 text-slate-400 hover:text-white transition-colors flex items-center gap-2">
         <ArrowLeft className="w-5 h-5" /> Back
      </Link>
      
      <div className="max-w-md w-full flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2">Ticket Scanner</h1>
        <p className="text-slate-400 mb-8 text-sm">Align the QR code within the frame to verify attendees.</p>

        <div className="bg-slate-900 border-4 border-slate-800 rounded-3xl p-4 shadow-2xl mb-8 w-full">
           <div id="reader" className="w-full bg-black rounded-2xl overflow-hidden aspect-square flex items-center justify-center"></div>
        </div>

        <div className={`px-6 py-4 rounded-full font-bold text-lg border w-full transition-all ${result.includes('✅') ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : result.includes('❌') || result.includes('⚠️') ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
           {result || "Awaiting Scan..."}
        </div>
      </div>
    </div>
  );
}