"use client";

import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function Scanner() {
  const [result, setResult] = useState("");

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");

    scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250,
      },
      async (decodedText) => {
        try {
          const ticketId = decodedText;

          const docRef = doc(db, "users", ticketId);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            setResult("❌ Invalid QR");
            return;
          }

          const data = docSnap.data();

          if (data.status === "used") {
            setResult("⚠️ Already Scanned");
          } else {
            setResult("✅ Entry Allowed");

            await updateDoc(docRef, {
              status: "used",
            });
          }
        } catch (error) {
          console.log(error);
          setResult("Error scanning");
        }
      }
    );

    return () => {
  try {
    scanner.stop();
  } catch (err) {
    console.log("Scanner already stopped");
  }
};
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-2xl mb-4">QR Scanner</h1>

      <div id="reader" className="w-80"></div>

      <p className="mt-4 text-lg">{result}</p>
    </div>
  );
}