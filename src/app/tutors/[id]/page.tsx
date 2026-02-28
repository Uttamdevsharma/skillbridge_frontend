"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { TutorProfile, AvailabilitySlot, Booking, Category } from "@/types";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "react-hot-toast";
import { Calendar, Clock, Star, ArrowRight, User, BookOpen, MapPin, ShieldCheck, Mail, Phone, Loader2, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function TutorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        
        const response = await api.get(`/tutors/${id}`);
        setTutor(response.data.data.tutor);
        setSlots(response.data.data.slots);
      } catch (error) {
        toast.error("Failed to load tutor details");
      } finally {
        setLoading(false);
      }
    };
    fetchTutor();
  }, [id]);

  const handleBooking = async (slotId: string) => {
    if (!user) {
      toast.error("Please login to book a session");
      router.push("/login");
      return;
    }

    if (user.role !== "STUDENT") {
      toast.error("Only students can book sessions");
      return;
    }

    setBookingLoading(slotId);
    try {
      await api.post("/bookings", { slotId });
      toast.success("Booking successful!");
      // Update slots to show it's booked
      setSlots(slots.map(s => s.id === slotId ? { ...s, isBooked: true } : s));
      setSelectedSlot(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(null);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-12">
      <div className="h-40 w-full bg-gray-100 rounded-[2.5rem]" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 h-[600px] bg-gray-50 rounded-[2rem]" />
        <div className="h-[400px] bg-gray-50 rounded-[2rem]" />
      </div>
    </div>
  );
  
  if (!tutor) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-8">
        <User size={40} />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Tutor Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">We couldn't find the tutor profile you're looking for. It might have been moved or removed.</p>
      <button 
        onClick={() => router.push("/tutors")}
        className="inline-flex items-center text-blue-600 font-bold hover:underline"
      >
        <ArrowRight size={20} className="rotate-180 mr-2" />
        Back to Tutors
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Profile Section */}
      <section className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
          <div className="relative">
            <img
              src={`https://ui-avatars.com/api/?name=${tutor.user.name}&background=random&size=200`}
              alt={tutor.user.name}
              className="w-44 h-44 rounded-3xl object-cover shadow-2xl ring-4 ring-white"
            />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-white px-4 py-1.5 rounded-full flex items-center shadow-lg border-2 border-white">
              <Star size={16} fill="currentColor" className="mr-1.5" />
              <span className="text-sm font-black tracking-tighter">{tutor.averageRating || "NEW"}</span>
            </div>
          </div>
          
          <div className="flex-grow space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">{tutor.user.name}</h1>
                <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                  {tutor.tutorCategories.map((tc, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-blue-100">
                      {tc.category.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-gray-900 text-white p-6 rounded-[2rem] flex flex-col items-center md:items-end justify-center shadow-xl shadow-gray-200">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Hourly Rate</span>
                <span className="text-3xl font-black text-blue-400">${tutor.hourlyRate}<span className="text-sm font-medium text-gray-500 ml-1">/hr</span></span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
              <div className="flex items-center space-x-3 text-gray-600 font-medium">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-sm">Verified Expert</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 font-medium">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Mail size={20} />
                </div>
                <span className="text-sm">Responsive</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 font-medium">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                  <BookOpen size={20} />
                </div>
                <span className="text-sm">{(Math.random() * 50).toFixed(0)}+ Sessions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Left Side: Bio & Info */}
        <div className="lg:col-span-2 space-y-12">
          <section className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm space-y-8">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight pb-6 border-b border-gray-50 flex items-center">
              <User className="w-6 h-6 mr-3 text-blue-600" />
              About the Tutor
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed italic">
              "{tutor.bio}"
            </p>
            <div className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100">
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-widest mb-4">Teaching Approach</h3>
              <p className="text-sm text-blue-800/70 leading-relaxed">
                Passionate about empowering students to reach their full potential. I focus on interactive learning, real-world applications, and personalized guidance tailored to each student's unique needs and goals.
              </p>
            </div>
          </section>

          {/* Student Reviews */}
          <section className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm space-y-8">
             <h2 className="text-2xl font-black text-gray-900 tracking-tight pb-6 border-b border-gray-50 flex items-center">
                <Star className="w-6 h-6 mr-3 text-yellow-500" />
                Student Reviews
              </h2>
              <div className="space-y-6">
                {tutor.reviews && tutor.reviews.length > 0 ? (
                  tutor.reviews.map((review, idx) => (
                    <div key={idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                            {(review.student?.name || "S")[0]}
                          </div>
                          <span className="font-bold text-gray-900">{review.student?.name || "Student"}</span>
                        </div>
                        <div className="flex text-yellow-400">
                          {Array(5).fill(0).map((_, j) => (
                            <Star 
                              key={j} 
                              size={14} 
                              fill={j < review.rating ? "currentColor" : "none"} 
                              className={j < review.rating ? "text-yellow-400" : "text-gray-300"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                      <p className="text-[10px] text-gray-400 mt-4 font-medium">
                        {format(new Date(review.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500 italic">No reviews yet for this tutor.</p>
                  </div>
                )}
              </div>
          </section>
        </div>

        {/* Right Side: Slots & Booking */}
        <div className="lg:sticky lg:top-24 space-y-8">
          <section className="bg-white rounded-[2.5rem] p-10 border-2 border-blue-100 shadow-xl shadow-blue-50/50">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-blue-600" />
              Available Slots
            </h2>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {slots.filter(s => !s.isBooked).length > 0 ? (
                slots.filter(s => !s.isBooked).map((slot) => (
                  <button
                    key={slot.id}
                    disabled={slot.isBooked || bookingLoading === slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`w-full text-left p-6 rounded-3xl border-2 transition-all group ${
                      selectedSlot === slot.id 
                        ? "border-blue-500 bg-blue-50 ring-4 ring-blue-100 shadow-lg" 
                        : "border-gray-50 hover:border-blue-200 hover:bg-gray-50 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm font-black text-blue-900 uppercase tracking-widest">
                          <BookOpen size={14} className="mr-2" />
                          {slot.category?.name}
                        </div>
                        <div className="flex items-center text-gray-600 font-bold">
                          <Clock size={16} className="mr-2 text-blue-600" />
                          {format(new Date(slot.startTime), "MMM d, h:mm a")}
                        </div>
                        <div className="text-xs text-gray-400 font-medium">
                          Duration: 1 hour
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedSlot === slot.id ? "border-blue-500 bg-blue-500 text-white" : "border-gray-200"
                      }`}>
                        {selectedSlot === slot.id && <CheckCircle2 size={16} />}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-bold">No available slots</p>
                  <p className="text-xs text-gray-400 mt-2 px-6">Check back later or contact the tutor for custom sessions.</p>
                </div>
              )}
            </div>

            <AnimatePresence>
              {selectedSlot && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-10 pt-10 border-t border-gray-100"
                >
                  <button
                    onClick={() => handleBooking(selectedSlot)}
                    disabled={bookingLoading !== null}
                    className="w-full flex items-center justify-center py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-70 group"
                  >
                    {bookingLoading === selectedSlot ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <>
                        Confirm Booking
                        <ArrowRight size={24} className="ml-3 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-gray-400 font-black uppercase tracking-widest mt-4">No payment required now</p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </div>
  );
}
