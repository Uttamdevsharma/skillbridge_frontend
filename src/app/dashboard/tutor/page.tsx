"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { BookOpen, CheckCircle, Users, Star, Loader2, ArrowRight, TrendingUp, Calendar, Clock, Settings } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface TutorDashboardStats {
  totalSessions: number;
  completedSessions: number;
  uniqueStudents: number;
  averageRating: number;
}

export default function TutorDashboard() {
  const [stats, setStats] = useState<TutorDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/tutors/dashboard");
        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to fetch tutor stats", error);
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

  return (
    <div className="space-y-12">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Total Sessions", value: stats?.totalSessions || 0, icon: BookOpen, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
          { label: "Completed", value: stats?.completedSessions || 0, icon: CheckCircle, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100" },
          { label: "Unique Students", value: stats?.uniqueStudents || 0, icon: Users, color: "bg-purple-50 text-purple-600", border: "border-purple-100" },
          { label: "Avg Rating", value: stats?.averageRating?.toFixed(1) || "0.0", icon: Star, color: "bg-yellow-50 text-yellow-600", border: "border-yellow-100" },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className={`bg-white p-8 rounded-[2rem] border ${stat.border} shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
                <stat.icon size={20} />
              </div>
              <TrendingUp size={16} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <section className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl -z-10" />
          <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link 
              href="/dashboard/tutor/slots"
              className="group p-8 bg-blue-50 hover:bg-blue-600 border border-blue-100 rounded-[2rem] transition-all flex flex-col items-center text-center space-y-4"
            >
              <div className="w-16 h-16 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Clock size={32} />
              </div>
              <div>
                <h4 className="font-black text-blue-900 group-hover:text-white transition-colors">Manage Slots</h4>
                <p className="text-xs text-blue-700/60 group-hover:text-blue-100 transition-colors mt-1 font-bold">Update your availability</p>
              </div>
            </Link>
            <Link 
              href="/dashboard/tutor/profile"
              className="group p-8 bg-indigo-50 hover:bg-indigo-600 border border-indigo-100 rounded-[2rem] transition-all flex flex-col items-center text-center space-y-4"
            >
              <div className="w-16 h-16 bg-white text-indigo-600 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Settings size={32} />
              </div>
              <div>
                <h4 className="font-black text-indigo-900 group-hover:text-white transition-colors">Update Profile</h4>
                <p className="text-xs text-indigo-700/60 group-hover:text-indigo-100 transition-colors mt-1 font-bold">Bio, rates and more</p>
              </div>
            </Link>
          </div>
        </section>

        <section className="bg-gray-900 text-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-500/20">
              <Calendar size={12} />
              <span>Session Overview</span>
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Need Help?</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Check out our tutor guide to learn how to maximize your earnings and provide the best experience for your students.
            </p>
          </div>
          <button className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center group">
            View Guide
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </section>
      </div>
    </div>
  );
}
