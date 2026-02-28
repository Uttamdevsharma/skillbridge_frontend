"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { TutorProfile, Category } from "@/types";
import { ArrowRight, BookOpen, Clock, Star, Users, CheckCircle, Search, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tutorsRes, categoriesRes] = await Promise.all([
          api.get("/tutors"),
          api.get("/categories"),
        ]);
        setTutors(tutorsRes.data.data.slice(0, 3));
        setCategories(categoriesRes.data.data.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch homepage data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 lg:pt-32 lg:pb-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-indigo-50 blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-8 border border-blue-100">
                <Trophy size={16} />
                <span>Top rated tutors worldwide</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tight">
                <span className="text-blue-600">Unlock Your Potential</span> with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Expert Tutors</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
                Connect with professional tutors across hundreds of subjects. Personalized learning that fits your schedule and goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/tutors"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all group"
                >
                  Browse Tutors
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                >
                  Join as Tutor
                </Link>
              </div>
              <div className="mt-12 flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-400 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium italic">Join <span className="font-black text-blue-600 dark:text-blue-400 text-lg">5,000+</span> active students</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" 
                  alt="Student learning" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl z-20 flex items-center space-x-4 border border-gray-100">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Verified Experts</p>
                  <p className="text-xs text-gray-500">Only top-tier professionals</p>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white p-6 rounded-2xl shadow-xl z-20 flex items-center space-x-4 border border-gray-100">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                  <Star fill="currentColor" size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">4.9/5 Rating</p>
                  <p className="text-xs text-gray-500">Based on 10k+ reviews</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 py-16 rounded-[3rem] shadow-sm">
        <div className="flex justify-between items-end mb-12">
          <div className="max-w-2xl px-4">
            <h2 className="text-4xl font-extrabold text-blue-600 mb-4 tracking-tight">Meet Our Best Tutors</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Hand-picked professionals with years of experience in their respective fields.</p>
          </div>
          <Link href="/tutors" className="hidden sm:flex items-center text-blue-600 font-bold hover:text-blue-700 group transition-all mr-6">
            View All Tutors
            <ArrowRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse space-y-6">
                <div className="w-full aspect-[4/3] bg-gray-100 rounded-2xl" />
                <div className="h-6 w-3/4 bg-gray-100 rounded-lg" />
                <div className="h-4 w-1/2 bg-gray-100 rounded-lg" />
                <div className="h-12 w-full bg-gray-50 rounded-xl" />
              </div>
            ))}
          </div>
        ) : tutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tutors.map((tutor) => (
              <motion.div 
                whileHover={{ y: -8 }}
                key={tutor.id} 
                className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative mb-6">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${tutor.user.name}&background=random&size=200`} 
                    alt={tutor.user.name} 
                    className="w-full aspect-[4/3] object-cover rounded-2xl"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl flex items-center shadow-sm">
                    <Star className="text-yellow-400 w-4 h-4 fill-current mr-1" />
                    <span className="text-sm font-bold text-gray-900">{tutor.averageRating || "New"}</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tutor.user.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tutor.tutorCategories.map((tc, idx) => (
                      <span key={idx} className="bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-gray-100">
                        {tc.category.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                    {tutor.bio}
                  </p>
                </div>
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Hourly Rate</span>
                    <span className="text-xl font-extrabold text-blue-600">${tutor.hourlyRate}</span>
                  </div>
                  <Link 
                    href={`/tutors/${tutor.id}`}
                    className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-md active:scale-95"
                  >
                    View Profile
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No featured tutors available at the moment.</p>
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="bg-gray-900 py-24 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full border border-white" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full border border-white" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold mb-6 tracking-tight">Explore Top Categories</h2>
            <p className="text-gray-400 text-lg">Whatever you want to learn, we have an expert for you. Choose from hundreds of professional categories.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
              ))
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <Link 
                  href={`/tutors?category=${category.id}`} 
                  key={category.id}
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-2xl text-center transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="font-bold text-sm tracking-wide">{category.name}</h3>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 italic">No categories found.</div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 py-20 rounded-[3rem] shadow-sm">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-blue-600 mb-6 tracking-tight">Simple 3-Step Process</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Your journey to mastering a new skill has never been this easy.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              step: "01",
              title: "Find Your Tutor",
              desc: "Browse through our verified experts and choose the one that fits your goals.",
              icon: Search,
              color: "bg-blue-50 text-blue-600"
            },
            {
              step: "02",
              title: "Book a Session",
              desc: "Pick a time that works for you from the tutor's available schedule slots.",
              icon: Clock,
              color: "bg-indigo-50 text-indigo-600"
            },
            {
              step: "03",
              title: "Start Learning",
              desc: "Connect with your tutor, learn your desired skill and track your progress.",
              icon: BookOpen,
              color: "bg-purple-50 text-purple-600"
            }
          ].map((item, idx) => (
            <div key={idx} className="relative group">
              {idx < 2 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-[2px] bg-gray-100 z-0 -translate-x-1/4" />
              )}
              <div className="relative z-10 bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition-all text-center">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                  <item.icon size={28} />
                </div>
                <span className="text-xs font-black text-gray-200 absolute top-8 right-8">{item.step}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-20 -mb-20 blur-3xl" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-8 leading-tight">Ready to start your learning journey?</h2>
            <p className="text-blue-100 text-xl mb-12 leading-relaxed">Join thousands of students and find the perfect tutor to help you achieve your goals.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/register"
                className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all shadow-xl shadow-blue-900/20"
              >
                Join as a Student
              </Link>
              <Link
                href="/tutors"
                className="bg-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-400 border border-blue-400 transition-all shadow-xl shadow-blue-900/10"
              >
                Explore Tutors
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
