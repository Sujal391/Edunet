"use client";

import { motion } from "framer-motion";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Upload, 
  HelpCircle,
  Bell,
  Calendar,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function UserDashboard() {
  const steps = [
    { title: "Registration", status: "completed", date: "Oct 12, 2023" },
    { title: "Admission Form", status: "current", date: "In Progress" },
    { title: "Document Upload", status: "pending", date: "Pending" },
    { title: "Fee Payment", status: "pending", date: "Pending" },
    { title: "Final Approval", status: "pending", date: "Waiting" },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight mb-1">
            Welcome back, <span className="text-[#6366F1]">Future Student!</span> 👋
          </h1>
          <p className="text-[#64748B] font-medium flex items-center gap-2">
            Your Application ID: <span className="text-[#0F172A] font-semibold underline decoration-indigo-500/30 underline-offset-4">ADM-2023-8942</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-sm h-11 px-5">
            <HelpCircle className="h-4 w-4 mr-2" />
            Support
          </Button>
          <Button className="rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white shadow-lg shadow-indigo-500/25 h-11 px-6 border-0 group">
            Apply Now
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </motion.div>

      {/* Progress Tracker */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-xl shadow-slate-200/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <Sparkles className="w-32 h-32 text-indigo-600" />
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">Application Progress</h2>
            <p className="text-sm text-slate-400">Track your admission journey in real-time</p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
            Current Status: Form Filling
          </div>
        </div>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div 
                  className={`size-11 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                    step.status === "completed" 
                      ? "bg-[#10B981] text-white" 
                      : step.status === "current" 
                      ? "bg-indigo-600 text-white scale-110 ring-4 ring-indigo-50" 
                      : "bg-white border-2 border-slate-100 text-slate-300"
                  }`}
                >
                  {step.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : step.status === "current" ? (
                    <Clock className="h-5 w-5 animate-pulse" />
                  ) : (
                    <span className="text-sm font-bold">{i + 1}</span>
                  )}
                </div>
                <h3 className={`mt-4 text-sm font-bold ${step.status !== "pending" ? "text-slate-900" : "text-slate-400"}`}>
                  {step.title}
                </h3>
                <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{step.date}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Quick Actions & Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div variants={item} className="bg-[#6366F1] rounded-3xl p-6 text-white relative overflow-hidden group">
              <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="h-10 w-10 bg-white/15 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold mb-1">Admission Form</h3>
                <p className="text-indigo-100/70 text-sm mb-6">Incomplete form handles require your attention.</p>
                <Link href="/user/admission">
                  <Button variant="secondary" className="w-full bg-white text-[#6366F1] hover:bg-indigo-50 border-0 rounded-xl font-bold h-11 transition-all active:scale-95">
                    Continue Application
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div variants={item} className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="h-10 w-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-4">
                <Upload className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Required Documents</h3>
              <p className="text-slate-400 text-sm mb-6">4 documents pending for upload task.</p>
              <Link href="/user/documents">
                <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold h-11 transition-all active:scale-95">
                  Manage Documents
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div variants={item} className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Required Documents Table</h3>
              <Button variant="link" className="text-indigo-600 font-bold p-0 h-auto">View Detailed Checklist</Button>
            </div>
            <div className="space-y-4">
              {[
                { name: "Birth Certificate", status: "Missing", priority: "High" },
                { name: "Previous School Marks Card", status: "Missing", priority: "High" },
                { name: "Transfer Certificate (TC)", status: "Optional", priority: "Medium" },
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="text-sm font-semibold text-slate-700">{doc.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.priority} Priority</span>
                    <Button size="sm" variant="ghost" className="h-8 px-3 rounded-lg text-indigo-600 hover:bg-indigo-50 font-bold text-xs">Upload</Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar Announcements */}
        <div className="space-y-6">
          <motion.div variants={item} className="bg-[#1E1B4B] rounded-3xl p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Important Dates</h3>
              <Calendar className="h-5 w-5 text-slate-500" />
            </div>
            <div className="space-y-5">
              {[
                { event: "Application Deadline", date: "Nov 30, 2023", color: "text-red-400" },
                { event: "Entrance Exam Page", date: "Dec 05, 2023", color: "text-indigo-300" },
                { event: "Result Declaration", date: "Dec 20, 2023", color: "text-emerald-400" },
              ].map((ev, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{ev.event}</span>
                  <span className={`text-base font-bold ${ev.color}`}>{ev.date}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Latest Notifications</h3>
              <Bell className="h-5 w-5 text-slate-300" />
            </div>
            <div className="space-y-4">
              {[
                "Your registration has been approved by the admission office.",
                "Upcoming orientation seminar on Nov 15th at 10:00 AM.",
                "New document field: Aadhar Card is now required."
              ].map((note, i) => (
                <div key={i} className="flex gap-3 text-sm leading-relaxed">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <p className="text-slate-600 font-medium">{note}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
