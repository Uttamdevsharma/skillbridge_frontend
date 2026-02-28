"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { User, DollarSign, FileText, Loader2, Save, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function TutorProfilePage() {
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/tutors/profile");
        if (response.data.data) {
          setBio(response.data.data.bio || "");
          setHourlyRate(response.data.data.hourlyRate || 0);
        }
      } catch (error) {
        // Profile might not exist yet
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/tutors/profile", { bio, hourlyRate: Number(hourlyRate) });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl -z-10" />
        
        <div className="flex items-center space-x-4 mb-12">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <User size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Profile Settings</h2>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Manage your professional information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-8">
            <div>
              <label className="flex items-center text-sm font-black text-gray-700 uppercase tracking-widest mb-4">
                <DollarSign size={16} className="mr-2 text-blue-600" />
                Hourly Rate ($)
              </label>
              <div className="relative">
                 <input
                  type="number"
                  required
                  min="0"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="block w-full px-6 py-5 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm text-xl font-black"
                  placeholder="0.00"
                />
              </div>
              <p className="mt-3 text-xs text-gray-400 font-medium">Set a competitive rate based on your experience.</p>
            </div>

            <div>
              <label className="flex items-center text-sm font-black text-gray-700 uppercase tracking-widest mb-4">
                <FileText size={16} className="mr-2 text-blue-600" />
                Professional Bio
              </label>
              <textarea
                required
                rows={8}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="block w-full px-6 py-5 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm resize-none text-lg leading-relaxed italic"
                placeholder="Write a compelling bio about your teaching style and experience..."
              />
              <div className="mt-3 flex justify-between items-center">
                <p className="text-xs text-gray-400 font-medium italic">Min 50 characters recommended for better visibility.</p>
                <span className="text-xs font-bold text-blue-600">{bio.length} characters</span>
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
                  Save Changes
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
