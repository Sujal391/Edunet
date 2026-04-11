"use client";

import React from "react";
import { LayoutDashboard } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

const sidebarLinks = [
  { title: "Dashboard", href: "/clerk", icon: LayoutDashboard },
];

export default function ClerkLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout roleTitle="Clerk" sidebarLinks={sidebarLinks}>
      {children}
    </DashboardLayout>
  );
}
