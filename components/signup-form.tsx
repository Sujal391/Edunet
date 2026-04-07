"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.4, 
      delay: i * 0.08, 
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
    },
  }),
};

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
      className="w-full"
    >
      {/* Header */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Create an account</h1>
        <p className="text-[#64748B] text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#4F46E5] hover:text-[#3730A3] transition-colors underline underline-offset-2"
          >
            Sign in instead
          </Link>
        </p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-semibold text-[#374151]">
            Full Name
          </Label>
          <div className="relative">
            <User
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                focused === "name" ? "text-[#4F46E5]" : "text-[#94A3B8]"
              }`}
            />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
              className="pl-10 h-12 rounded-xl border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#CBD5E1] shadow-sm focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all duration-200"
            />
          </div>
        </motion.div>

        {/* Email */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-semibold text-[#374151]">
            Email address
          </Label>
          <div className="relative">
            <Mail
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                focused === "email" ? "text-[#4F46E5]" : "text-[#94A3B8]"
              }`}
            />
            <Input
              id="email"
              type="email"
              placeholder="you@school.com"
              required
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              className="pl-10 h-12 rounded-xl border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#CBD5E1] shadow-sm focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all duration-200"
            />
          </div>
        </motion.div>

        {/* Password */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-semibold text-[#374151]">
            Password
          </Label>
          <div className="relative">
            <Lock
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                focused === "password" ? "text-[#4F46E5]" : "text-[#94A3B8]"
              }`}
            />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              className="pl-10 pr-11 h-12 rounded-xl border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#CBD5E1] shadow-sm focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all duration-200"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={showPassword ? "hide" : "show"}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </motion.div>

        {/* Confirm Password */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="space-y-1.5">
          <Label htmlFor="confirm-password" className="text-sm font-semibold text-[#374151]">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                focused === "confirm-password" ? "text-[#4F46E5]" : "text-[#94A3B8]"
              }`}
            />
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              onFocus={() => setFocused("confirm-password")}
              onBlur={() => setFocused(null)}
              className="pl-10 pr-11 h-12 rounded-xl border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#CBD5E1] shadow-sm focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all duration-200"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={showConfirmPassword ? "hide" : "show"}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="pt-1">
          <Button
            type="submit"
            disabled={isLoading}
            className="group relative w-full h-12 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6D28D9] text-white font-semibold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:from-[#4338CA] hover:to-[#5B21B6] active:scale-[0.98] transition-all duration-200 disabled:opacity-70"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isLoading ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  Create account
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </form>

      {/* Trust badges */}
      <motion.div
        custom={6}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-6 pt-5 border-t border-[#F1F5F9] flex items-center justify-center gap-6"
      >
        {["256-bit SSL", "GDPR Compliant", "99.9% Uptime"].map((badge) => (
          <span key={badge} className="flex items-center gap-1 text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] inline-block" />
            {badge}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
