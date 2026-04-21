"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "../../lib/firebase";
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, orderBy } from "firebase/firestore";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, 
  Plus, 
  QrCode, 
  User as UserIcon, 
  Loader2, 
  CheckCircle2, 
  X,
  CalendarDays,
  Copy,
  MapPin,
  Clock,
  Settings2,
  ExternalLink,
  ScanLine,
  Trash2
} from "lucide-react";

export default function Dashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  
  // Dashboard Metrics
  const [totalRegs, setTotalRegs] = useState(0);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);

  const [eventName, setEventName] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [maxAttendees, setMaxAttendees] = useState("");
  
  // Dashboard Metrics
  const [todayRegs, setTodayRegs] = useState(0);
  
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.uid) {
      fetchEvents(user.uid);
    }
  }, [user]);

  const fetchEvents = async (uid: string) => {
    setLoadingEvents(true);
    let totalLifetimeRegs = 0;
    try {
      const q = query(
        collection(db, "events"), 
        where("createdBy", "==", uid)
      );
      const querySnapshot = await getDocs(q);
      
      const allEvents: any[] = [];
      
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      let lifetimeTodayRegs = 0;

      // We process sequentially to fetch registration counts per event
      for (const eventDoc of querySnapshot.docs) {
        const evData = eventDoc.data();
        // Fetch reg count for this event
        const regQ = query(collection(db, "registrations"), where("eventId", "==", eventDoc.id));
        const regSnap = await getDocs(regQ);
        const count = regSnap.docs.length;
        totalLifetimeRegs += count;
        
        regSnap.forEach(d => {
           if (new Date(d.data().createdAt).getTime() >= startOfToday) {
             lifetimeTodayRegs++;
           }
        });
        
        allEvents.push({ 
          id: eventDoc.id, 
          regCount: count,
          ...evData 
        });
      }
      
      allEvents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setEvents(allEvents);
      setTotalRegs(totalLifetimeRegs);
      setTodayRegs(lifetimeTodayRegs);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const createEvent = async () => {
    if (!eventName || !desc || !date || !time) {
      setMessage({ type: 'error', text: "Please fill required fields (Name, Desc, Date, Time)" });
      return;
    }

    setGenerating(true);
    setMessage(null);

    try {
      const eventId = Math.random().toString(36).substring(2, 12);
      
      await setDoc(doc(db, "events", eventId), {
        eventId,
        createdBy: user?.uid,
        organizerEmail: user?.email,
        organizerName: user?.displayName || "Organizer",
        eventName,
        description: desc,
        date,
        time,
        location: location || "TBA",
        isPaid,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : 0, // 0 = unlimited
        status: "Upcoming",
        createdAt: new Date().toISOString()
      });

      setMessage({ type: 'success', text: "Event created successfully!" });
      fetchEvents(user?.uid || "");
      
      setTimeout(() => {
        setShowForm(false);
        setEventName("");
        setDesc("");
        setDate("");
        setTime("");
        setLocation("");
        setIsPaid(false);
        setMaxAttendees("");
        setMessage(null);
      }, 2000);

    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: "Error occurred while creating event." });
    } finally {
      setGenerating(false);
    }
  };

  const deleteEvent = async (eventId: string, eventName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${eventName}"? This action cannot be undone.`)) return;
    
    setDeletingId(eventId);
    try {
      // Delete the event doc
      await deleteDoc(doc(db, "events", eventId));
      
      // Fetch and delete all registrations associated with this event
      const regQ = query(collection(db, "registrations"), where("eventId", "==", eventId));
      const regSnap = await getDocs(regQ);
      
      const deletePromises = regSnap.docs.map(regDoc => deleteDoc(doc(db, "registrations", regDoc.id)));
      await Promise.all(deletePromises);
      
      setEvents(prev => prev.filter(e => e.id !== eventId));
      setTotalRegs(prev => prev - regSnap.docs.length); // Rough update locally
      fetchEvents(user?.uid || ""); // Refetch to guarantee accuracy
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event.");
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (eventId: string) => {
    const url = `${window.location.origin}/event/${eventId}`;
    navigator.clipboard.writeText(url);
    alert("Public Event Link Copied!");
  };

  if (authLoading || !user) {
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
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <QrCode className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-xl tracking-tight text-slate-900">CheckMyEntry</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/scanner" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-all flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-50 rounded-lg">
              <ScanLine className="w-4 h-4" />
              Scanner
            </Link>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-700">
              <UserIcon className="w-4 h-4" />
              {user.displayName || user.email}
            </div>
            <button 
              onClick={logout}
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Organizer Dashboard</h1>
            <p className="text-slate-500">Manage your events and track registrations seamlessly.</p>
          </div>
          <div className="flex items-center gap-3">
             <Link href="/scanner">
               <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-medium shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
                 <ScanLine className="w-5 h-5" />
                 Scan Tickets
               </button>
             </Link>
             <button 
               onClick={() => setShowForm(true)}
               className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
             >
               <Plus className="w-5 h-5" />
               Create Event
             </button>
          </div>
        </div>

        {/* Global Event Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium mb-1">Total Active Events</p>
            <p className="text-4xl font-bold text-slate-900">{events.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium mb-1">Lifetime Registrations</p>
            <p className="text-4xl font-bold text-emerald-600">{totalRegs}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><UserIcon className="w-24 h-24 text-blue-600" /></div>
            <p className="text-slate-500 text-sm font-medium mb-1">Today's Registrations</p>
            <p className="text-4xl font-bold text-blue-600">{todayRegs}</p>
          </div>
        </div>

        {/* Events Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            My Events
          </h2>
          
          {loadingEvents ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                <CalendarDays className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Events Created Yet</h3>
              <p className="text-slate-500 max-w-sm mb-6">Start managing your attendees by creating your first event hook.</p>
              <button 
                onClick={() => setShowForm(true)}
                className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
              >
                Create Event Now
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={event.id} 
                  className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden group hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                >
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          {event.status}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                          {event.isPaid ? "Paid" : "Free"}
                        </span>
                      </div>
                      <button 
                        onClick={() => deleteEvent(event.id, event.eventName)}
                        disabled={deletingId === event.id}
                        className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors disabled:opacity-50"
                        title="Delete Event"
                      >
                         {deletingId === event.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2">{event.eventName}</h3>
                    
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center text-sm text-slate-500 gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {event.date} • {event.time}
                      </div>
                      <div className="flex items-center text-sm text-slate-500 gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border-t border-slate-100 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm">
                        <p className="text-slate-500 font-medium">Registrations</p>
                        <p className="text-xl font-bold text-slate-900">{event.regCount}</p>
                      </div>
                      <Link href={`/dashboard/event/${event.id}`}>
                        <button className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-xl">
                          Manage <Settings2 className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => copyToClipboard(event.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                      >
                        <Copy className="w-4 h-4" /> Copy Link
                      </button>
                      <Link href={`/event/${event.id}`} target="_blank" className="flex-1">
                        <button className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
                          <ExternalLink className="w-4 h-4" /> View Page
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Creating Event Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
              onClick={() => !generating && setShowForm(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden pointer-events-auto h-full max-h-[90vh] flex flex-col"
              >
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                    Create New Event
                  </h3>
                  <button 
                    onClick={() => setShowForm(false)}
                    disabled={generating}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                  {message && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-100' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'}`}
                    >
                      {message.type === 'error' ? <X className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                      <span className="text-sm font-medium">{message.text}</span>
                    </motion.div>
                  )}

                  <div className="space-y-5">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 ml-1">Event Name</label>
                      <input
                        type="text"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        placeholder="e.g. Next.js Genesis Meetup"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 ml-1">Description</label>
                      <textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="Short overview of the event..."
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 ml-1">Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 ml-1">Time</label>
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 ml-1">Location (Optional)</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Auditorium Hall B or Zoom Link"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 ml-1">Max Attendees (Optional)</label>
                      <input
                        type="number"
                        min="1"
                        value={maxAttendees}
                        onChange={(e) => setMaxAttendees(e.target.value)}
                        placeholder="e.g. 500 (Leave blank for unlimited)"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-1 pt-2">
                       <label className="text-sm font-medium text-slate-700 ml-1">Ticketing</label>
                       <div className="flex gap-4 mt-2">
                         <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex-1 hover:border-blue-300 transition-colors">
                           <input type="radio" checked={!isPaid} onChange={() => setIsPaid(false)} className="w-4 h-4 text-blue-600 focus:ring-blue-500"/>
                           <span className="font-medium text-slate-700">Free</span>
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex-1 hover:border-blue-300 transition-colors">
                           <input type="radio" checked={isPaid} onChange={() => setIsPaid(true)} className="w-4 h-4 text-blue-600 focus:ring-blue-500"/>
                           <span className="font-medium text-slate-700">Paid Ticket</span>
                         </label>
                       </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100">
                    <button
                      onClick={createEvent}
                      disabled={generating}
                      className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Creating Platform Link...
                        </>
                      ) : (
                        <>
                          Launch Event
                          <QrCode className="w-5 h-5 ml-1" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
