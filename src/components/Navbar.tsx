"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { LogOut, LayoutDashboard, Menu, X, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname?.startsWith("/dashboard")) return null;

  const toggleMenu = () => setIsOpen(!isOpen);

  const isStudent = user?.role === "STUDENT";
  const isTutor = user?.role === "TUTOR";
  const isAdmin = user?.role === "ADMIN";

  // Navigation links based on role
  // We no longer use simple navLinks for tutor discovery as it's now a highlighted button
  const navLinks: { name: string; href: string }[] = [];

  const dashboardLink = isStudent ? "/dashboard/student" : "/dashboard/tutor";

  // Show "Find Tutors" for guests or students, hide for Tutor/Admin
  const showFindTutors = !user || isStudent;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 relative">
          {/* Left: Logo & Basic Links */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3 group-hover:rotate-6 transition-transform">
                <Sparkles className="text-white" size={20} />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tighter">SkillBridge</span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-bold transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Center: Visually Focused "Find Tutors" (Guests and Students) */}
          {showFindTutors && (
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center h-full">
              <Link
                href="/tutors"
                className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-[1.25rem] text-sm font-black uppercase tracking-widest hover:scale-105 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95 group"
              >
                <Search size={18} className="group-hover:rotate-12 transition-transform" />
                <span>Find Tutors</span>
              </Link>
            </div>
          )}

          {/* Right: Auth & Dashboard */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  href={dashboardLink}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-blue-50"
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                <div className="h-6 w-px bg-gray-100" />
                <div className="flex items-center space-x-4 pl-2">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Welcome back</span>
                    <span className="text-sm text-gray-900 font-black tracking-tight leading-none">{user.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center justify-center w-10 h-10 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group"
                    title="Logout"
                  >
                    <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-bold transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-black hover:bg-blue-600 shadow-lg shadow-gray-200 transition-all duration-200 active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-3 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden overflow-hidden transition-all duration-300", isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
        <div className="px-4 pt-2 pb-8 space-y-2 bg-white border-t border-gray-50">
          {showFindTutors && (
             <Link
              href="/tutors"
              className="flex items-center justify-center space-x-3 bg-blue-600 text-white px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest mb-4"
              onClick={() => setIsOpen(false)}
            >
              <Search size={18} />
              <span>Find Tutors</span>
            </Link>
          )}
          
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-4 py-3 rounded-xl text-base font-bold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <>
              <Link
                href={dashboardLink}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-bold text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl text-base font-bold text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Link
                href="/login"
                className="flex items-center justify-center px-4 py-3 rounded-xl text-base font-bold text-gray-600 border border-gray-100 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center px-4 py-3 rounded-xl text-base font-bold bg-gray-900 text-white"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
