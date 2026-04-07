"use client";

import { motion } from "framer-motion";

export default function LibrarianDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md space-y-4"
      >
        <div className="bg-[#4F46E5]/10 text-[#4F46E5] h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#4F46E5]/20">
          <span className="text-2xl font-bold">📚</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome, Librarian!</h2>
        <p className="text-gray-500 text-lg leading-relaxed">
          Your dashboard layout is ready. Soon you'll be able to manage book inventories, issues, returns, and library members here.
        </p>
      </motion.div>
    </div>
  );
}
