"use client";

import { useState } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";

export default function Register() {
  const [regNo, setRegNo] = useState("");
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [course, setCourse] = useState("");
  const [session, setSession] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [qrImage, setQrImage] = useState("");

  const generateTicket = async () => {
    if (!regNo || !name || !college || !course || !session || !email) {
      setMessage("Please fill all fields");
      return;
    }

    const cleanRegNo = regNo.trim().toUpperCase();

    try {
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

      const ticketId = Math.random().toString(36).substring(2, 10);

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}`;

      await setDoc(doc(db, "users", ticketId), {
        regNo: cleanRegNo,
        name,
        college,
        course,
        session,
        email,
        ticketId,
        status: "not_used",
      });

      await setDoc(studentRef, {
        ...studentData,
        status: "used",
      });

      await emailjs.send(
        "service_9y37lip",
        "template_e9rgdnq",
        {
          name,
          email,
          qr_code: qrUrl,
        },
        "cyNr94OU4b_fwtLPB"
      );

      setQrImage(qrUrl);
      setMessage("✅ Registration Successful");

    } catch (error) {
      console.log(error);
      setMessage("Error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🎟 CheckMyEntry
        </h1>

        <div className="space-y-3">

          <input
            type="text"
            placeholder="Registration Number"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="College Name"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Session (e.g. 2023-2026)"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <button
            onClick={generateTicket}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Generate Pass
          </button>

          <p className="text-center text-sm text-gray-600">{message}</p>

          {qrImage && (
            <div className="flex flex-col items-center mt-4">
              <img src={qrImage} className="w-40 h-40" />
              <p className="text-xs mt-2 text-gray-500">Show this at entry</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}