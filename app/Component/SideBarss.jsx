"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  NewspaperIcon,
  CoinsIcon,
  Menu,
  X,
} from "lucide-react";

import ExchangeModal from "./ExchangeModal";

const menuItems = [
  {
    name: "Home",
    path: "/",
    icon: <Home size={20} />,
  },
  {
    name: "Product",
    path: "/Product",
    icon: <CoinsIcon size={20} />,
  },
  {
    name: "Exchange",
    icon: (
      <Image
        src="/Image/two-arrows.png"
        alt="exchange"
        width={20}
        height={20}
      />
    ),
    subItems: [
      { label: "Exchange", href: "/Exchanges" },
      { label: "Exchange History", href: "/Exchanges/Confirm" },
    ],
  },
  {
    name: "Profile",
    path: "/Profile",
    icon: <User size={20} />,
  },
  {
    name: "News",
    path: "/News",
    icon: <NewspaperIcon size={20} />,
  },
  {
    name: "Community",
    path: "/Community",
    icon: (
      <Image
        src="/Image/communities.png"
        alt="community"
        width={20}
        height={20}
      />
    ),
  },
  {
    name: "Register",
    path: "/SignUp",
    icon: (
      <Image
        src="/Image/edit.png"
        alt="register"
        width={20}
        height={20}
      />
    ),
  },
  {
    name: "Admin",
    path: "/Admin",
    icon: (
      <Image
        src="/Image/administrator.png"
        alt="admin"
        width={20}
        height={20}
      />
    ),
  },
];

function SideBarss() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-5 right-5 z-50 p-3 rounded-xl bg-gray-900 text-white shadow-lg"
        >
          <Menu size={24} />
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white z-40 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <Image
            src="/Image/bossvnnlogo.png"
            alt="logo"
            width={42}
            height={42}
            className="rounded-full"
          />

          <button onClick={() => setIsOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="mt-6 px-4 flex flex-col gap-2">
          {menuItems.map((item) => {
            // Render dropdown item
            if (item.subItems) {
              return (
                <ExchangeModal
                  key={item.name}
                  label={item.name}
                  icon={item.icon}
                  items={item.subItems}
                />
              );
            }

            const active = pathname === item.path;

            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl transition
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-800 text-gray-300"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 w-full px-5">
          <div className="border-t border-gray-700 pt-4 text-sm text-gray-400">
            © 2026 Crypto Dashboard
          </div>
        </div>
      </aside>
    </>
  );
}

export default SideBarss;