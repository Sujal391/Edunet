"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Users, Mail, Phone, Loader2, Filter } from "lucide-react";

// Mock Data
const initialStaff = [
  { id: 1, name: "Dr. Richard Hendricks", email: "richard@school.edu", phone: "+91 9000000001", role: "Principal", school: "Sunrise Academy" },
  { id: 2, name: "Dinesh Chugtai", email: "dinesh@school.edu", phone: "+91 9000000002", role: "Teacher", school: "Sunrise Academy" },
  { id: 3, name: "Jared Dunn", email: "jared@school.edu", phone: "+91 9000000003", role: "Admin", school: "Global Edu Trust" },
];

const ROLES = ["Principal", "Teacher", "Admin", "Support"];

export default function TrusteeDashboard() {
  const [staffList, setStaffList] = useState(initialStaff);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterRole, setFilterRole] = useState("All");

  // Form State
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", role: "Principal" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setStaffList([
        { id: Date.now(), ...formData, school: "Unassigned" },
        ...staffList
      ]);
      setFormData({ name: "", email: "", phone: "", role: "Principal" });
      setIsAdding(false);
      setIsLoading(false);
    }, 1000);
  };

  const filteredStaff = staffList.filter((staff) => filterRole === "All" || staff.role === filterRole);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Staff</h2>
          <p className="text-sm text-gray-500 mt-1">Register all staff members and assign their roles centrally.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="bg-[#4F46E5] hover:bg-[#4338CA] text-white">
          <Plus className="h-4 w-4 mr-2" />
          {isAdding ? "Cancel Registration" : "Register Staff"}
        </Button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Registration Form</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  id="name" 
                  required 
                  className="pl-9" 
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  className="pl-9" 
                  placeholder="staff@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone No</Label>
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
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select 
                id="role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="lg:col-span-4 flex justify-end pt-2 border-t border-gray-100">
              <Button type="submit" disabled={isLoading} className="bg-[#4F46E5] hover:bg-[#4338CA] text-white">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Register Member
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Staff Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <Filter className="h-4 w-4" /> Filter by Role:
          </div>
          <select 
            className="h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="All">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">School</th>
                <th className="px-6 py-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{staff.name}</td>
                  <td className="px-6 py-4 text-gray-600">{staff.email}</td>
                  <td className="px-6 py-4 text-gray-600">{staff.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{staff.school}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                      ${staff.role === 'Principal' ? 'bg-purple-100 text-purple-800' : ''}
                      ${staff.role === 'Teacher' ? 'bg-blue-100 text-blue-800' : ''}
                      ${staff.role === 'Admin' ? 'bg-amber-100 text-amber-800' : ''}
                      ${staff.role === 'Support' ? 'bg-emerald-100 text-emerald-800' : ''}
                    `}>
                      {staff.role}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No staff found for the selected role filter.
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
