"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useRouter } from "next/navigation";
import { db, storage } from "../../lib/firebase";
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, orderBy, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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
  Trash2,
  Wifi,
  WifiOff,
  Layers,
  ListPlus,
  FileSpreadsheet,
  UploadCloud,
  Trash
} from "lucide-react";
import { ThemeToggle } from "../../components/ThemeToggle";

export default function Dashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  
  // Dashboard Metrics
  const [totalRegs, setTotalRegs] = useState(0);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'form' | 'verification'>('basic');
  const [customFields, setCustomFields] = useState<any[]>([]);
  const [excelFile, setExcelFile] = useState<File | null>(null);
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
  const [checkedInCount, setCheckedInCount] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Scanner State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState<{type: 'success'|'error'|'warning', text: string} | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;
    let startPromise: Promise<any> | null = null;

    if (isScannerOpen) {
      setScanResult(null); // reset
      const updateOnlineStatus = () => setIsOnline(navigator.onLine);
      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
      updateOnlineStatus();

      const timer = setTimeout(() => {
        html5QrCode = new Html5Qrcode("dashboard-reader");

        startPromise = html5QrCode
          .start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            async (decodedText) => {
              if (!navigator.onLine) {
                setScanResult({ type: 'error', text: "Verification Requires Internet" });
                return;
              }
              try {
                if (html5QrCode && html5QrCode.isScanning) {
                   html5QrCode.pause(true); 
                }
                setScanResult({ type: 'warning', text: "Verifying Ticket..." });

                const q = query(collection(db, "registrations"), where("ticketId", "==", decodedText));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                  setScanResult({ type: 'error', text: "Invalid Ticket / Not Found" });
                  setTimeout(() => html5QrCode?.resume(), 2500);
                  return;
                }

                const ticketDoc = querySnapshot.docs[0];
                const data = ticketDoc.data();

                if (data.status === "Used" || data.status === "used" || data.status === "Checked In") {
                  setScanResult({ type: 'warning', text: `Already Checked In: ${data.attendeeName || data.name}` });
                  setTimeout(() => html5QrCode?.resume(), 2500);
                } else {
                  setScanResult({ type: 'success', text: `Access Granted: ${data.attendeeName || data.name}` });
                  await updateDoc(doc(db, "registrations", ticketDoc.id), { status: "Checked In" });
                  fetchEvents(user?.uid || ""); // Auto update dashboard metric
                  setTimeout(() => html5QrCode?.resume(), 3000);
                }
              } catch (error) {
                console.error(error);
                setScanResult({ type: 'error', text: "Error processing scan" });
                setTimeout(() => html5QrCode?.resume(), 2500);
              }
            },
            (err) => {}
          )
          .catch((err) => {
            console.error("Camera start error:", err);
            setScanResult({ type: 'error', text: "Camera permissions denied." });
          });
      }, 100);
      
      return () => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
        clearTimeout(timer);
        if (startPromise && html5QrCode) {
          startPromise.then(() => {
            html5QrCode?.stop().then(() => html5QrCode?.clear()).catch(console.error);
          }).catch(console.error);
        }
      };
    }
  }, [isScannerOpen]);

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
      let lifetimeCheckedIn = 0;
      const dateMap: Record<string, number> = {};

      // We process sequentially to fetch registration counts per event
      for (const eventDoc of querySnapshot.docs) {
        const evData = eventDoc.data();
        // Fetch reg count for this event
        const regQ = query(collection(db, "registrations"), where("eventId", "==", eventDoc.id));
        const regSnap = await getDocs(regQ);
        const count = regSnap.docs.length;
        totalLifetimeRegs += count;
        
        regSnap.forEach(d => {
           const regData = d.data();
           
           if (new Date(regData.createdAt).getTime() >= startOfToday) {
             lifetimeTodayRegs++;
           }
           
           if (regData.status === "Checked In" || regData.checkedIn === true) {
             lifetimeCheckedIn++;
           }
           
           const dateStr = new Date(regData.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
           dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
        });
        
        allEvents.push({ 
          id: eventDoc.id, 
          regCount: count,
          ...evData 
        });
      }
      
      allEvents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      const finalChartData = Object.keys(dateMap).map(date => ({
        name: date,
        registrations: dateMap[date]
      })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
      
      setEvents(allEvents);
      setTotalRegs(totalLifetimeRegs);
      setTodayRegs(lifetimeTodayRegs);
      setCheckedInCount(lifetimeCheckedIn);
      setChartData(finalChartData);
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
      let verificationFileUrl = null;
      let verificationFileName = null;
      if (excelFile) {
        setMessage({ type: 'success', text: "Uploading Verification List..." });
        const fileRef = ref(storage, `verifications/${user?.uid}_${Date.now()}_${excelFile.name}`);
        await uploadBytes(fileRef, excelFile);
        verificationFileUrl = await getDownloadURL(fileRef);
        verificationFileName = excelFile.name;
      }
      
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
        customFields,
        verificationFileUrl,
        verificationFileName,
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
        setCustomFields([]);
        setExcelFile(null);
        setActiveTab('basic');
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
      <div className="min-h-screen bg-slate-50 dark:bg-[#05050A] flex items-center justify-center transition-colors duration-300">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05050A] text-slate-900 dark:text-white font-sans selection:bg-blue-200 dark:selection:bg-purple-500/30 overflow-x-hidden relative transition-colors duration-300">
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 dark:bg-blue-600/10 blur-[150px] rounded-full pointer-events-none transition-colors duration-500" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 dark:bg-purple-600/10 blur-[150px] rounded-full pointer-events-none transition-colors duration-500" />
      
      <nav className="bg-white/70 dark:bg-[#05050A]/60 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <QrCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">CheckMyEntry</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button 
              onClick={() => setIsScannerOpen(true)}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white transition-all flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg"
            >
              <ScanLine className="w-4 h-4" />
              Scanner
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-full text-sm font-medium text-slate-700 dark:text-neutral-300">
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">Organizer Dashboard</h1>
            <p className="text-slate-500 dark:text-neutral-400 font-medium">Manage your events and track registrations seamlessly.</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setShowForm(true)}
               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
             >
               <Plus className="w-5 h-5" />
               Create Event
             </button>
          </div>
        </div>

        {/* Global Scanner Master Banner */}
        <div className="bg-gradient-to-tr from-slate-900 to-slate-800 rounded-3xl p-8 mb-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-white border border-slate-700">
           <div className="absolute top-0 right-10 p-8 opacity-5 rotate-12 pointer-events-none">
             <ScanLine className="w-64 h-64" />
           </div>
           <div className="z-10 mb-6 md:mb-0 relative">
             <div className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-md border border-blue-500/30">
               <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span> System Live
             </div>
             <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Gate Scanning Mode</h2>
             <p className="text-slate-300 text-lg max-w-lg font-medium">Instantly convert this device into a high-speed ticket scanner. Validates entry and syncs live.</p>
           </div>
           <div className="z-10 w-full md:w-auto relative">
             <button 
               onClick={() => setIsScannerOpen(true)}
               className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/20 border border-blue-500 px-8 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-opacity active:scale-[0.98]"
             >
               <ScanLine className="w-6 h-6" />
               Start Scanning Now
             </button>
           </div>
        </div>

        {/* Global Event Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 relative z-10">
          <div className="bg-white dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl flex flex-col justify-center">
            <p className="text-slate-500 dark:text-neutral-400 text-sm font-medium mb-1">Total Active Events</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{events.length}</p>
          </div>
          <div className="bg-white dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl flex flex-col justify-center">
            <p className="text-slate-500 dark:text-neutral-400 text-sm font-medium mb-1">Lifetime Registrations</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{totalRegs}</p>
          </div>
          <div className="bg-white dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl flex flex-col justify-center relative overflow-hidden">
            <p className="text-slate-500 dark:text-neutral-400 text-sm font-medium mb-1">Total Checked-In</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{checkedInCount}</p>
          </div>
          <div className="bg-white dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-xl flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><UserIcon className="w-24 h-24 text-blue-600 dark:text-blue-400" /></div>
            <p className="text-slate-500 dark:text-neutral-400 text-sm font-medium mb-1">Today's Registrations</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{todayRegs}</p>
          </div>
        </div>
        
        {/* Analytics Growth Chart */}
        {chartData.length > 0 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl mb-10 relative z-10">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              Registration Growth
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRegs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="registrations" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRegs)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

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
                
                
                <div className="flex border-b border-slate-200 shrink-0 bg-white">
                  <button onClick={() => setActiveTab('basic')} className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'basic' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Basic Info</button>
                  <button onClick={() => setActiveTab('form')} className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'form' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Form Builder</button>
                  <button onClick={() => setActiveTab('verification')} className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'verification' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Verification</button>
                </div>

                <div className="p-6 overflow-y-auto w-full">
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

                  {activeTab === 'basic' && (
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 ml-1">Event Name</label>
                        <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="e.g. Next.js Genesis Meetup" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 ml-1">Description</label>
                        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Short overview..." rows={3} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-sm font-medium text-slate-700 ml-1">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" /></div>
                        <div className="space-y-1"><label className="text-sm font-medium text-slate-700 ml-1">Time</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" /></div>
                      </div>
                      <div className="space-y-1"><label className="text-sm font-medium text-slate-700 ml-1">Location</label><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Zoom Link" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" /></div>
                      <div className="space-y-1"><label className="text-sm font-medium text-slate-700 ml-1">Max Attendees</label><input type="number" min="1" value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)} placeholder="Leave blank for unlimited" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" /></div>
                      <div className="space-y-1 pt-2">
                         <label className="text-sm font-medium text-slate-700 ml-1">Ticketing</label>
                         <div className="flex gap-4 mt-2">
                           <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex-1 hover:border-blue-300"><input type="radio" checked={!isPaid} onChange={() => setIsPaid(false)} className="w-4 h-4 text-blue-600"/><span>Free</span></label>
                           <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex-1 hover:border-blue-300"><input type="radio" checked={isPaid} onChange={() => setIsPaid(true)} className="w-4 h-4 text-blue-600"/><span>Paid Ticket</span></label>
                         </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'form' && (
                    <div className="space-y-6">
                      <div className="bg-purple-50 text-purple-800 p-4 rounded-xl text-sm border border-purple-100 flex items-start gap-3">
                        <Layers className="w-5 h-5 shrink-0 text-purple-600" />
                        <div>
                          <strong>Dynamic Form Builder</strong>
                          <p>Add custom questions, file uploads, and specific registration number verification fields for your attendees.</p>
                        </div>
                      </div>

                      {customFields.map((field, index) => (
                        <div key={field.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl relative group">
                          <button onClick={() => setCustomFields(prev => prev.filter((_, i) => i !== index))} className="absolute top-3 right-3 text-slate-400 hover:text-red-500">
                            <Trash className="w-4 h-4" />
                          </button>
                          
                          <div className="grid grid-cols-2 gap-4 mb-3 pr-8">
                            <div>
                               <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1 block">Field Label</label>
                               <input type="text" value={field.label} onChange={(e) => { const newF = [...customFields]; newF[index].label = e.target.value; setCustomFields(newF); }} className="w-full text-sm py-2 px-3 border border-slate-200 rounded-lg text-slate-900" placeholder="e.g. T-Shirt Size" />
                            </div>
                            <div>
                               <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1 block">Field Type</label>
                               <select value={field.type} onChange={(e) => { const newF = [...customFields]; newF[index].type = e.target.value; setCustomFields(newF); }} className="w-full text-sm py-2 px-3 border border-slate-200 rounded-lg text-slate-900 bg-white">
                                 <option value="text">Short Answer</option>
                                 <option value="radio">Radio Options</option>
                                 <option value="dropdown">Dropdown Select</option>
                                 <option value="file">File Upload (Proof)</option>
                                 <option value="verification">ID Verification Match</option>
                               </select>
                            </div>
                          </div>

                          {(field.type === 'radio' || field.type === 'dropdown') && (
                            <div className="mb-3">
                              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1 block">Options (comma separated)</label>
                              <input type="text" value={field.options?.join(', ') || ''} onChange={(e) => { const newF = [...customFields]; newF[index].options = e.target.value.split(',').map(s=>s.trim()); setCustomFields(newF); }} className="w-full text-sm py-2 px-3 border border-slate-200 rounded-lg text-slate-900" placeholder="Small, Medium, Large" />
                            </div>
                          )}

                          <div className="flex items-center justify-between border-t border-slate-200 pt-3 mt-3">
                            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                               <input type="checkbox" checked={field.required} onChange={(e) => { const newF = [...customFields]; newF[index].required = e.target.checked; setCustomFields(newF); }} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /> Required
                            </label>

                            <div className="flex items-center gap-2">
                               <span className="text-xs font-semibold text-slate-500">Show If:</span>
                               <select value={field.condition?.dependsOn || ""} onChange={(e) => { const newF = [...customFields]; newF[index].condition = { dependsOn: e.target.value, value: "" }; setCustomFields(newF); }} className="text-xs py-1 px-2 border border-slate-200 rounded bg-white">
                                 <option value="">Always Show</option>
                                 {customFields.slice(0, index).filter(f => f.type === 'radio' || f.type === 'dropdown').map(f => (<option key={f.id} value={f.id}>Match {f.label}</option>))}
                               </select>
                               {field.condition?.dependsOn && (
                                  <input type="text" value={field.condition.value} onChange={(e) => { const newF = [...customFields]; newF[index].condition.value = e.target.value; setCustomFields(newF); }} className="text-xs py-1 px-2 border border-slate-200 rounded w-24" placeholder="Value is..." />
                               )}
                            </div>
                          </div>
                        </div>
                      ))}

                      <button onClick={() => setCustomFields([...customFields, { id: Math.random().toString(36).substring(2,9), label: '', type: 'text', required: true }])} className="w-full py-3 border-2 border-dashed border-purple-200 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors flex justify-center items-center gap-2">
                        <ListPlus className="w-5 h-5" /> Add Field
                      </button>
                    </div>
                  )}

                  {activeTab === 'verification' && (
                    <div className="space-y-6">
                      <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm border border-emerald-100 flex items-start gap-3">
                        <FileSpreadsheet className="w-5 h-5 shrink-0 text-emerald-600" />
                        <div>
                          <strong>Excel Waitlist Verification</strong>
                          <p>Upload a .xlsx file containing a column named <b>"Registration Number"</b>. If you add a "Verification Match" field in your form, attendees must provide a number that exists in this Excel file to secure a ticket.</p>
                        </div>
                      </div>

                      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-emerald-50/50 transition-colors relative">
                        <input type="file" id="excel-upload" accept=".xlsx" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => e.target.files && setExcelFile(e.target.files[0])} />
                        <div className="flex flex-col items-center pointer-events-none">
                          <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 border border-slate-200">
                             <UploadCloud className="w-8 h-8 text-emerald-500" />
                          </div>
                          <span className="text-slate-900 font-semibold">{excelFile ? excelFile.name : "Click to Upload .xlsx Database"}</span>
                          <span className="text-slate-500 text-sm mt-1">{excelFile ? (`${(excelFile.size / 1024).toFixed(1)} KB`) : "Max 5MB"}</span>
                        </div>
                      </div>
                      
                      {excelFile && (
                        <button onClick={() => setExcelFile(null)} className="text-sm font-medium text-red-500 hover:underline flex items-center justify-center w-full">
                          Remove File
                        </button>
                      )}
                    </div>
                  )}

                  <div className="mt-8 pt-4 border-t border-slate-100">
                    <button onClick={createEvent} disabled={generating} className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                      {generating ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Saving Configuration...</>
                      ) : (
                        <><QrCode className="w-5 h-5 shrink-0" /> Publish Event</>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
        
        {/* Global Modal Scanner */}
        {isScannerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden flex flex-col relative"
              >
                <div className="px-6 py-4 flex justify-between items-center bg-slate-900 text-white shrink-0">
                  <div className="flex items-center gap-2">
                    <ScanLine className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold">Global Scanner</h3>
                  </div>
                  <button 
                    onClick={() => setIsScannerOpen(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 bg-slate-950 flex flex-col items-center">
                  <div className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden border-4 border-slate-800 shadow-inner mb-6">
                    <div id="dashboard-reader" className="w-full h-full"></div>
                  </div>
                  
                  {/* Toast/Status Readout */}
                  <div className={`w-full p-4 rounded-xl font-medium text-center text-sm border shadow-sm transition-all ${
                    !scanResult ? 'bg-slate-800 text-slate-300 border-slate-700' :
                    scanResult.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' :
                    scanResult.type === 'warning' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' :
                    'bg-red-500/20 text-red-400 border-red-500/50'
                  }`}>
                    {scanResult ? scanResult.text : "Awaiting Scan..."}
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
