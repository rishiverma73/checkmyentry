"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "../../../../lib/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "../../../../lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, orderBy } from "firebase/firestore";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  LogOut, 
  ArrowLeft,
  Users,
  CalendarDays,
  Loader2,
  Download,
  Filter,
  Search,
  Copy,
  ExternalLink
} from "lucide-react";
import jsPDF from "jspdf";

export default function OrganizerEventDashboard({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [eventData, setEventData] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.uid && eventId) {
      fetchData();
    }
  }, [user, eventId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Event Document
      const eventDoc = await getDoc(doc(db, "events", eventId));
      if (!eventDoc.exists() || eventDoc.data().createdBy !== user?.uid) {
        // If it doesn't exist or doesn't belong to loged in user, send them back
        router.push("/dashboard");
        return;
      }
      setEventData(eventDoc.data());

      // 2. Fetch all Registrations corresponding to this event
      const q = query(
        collection(db, "registrations"),
        where("eventId", "==", eventId)
      );
      const querySnapshot = await getDocs(q);
      const regs: any[] = [];
      querySnapshot.forEach((d) => {
        regs.push({ id: d.id, ...d.data() });
      });
      
      // Sort newest
      regs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setRegistrations(regs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/event/${eventId}`;
    navigator.clipboard.writeText(url);
    alert("Public Event Link Copied!");
  };

  const exportCSV = () => {
    if (registrations.length === 0) return;
    
    // Create CSV Header
    const headers = ["Ticket ID", "Attendee Name", "Phone", "Email", "Status", "Date Registered"];
    let csvContent = headers.join(",") + "\n";
    
    // Add Rows
    registrations.forEach(r => {
      const row = [
        r.ticketId,
        `"${r.attendeeName}"`,
        `"${r.phone}"`,
        `"${r.email || ''}"`,
        r.status,
        new Date(r.createdAt).toLocaleString()
      ];
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${eventData.eventName.replace(/\s+/g, '_')}_Registrations.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      reg.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      reg.phone.includes(searchQuery);
    
    if (statusFilter === "All") return matchesSearch;
    return matchesSearch && reg.status === statusFilter;
  });

  if (authLoading || !user || loading || !eventData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center text-slate-500 hover:text-slate-900 transition-colors gap-2 font-medium">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-700">
              {user.displayName || user.email}
            </div>
            <button onClick={logout} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">{eventData.eventName}</h1>
            <p className="text-slate-500 flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${eventData.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                {eventData.status}
              </span>
              Event Analytics
            </p>
          </div>
          
          <div className="flex gap-3">
             <button 
                onClick={exportCSV}
                className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
             <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </button>
          </div>
        </div>

        {/* Global Event Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Users className="w-24 h-24" /></div>
            <p className="text-slate-500 text-sm font-medium mb-1">Total Registrations</p>
            <p className="text-4xl font-bold text-slate-900">{registrations.length}</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 shadow-md flex flex-col justify-center text-white col-span-1 md:col-span-2">
             <div className="flex flex-col justify-center h-full">
               <p className="text-blue-100/80 text-sm font-medium mb-1 uppercase tracking-wider">Public Link</p>
               <a href={`/event/${eventId}`} target="_blank" className="font-mono text-lg md:text-xl truncate hover:underline flex items-center gap-2 max-w-fit">
                 checkmyentry.vercel.app/event/{eventId}
                 <ExternalLink className="w-5 h-5 shrink-0" />
               </a>
             </div>
          </div>
        </div>

        {/* Attendees Data Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Attendee Roster
            </h2>
            
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search name or phone..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-64 bg-white"
                />
              </div>
              
              <div className="relative">
                <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none bg-white font-medium text-slate-700 w-full sm:w-auto cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Registered">Registered</option>
                  <option value="Checked In">Checked In</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Ticket / ID</th>
                  <th className="px-6 py-4">Attendee info</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <CalendarDays className="w-10 h-10 text-slate-300 mb-3" />
                        <p className="text-lg font-medium text-slate-600">No attendees yet</p>
                        <p className="text-sm">Share your event link to start collecting registrations.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-500 font-medium">#{reg.ticketId}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{reg.attendeeName}</td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900">{reg.phone}</div>
                        <div className="text-xs text-slate-500">{reg.email || "-"}</div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-500 text-xs font-medium">
                        {new Date(reg.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
