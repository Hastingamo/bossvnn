"use server";

import React from "react";
import { motion } from "framer-motion";
import community from "../Component/community.json";
import Link from "next/link";
import Image from "next/image";
import { redirect } from 'next/navigation';
// import { supabase } from '../lib/Client';
import {createClient} from "../lib/server"

const container = {
hidden: { opacity: 0 },
visible: {
opacity: 1,
transition: { staggerChildren: 0.5 }
}
};

const items = {
hidden: { opacity: 0, y: 20 },
visible: { opacity: 1, y: 0 }
};

export default async function Page(){
    const supabase = await createClient();

      const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      redirect('/SignUp');
}
return ( <div className="flex flex-col items-center min-h-screen py-10 px-4">

```
  <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
    Join Our Community
  </h1>

  <motion.div
    variants={container}
    initial="hidden"
    animate="visible"
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full"
  >
    {community.map((item) => (
      <motion.div
        key={item.name}
        variants={items}
        whileHover={{ scale: 1.03 }}
        className="flex gap-4 p-5 border rounded-xl shadow-md hover:shadow-xl transition-all bg-white dark:bg-neutral-900"
      >
        <Image
          src={item.images}
          width={100}
          height={40}
          alt={item.name}
          className="rounded-lg object-cover"
        />

        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {item.discreption}
            </p>
          </div>

          <Link
            href={item.href}
            className="mt-3 inline-block bg-sky-500 hover:bg-sky-600 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            Join
          </Link>
        </div>
      </motion.div>
    ))}
  </motion.div>
</div>

);
}


