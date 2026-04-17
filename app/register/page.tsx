"use client";

import { useState } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import QRCode from "qrcode";
import emailjs from "emailjs-com";

export default function Home() {
  const [regNo, setRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [qrImage, setQrImage] = useState("");

  const generateTicket = async () => {
    if (!regNo || !email) {
      setMessage("Please enter all details");
      return;
    }

    const cleanRegNo = regNo.trim().toUpperCase();

    try {
      // 🔍 check valid student
      const studentRef = doc(db, "valid_students", cleanRegNo);
      const studentSnap = await getDoc(studentRef);

      if (!studentSnap.exists()) {
        setMessage("❌ Invalid Registration Number");
        return;
      }

      const studentData = studentSnap.data();

      if (studentData.status === "used") {
        setMessage("⚠️ Already Registered");
        return;
      }

      // 🎟 generate ticket ID
      const ticketId = Math.random().toString(36).substring(2, 10);

      // 🔳 generate QR
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}`;
      // 💾 save in users collection
      await setDoc(doc(db, "users", ticketId), {
        regNo: cleanRegNo,
        name: studentData.name,
        email: email,
        ticketId: ticketId,
        status: "not_used",
      });

      // 🔁 update valid_students
      await setDoc(studentRef, {
        ...studentData,
        status: "used",
      });

      // 📧 SEND EMAIL
      await emailjs.send(
        "service_9y37lip",     
        "template_e9rgdnq",   
        {
          name: studentData.name,
          email: email,
          qr_code: qrUrl,
        },
        "cyNr94OU4b_fwtLPB"      // 🔴 replace
      );

      setQrImage(qrUrl);
      setMessage("✅ Registration Successful & Email Sent");

    } catch (error) {
      console.log(error);
      setMessage("Error occurred");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">CheckMyEntry</h1>

      {/* REG NO */}
      <input
        type="text"
        placeholder="Enter Registration Number"
        value={regNo}
        onChange={(e) => setRegNo(e.target.value)}
        className="border p-3 rounded w-80 mb-4"
      />

      {/* EMAIL */}
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-3 rounded w-80 mb-4"
      />

      {/* BUTTON */}
      <button
        onClick={generateTicket}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Generate Pass
      </button>

      {/* MESSAGE */}
      <p className="mt-4 text-lg">{message}</p>

      {/* QR */}
      {qrImage && (
        <img src={qrImage} alt="QR Code" className="mt-6 w-40 h-40" />
      )}
    </div>
  );
}
