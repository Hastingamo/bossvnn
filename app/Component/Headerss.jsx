"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import Image from "next/image";
import SideBarss from "./SideBarss";

function Headerss() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const mounthed = () => {
    setMounted(true);
  };

  useEffect(() => {
    mounthed();
    setMounted(true);
  }, []);

  return (
    <>
      <div className="hidden text-white lg:flex lg:gap-10 lg:flex-row lg:p-4 bg-[#06142E]">
        <Link href="/">
          <Image src="/Image/bossvnnlogo.png" alt="logo" width={40} height={40} className="w-10 h-10 rounded-full" />
        </Link>
        <Link href="/Product">
          <h1>Crypto page</h1>
        </Link>
        <Link href="/Profile">
          <h1>Profile</h1>
        </Link>
        <Link href="/SignUp">
          <h1>Register Up</h1>
        </Link>
        <Link href="/News">
          <h1>News</h1>
        </Link>
        <Link href="/admin">
        <h1>Admin</h1>
        </Link>

            <Link href="/Exchanges">
          <h1>Exchange rate page</h1>
        </Link>
        <Link href="/Community">
          <h1>Community page</h1>
        </Link>
        

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="ml-auto p-2 rounded-lg bg-secondary hover:opacity-80 transition-all"
          aria-label="Toggle theme"
        >
          {mounted &&
            (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
        </button>
      </div>

      <div className="grid p-4 grid-cols-4 lg:hidden">
          <Image src="/Image/bossvnnlogo.png" alt="logo" width={40} height={40} className="w-10 h-10 rounded-full" />
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="ml-auto p-2 rounded-lg bg-secondary hover:opacity-80 transition-all"
          aria-label="Toggle theme"
        >
          {mounted &&
            (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
        </button>
        <Link href="/Login">
          <h1>login</h1>
        </Link>
       <SideBarss/>
      </div>
    </>
  );
}

export default Headerss;
