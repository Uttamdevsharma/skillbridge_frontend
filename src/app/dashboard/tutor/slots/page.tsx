"use client";


import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { AvailabilitySlot, Category } from "@/types";
import { toast } from "react-hot-toast";
import { Clock, Plus, Trash2, Loader2, Calendar, BookOpen, Clock3, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function TutorSlotsPage() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slotsRes, categoriesRes] = await Promise.all([
          api.get("/tutors/slots"),
          api.get("/tutors/subjects"),
        ]);
        setSlots(slotsRes.data.data || []);
        setCategories((categoriesRes.data.data || []).map((item: any) => item.category));
      } catch (error) {
        console.error("Failed to fetch slots", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startTime || !endTime) {
      toast.error("Please select both start and end times");
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      toast.error("Invalid date or time selected");
      return;
    }

    if (start >= end) {
      toast.error("End time must be after start time");
      return;
    }

    setCreating(true);
    try {
      const response = await api.post("/tutors/slots", {
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        categoryId,
      });
      setSlots([...slots, response.data.data]);
      toast.success("Slot created successfully!");
      setStartTime("");
      setEndTime("");
      setCategoryId("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create slot");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm("Are you sure you want to delete this slot?")) return;
    try {
      await api.delete(`/tutors/slots/${slotId}`);
      setSlots(slots.filter((s) => s.id !== slotId));
      toast.success("Slot deleted!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete slot");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Create Slot Form */}
        <section className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-8 relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-full -mr-24 -mt-24 blur-3xl -z-10" />
          <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-50">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                <Plus size={24} />
            </div>
            <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Create Slot</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Add new availability</p>
            </div>
          </div>

          <form onSubmit={handleCreateSlot} className="space-y-6">
            <div>
              <label className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                 <BookOpen size={14} className="mr-2 text-blue-600" />
                 Category
              </label>
              <select
                required
                className="block w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all font-bold appearance-none cursor-pointer"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                   <Clock size={14} className="mr-2 text-blue-600" />
                   Start Time
                </label>
                <input
                  type="datetime-local"
                  required
                  className="block w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all font-bold cursor-pointer"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                   <Clock3 size={14} className="mr-2 text-blue-600" />
                   End Time
                </label>
                <input
                  type="datetime-local"
                  required
                  className="block w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all font-bold cursor-pointer"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="w-full flex items-center justify-center py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-70 group mt-4"
            >
              {creating ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  Create Slot
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </section>

        {/* List of Slots */}
        <section className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mb-16 blur-2xl -z-10" />
             <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Existing Slots</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Manage your schedule</p>
             </div>
             <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                <CheckCircle2 size={14} />
                <span>{slots.length} Total</span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar p-1">
            <AnimatePresence mode="popLayout">
              {slots.length > 0 ? (
                slots.map((slot) => {
                  const startDate = new Date(slot.startTime);
                  const endDate = new Date(slot.endTime);
                  const isValidStart = !isNaN(startDate.getTime());
                  const isValidEnd = !isNaN(endDate.getTime());
                  
                  return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={slot.id}
                    className={`group p-8 bg-white border-2 rounded-[2rem] transition-all relative overflow-hidden flex flex-col justify-between h-full ${
                      slot.isBooked 
                        ? "border-emerald-100 shadow-emerald-50/50 opacity-90" 
                        : "border-gray-50 hover:border-blue-100 shadow-xl shadow-gray-100 hover:shadow-blue-50/50"
                    }`}
                  >
                    {slot.isBooked && (
                      <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200 shadow-sm">
                        Booked
                      </div>
                    )}
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center">
                          <BookOpen size={14} className="mr-2" />
                          {slot.category?.name}
                        </div>
                        <h4 className="text-xl font-black text-gray-900 leading-tight">
                           {isValidStart ? format(startDate, "MMM d, yyyy") : "Invalid Date"}
                        </h4>
                      </div>

                      <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                        <div className="flex items-center text-sm font-bold text-gray-600">
                          <Clock size={16} className="mr-3 text-blue-500" />
                          {isValidStart && isValidEnd 
                            ? `${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}` 
                            : "Invalid Time"}
                        </div>
                      </div>
                    </div>

                    {!slot.isBooked && (
                      <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end">
                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="flex items-center space-x-2 text-gray-300 hover:text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all font-black text-xs uppercase tracking-widest active:scale-95 group-hover:text-red-400 group-hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                )})
              ) : (
                <div className="col-span-full text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                  <AlertCircle className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                  <p className="text-gray-400 font-bold text-lg">No slots available</p>
                  <p className="text-sm text-gray-400 max-w-xs mx-auto mt-2">Start by creating availability slots for your students to book sessions with you.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
