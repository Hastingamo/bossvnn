"use server";
import { redirect } from "next/navigation";
import { createClient } from "../lib/server";
import Link from "next/link";
import AdminDashboardClient from "../Component/AdminDashboardClient";

// Separate client component for animations
// Save this as AdminDashboardClient.jsx in the same folder

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/SignUp");
  }

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role, username")
    .eq("id", user.id)
    .single();

  if (!adminProfile || adminProfile.role !== "admin") {
    return <AdminDashboardClient accessDenied />;
  }

  const initials = user.email
    ? user.email.slice(0, 2).toUpperCase()
    : "AD";

  return <AdminDashboardClient user={user} initials={initials} />;
}