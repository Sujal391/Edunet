"use client";

import React from "react";
import { LayoutDashboard } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

const sidebarLinks = [
  { title: "Dashboard", href: "/inventory", icon: LayoutDashboard },
];

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout roleTitle="Inventory" sidebarLinks={sidebarLinks}>
      {children}
    </DashboardLayout>
  );
}
