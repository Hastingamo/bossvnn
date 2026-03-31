"use server";

import { redirect } from "next/navigation";
import { createClient } from "../lib/server";
import CommunityUI from "./CommunityUI";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/SignUp");
  }

  return <CommunityUI />;
}