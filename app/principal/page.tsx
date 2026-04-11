"use client";

import { Users, GraduationCap, FileText, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

export default function PrincipalDashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Principal Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Overview of school activities and administration.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Students", value: "1,248", icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Teaching Staff", value: "84", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Active Forms", value: "3", icon: ClipboardList, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "New Applications", value: "156", icon: FileText, color: "text-violet-600", bg: "bg-violet-50" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex items-center gap-4"
            >
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 leading-tight">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-8 sm:p-12 text-center shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Welcome back, Principal!</h3>
        <p className="mt-2 text-gray-500 max-w-lg mx-auto">
          Use the side navigation to manage admission forms, view student records, and oversee staff activities. This dashboard will be populated with more metrics soon.
        </p>
      </div>
    </div>
  );
}
