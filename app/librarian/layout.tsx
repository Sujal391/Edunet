"use client";

import React from "react";
import { LayoutDashboard } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

const sidebarLinks = [
  { title: "Dashboard", href: "/librarian", icon: LayoutDashboard },
];

export default function LibrarianLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout roleTitle="Librarian" sidebarLinks={sidebarLinks}>
      {children}
    </DashboardLayout>
  );
}
