"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Lock, Loader2, Save, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentPasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    
    setSaving(true);
    try {
      await api.patch("/auth/change-password", { oldPassword, newPassword });
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl -z-10" />
        
        <div className="flex items-center space-x-4 mb-12">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Security Settings</h2>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Update your account credentials</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-8">
            <div className="relative">
              <label className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                <Lock size={14} className="mr-2 text-blue-600" />
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showOld ? "text" : "password"}
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="block w-full px-6 py-5 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm font-bold tracking-widest"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute inset-y-0 right-6 flex items-center text-gray-400 hover:text-blue-600"
                >
                   {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <label className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                    <Lock size={14} className="mr-2 text-blue-600" />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full px-6 py-5 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm font-bold tracking-widest"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute inset-y-0 right-6 flex items-center text-gray-400 hover:text-blue-600"
                    >
                      {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
               </div>
               <div>
                  <label className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                    <Lock size={14} className="mr-2 text-blue-600" />
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full px-6 py-5 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm font-bold tracking-widest"
                    placeholder="••••••••"
                  />
               </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-50">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-70 group"
            >
              {saving ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  <Save size={20} className="mr-3" />
                  Update Password
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
