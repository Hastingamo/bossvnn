"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

function ExchangeModal({ label, items }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <button className="flex items-center gap-1 text-sm font-medium hover:text-blue-500">
        {label}
        <ChevronDown size={16} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
          absolute
          top-full
          left-0
          mt-2
          w-52
          rounded-xl
          bg-white
          dark:bg-[#06142E]
          shadow-xl
          border
          dark:border-gray-700
          z-[100]
          overflow-hidden"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
              block
              px-4
              py-3
              hover:bg-gray-100
              dark:hover:bg-gray-800
              transition"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExchangeModal;