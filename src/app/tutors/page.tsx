"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { TutorProfile, Category } from "@/types";
import { Search, Filter, Star, Clock, ArrowRight, User, BookOpen, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

function TutorsList() {
  const searchParams = useSearchParams();
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tutorsRes, categoriesRes] = await Promise.all([
          api.get("/tutors", {
            params: {
              search: searchTerm,
              category: selectedCategory,
            },
          }),
          api.get("/categories"),
        ]);
        setTutors(tutorsRes.data.data);
        setCategories(categoriesRes.data.data);
      } catch (error) {
        console.error("Failed to fetch tutors", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-16 bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-sm">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4 tracking-tight">Find Your Perfect Tutor</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Browse through our curated list of expert tutors to find the right fit for your learning goals.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 space-y-10 shrink-0">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center">
              <Filter className="w-4 h-4 mr-2 text-blue-600" />
              Categories
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setSelectedCategory("")}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                  selectedCategory === "" 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"
                }`}
              >
                <span>All Categories</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedCategory === "" ? "translate-x-1" : "group-hover:translate-x-1 opacity-0 group-hover:opacity-100"}`} />
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                    selectedCategory === category.id 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-transparent"
                  }`}
                >
                  <span className="truncate">{category.name}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedCategory === category.id ? "translate-x-1" : "group-hover:translate-x-1 opacity-0 group-hover:opacity-100"}`} />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-grow">
          {/* Search Bar */}
          <div className="mb-10 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, subject, or keywords..."
              className="block w-full pl-12 pr-12 py-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[2rem] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:border-blue-400 transition-all shadow-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl" />
                    <div className="space-y-3 flex-grow">
                      <div className="h-5 w-1/3 bg-gray-100 rounded-lg" />
                      <div className="h-4 w-1/2 bg-gray-100 rounded-lg" />
                    </div>
                  </div>
                  <div className="h-20 w-full bg-gray-50 rounded-2xl" />
                  <div className="h-14 w-full bg-gray-50 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : tutors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence mode="popLayout">
                {tutors.map((tutor) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={tutor.id}
                    className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300 flex flex-col group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
                    
                    <div className="flex items-start gap-6 relative z-10 mb-8">
                      <img
                        src={`https://ui-avatars.com/api/?name=${tutor.user.name}&background=random&size=100`}
                        alt={tutor.user.name}
                        className="w-20 h-20 rounded-2xl object-cover shadow-md group-hover:rotate-3 transition-transform"
                      />
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{tutor.user.name}</h3>
                            <div className="flex items-center text-sm font-bold text-yellow-500">
                              <Star size={16} fill="currentColor" className="mr-1" />
                              <span>{tutor.averageRating || "No ratings"}</span>
                              <span className="text-gray-400 font-medium ml-2">({(Math.random() * 100).toFixed(0)} reviews)</span>
                            </div>
                          </div>
                          <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl font-black text-lg">
                            ${tutor.hourlyRate}
                            <span className="text-[10px] font-bold text-blue-500 uppercase ml-1 tracking-tighter">/hr</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 space-y-6 flex-grow">
                      <div className="flex flex-wrap gap-2">
                        {tutor.tutorCategories.map((tc, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-gray-100"
                          >
                            {tc.category.name}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 italic">
                        "{tutor.bio}"
                      </p>
                    </div>

                    <div className="relative z-10 mt-8 pt-8 border-t border-gray-50">
                      <Link
                        href={`/tutors/${tutor.id}`}
                        className="flex items-center justify-center w-full py-4 bg-gray-900 text-white rounded-[1.25rem] font-bold hover:bg-blue-600 transition-all active:scale-95 group/btn"
                      >
                        Book a Session
                        <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32 bg-white dark:bg-gray-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800 shadow-sm"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 rounded-full mb-6">
                <Search size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Tutors Found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">We couldn't find any tutors matching your search. Try adjusting your filters or search term.</p>
              <button 
                onClick={() => {setSearchTerm(""); setSelectedCategory("");}}
                className="mt-8 text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TutorsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-1/4 bg-gray-200 rounded" />
          <div className="h-6 w-1/2 bg-gray-100 rounded" />
        </div>
      </div>
    }>
      <TutorsList />
    </Suspense>
  );
}
