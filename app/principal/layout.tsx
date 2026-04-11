"use client";
import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FileText, LayoutDashboard } from "lucide-react";

const sidebarLinks = [
  { title: "Dashboard", href: "/principal", icon: LayoutDashboard },
  { title: "Admission Form", href: "/principal/admission-form", icon: FileText },
];

export default function PrincipalLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout roleTitle="Principal" sidebarLinks={sidebarLinks}>
      {children}
    </DashboardLayout>
  );
}
