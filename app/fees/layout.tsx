"use client";

import React from "react";
import { LayoutDashboard } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

const sidebarLinks = [
  { title: "Dashboard", href: "/fees", icon: LayoutDashboard },
];

export default function FeesLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout roleTitle="Fees" sidebarLinks={sidebarLinks}>
      {children}
    </DashboardLayout>
  );
}
