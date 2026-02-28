"use client";


import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Booking, Review } from "@/types";
import { toast } from "react-hot-toast";
import { History, Star, Loader2, ArrowRight, BookOpen, MessageSquare, X, Save, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentHistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const safeFormat = (dateStr: string | undefined, formatStr: string) => {
    try {
      if (!dateStr) return "N/A";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "Invalid Date";
      return format(date, formatStr);
    } catch (e) {
      return "Invalid Date";
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/bookings/history");
        setBookings(response.data.data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleSubmitReview = async (bookingId: string) => {
    setSaving(true);
    try {
      if (editingReviewId) {
        await api.patch(`/reviews/${editingReviewId}`, { rating, comment });
        toast.success("Review updated!");
      } else {
        await api.post("/reviews", { bookingId, rating, comment });
        toast.success("Review submitted!");
      }
      
      // Refresh history
      const response = await api.get("/bookings/history");
      setBookings(response.data.data);
      
      setReviewing(null);
      setEditingReviewId(null);
      setComment("");
      setRating(5);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success("Review deleted!");
      const response = await api.get("/bookings/history");
      setBookings(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete review");
    }
  };

  const startReview = (booking: Booking) => {
    setReviewing(booking.id);
    if (booking.review) {
      setEditingReviewId(booking.review.id);
      setRating(booking.review.rating);
      setComment(booking.review.comment);
    } else {
      setEditingReviewId(null);
      setRating(5);
      setComment("");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex items-center justify-between bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full -mr-32 -mt-32 blur-3xl -z-10" />
         <div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Learning History</h3>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Review your completed sessions</p>
         </div>
         <div className="flex items-center space-x-2 text-sm font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100 shadow-sm">
            <History size={18} className="mr-2" />
            {bookings.length} Total Sessions
         </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence mode="popLayout">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={booking.id}
                className="group p-10 bg-white rounded-[2.5rem] border-2 border-transparent hover:border-blue-100 shadow-xl shadow-gray-100 hover:shadow-2xl hover:shadow-blue-50/20 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-10">
                   <div className="flex items-start gap-8 flex-grow">
                      <div className="relative shrink-0">
                        <img
                          src={`https://ui-avatars.com/api/?name=${booking.tutor?.user?.name}&background=random&size=100`}
                          alt={booking.tutor?.user?.name}
                          className="w-20 h-20 rounded-3xl object-cover shadow-lg group-hover:rotate-2 transition-transform ring-4 ring-white"
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h4 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">{booking.tutor?.user?.name}</h4>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                            booking.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-xs font-black text-blue-500 uppercase tracking-widest flex items-center">
                          <BookOpen size={14} className="mr-2" />
                          {booking.category?.name}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 font-bold pt-2">
                           {safeFormat(booking.slot?.startTime, "MMM d, yyyy")} • {safeFormat(booking.slot?.startTime, "h:mm a")}
                        </div>
                      </div>
                   </div>

                   <div className="shrink-0 flex flex-col justify-center">
                      {booking.status === "COMPLETED" && (
                        <>
                          {booking.review ? (
                             <div className="space-y-4">
                               <div className="flex text-yellow-400">
                                  {Array(5).fill(0).map((_, i) => (
                                    <Star key={i} size={20} fill={i < (booking.review?.rating || 0) ? "currentColor" : "none"} />
                                  ))}
                               </div>
                               <p className="text-sm text-gray-500 italic max-w-xs line-clamp-2">"{booking.review.comment}"</p>
                               <div className="flex gap-4">
                                  <button onClick={() => startReview(booking)} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">Edit Review</button>
                                  <button onClick={() => handleDeleteReview(booking.review!.id)} className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:underline">Delete</button>
                               </div>
                             </div>
                          ) : (
                            <button
                              onClick={() => startReview(booking)}
                              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 flex items-center justify-center group/btn"
                            >
                              Leave a Review
                              <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          )}
                        </>
                      )}
                   </div>
                </div>

                <AnimatePresence>
                  {reviewing === booking.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-10 pt-10 border-t border-gray-50 space-y-8"
                    >
                       <div className="flex items-center justify-between">
                          <h5 className="font-black text-gray-900 tracking-tight flex items-center">
                            <MessageSquare className="w-5 h-5 mr-3 text-blue-600" />
                            {editingReviewId ? "Update your feedback" : "How was your session?"}
                          </h5>
                          <button onClick={() => setReviewing(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                             <X size={20} className="text-gray-400" />
                          </button>
                       </div>

                       <div className="space-y-6">
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Rating</label>
                            <div className="flex gap-2">
                               {[1, 2, 3, 4, 5].map((s) => (
                                 <button
                                   key={s}
                                   onClick={() => setRating(s)}
                                   className={`p-3 rounded-xl transition-all ${rating >= s ? "bg-yellow-50 text-yellow-500 scale-110" : "bg-gray-50 text-gray-300"}`}
                                 >
                                   <Star size={24} fill={rating >= s ? "currentColor" : "none"} />
                                 </button>
                               ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Comment</label>
                            <textarea
                              rows={4}
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none text-gray-700 font-medium"
                              placeholder="Share your experience with this tutor..."
                            />
                          </div>

                          <div className="flex justify-end">
                            <button
                              onClick={() => handleSubmitReview(booking.id)}
                              disabled={saving}
                              className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 active:scale-95 disabled:opacity-70 flex items-center"
                            >
                              {saving ? <Loader2 size={20} className="animate-spin" /> : (
                                <>
                                  <Save size={18} className="mr-3" />
                                  {editingReviewId ? "Update Review" : "Post Review"}
                                </>
                              )}
                            </button>
                          </div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-32 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
              <History className="w-20 h-20 text-gray-200 mx-auto mb-6" />
              <p className="text-gray-400 font-black text-xl mb-2">No session history</p>
              <p className="text-gray-400 text-sm max-w-sm mx-auto">Complete your first session to see your learning history and leave feedback for your tutors.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
