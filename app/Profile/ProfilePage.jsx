"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/Client";

function Page() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ username: "", gender: "" });
  const [updateMessage, setUpdateMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: user } = await supabase.auth.getUser();
          setUserDetails(user.user);
          setEditData({
            username: user.user.user_metadata?.username || "",
            gender: user.user.user_metadata?.gender || ""
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        fetchUserDetails();
      } else if (event === 'SIGNED_OUT') {
        setUserDetails(null);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserDetails(null);
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    setUpdateMessage("");
    setError("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setUpdateMessage("");

    try {
      const { error } = await supabase.auth.updateUser({
        data: { username: editData.username, gender: editData.gender }
      });

      if (error) throw error;
      setUpdateMessage("Profile updated successfully!");
      setEditing(false);
      const { data: user } = await supabase.auth.getUser();
      setUserDetails(user.user);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[6rem] md:pl-[10rem] md:pt-[8rem] lg:pl-[20rem] lg:pt-[12rem] xl:flex xl:items-center xl:justify-center xl:pl-[6rem] xl:pt-[4rem] py-12 px-4 bg-gradient-to-br from-[#004643] to-[#foede5] dark:from-slate-900 dark:to-slate-800">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-[97%] max-w-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-2xl p-8 space-y-6"
      >
        {userDetails ? (
          <div className="m">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {userDetails.user_metadata?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {userDetails.user_metadata?.username || 'User'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {userDetails.email}
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Gender: {userDetails.user_metadata?.gender || 'Not specified'}
              </p>
            </div>

            {editing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData({...editData, username: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white/50 dark:bg-slate-700/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    value={editData.gender}
                    onChange={(e) => setEditData({...editData, gender: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white/50 dark:bg-slate-700/50"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}
                {updateMessage && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl">
                    <p className="text-sm text-green-600 dark:text-green-400">{updateMessage}</p>
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleEditToggle}
                    className="flex-1 bg-gray-200 dark:bg-slate-600 text-gray-900 dark:text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-slate-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-black dark:bg-white text-white dark:text-black py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 focus:ring-4 focus:ring-black/20 transition flex items-center justify-center"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 pt-6">
                <button
                  onClick={handleEditToggle}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition flex items-center justify-center gap-2"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-red-700 focus:ring-4 focus:ring-red-500/50 transition flex items-center justify-center gap-2"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <h1 className="text-3xl flex justify-center font-bold text-gray-900 dark:text-white mb-6">
              Welcome!
            </h1>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/50 dark:to-slate-700/50 p-8 rounded-2xl border border-blue-200 dark:border-slate-600 shadow-lg">
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-lg">
                Sign up or log in to view your profile and trading dashboard.
              </p>
              <div className="space-y-3">
                <Link
                  href="/SignUp"
                  className="block w-full bg-black dark:bg-white text-white dark:text-black py-4 px-6 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 focus:ring-4 focus:ring-black/20 transition text-center flex items-center justify-center"
                >
                  Get Started
                </Link>
                <Link
                  href="/SignUp"
                  className="block w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition text-center"
                >
                  Already have an account? Log In
                </Link>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default Page;
