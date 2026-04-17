"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import emailjs from "@emailjs/browser";

export default function EventPage() {
  const params = useParams();

  const [event, setEvent] = useState<any>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [course, setCourse] = useState("");
  const [session, setSession] = useState("");

  const [message, setMessage] = useState("");
  const [qrImage, setQrImage] = useState("");

  // 🔥 Fetch Event
  useEffect(() => {
    const fetchEvent = async () => {
      const docRef = doc(db, "events", params.id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setEvent(docSnap.data());
      }
    };

    fetchEvent();
  }, []);

  // 🔥 Registration + QR
  const registerUser = async () => {
    if (!name || !email || !college || !course || !session) {
      setMessage("Fill all fields");
      return;
    }

    try {
      const ticketId = Math.random().toString(36).substring(2, 10);

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}`;

      await addDoc(collection(db, "registrations"), {
        eventId: params.id,
        name,
        email,
        college,
        course,
        session,
        ticketId,
        status: "not_used",
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

    } catch (err) {
      console.log(err);
      setMessage("Error occurred");
    }
  };

  if (!event) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex flex-col items-center justify-center p-4">

      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">

        {/* Event Info */}
        <h1 className="text-2xl font-bold text-center mb-2">
          {event.eventName}
        </h1>

        <p className="text-center text-gray-600">₹{event.price}</p>
        <p className="text-center text-gray-500 mb-4">{event.date}</p>

        {/* Form */}
        <div className="space-y-3">

          <input
            placeholder="Full Name"
            className="w-full border p-3 rounded-lg"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Email"
            className="w-full border p-3 rounded-lg"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="College"
            className="w-full border p-3 rounded-lg"
            onChange={(e) => setCollege(e.target.value)}
          />

          <input
            placeholder="Course"
            className="w-full border p-3 rounded-lg"
            onChange={(e) => setCourse(e.target.value)}
          />

          <input
            placeholder="Session"
            className="w-full border p-3 rounded-lg"
            onChange={(e) => setSession(e.target.value)}
          />

          <button
            onClick={registerUser}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Get Entry Pass
          </button>

          <p className="text-center text-sm">{message}</p>

          {qrImage && (
            <div className="flex flex-col items-center mt-4">
              <img src={qrImage} className="w-40 h-40" />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}