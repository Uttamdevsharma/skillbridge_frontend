"use client";


import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Review } from "@/types";
import { Star, Loader2, User, MessageSquare, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function TutorReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get("/tutors/reviews");
        setReviews(response.data.data);
      } catch (error) {
        console.error("Failed to fetch tutor reviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex items-center justify-between bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50/50 rounded-full -mr-32 -mt-32 blur-3xl -z-10" />
         <div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Student Feedback</h3>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">What your students are saying</p>
         </div>
         <div className="flex items-center space-x-2 text-sm font-black uppercase tracking-widest text-yellow-600 bg-yellow-50 px-6 py-3 rounded-full border border-yellow-100 shadow-sm">
            <Star size={18} fill="currentColor" className="mr-2" />
            {reviews.length} Total Reviews
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={review.id}
                className="group p-10 bg-white rounded-[2.5rem] border-2 border-transparent hover:border-blue-100 shadow-xl shadow-gray-100 hover:shadow-2xl hover:shadow-blue-50/20 transition-all flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-lg">
                        {review.student?.name[0]}
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 tracking-tight">{review.student?.name}</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{format(new Date(review.createdAt), "MMM d, yyyy")}</p>
                      </div>
                    </div>
                    <div className="flex text-yellow-400 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <MessageSquare size={32} className="text-gray-50 absolute -top-4 -left-4 -z-0" />
                    <p className="text-gray-600 text-lg leading-relaxed italic relative z-10 pl-2">
                      "{review.comment}"
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-32 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
              <Star className="w-20 h-20 text-gray-200 mx-auto mb-6" />
              <p className="text-gray-400 font-black text-xl mb-2">No reviews yet</p>
              <p className="text-gray-400 text-sm max-w-sm mx-auto">When students leave reviews after completing sessions, they will appear here. Provide great sessions to earn top ratings!</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
