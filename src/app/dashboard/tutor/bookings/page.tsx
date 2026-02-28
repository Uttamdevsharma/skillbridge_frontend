"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Booking } from "@/types";
import { toast } from "react-hot-toast";
import { Calendar, Clock, User, CheckCircle, Loader2, ArrowRight, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function TutorBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/tutors/bookings");
        setBookings(response.data.data);
      } catch (error) {
        console.error("Failed to fetch tutor bookings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleMarkComplete = async (bookingId: string) => {
    setUpdating(bookingId);
    try {
      await api.patch(`/tutors/bookings/${bookingId}/complete`);
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: "COMPLETED" } : b));
      toast.success("Booking marked as completed!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update booking");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex items-center justify-between bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl -z-10" />
         <div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Student Bookings</h3>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Manage all your sessions here</p>
         </div>
         <div className="flex items-center space-x-2 text-sm font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-6 py-3 rounded-full border border-blue-100 shadow-sm">
            <CheckCircle size={18} className="mr-2" />
            {bookings.length} Total Bookings
         </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence mode="popLayout">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={booking.id}
                className={`group p-10 rounded-[2.5rem] border-2 transition-all relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-10 hover:shadow-2xl hover:shadow-blue-50/20 ${
                  booking.status === "COMPLETED" 
                    ? "bg-emerald-50/20 border-emerald-50 shadow-sm opacity-80" 
                    : booking.status === "CANCELLED"
                    ? "bg-red-50/20 border-red-50 shadow-sm opacity-60"
                    : "bg-white border-transparent shadow-xl shadow-gray-100 hover:border-blue-100"
                }`}
              >
                <div className="flex items-start gap-8">
                  <div className="relative shrink-0">
                    <img
                      src={`https://ui-avatars.com/api/?name=${booking.student?.name}&background=random&size=100`}
                      alt={booking.student?.name}
                      className="w-20 h-20 rounded-3xl object-cover shadow-lg group-hover:rotate-2 transition-transform ring-4 ring-white"
                    />
                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg ${
                      booking.status === "COMPLETED" ? "bg-emerald-500 text-white" : booking.status === "CANCELLED" ? "bg-red-500 text-white" : "bg-blue-600 text-white"
                    }`}>
                      {booking.status === "COMPLETED" ? <CheckCircle2 size={16} /> : <Calendar size={16} />}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">{booking.student?.name}</h4>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                        booking.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : booking.status === "CANCELLED" ? "bg-red-100 text-red-700 border-red-200" : "bg-blue-100 text-blue-700 border-blue-200"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-xs font-black text-blue-500 uppercase tracking-widest flex items-center">
                      <BookOpen size={14} className="mr-2" />
                      {booking.category?.name}
                    </p>
                    <div className="flex flex-wrap items-center text-sm text-gray-500 font-bold pt-2 gap-6">
                      <div className="flex items-center bg-white/50 px-4 py-2 rounded-xl border border-gray-50">
                        <Calendar size={14} className="mr-2 text-blue-500" />
                        {format(new Date(booking.slot?.startTime || ""), "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center bg-white/50 px-4 py-2 rounded-xl border border-gray-50">
                        <Clock size={14} className="mr-2 text-blue-500" />
                        {format(new Date(booking.slot?.startTime || ""), "h:mm a")} - {format(new Date(booking.slot?.endTime || ""), "h:mm a")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                  {booking.status === "CONFIRMED" && (
                    <button
                      onClick={() => handleMarkComplete(booking.id)}
                      disabled={updating === booking.id}
                      className="w-full sm:w-auto bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95 disabled:opacity-70 flex items-center justify-center group/btn"
                    >
                      {updating === booking.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 size={18} className="mr-3" />
                          Mark Complete
                          <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  )}
                  {booking.status === "COMPLETED" && (
                    <div className="bg-emerald-50 text-emerald-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-emerald-100 shadow-sm flex items-center">
                      <CheckCircle2 size={16} className="mr-2" />
                      Session Done
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-32 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
              <Calendar className="w-20 h-20 text-gray-200 mx-auto mb-6" />
              <p className="text-gray-400 font-black text-xl mb-2">No bookings yet</p>
              <p className="text-gray-400 text-sm max-w-sm mx-auto">When students book sessions with you, they will appear here. Make sure your slots are up to date!</p>
              <Link
                href="/dashboard/tutor/slots"
                className="inline-flex items-center px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest mt-10 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all"
              >
                Create Slots
              </Link>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
