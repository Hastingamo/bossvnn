"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Newspaper, ArrowLeftRight, Users, ArrowRight } from "lucide-react";
import Image from "next/image";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <section className="relative h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background z-10" />
          <Image
            src="/Image/Launch.jpg"
            alt="Hero Background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>

        <motion.div 
          className="relative z-10 text-center max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
            variants={fadeInUp}
          >
            Track the Future of <br />
            <span className="text-blue-500">Digital Assets</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Stay ahead in the fast-paced world of cryptocurrency. Get real-time market data, latest news, and seamless exchange insights all in one place.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
          >
            <Link href="/Product" className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group">
              Explore Market <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link href="/SignUp" className="px-8 py-4 border border-foreground/20 rounded-full font-semibold hover:bg-foreground/5 transition-all">
              Join Community
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {[
            {
              title: "Live Market",
              description: "Real-time prices and trends for thousands of cryptocurrencies.",
              icon: <TrendingUp size={32} />,
              link: "/Product",
              color: "bg-blue-500/10 text-blue-500"
            },
            {
              title: "Crypto News",
              description: "Get the latest breaking news from the world of blockchain.",
              icon: <Newspaper size={32} />,
              link: "/News",
              color: "bg-purple-500/10 text-purple-500"
            },
            {
              title: "Exchange Rates",
              description: "Monitor exchange rates across multiple platforms instantly.",
              icon: <ArrowLeftRight size={32} />,
              link: "/Exchanges",
              color: "bg-green-500/10 text-green-500"
            },
            {
              title: "Community",
              description: "Connect with other crypto traders and share insights.",
              icon: <Users size={32} />,
              link: "/Community",
              color: "bg-orange-500/10 text-orange-500"
            }
          ].map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Link href={feature.link}>
                <motion.div 
                  className="p-4 md:p-8 rounded-3xl border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-colors h-full flex flex-col group cursor-pointer"
                  whileHover={{ y: -10 }}
                >
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-foreground/60 mb-6 flex-grow">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-blue-500 font-semibold group-hover:gap-2 transition-all">
                    Learn more <ArrowRight size={16} className="ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="py-24 bg-foreground/5">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Why Choose bossVnn Crypto?</h2>
            <p className="text-lg text-foreground/70 mb-8">
              We provide the most comprehensive and accurate cryptocurrency data in the market. Our platform is designed for both beginners and professional traders.
            </p>
            <ul className="space-y-4">
              {['Lightning Fast Updates', 'Global Market Coverage', 'Community Driven Insights', 'Secure & Private'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                    <ArrowRight size={14} />
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div 
            className="relative h-[400px] rounded-3xl overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Image 
              src="/Image/why.jpg" 
              alt="Why Choose Us" 
              fill 
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
