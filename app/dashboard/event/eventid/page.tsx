"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "../../../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function EventDashboard() {
  const params = useParams();

  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [checked, setChecked] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(
        collection(db, "registrations"),
        where("eventId", "==", params.id)
      );

      const querySnapshot = await getDocs(q);

      const list: any[] = [];
      let checkedCount = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push(data);

        if (data.status === "used") {
          checkedCount++;
        }
      });

      setUsers(list);
      setTotal(list.length);
      setChecked(checkedCount);
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen p-6">

      <h1 className="text-2xl font-bold mb-4">Event Dashboard</h1>

      {/* Stats */}
      <div className="flex gap-4 mb-6">
        <div className="p-4 bg-blue-100 rounded">
          Total: {total}
        </div>
        <div className="p-4 bg-green-100 rounded">
          Checked-in: {checked}
        </div>
      </div>

      {/* Users */}
      <div className="space-y-2">
        {users.map((u, i) => (
          <div key={i} className="p-3 border rounded flex justify-between">
            <div>
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
            </div>

            <div>
              {u.status === "used" ? (
                <span className="text-green-600">✔ Entered</span>
              ) : (
                <span className="text-red-500">Not Entered</span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}