"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Admin() {
  const [users, setUsers] = useState<{name?: string, status?: string}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const list = querySnapshot.docs.map(doc => doc.data());
      setUsers(list);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <p>Total Users: {users.length}</p>

      {users.map((user, index) => (
        <div key={index} className="border p-2 mt-2">
          {user.name} - {user.status}
        </div>
      ))}
    </div>
  );
}