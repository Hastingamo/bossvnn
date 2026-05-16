"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/Client";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/");
      } else {
        setSessionReady(true);
      }
    };
    checkSession();
  }, [router]);

  const handleUpdate = async () => {
    setMessage("");

    if (!password || !confirmPassword) {
      setMessage("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully! You can now log in.");
      setPassword("");
      setConfirmPassword("");
    }

    setLoading(false);
  };

  if (!sessionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Verifying access...
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900">
            <Lock size={28} className="text-blue-600 dark:text-blue-300" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
            Reset Password
          </h1>

          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center">
            Enter your new password below
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full p-3 rounded-xl
              border border-gray-300
              dark:border-gray-700
              bg-white dark:bg-gray-800
              text-gray-800 dark:text-white
              outline-none
              focus:ring-2 focus:ring-blue-500
            "
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="
              w-full p-3 rounded-xl
              border border-gray-300
              dark:border-gray-700
              bg-white dark:bg-gray-800
              text-gray-800 dark:text-white
              outline-none
              focus:ring-2 focus:ring-blue-500
            "
          />

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="
              w-full py-3 rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white font-medium
              transition
              disabled:opacity-50
            "
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          {message && (
            <p
              className={`text-sm text-center ${
                message.includes("success") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
