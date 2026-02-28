"use client";


import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Booking } from "@/types";
import { Calendar, Clock, User, CheckCircle, ArrowRight, BookOpen, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings");
        setBookings(response.data.data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const upcomingBookings = bookings.filter(b => b.status === "CONFIRMED");

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
    <div className="space-y-12">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Total Bookings", value: bookings.length, icon: BookOpen, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
          { label: "Confirmed", value: bookings.filter(b => b.status === "CONFIRMED").length, icon: Calendar, color: "bg-indigo-50 text-indigo-600", border: "border-indigo-100" },
          { label: "Completed", value: bookings.filter(b => b.status === "COMPLETED").length, icon: CheckCircle, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100" },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className={`bg-white p-8 rounded-[2rem] border ${stat.border} shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all group`}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-black text-gray-900 group-hover:scale-110 transition-transform origin-left">{stat.value}</p>
              </div>
              <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                <stat.icon size={28} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Bookings */}
      <section className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl -z-10" />
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Upcoming Sessions</h3>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Don't miss your classes</p>
          </div>
          <Link href="/dashboard/student/bookings" className="text-sm font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center group">
            View All
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="space-y-6">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.slice(0, 3).map((booking) => (
              <div key={booking.id} className="group p-8 bg-gray-50/50 hover:bg-white border-2 border-transparent hover:border-blue-100 rounded-[2rem] transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 hover:shadow-xl hover:shadow-blue-50/20">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={`https://ui-avatars.com/api/?name=${booking.tutor?.user?.name}&background=random&size=80`}
                      alt={booking.tutor?.user?.name}
                      className="w-16 h-16 rounded-2xl object-cover shadow-md group-hover:rotate-3 transition-transform"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      <Clock size={12} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">{booking.tutor?.user?.name}</h4>
                    <p className="text-xs font-black text-blue-500 uppercase tracking-widest">{booking.category?.name}</p>
                    <div className="flex items-center text-sm text-gray-500 font-bold pt-2">
                      <Calendar size={14} className="mr-2 text-gray-400" />
                      {safeFormat(booking.slot?.startTime, "MMM d, yyyy")}
                      <Clock size={14} className="ml-4 mr-2 text-gray-400" />
                      {safeFormat(booking.slot?.startTime, "h:mm a")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <Link
                      href={`/tutors/${booking.tutorProfileId}`}
                      className="bg-white text-gray-900 border border-gray-200 px-6 py-3 rounded-xl text-sm font-black hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                   >
                     Profile
                   </Link>
                   <button className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
                     Join Session
                   </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <p className="text-gray-500 font-bold text-lg">No upcoming sessions</p>
              <p className="text-sm text-gray-400 mb-10 px-6">Ready to learn something new? Browse our expert tutors and book your first session.</p>
              <Link
                href="/tutors"
                className="inline-flex items-center px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all group"
              >
                Find a Tutor
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
