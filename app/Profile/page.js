"use server";
import { redirect } from 'next/navigation';
import { supabase } from '../lib/Client';
//  export const revalidate =  60; // ISR: revalidate every 60 seconds

export default async function ProfilePage() {
  

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/SignUp');
  }

  const { user_metadata = {} } = user;
  const username = user_metadata.username || 'User';
  const gender = user_metadata.gender || 'Not specified';

  return (
    <div className="min-h-screen pt-[6rem] md:pl-[10rem] md:pt-[8rem] lg:pl-[20rem] lg:pt-[12rem] xl:flex xl:items-center xl:justify-center xl:pl-[6rem] xl:pt-[4rem] py-12 px-4 bg-gradient-to-br from-[#004643] to-[#foede5] dark:from-slate-900 dark:to-slate-800">
      <div className="w-[97%] max-w-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {username[0]?.toUpperCase() || 'U'}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {username}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {user.email}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Gender: {gender}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Role: {user_metadata.role || 'user'}
          </p>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          ISR Page - Revalidated: {new Date().toLocaleString()}
        </div>
        <div className="space-y-4 pt-6">
          <a
            href="/Profile/ProfilePage"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 block text-center"
          >
            Edit Profile (Client-side)
          </a>
        </div>
      </div>
    </div>
  );
}