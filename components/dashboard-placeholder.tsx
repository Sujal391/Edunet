"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardPlaceholderProps {
  badge: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function DashboardPlaceholder({
  badge,
  title,
  description,
  icon,
}: DashboardPlaceholderProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-3xl"
      >
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-white via-white to-[#eef2ff] py-0 shadow-xl ring-1 ring-[#4F46E5]/10">
          <CardContent className="relative px-8 py-10 text-center sm:px-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(79,70,229,0.12),transparent_30%)]" />
            <div className="relative space-y-6">
              <Badge className="rounded-full border-0 bg-[#eef2ff] px-4 py-1.5 text-[#4F46E5]">
                {badge}
              </Badge>
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#4F46E5] to-[#34D399] text-white shadow-lg"
              >
                {icon}
              </motion.div>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
                <p className="mx-auto max-w-xl text-base leading-7 text-slate-500">{description}</p>
              </div>
              <div className="flex items-center justify-center">
                <Button
                  variant="outline"
                  className="rounded-full border-[#34D399]/30 bg-white/80 px-5 text-[#4F46E5] hover:bg-[#eef2ff]"
                >
                  Explore modules
                  <ArrowRight className="ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
