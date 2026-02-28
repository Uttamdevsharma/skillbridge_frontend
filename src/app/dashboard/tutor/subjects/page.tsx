"use client";


import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Category } from "@/types";
import { toast } from "react-hot-toast";
import { BookOpen, Plus, X, Loader2, Search, ArrowRight, BookMarked, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TutorSubjectsPage() {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, myRes] = await Promise.all([
          api.get("/categories"),
          api.get("/tutors/subjects"),
        ]);
        setAllCategories(allRes.data.data);
        setSelectedCategories((myRes.data.data || []).map((item: any) => item.category));
      } catch (error) {
        console.error("Failed to fetch subjects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddSubject = async (categoryId: string) => {
    setSaving(true);
    try {
      await api.post("/tutors/subjects", { categoryIds: [categoryId] });
      const addedCategory = allCategories.find((c) => c.id === categoryId);
      if (addedCategory) {
        setSelectedCategories([...selectedCategories, addedCategory]);
        toast.success("Subject added!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add subject");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSubject = async (categoryId: string) => {
    setSaving(true);
    try {
      await api.delete(`/tutors/subjects/${categoryId}`);
      setSelectedCategories(selectedCategories.filter((c) => c.id !== categoryId));
      toast.success("Subject removed!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove subject");
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = allCategories.filter(
    (c) => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      !selectedCategories.find((sc) => sc.id === c.id)
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Current Subjects */}
        <section className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-full -mr-24 -mt-24 blur-3xl -z-10" />
           <div className="flex items-center space-x-4 mb-10 pb-6 border-b border-gray-50">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                <BookMarked size={24} />
            </div>
            <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">My Subjects</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">What you are currently teaching</p>
            </div>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {selectedCategories.length > 0 ? (
                selectedCategories.map((category) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={category.id}
                    className="group flex items-center justify-between p-6 bg-gray-50/50 hover:bg-white border-2 border-transparent hover:border-red-100 rounded-[2rem] transition-all hover:shadow-xl hover:shadow-red-50/20"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                        <CheckCircle2 size={18} />
                      </div>
                      <span className="font-black text-gray-900 tracking-tight">{category.name}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveSubject(category.id)}
                      disabled={saving}
                      className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95 group-hover:bg-red-50 group-hover:text-red-400"
                    >
                      <X size={20} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
                  <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold">No subjects selected</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Available Categories */}
        <section className="bg-gray-900 text-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200 space-y-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl -z-10" />
          
          <div className="space-y-6">
            <h3 className="text-2xl font-black tracking-tight flex items-center">
              <Plus className="w-6 h-6 mr-3 text-blue-400" />
              Add New Subjects
            </h3>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search categories..."
                className="block w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleAddSubject(category.id)}
                  disabled={saving}
                  className="w-full flex items-center justify-between p-6 bg-white/5 hover:bg-blue-600 border border-white/5 rounded-[2rem] transition-all group active:scale-95 shadow-lg shadow-black/20"
                >
                  <span className="font-bold group-hover:scale-105 transition-transform origin-left">{category.name}</span>
                  <div className="p-2 bg-white/10 rounded-xl group-hover:bg-white group-hover:text-blue-600 transition-all">
                    <Plus size={18} />
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                <Search className="w-16 h-16 text-white/10 mx-auto mb-4" />
                <p className="text-white/30 font-bold">No categories found</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
            <div className="text-left">
               <h3 className="text-2xl font-black mb-2 tracking-tight">Need a missing category?</h3>
               <p className="text-blue-100/70 text-sm font-medium">Contact administrator to add more subjects to the platform.</p>
            </div>
            <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all shadow-xl shadow-blue-900/20 whitespace-nowrap group">
               Contact Admin
               <ArrowRight size={18} className="ml-2 inline group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
      </div>
    </div>
  );
}
