"use client";

import { GraduationCap, CheckCircle2, Shield, Users, BarChart2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const features = [
  { icon: Shield, text: "Role-based access for all stakeholders" },
  { icon: Users, text: "50,000+ students managed across 500+ schools" },
  { icon: BarChart2, text: "Real-time analytics & automated reports" },
  { icon: CheckCircle2, text: "99.9% uptime with enterprise-grade security" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="grid min-h-svh lg:grid-cols-2">

      {/* ── LEFT: Branding panel ── */}
      <div className="relative hidden lg:flex flex-col justify-center gap-12 overflow-hidden bg-gradient-to-br from-[#312E81] via-[#4F46E5] to-[#6D28D9] p-12">

        {/* Animated blob background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/5 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#34D399]/10 blur-3xl animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          {/* Grid dots */}
          <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm shadow-lg group-hover:bg-white/25 transition-all">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Edu<span className="text-[#34D399]">Manage</span>
            </span>
          </Link>
        </motion.div>

        {/* Centre content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative z-10 flex flex-col gap-8"
        >
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Welcome to EduManage!
            </h2>
            <p className="text-white/70 text-lg leading-relaxed max-w-sm">
              Manage your school seamlessly with our cutting-edge unified platform.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-4">
            {features.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <f.icon className="h-4 w-4 text-[#34D399]" />
                </div>
                <span className="text-sm text-white/80">{f.text}</span>
              </motion.li>
            ))}
          </ul>

          {/* Stats row */}
          <div className="flex gap-8 pt-2 border-t border-white/10">
            {[
              { value: "500+", label: "Schools" },
              { value: "50K+", label: "Students" },
              { value: "4.9★", label: "Rating" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
              >
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/50 uppercase tracking-wider">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── RIGHT: Auth forms ── */}
      <div className="flex flex-col bg-[#F8FAFC]">
        {/* Mobile logo */}
        <div className="flex justify-center p-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#3730A3] text-white">
              <GraduationCap className="size-4" />
            </div>
            <span className="text-lg font-bold text-[#0F172A]">
              Edu<span className="text-[#4F46E5]">Manage</span>
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-md relative overflow-hidden">
            {/* AnimatePresence for smooth route transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <p className="pb-6 text-center text-xs text-[#94A3B8]">
          © {new Date().getFullYear()} EduManage · School Management Platform
        </p>
      </div>

    </div>
  );
}
