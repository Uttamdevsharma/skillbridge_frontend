"use client";




import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Booking } from "@/types";
import { toast } from "react-hot-toast";
import { Calendar, Clock, User, XCircle, Loader2, ArrowRight, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings");
        setBookings(response.data.data);
      } catch (error) {
        console.error("Failed to fetch student bookings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancelling(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: "CANCELLED" } : b));
      toast.success("Booking cancelled successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelling(null);
    }
  };

  const activeBookings = bookings.filter(b => b.status === "CONFIRMED");

  const safeFormat = (dateStr: string | undefined, formatStr: string) => {
    try {
      if (!dateStr) return "N/A";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "Invalid Date";
      return format(date, formatStr);
    } catch (e) {
      return "Invalid Date";
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
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Active Bookings</h3>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Manage your upcoming sessions</p>
         </div>
         <div className="flex items-center space-x-2 text-sm font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-6 py-3 rounded-full border border-blue-100 shadow-sm">
            <Calendar size={18} className="mr-2" />
            {activeBookings.length} Confirmed Sessions
         </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence mode="popLayout">
          {activeBookings.length > 0 ? (
            activeBookings.map((booking) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={booking.id}
                className="group p-10 bg-white rounded-[2.5rem] border-2 border-transparent hover:border-blue-100 shadow-xl shadow-gray-100 hover:shadow-2xl hover:shadow-blue-50/20 transition-all relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-10"
              >
                <div className="flex items-start gap-8">
                  <div className="relative shrink-0">
                    <img
                      src={`https://ui-avatars.com/api/?name=${booking.tutor?.user?.name}&background=random&size=100`}
                      alt={booking.tutor?.user?.name}
                      className="w-20 h-20 rounded-3xl object-cover shadow-lg group-hover:rotate-2 transition-transform ring-4 ring-white"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                      <Clock size={16} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">{booking.tutor?.user?.name}</h4>
                    <p className="text-xs font-black text-blue-500 uppercase tracking-widest flex items-center">
                      <BookOpen size={14} className="mr-2" />
                      {booking.category?.name}
                    </p>
                    <div className="flex flex-wrap items-center text-sm text-gray-500 font-bold pt-2 gap-6">
                      <div className="flex items-center bg-gray-50/50 px-4 py-2 rounded-xl border border-gray-100">
                        <Calendar size={14} className="mr-2 text-blue-500" />
                        {safeFormat(booking.slot?.startTime, "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center bg-gray-50/50 px-4 py-2 rounded-xl border border-gray-100">
                        <Clock size={14} className="mr-2 text-blue-500" />
                        {safeFormat(booking.slot?.startTime, "h:mm a")} - {safeFormat(booking.slot?.endTime, "h:mm a")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                   <button
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancelling === booking.id}
                      className="w-full sm:w-auto text-gray-400 hover:text-red-500 hover:bg-red-50 px-8 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest active:scale-95 group-hover:text-red-400"
                   >
                     {cancelling === booking.id ? <Loader2 size={18} className="animate-spin" /> : "Cancel Session"}
                   </button>
                   <button className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 flex items-center justify-center group/btn">
                     Join Session
                     <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                   </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-32 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
              <Calendar className="w-20 h-20 text-gray-200 mx-auto mb-6" />
              <p className="text-gray-400 font-black text-xl mb-2">No active sessions</p>
              <p className="text-gray-400 text-sm max-w-sm mx-auto">You don't have any upcoming classes. Ready to learn something new? Browse our experts.</p>
              <Link
                href="/tutors"
                className="inline-flex items-center px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest mt-10 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all group"
              >
                Find a Tutor
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
