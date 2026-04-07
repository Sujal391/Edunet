"use client";
import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Users, LayoutDashboard } from "lucide-react";

const sidebarLinks = [
  { title: "Dashboard", href: "/superadmin", icon: LayoutDashboard },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout roleTitle="Super Admin" sidebarLinks={sidebarLinks}>
      {children}
    </DashboardLayout>
  );
}
