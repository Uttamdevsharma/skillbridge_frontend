"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Users, GraduationCap, Calendar, TrendingUp, ArrowRight, Loader2, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface AdminStats {
  totalStudents: number;
  totalTutors: number;
  totalBookings: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/analytics");
        setStats(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Analytics</h3>
      <p className="text-red-700">{error}</p>
    </div>
  );

  const statCards = [
    { label: "Total Students", value: stats?.totalStudents || 0, icon: Users, color: "bg-blue-50 text-blue-600", border: "border-blue-100", link: "/dashboard/admin/users?role=STUDENT" },
    { label: "Total Tutors", value: stats?.totalTutors || 0, icon: GraduationCap, color: "bg-indigo-50 text-indigo-600", border: "border-indigo-100", link: "/dashboard/admin/users?role=TUTOR" },
    { label: "Total Bookings", value: stats?.totalBookings || 0, icon: Calendar, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100", link: "/dashboard/admin/bookings" },
  ];

  return (
    <div className="space-y-12">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className={`bg-white p-8 rounded-[2rem] border ${stat.border} shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all group`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                <stat.icon size={28} />
              </div>
              <TrendingUp size={20} className="text-gray-200 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-4xl font-black text-gray-900 tracking-tight">{stat.value}</p>
            </div>
            <Link 
              href={stat.link} 
              className="mt-8 flex items-center text-xs font-black text-blue-600 uppercase tracking-widest hover:underline group/link"
            >
              View Details
              <ArrowRight size={14} className="ml-2 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl -z-10" />
          <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-8">System Overview</h3>
          <div className="space-y-6">
             <div className="p-6 bg-gray-50 rounded-2xl flex items-center justify-between group hover:bg-white border-2 border-transparent hover:border-blue-50 transition-all">
                <div className="flex items-center space-x-4">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Users size={20}/></div>
                   <span className="font-bold text-gray-700">User Management</span>
                </div>
                <Link href="/dashboard/admin/users" className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-all"><ArrowRight size={20}/></Link>
             </div>
             <div className="p-6 bg-gray-50 rounded-2xl flex items-center justify-between group hover:bg-white border-2 border-transparent hover:border-indigo-50 transition-all">
                <div className="flex items-center space-x-4">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm"><BookOpen size={20}/></div>
                   <span className="font-bold text-gray-700">Category Management</span>
                </div>
                <Link href="/dashboard/admin/categories" className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-all"><ArrowRight size={20}/></Link>
             </div>
             <div className="p-6 bg-gray-50 rounded-2xl flex items-center justify-between group hover:bg-white border-2 border-transparent hover:border-emerald-50 transition-all">
                <div className="flex items-center space-x-4">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm"><Calendar size={20}/></div>
                   <span className="font-bold text-gray-700">Booking Monitoring</span>
                </div>
                <Link href="/dashboard/admin/bookings" className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-all"><ArrowRight size={20}/></Link>
             </div>
          </div>
        </section>

        <section className="bg-gray-900 text-white rounded-[2.5rem] p-10 flex flex-col justify-between overflow-hidden relative">
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-20 -mb-20 blur-3xl -z-0" />
           <div className="relative z-10">
              <h3 className="text-3xl font-black mb-6 tracking-tight">System Status</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between pb-4 border-b border-white/5">
                    <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Server Status</span>
                    <span className="flex items-center text-emerald-400 text-xs font-black uppercase tracking-widest">
                       <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
                       Online
                    </span>
                 </div>
                 <div className="flex items-center justify-between pb-4 border-b border-white/5">
                    <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Database</span>
                    <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Healthy</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Last Update</span>
                    <span className="text-blue-400 text-xs font-black uppercase tracking-widest">Just now</span>
                 </div>
              </div>
           </div>
           <button className="relative z-10 w-full mt-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-all">
              Run System Diagnostics
           </button>
        </section>
      </div>
    </div>
  );
}
