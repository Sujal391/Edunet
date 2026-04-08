"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus, Users, Mail, Phone, MapPin, Globe,
  Loader2, Building2, X, RefreshCw, Hash
} from "lucide-react";
import { getSchools, createSchool } from "@/lib/school";
import { CreateSchoolPayload, School } from "@/types";

const EMPTY_FORM: CreateSchoolPayload = {
  name: "", email: "", phone: "",
  address: "", city: "", state: "", country: "", pincode: "",
  is_active: true,
};

type FormFieldKey = Exclude<keyof CreateSchoolPayload, "is_active">;

export default function SuperAdminDashboard() {
  const [schools, setSchools] = useState<School[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchSchools = useCallback(async () => {
    setIsFetching(true);
    setError("");
    try {
      const data = await getSchools();
      setSchools(data);
    } catch (err: any) {
      setError(err.message || "Failed to load schools.");
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const handleChange = (field: FormFieldKey) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await createSchool(formData);
      setSuccessMsg(res.meassage || res.message || "School created successfully.");
      setFormData(EMPTY_FORM);
      setIsAdding(false);
      await fetchSchools();
    } catch (err: any) {
      setError(err.message || "Failed to create school.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields: {
    key: FormFieldKey;
    label: string;
    placeholder: string;
    type?: string;
    icon: React.ElementType;
    span?: boolean;
  }[] = [
    { key: "name",    label: "School / Organization Name", placeholder: "e.g. Sunrise Academy", icon: Building2, span: true },
    { key: "email",   label: "Email",    placeholder: "contact@example.com", type: "email", icon: Mail },
    { key: "phone",   label: "Phone",    placeholder: "+91 9000000000", icon: Phone },
    { key: "address", label: "Address",  placeholder: "123 Main Street", icon: MapPin, span: true },
    { key: "city",    label: "City",     placeholder: "Mumbai", icon: MapPin },
    { key: "state",   label: "State",    placeholder: "Maharashtra", icon: MapPin },
    { key: "country", label: "Country",  placeholder: "India", icon: Globe },
    { key: "pincode", label: "Pincode",  placeholder: "400001", icon: Hash },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Schools</h2>
          <p className="text-sm text-gray-500 mt-1">Create and view all school / trustee registrations.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchSchools}
            disabled={isFetching}
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
          <Button
            onClick={() => { setIsAdding(!isAdding); setError(""); setSuccessMsg(""); }}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white"
          >
            {isAdding
              ? <><X className="h-4 w-4 mr-2" />Cancel</>
              : <><Plus className="h-4 w-4 mr-2" />Add School</>
            }
          </Button>
        </div>
      </div>

      {/* Toast Messages */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium"
          >
            <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
            {successMsg}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium"
          >
            <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Register New School</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {fields.map(({ key, label, placeholder, type, icon: Icon, span }) => (
                <div key={key} className={`space-y-1.5 ${span ? "sm:col-span-2" : ""}`}>
                  <Label htmlFor={key} className="text-sm font-medium text-gray-700">{label}</Label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id={key}
                      type={type || "text"}
                      required
                      placeholder={placeholder}
                      value={formData[key]}
                      onChange={handleChange(key)}
                      className="pl-9 h-11 rounded-xl border-gray-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20"
                    />
                  </div>
                </div>
              ))}

              <div className="sm:col-span-2 flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 h-11 rounded-xl"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {isSubmitting ? "Creating…" : "Create School"}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schools Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4">Pincode</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isFetching ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#4F46E5] mx-auto" />
                    <p className="text-gray-400 text-sm mt-2">Loading schools…</p>
                  </td>
                </tr>
              ) : schools.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No schools found. Create one to get started.</p>
                  </td>
                </tr>
              ) : (
                schools.map((school, idx) => (
                  <motion.tr
                    key={school.id ?? idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-600">{school.code || "-"}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{school.name || "-"}</td>
                    <td className="px-6 py-4 text-gray-600">{school.email || "-"}</td>
                    <td className="px-6 py-4 text-gray-600">{school.phone || "-"}</td>
                    <td className="px-6 py-4 text-gray-600">{school.city || "-"}</td>
                    <td className="px-6 py-4 text-gray-600">{school.state || "-"}</td>
                    <td className="px-6 py-4 text-gray-600">{school.country || "-"}</td>
                    <td className="px-6 py-4 text-gray-600">{school.pincode || "-"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          school.is_active ?? true
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {school.is_active ?? true ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
