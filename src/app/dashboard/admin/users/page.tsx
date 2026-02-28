"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { User } from "@/types";
import { toast } from "react-hot-toast";
import { Users, ShieldAlert, ShieldCheck, Loader2, Search, Filter, Mail, UserCheck, UserX, AlertCircle, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function UsersManagement() {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>(searchParams.get("role") || "");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/users");
        setUsers(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (userId: string, action: "BAN" | "UNBAN") => {
    if (!confirm(`Are you sure you want to ${action.toLowerCase()} this user?`)) return;
    
    setUpdatingId(userId);
    try {
      await api.patch(`/admin/users/${userId}`, { action });
      setUsers(users.map(u => u.id === userId ? { ...u, isBanned: action === "BAN" } : u));
      toast.success(`User ${action === "BAN" ? "banned" : "unbanned"} successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update user status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl -z-10" />
         <div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">User Management</h3>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Control platform access and user status</p>
         </div>
         <div className="flex items-center space-x-2 text-sm font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-6 py-3 rounded-full border border-blue-100 shadow-sm">
            <Users size={18} className="mr-2" />
            {filteredUsers.length} Total Users
         </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            className="block w-full pl-10 pr-10 py-4 bg-white border border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-4 flex items-center text-gray-300 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex items-center space-x-4">
           <Filter size={18} className="text-gray-400" />
           <select 
             className="bg-white border border-gray-100 rounded-2xl px-6 py-4 font-black text-xs uppercase tracking-widest text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
             value={roleFilter}
             onChange={(e) => setRoleFilter(e.target.value)}
           >
              <option value="">All Roles</option>
              <option value="STUDENT">Student</option>
              <option value="TUTOR">Tutor</option>
           </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-gray-50/50">
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">User</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Role</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  <AnimatePresence mode="popLayout">
                     {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                           <motion.tr 
                             layout
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             key={user.id} 
                             className="group hover:bg-gray-50/50 transition-all"
                           >
                              <td className="px-8 py-6">
                                 <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                       {user.name[0]}
                                    </div>
                                    <div className="space-y-1">
                                       <h4 className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">{user.name}</h4>
                                       <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                          <Mail size={12} className="mr-1.5" />
                                          {user.email}
                                       </div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                                    user.role === "TUTOR" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-blue-50 text-blue-600 border-blue-100"
                                 }`}>
                                    {user.role}
                                 </span>
                              </td>
                              <td className="px-8 py-6">
                                 {user.isBanned ? (
                                    <span className="flex items-center text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                                       <ShieldAlert size={14} className="mr-2" />
                                       Banned
                                    </span>
                                 ) : (
                                    <span className="flex items-center text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                       <ShieldCheck size={14} className="mr-2" />
                                       Active
                                    </span>
                                 )}
                              </td>
                              <td className="px-8 py-6 text-right">
                                 {user.isBanned ? (
                                    <button
                                      onClick={() => handleUpdateStatus(user.id, "UNBAN")}
                                      disabled={updatingId === user.id}
                                      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-black text-[10px] uppercase tracking-widest group/btn bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all shadow-sm"
                                    >
                                       {updatingId === user.id ? <Loader2 size={14} className="animate-spin mr-2" /> : <UserCheck size={14} className="mr-2 group-hover/btn:scale-110 transition-transform" />}
                                       Unban User
                                    </button>
                                 ) : (
                                    <button
                                      onClick={() => handleUpdateStatus(user.id, "BAN")}
                                      disabled={updatingId === user.id}
                                      className="inline-flex items-center text-red-500 hover:text-red-600 font-black text-[10px] uppercase tracking-widest group/btn bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-all shadow-sm"
                                    >
                                       {updatingId === user.id ? <Loader2 size={14} className="animate-spin mr-2" /> : <UserX size={14} className="mr-2 group-hover/btn:scale-110 transition-transform" />}
                                       Ban User
                                    </button>
                                 )}
                              </td>
                           </motion.tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan={4} className="px-8 py-32 text-center">
                              <AlertCircle className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                              <p className="text-gray-400 font-black text-xl mb-2">No users found</p>
                              <p className="text-gray-400 text-sm max-w-sm mx-auto">Try adjusting your filters or search term to find what you're looking for.</p>
                           </td>
                        </tr>
                     )}
                  </AnimatePresence>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

export default function UsersManagementPage() {
  return (
    <Suspense fallback={
       <div className="flex items-center justify-center min-h-[400px]">
         <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
       </div>
    }>
      <UsersManagement />
    </Suspense>
  );
}
