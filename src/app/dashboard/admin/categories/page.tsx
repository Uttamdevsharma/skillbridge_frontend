"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Category } from "@/types";
import { toast } from "react-hot-toast";
import { BookOpen, Plus, Pencil, Trash2, Loader2, Save, X, Search, AlertCircle, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/admin/analytics"); // categories are normally in getCategories but admin might have special view
      // Actually use general categories endpoint but with admin prefix if needed
      const catRes = await api.get("/categories");
      setCategories(catRes.data.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    setSaving(true);
    try {
      const response = await api.post("/admin/categories", { name: newCategoryName });
      setCategories([...categories, response.data.data]);
      setNewCategoryName("");
      toast.success("Category created successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editName.trim()) return;
    
    setSaving(true);
    try {
      const response = await api.patch(`/admin/categories/${id}`, { name: editName });
      setCategories(categories.map(c => c.id === id ? response.data.data : c));
      setEditingId(null);
      setEditName("");
      toast.success("Category updated!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This might affect existing tutors and bookings.")) return;
    
    setSaving(true);
    try {
      await api.delete(`/admin/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
      toast.success("Category deleted!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Add Category Form */}
        <section className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-8 relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-full -mr-24 -mt-24 blur-3xl -z-10" />
          <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-50">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                <Plus size={24} />
            </div>
            <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">New Category</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Add to platform subjects</p>
            </div>
          </div>

          <form onSubmit={handleAddCategory} className="space-y-6">
            <div>
              <label className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                 <BookOpen size={14} className="mr-2 text-blue-600" />
                 Category Name
              </label>
              <input
                type="text"
                required
                className="block w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all font-bold placeholder:text-gray-300"
                placeholder="e.g. Mathematics, Music, Arts"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={saving || !newCategoryName.trim()}
              className="w-full flex items-center justify-center py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-70 group mt-4"
            >
              {saving ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  Create Category
                  <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </section>

        {/* Categories List */}
        <section className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mb-16 blur-2xl -z-10" />
             <div className="flex-grow">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-2xl font-black text-gray-900 tracking-tight">Existing Categories</h3>
                   <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                      <CheckCircle2 size={14} />
                      <span>{categories.length} Total</span>
                   </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search subjects..."
                    className="block w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm font-bold"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar p-1">
            <AnimatePresence mode="popLayout">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={category.id}
                    className="group flex items-center justify-between p-6 bg-white border-2 border-transparent hover:border-blue-50 rounded-[2rem] transition-all shadow-xl shadow-gray-100 hover:shadow-blue-50/50"
                  >
                    {editingId === category.id ? (
                      <div className="flex-grow flex items-center space-x-4">
                        <input
                          type="text"
                          className="flex-grow px-4 py-2 bg-gray-50 border border-blue-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-50"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                        />
                        <button 
                          onClick={() => handleUpdateCategory(category.id)}
                          disabled={saving}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-90"
                        >
                           {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        </button>
                        <button 
                          onClick={() => {setEditingId(null); setEditName("");}}
                          className="p-2 bg-gray-100 text-gray-400 rounded-lg hover:bg-gray-200 transition-all active:scale-90"
                        >
                           <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                             {category.name[0]}
                          </div>
                          <span className="font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">{category.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                          <button
                            onClick={() => {setEditingId(category.id); setEditName(category.name);}}
                            className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                  <AlertCircle className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                  <p className="text-gray-400 font-black text-xl mb-2">No categories found</p>
                  <p className="text-sm text-gray-400 max-w-xs mx-auto">Try a different search term or add a new category to get started.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
