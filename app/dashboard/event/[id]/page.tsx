"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "../../../../lib/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "../../../../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  ExternalLink,
  Trash2,
  Pencil,
  X,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  ChevronDown,
} from "lucide-react";

export default function OrganizerEventDashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteReg, setConfirmDeleteReg] = useState<any | null>(null);

  // Edit state
  const [editingReg, setEditingReg] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editMessage, setEditMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
      const eventDoc = await getDoc(doc(db, "events", eventId));
      if (!eventDoc.exists() || eventDoc.data().createdBy !== user?.uid) {
        router.push("/dashboard");
        return;
      }
      setEventData(eventDoc.data());

      const q = query(
        collection(db, "registrations"),
        where("eventId", "==", eventId)
      );
      const querySnapshot = await getDocs(q);
      const regs: any[] = [];
      querySnapshot.forEach((d) => {
        regs.push({ id: d.id, ...d.data() });
      });

      regs.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

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
    const headers = ["Ticket ID", "Attendee Name", "Phone", "Email", "Status", "Date Registered"];
    let csvContent = headers.join(",") + "\n";
    registrations.forEach((r) => {
      const row = [
        r.ticketId,
        `"${r.attendeeName}"`,
        `"${r.phone}"`,
        `"${r.email || ""}"`,
        r.status,
        new Date(r.createdAt).toLocaleString(),
      ];
      csvContent += row.join(",") + "\n";
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${eventData.eventName.replace(/\s+/g, "_")}_Registrations.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─── DELETE REGISTRATION ────────────────────────────────────────────────────
  const confirmAndDelete = (reg: any) => {
    setConfirmDeleteReg(reg);
  };

  const executeDelete = async () => {
    if (!confirmDeleteReg) return;
    setDeletingId(confirmDeleteReg.id);
    setConfirmDeleteReg(null);
    try {
      await deleteDoc(doc(db, "registrations", confirmDeleteReg.id));
      setRegistrations((prev) => prev.filter((r) => r.id !== confirmDeleteReg.id));
    } catch (err) {
      console.error("Error deleting registration:", err);
      alert("Error deleting registration. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // ─── OPEN EDIT MODAL ────────────────────────────────────────────────────────
  const openEdit = (reg: any) => {
    setEditingReg(reg);
    setEditName(reg.attendeeName || "");
    setEditPhone(reg.phone || "");
    setEditEmail(reg.email || "");
    setEditStatus(reg.status || "Registered");
    setEditMessage(null);
  };

  const saveEdit = async () => {
    if (!editName.trim() || !editPhone.trim()) {
      setEditMessage({ type: "error", text: "Name and Phone are required fields." });
      return;
    }
    setSavingEdit(true);
    setEditMessage(null);
    try {
      await updateDoc(doc(db, "registrations", editingReg.id), {
        attendeeName: editName.trim(),
        phone: editPhone.trim(),
        email: editEmail.trim(),
        status: editStatus,
      });
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === editingReg.id
            ? { ...r, attendeeName: editName.trim(), phone: editPhone.trim(), email: editEmail.trim(), status: editStatus }
            : r
        )
      );
      setEditMessage({ type: "success", text: "Registration updated successfully!" });
      setTimeout(() => {
        setEditingReg(null);
        setEditMessage(null);
      }, 1500);
    } catch (err) {
      console.error("Edit error:", err);
      setEditMessage({ type: "error", text: "Error updating registration. Please try again." });
    } finally {
      setSavingEdit(false);
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      (reg.attendeeName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.phone || "").includes(searchQuery) ||
      (reg.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === "All") return matchesSearch;
    return matchesSearch && reg.status === statusFilter;
  });

  const checkedInCount = registrations.filter(
    (r) => r.status === "Checked In"
  ).length;

  if (authLoading || !user || loading || !eventData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ─── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center text-slate-500 hover:text-slate-900 transition-colors gap-2 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-700">
              {user.displayName || user.email}
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* ─── PAGE HEADER ────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">
              {eventData.eventName}
            </h1>
            <p className="text-slate-500 flex items-center gap-3 flex-wrap">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                  eventData.status === "Upcoming"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {eventData.status}
              </span>
              {eventData.date && (
                <span className="flex items-center gap-1 text-sm">
                  <Clock className="w-3.5 h-3.5" />
                  {eventData.date} • {eventData.time}
                </span>
              )}
              {eventData.location && (
                <span className="flex items-center gap-1 text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  {eventData.location}
                </span>
              )}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
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

        {/* ─── STATS CARDS ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Users className="w-24 h-24" />
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">
              Total Registrations
            </p>
            <p className="text-4xl font-bold text-slate-900">
              {registrations.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-slate-500 text-sm font-medium mb-1">
              Checked In
            </p>
            <p className="text-4xl font-bold text-emerald-600">
              {checkedInCount}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {registrations.length > 0
                ? `${Math.round((checkedInCount / registrations.length) * 100)}% attendance`
                : "No registrations yet"}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 shadow-md flex flex-col justify-center text-white">
            <p className="text-blue-100/80 text-sm font-medium mb-1 uppercase tracking-wider">
              Public Link
            </p>
            <a
              href={`/event/${eventId}`}
              target="_blank"
              className="font-mono text-sm truncate hover:underline flex items-center gap-2 max-w-fit"
            >
              /event/{eventId}
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>

        {/* ─── ATTENDEES TABLE ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Attendee Roster
              <span className="ml-1 text-sm font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {filteredRegistrations.length}
              </span>
            </h2>

            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, phone or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-64 bg-white"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                  <th className="px-6 py-4">Attendee Info</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Registered</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <CalendarDays className="w-10 h-10 text-slate-300 mb-3" />
                        <p className="text-lg font-medium text-slate-600">
                          {searchQuery || statusFilter !== "All"
                            ? "No results found"
                            : "No attendees yet"}
                        </p>
                        <p className="text-sm mt-1">
                          {searchQuery || statusFilter !== "All"
                            ? "Try changing your search or filter."
                            : "Share your event link to start receiving registrations."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <motion.tr
                      key={reg.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4 font-mono text-slate-500 font-medium text-xs">
                        #{reg.ticketId}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {reg.attendeeName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900">{reg.phone}</div>
                        <div className="text-xs text-slate-400">
                          {reg.email || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            reg.status === "Checked In"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {reg.status === "Checked In" ? (
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                          ) : null}
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-400 text-xs font-medium">
                        {new Date(reg.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      {/* ─── ACTION BUTTONS ─── */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Edit */}
                          <button
                            onClick={() => openEdit(reg)}
                            title="Edit Registration"
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => confirmAndDelete(reg)}
                            disabled={deletingId === reg.id}
                            title="Delete Registration"
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            {deletingId === reg.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
      ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {confirmDeleteReg && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
              onClick={() => setConfirmDeleteReg(null)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden pointer-events-auto"
              >
                <div className="p-6 text-center">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Delete Registration?
                  </h3>
                  <p className="text-slate-500 text-sm mb-1">
                    <span className="font-semibold text-slate-700">
                      {confirmDeleteReg.attendeeName}
                    </span>{" "}
                    's registration will be permanently deleted.
                  </p>
                  <p className="text-xs text-slate-400 mb-6">
                    Ticket ID: #{confirmDeleteReg.ticketId}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfirmDeleteReg(null)}
                      className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={executeDelete}
                      className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════
          EDIT REGISTRATION MODAL
      ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {editingReg && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
              onClick={() => !savingEdit && setEditingReg(null)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto"
              >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <Pencil className="w-5 h-5 text-blue-600" />
                    Edit Registration
                  </h3>
                  <button
                    onClick={() => setEditingReg(null)}
                    disabled={savingEdit}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                  {/* Ticket ID (readonly) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm">
                    <span className="text-slate-400 font-medium">Ticket ID: </span>
                    <span className="font-mono text-slate-700 font-semibold">
                      #{editingReg.ticketId}
                    </span>
                  </div>

                  {/* Alert Message */}
                  <AnimatePresence>
                    {editMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${
                          editMessage.type === "error"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}
                      >
                        {editMessage.type === "error" ? (
                          <X className="w-4 h-4 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                        )}
                        {editMessage.text}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 ml-1">
                      Attendee Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 ml-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 ml-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 ml-1">
                      Status
                    </label>
                    <div className="flex gap-3">
                      {["Registered", "Checked In"].map((s) => (
                        <label
                          key={s}
                          className={`flex items-center gap-2 cursor-pointer border px-4 py-3 rounded-xl flex-1 transition-colors ${
                            editStatus === s
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300"
                          }`}
                        >
                          <input
                            type="radio"
                            checked={editStatus === s}
                            onChange={() => setEditStatus(s)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="font-medium text-sm">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 pb-6">
                  <button
                    onClick={saveEdit}
                    disabled={savingEdit}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {savingEdit ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
