"use client"

import { useEffect, useState } from "react"
import {
  School,
  Search,
  Check,
  Plus,
  Loader2,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Trash2
} from "lucide-react"
import { toast } from "sonner"

import { getSchoolClasses, saveSchoolClasses, deleteSchoolClass, type SchoolClass } from "@/lib/forms"
import { SCHOOL_CLASS_OPTIONS } from "@/lib/form-builder-config"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ClassesPage() {
  const [existingClasses, setExistingClasses] = useState<SchoolClass[]>([])
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<SchoolClass | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchClasses = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getSchoolClasses()
      const sorted = data.sort((a, b) => {
        const indexA = SCHOOL_CLASS_OPTIONS.findIndex(opt => opt.value === a.school_class)
        const indexB = SCHOOL_CLASS_OPTIONS.findIndex(opt => opt.value === b.school_class)
        return indexA - indexB
      })
      setExistingClasses(sorted)
      // Pre-select classes that exist in our predefined list (backend returns values)
      const values = data.map(c => c.school_class)
      const validValues = SCHOOL_CLASS_OPTIONS.map(o => o.value)
      setSelectedClasses(values.filter(val => validValues.includes(val)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch classes")
      toast.error("Could not load existing classes")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  const filteredOptions = SCHOOL_CLASS_OPTIONS.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleClass = (classValue: string) => {
    setSelectedClasses(current =>
      current.includes(classValue)
        ? current.filter(c => c !== classValue)
        : [...current, classValue]
    )
  }

  const handleSave = async () => {
    if (selectedClasses.length === 0) {
      toast.error("Please select at least one class")
      return
    }

    setIsSaving(true)
    try {
      // Filter out classes that are already active (backend only wants new ones)
      const activeValues = existingClasses.map(c => c.school_class)
      const newOnly = selectedClasses.filter(val => !activeValues.includes(val))
      
      if (newOnly.length === 0) {
        toast.info("No new classes to add")
        setIsSaving(false)
        return
      }

      await saveSchoolClasses(newOnly)
      toast.success("New school classes added successfully")
      await fetchClasses() // Refresh the list
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save classes")
    } finally {
      setIsSaving(false)
    }
  }

  const selectAll = () => {
    // Current active classes (must stay selected)
    const activeValues = existingClasses.map(c => c.school_class)
    // Add all other options that are not already active
    const selectableValues = SCHOOL_CLASS_OPTIONS
      .map(o => o.value)
      .filter(val => !activeValues.includes(val))
    
    setSelectedClasses([...activeValues, ...selectableValues])
  }

  const deselectAll = () => {
    // Only keep classes that are already active (the disabled ones)
    const existingValues = existingClasses.map(c => c.school_class)
    setSelectedClasses(existingValues)
  }

  const handleDeleteRequest = (cls: SchoolClass) => {
    setDeleteTarget(cls)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    setIsDeleting(true)
    try {
      await deleteSchoolClass(deleteTarget.id)
      toast.success(`${SCHOOL_CLASS_OPTIONS.find(o => o.value === deleteTarget.school_class)?.label || deleteTarget.school_class} deleted successfully`)
      setDeleteTarget(null)
      await fetchClasses()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete class")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-white min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <School className="h-8 w-8 text-primary" />
            Class Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Configure the specific classes available in your school.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchClasses}
            disabled={isLoading || isSaving}
            className="hidden sm:flex"
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button onClick={handleSave} disabled={isLoading || isSaving || selectedClasses.length === 0}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <Separator />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-7 items-stretch">
        {/* Summary Area */}
        <div className="md:col-span-3 flex flex-col">
          <Card className="shadow-sm border-slate-200 flex flex-col h-full">
            <CardHeader className="pb-3 px-6 pt-6">
              <CardTitle className="text-lg">Created Classes</CardTitle>
              <CardDescription>
                List of classes currently active in the school
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col px-6 pb-6">
              <ScrollArea className="flex-1">
                {existingClasses.length > 0 ? (
                  <div className="rounded-md border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <tr>
                          <th className="px-4 py-2.5 text-left font-semibold">#</th>
                          <th className="px-4 py-2.5 text-left font-semibold">Class Name</th>
                          <th className="px-4 py-2.5 text-right font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {existingClasses.map((c, index) => {
                          const label = SCHOOL_CLASS_OPTIONS.find(o => o.value === c.school_class)?.label || c.school_class
                          return (
                            <tr key={index} className="hover:bg-primary/5 transition-colors group">
                              <td className="px-4 py-3 text-slate-400 font-mono text-xs">{index + 1}</td>
                              <td className="px-4 py-3 text-slate-700 font-medium">
                                {label}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteRequest(c)}
                                  className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <AlertCircle className="h-10 w-10 text-slate-200 mb-3" />
                    <p className="text-sm text-slate-400">No classes created yet</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Selection Area */}
        <Card className="md:col-span-4 shadow-sm border-slate-200 flex flex-col h-full">
          <CardHeader className="pb-3 px-6 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Select Classes</CardTitle>
                <CardDescription>
                  Choose the classes to be active for your school
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={selectAll} className="text-xs h-8">
                  Select All
                </Button>
                <Button variant="ghost" size="sm" onClick={deselectAll} className="text-xs h-8 text-destructive hover:text-destructive">
                  Clear All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4 px-6 pb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200"
              />
            </div>

            <ScrollArea className="flex-1 h-[350px] pr-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground">
                  <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary/40" />
                  <p>Loading available classes...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
                  {filteredOptions.map((option) => {
                    const isSelected = selectedClasses.includes(option.value)
                    const isAlreadyCreated = existingClasses.some(c => c.school_class === option.value)

                    return (
                      <div
                        key={option.value}
                        onClick={() => !isAlreadyCreated && toggleClass(option.value)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border-2 transition-all select-none",
                          isAlreadyCreated
                            ? "border-slate-50 bg-slate-50/50 opacity-60 cursor-not-allowed"
                            : isSelected
                              ? "border-primary bg-primary/5 shadow-sm cursor-pointer"
                              : "border-slate-100 hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => !isAlreadyCreated && toggleClass(option.value)}
                          disabled={isAlreadyCreated}
                          className="rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm font-medium truncate",
                            isSelected ? "text-primary" : "text-slate-700"
                          )}>
                            {option.label}
                          </p>
                          {isAlreadyCreated && (
                            <div className="flex items-center gap-1 text-[10px] text-green-600 font-semibold mt-0.5">
                              <CheckCircle2 className="h-3 w-3" />
                              Active
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Class</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-semibold text-slate-900">{SCHOOL_CLASS_OPTIONS.find(o => o.value === deleteTarget?.school_class)?.label || deleteTarget?.school_class}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Class"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
