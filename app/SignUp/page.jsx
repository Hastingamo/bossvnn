"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/Client";
import { useRouter } from "next/navigation";

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [isSignup, setIsSignup] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError("");
    setMessage("");
    setEmail("");
    setPassword("");
    setUserName("");
    setConfirmPassword("");
    setGender("");
    setAdminKey("");
    setLoading(false);
  };

  const isStrongPassword = (pw) =>
    pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\d/.test(pw);

     const forgetPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://bossvnn.vercel.app/SignUp/ResetPassword',
    });

    if (error) setMessage(error.message);
    else setMessage('Check your email for the reset link!');
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      if (!password || password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      if (isSignup) {
        if (!userName) {
          setError("Username is required");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        if (!isStrongPassword(password)) {
          setError(
            "Password must be 8+ chars, with uppercase, lowercase, and number",
          );
          setLoading(false);
          return;
        }
        if (!gender) {
          setError("Please select gender");
          setLoading(false);
          return;
        }
        const validateAdminKey = async (key) => {
          const { data, error } = await supabase.rpc("validate_admin_key", {
            input_key: key,
          });
          if (error) return false;
          return data === true;
        };

        if (role === "admin") {
          if (!adminKey) {
            setError("Admin key is required");
            setLoading(false);
            return;
          }
          const isValidKey = await validateAdminKey(adminKey);
          if (!isValidKey) {
            setError("Invalid admin key");
            setLoading(false);
            return;
          }
        }
  

        const { error: signUpError } = await supabase.auth.signUp({
          email: email.toLowerCase(),
          password,
          options: {
            emailRedirectTo: "http://bossvnn.vercel.app/Auth/Callback",
            data: {
              username: userName,
              gender,
              role,
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        setMessage(
          "Signup successful! Check your email to confirm your account.",
        );
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password,
        });

        if (loginError) {
          console.log("Login error:", loginError);
        } else {
          setMessage("Login successful! Redirecting...");
          setTimeout(() => {
            router.refresh();
            router.push("/Profile");
          }, 2000);
        }
      }

      setLoading(false);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.log("Unexpected error:", err);
      setLoading(false);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3e6] to-[#381932] dark:from-[#1a0f18] dark:to-[#0a0509] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <motion.div
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        className="w-full max-w-md bg-[#fff3e6] dark:bg-[#1a0f18] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-8 space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isSignup ? "Sign up to get started" : "Sign in to your account"}
          </p>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
          <button
            type="button"
            className={`flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all ${
              isSignup
                ? "bg-gradient-to-br from-[#fff3e6] to-[#381932] dark:from-[#381932] dark:to-[#1a0f18] text-white"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setIsSignup(true)}
          >
            Sign Up
          </button>
          <button
            type="button"
            className={`flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all ${
              !isSignup
                ? "bg-gradient-to-br from-[#fff3e6] to-[#381932] dark:from-[#381932] dark:to-[#1a0f18] text-white"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setIsSignup(false)}
          >
            Log In
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Username *
              </label>
              <input
                id="username"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password *
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            {password && (
              <p
                className={`text-xs mt-1 ${isStrongPassword(password) ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}`}
              >
                {isStrongPassword(password)
                  ? "✅ Strong password"
                  : "Password should be 8+ chars with upper, lower, number"}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={forgetPassword}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
          >
            forget password
          </button>


          {isSignup && (
            <>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Gender *
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 transition"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Role *
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 transition"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {role === "admin" && (
                <div>
                  <label
                    htmlFor="adminKey"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Admin Key *
                  </label>
                  <input
                    id="adminKey"
                    type="password"
                    placeholder="Enter secret admin key"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
              )}
            </>
          )}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          {message && (
            <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl">
              <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    opacity=".25"
                  />
                  <path
                    fill="currentColor"
                    opacity=".75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>{isSignup ? "Create Account" : "Sign In"}</span>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline"
            >
              {isSignup
                ? "Already have an account? Log in"
                : "Need an account? Sign up"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Page;
