"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import {
  Home,
  GlassWater,
  User,
  Heart,
  NewspaperIcon,
  CoinsIcon,
  Menu,
  X,
} from "lucide-react";

const SideBarss = () => {
  const menuItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Product", path: "/Product", icon: <CoinsIcon size={20} /> },
    { name: "Exchange", path: "/Exchanges", icon: <GlassWater size={20} /> },
    { name: "Profile", path: "/Profile", icon: <User size={20} /> },
    { name: "News", path: "/News", icon: <NewspaperIcon size={20} /> },
    { name: "Community", path: "/Community", icon: <Heart size={20} /> },
    { name: "Register", path: "/SignUp", icon: <GlassWater size={20} /> },
    { name: "Admin", path: "/Admin", icon: <GlassWater size={20} /> }


  ];

   const [isOpen, setIsOpen] = useState(false);
  return (

    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-5 right-5 z-50 bg-gray-900 dark:bg-gray-900 p-2 rounded-lg text-white shadow-lg"
        >
          <Menu />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-900 text-white w-64 transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Image
            src="/Image/bossvnnlogo.png"
            alt="logo"
            width={40}
            height={40}
            className="rounded-full"
          />

          <button onClick={() => setIsOpen(false)}>
            <X />
          </button>
        </div>

        {/* Menu */}
        <div className="flex flex-col mt-6 space-y-2 px-4">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.path}>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition cursor-pointer">
                {item.icon}
                <span>{item.name}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-4 text-gray-400 text-sm">
          Crypto Dashboard
        </div>
      </div>
    </>
  );
};

export default SideBarss;