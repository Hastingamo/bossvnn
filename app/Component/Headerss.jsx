"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import Image from "next/image";
import SideBarss from "./SideBarss";
import ExchangeModal from "./ExchangeModal";

function Headerss() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Crypto", path: "/Product" },
    { name: "Profile", path: "/Profile" },
    { name: "Register", path: "/SignUp" },
    { name: "News", path: "/News" },
    { name: "Admin", path: "/Admin" },
    { name: "Community", path: "/Community" },
  ];

  return (
    <>
      <header className="hidden lg:flex sticky top-0 z-50 items-center justify-between px-8 py-4 bg-white/80 dark:bg-[#06142E]/90 backdrop-blur-md shadow-md dark:text-white">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Image/bossvnnlogo.png"
            alt="logo"
            width={45}
            height={45}
            className="rounded-full"
          />
          <span className="font-bold text-lg">
            BossVNN
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">

          {navLinks.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="
              text-sm
              font-medium
              hover:text-blue-500
              transition-all
              duration-300"
            >
              {item.name}
            </Link>
          ))}

         <ExchangeModal
  label="Exchange"
  items={[
    {
      label: "Exchange",
      href: "/Exchanges",
    },
    {
      label: "Exchange History",
      href: "/Exchanges/Confirm",
    },
  ]}
/>
        </nav>

        {/* Theme button */}
        <button
          onClick={() =>
            setTheme(
              theme === "dark"
                ? "light"
                : "dark"
            )
          }
          className="
          p-3
          rounded-full
          bg-gray-100
          dark:bg-gray-800
          hover:scale-110
          transition-all"
          aria-label="Toggle theme"
        >
          {mounted &&
            (theme === "dark" ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            ))}
        </button>
      </header>

      <header className="flex lg:hidden items-center justify-between px-4 py-4 bg-white dark:bg-[#06142E] shadow-md">

        <Link href="/">
          <Image
            src="/Image/bossvnnlogo.png"
            alt="logo"
            width={40}
            height={40}
            className="rounded-full"
          />
        </Link>

        <div className="flex items-center ml-[4rem] gap-3">

   

          <button
            onClick={() =>
              setTheme(
                theme === "dark"
                  ? "light"
                  : "dark"
              )
            }
            className="
            p-2
            rounded-full
            bg-green-100-100
            dark:bg-gray-800 "
            aria-label="Toggle theme"
          >
            {mounted &&
              (theme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              ))}
          </button>

          <SideBarss />
        </div>

      </header>
    </>
  );
}

export default Headerss;