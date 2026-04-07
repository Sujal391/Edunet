"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Users, Mail, Phone, Loader2 } from "lucide-react";

// Mock Data
const initialTrustees = [
  { id: 1, name: "Global Education Trust", email: "contact@globaled.com", phone: "+91 9876543210", schools: 5, status: "Active" },
  { id: 2, name: "Sunrise Academies Foundation", email: "admin@sunrise.edu", phone: "+91 9123456789", schools: 12, status: "Active" },
];

export default function SuperAdminDashboard() {
  const [trustees, setTrustees] = useState(initialTrustees);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setTrustees([
        { id: Date.now(), ...formData, schools: 0, status: "Active" },
        ...trustees
      ]);
      setFormData({ name: "", email: "", phone: "" });
      setIsAdding(false);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Trustees</h2>
          <p className="text-sm text-gray-500 mt-1">Add and view all trustee organizations across the platform.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="bg-[#4F46E5] hover:bg-[#4338CA] text-white">
          <Plus className="h-4 w-4 mr-2" />
          {isAdding ? "Cancel Addition" : "Add Trustee"}
        </Button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Register New Trustee</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  id="name" 
                  required 
                  className="pl-9" 
                  placeholder="e.g. Acme Education Trust"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Primary Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  className="pl-9" 
                  placeholder="contact@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  id="phone" 
                  required 
                  className="pl-9" 
                  placeholder="+91 0000000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="md:col-span-3 flex justify-end">
              <Button type="submit" disabled={isLoading} className="bg-[#4F46E5] hover:bg-[#4338CA] text-white">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Trustee
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Trustees Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Organization Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Schools</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {trustees.map((trustee) => (
                <tr key={trustee.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{trustee.name}</td>
                  <td className="px-6 py-4 text-gray-600">{trustee.email}</td>
                  <td className="px-6 py-4 text-gray-600">{trustee.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{trustee.schools}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
                      {trustee.status}
                    </span>
                  </td>
                </tr>
              ))}
              {trustees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No trustees found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
