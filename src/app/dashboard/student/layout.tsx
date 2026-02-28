"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { LayoutDashboard, Calendar, History, Lock, User, Menu, X, ChevronRight, LogOut, ArrowLeft, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
  { name: "My Bookings", href: "/dashboard/student/bookings", icon: Calendar },
  { name: "History", href: "/dashboard/student/history", icon: History },
  { name: "Change Password", href: "/dashboard/student/password", icon: Lock },
];

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return null;
  if (!user || user.role !== "STUDENT") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-12 bg-white rounded-[3rem] shadow-2xl border border-gray-100 text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <X size={40} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Access Denied</h2>
          <p className="text-gray-500 mb-10 leading-relaxed">Only students can access this dashboard. If you're a tutor, please head to the tutor dashboard.</p>
          <Link href="/login" className="inline-flex items-center text-blue-600 font-bold hover:underline">
            <ArrowLeft size={20} className="mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Dashboard Top Bar (Minimal) */}
      <div className="flex items-center justify-between bg-white px-4 sm:px-8 py-4 border-b border-gray-100 sticky top-0 z-[60] shadow-sm md:hidden">
        <div className="flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-50 rounded-xl transition-all border border-gray-100 mr-4"
          >
            <Menu size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Mobile Center: Find Tutors */}
        <div className="flex-grow flex justify-center">
          <Link
            href="/tutors"
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            <Search size={14} />
            <span>Find Tutors</span>
          </Link>
        </div>

        {/* Right Side: Avatar & Logout */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-sm border-2 border-white shadow-sm shrink-0">
            {user.name[0]}
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Desktop Top Bar (Minimal placeholder for consistency if needed, or just let sidebar handle it) */}
      {/* We'll skip a desktop top bar for now as per requirement 2: "Sidebar... Top Navbar (minimal)... Main content" */}
      {/* Let's add a minimal desktop top navbar */}
      <div className="hidden md:flex fixed top-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 items-center justify-end px-10 transition-all duration-300" style={{ left: isSidebarOpen ? '280px' : '80px' }}>
         <div className="flex items-center space-x-6">
            <Link
              href="/tutors"
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 font-bold text-sm transition-colors mr-4"
            >
              <Search size={18} />
              <span>Find Tutors</span>
            </Link>
            <div className="h-6 w-px bg-gray-100" />
            <div className="flex items-center space-x-4">
               <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Student</span>
                  <span className="text-sm text-gray-900 font-black tracking-tight leading-none">{user.name}</span>
               </div>
               <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-blue-200">
                  {user.name[0]}
               </div>
            </div>
         </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 280 : (typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 80),
          x: (typeof window !== 'undefined' && window.innerWidth < 768 && !isSidebarOpen) ? -280 : 0
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed md:sticky left-0 top-0 h-screen bg-white border-r border-gray-100 shadow-xl shadow-slate-200/20 z-[80] flex flex-col overflow-hidden`}
      >
        <div className="p-6 border-b border-gray-50 flex items-center justify-between shrink-0">
          <Link href="/" className={`font-black text-2xl text-blue-600 tracking-tighter whitespace-nowrap ${(typeof window !== 'undefined' && window.innerWidth >= 768 && !isSidebarOpen) ? "opacity-0 invisible" : "opacity-100 visible"}`}>
            SkillBridge
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100"
          >
            {isSidebarOpen ? <X size={20} className="text-gray-400" /> : <Menu size={20} className="text-gray-400" />}
          </button>
        </div>

        <div className="p-4 flex flex-col space-y-2 flex-grow overflow-y-auto mt-4 custom-scrollbar">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const showText = isSidebarOpen;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => {
                   if(typeof window !== 'undefined' && window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all group shrink-0 ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                <link.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={`shrink-0 ${isActive ? "text-white" : "text-gray-400 group-hover:text-blue-500"}`} />
                <AnimatePresence>
                  {showText && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-bold text-sm tracking-wide flex-grow whitespace-nowrap"
                    >
                      {link.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {showText && isActive && <ChevronRight size={16} className="text-blue-200 shrink-0" />}
              </Link>
            );
          })}
        </div>

        <div className="p-6 border-t border-gray-50 bg-gray-50/50 shrink-0">
          <button
            onClick={logout}
            className="flex items-center space-x-4 w-full p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all group overflow-hidden"
          >
            <LogOut size={22} strokeWidth={2.5} className="shrink-0" />
            {isSidebarOpen && <span className="font-black text-sm uppercase tracking-widest whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-grow min-w-0 overflow-x-hidden md:pt-20">
        <div className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-6 lg:space-y-10">
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm gap-6">
            <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:w-auto">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl shadow-lg shadow-blue-200 shrink-0">
                {user.name[0]}
              </div>
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight truncate">Student Dashboard</h2>
                <p className="text-[10px] sm:text-sm text-gray-400 font-bold tracking-widest uppercase truncate">Welcome, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 text-[10px] font-black uppercase tracking-widest text-gray-400 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
               <span className="bg-blue-50 text-blue-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-blue-100 whitespace-nowrap">Student Account</span>
               <span className="bg-gray-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-gray-100 whitespace-nowrap">Status: Active</span>
            </div>
          </div>
          <div className="min-h-[calc(100vh-200px)] overflow-x-hidden">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
