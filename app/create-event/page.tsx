"use client";

import { useState } from "react";
import { db, auth } from "../../lib/firebase";
import { addDoc, collection } from "firebase/firestore";

export default function CreateEvent() {
  const [eventName, setEventName] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [msg, setMsg] = useState("");

  const createEvent = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        setMsg("Please login first");
        return;
      }

      const docRef = await addDoc(collection(db, "events"), {
        eventName,
        price,
        date,
        userId: user.uid,
      });

      const eventLink = `${window.location.origin}/event/${docRef.id}`;

      setMsg("✅ Event Created");

      alert("Event Link: " + eventLink);

    } catch (err) {
      console.log(err);
      setMsg("Error creating event");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow w-96">

        <h1 className="text-xl font-bold mb-4 text-center">Create Event</h1>

        <input
          type="text"
          placeholder="Event Name"
          className="w-full border p-2 mb-3 rounded"
          onChange={(e) => setEventName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price (₹)"
          className="w-full border p-2 mb-3 rounded"
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="date"
          className="w-full border p-2 mb-3 rounded"
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          onClick={createEvent}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Create Event
        </button>

        <p className="text-sm mt-3 text-center">{msg}</p>

      </div>
    </div>
  );
}