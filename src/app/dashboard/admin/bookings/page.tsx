"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Booking } from "@/types";
import { Calendar, Clock, User, CheckCircle, Loader2, BookOpen, AlertCircle, Search, Filter, Mail, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingMonitoringPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/admin/bookings");
        setBookings(response.data.data);
      } catch (error) {
        console.error("Failed to fetch admin bookings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      booking.tutor?.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full -mr-32 -mt-32 blur-3xl -z-10" />
         <div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Booking Monitoring</h3>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Review all platform activities</p>
         </div>
         <div className="flex items-center space-x-2 text-sm font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100 shadow-sm">
            <Calendar size={18} className="mr-2" />
            {filteredBookings.length} Total Bookings
         </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by student or tutor name..."
            className="block w-full pl-10 pr-10 py-4 bg-white border border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4">
           <Filter size={18} className="text-gray-400" />
           <select 
             className="bg-white border border-gray-100 rounded-2xl px-6 py-4 font-black text-xs uppercase tracking-widest text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
           >
              <option value="">All Status</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
           </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-gray-50/50">
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Student</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Tutor</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Date & Time</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  <AnimatePresence mode="popLayout">
                     {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                           <motion.tr 
                             layout
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             key={booking.id} 
                             className="group hover:bg-gray-50/50 transition-all"
                           >
                              <td className="px-8 py-6">
                                 <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xs">
                                       {booking.student?.name[0]}
                                    </div>
                                    <div className="space-y-0.5">
                                       <h4 className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">{booking.student?.name}</h4>
                                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate max-w-[150px]">{booking.student?.email}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs">
                                       {booking.tutor?.user?.name[0]}
                                    </div>
                                    <div className="space-y-0.5">
                                       <h4 className="text-sm font-black text-gray-900 group-hover:text-indigo-600 transition-colors tracking-tight">{booking.tutor?.user?.name}</h4>
                                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate max-w-[150px]">{booking.tutor?.user?.email}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border bg-blue-50 text-blue-600 border-blue-100">
                                    {booking.category?.name}
                                 </span>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="space-y-1">
                                    <div className="flex items-center text-xs font-black text-gray-900 tracking-tight">
                                       <Calendar size={14} className="mr-2 text-blue-500" />
                                       {format(new Date(booking.createdAt), "MMM d, yyyy")}
                                    </div>
                                    <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                       <Clock size={14} className="mr-2 text-blue-500" />
                                       {format(new Date(booking.createdAt), "h:mm a")}
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                                    booking.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : booking.status === "CANCELLED" ? "bg-red-50 text-red-700 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"
                                 }`}>
                                    {booking.status}
                                 </span>
                              </td>
                           </motion.tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan={5} className="px-8 py-32 text-center">
                              <AlertCircle className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                              <p className="text-gray-400 font-black text-xl mb-2">No bookings found</p>
                              <p className="text-gray-400 text-sm max-w-sm mx-auto">The platform currently has no bookings matching these criteria.</p>
                           </td>
                        </tr>
                     )}
                  </AnimatePresence>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
