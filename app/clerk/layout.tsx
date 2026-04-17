"use client";

import React from "react";
import { LayoutDashboard, LayoutGrid, BookOpen, FileText, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

const sidebarLinks = [
  { title: "Dashboard", href: "/clerk", icon: LayoutDashboard },
  { title: "Divisions", href: "/clerk/divisions", icon: LayoutGrid },
  { title: "Subjects", href: "/clerk/subjects", icon: BookOpen },
  { title: "Syllabus", href: "/clerk/syllabus", icon: FileText },
  { title: "Assign Teacher", href: "/clerk/assign-teacher", icon: Plus },
];

export default function ClerkLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout roleTitle="Clerk" sidebarLinks={sidebarLinks}>
      {children}
    </DashboardLayout>
  );
}
