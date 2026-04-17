"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";

export default function Dashboard() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const user = auth.currentUser;

      if (!user) return;

      const q = query(
        collection(db, "events"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);

      const list: any[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      setEvents(list);
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen p-6">

      <h1 className="text-2xl font-bold mb-6">Your Events</h1>

      <Link href="/create-event">
        <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
          + Create Event
        </button>
      </Link>

      <div className="grid gap-4">
        {events.map((event) => (
          <Link key={event.id} href={`/dashboard/event/${event.id}`}>
            <div className="p-4 border rounded-lg shadow hover:bg-gray-50 cursor-pointer">
              <h2 className="font-semibold">{event.eventName}</h2>
              <p className="text-sm text-gray-500">₹{event.price}</p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}