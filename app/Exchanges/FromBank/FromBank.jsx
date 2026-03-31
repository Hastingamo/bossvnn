"use client";
import React from 'react'
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
export default function FromBank() {
  return (
 <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-background text-foreground w-full h-fit p-4"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 flex items-center gap-3">
        
        </h1>

        <div className="w-full max-w-4xl mx-auto border border-border bg-secondary/10 rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-[200px_1fr]">
          <div className="flex flex-row md:flex-col gap-2 p-4 bg-secondary/20 border-b md:border-b-0 md:border-r border-border">
           
          </div>

          <div className="p-8 relative min-h-[500px]">
            {loading && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                <Loader2 className="animate-spin text-blue-500" size={48} />
              </div>
            )}
          
            
     
          </div>
        </div>
      </div>
    </motion.div>
  )
}
