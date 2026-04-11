"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  FileStack,
  Loader2,
  Plus,
  Settings2,
  Sparkles,
  Trash2,
  Eye,
  School,
  Users,
  FileText,
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Upload,
  Check,
  AlertCircle,
  ArrowRight,
  Save,
  Send,
} from "lucide-react"

import {
  createAdmissionForm,
  getSchoolClasses,
  type SchoolClass,
} from "@/lib/forms"
import {
  createConfiguredField,
  DOCUMENT_FIELD_TEMPLATES,
  FIELD_TYPE_OPTIONS,
  PERSONAL_FIELD_TEMPLATES,
  type AdmissionFormCreatePayload,
  type AdmissionFormFieldPayload,
  type AdmissionFormResponse,
  type BuilderFieldType,
  type BuilderOption,
  type ConfiguredField,
} from "@/lib/form-builder-config"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

type ErrorMap = Record<string, string>

const STEP_TITLES = [
  {
    title: "Basic Information",
    description: "Set form title and student information fields",
    icon: School,
  },
  {
    title: "Document Requirements",
    description: "Configure required documents for admission",
    icon: FileStack,
  },
  {
    title: "Review & Publish",
    description: "Set fees and publish the admission form",
    icon: CheckCircle2,
  },
]

// Field type icons mapping for better visual recognition
const FIELD_ICONS: Record<string, any> = {
  text: FileText,
  email: Mail,
  tel: Phone,
  number: GraduationCap,
  date: Calendar,
  file: Upload,
  select: ChevronRight,
  textarea: FileText,
}

function cloneField(field: ConfiguredField, index: number) {
  return {
    ...field,
    id: `${field.key}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    options: field.options.map((option) => ({ ...option })),
  }
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function createCustomField(section: "personal" | "documents", count: number): ConfiguredField {
  const key = `${section}_custom_${count + 1}`
  return {
    id: `${key}-${Date.now()}`,
    key,
    label: section === "personal" ? "Additional Information" : "Additional Document",
    type: "text",
    required: false,
    placeholder: "",
    options: [],
    selected: true,
    custom: true,
  }
}

function toPayloadFields(fields: ConfiguredField[]): AdmissionFormFieldPayload[] {
  return fields
    .filter((field) => field.selected)
    .map((field, index) => {
      const isSelect = field.type === "select"
      const validOptions = isSelect ? field.options.filter((option) => option.label && option.value) : []
      return {
        ...(isSelect && validOptions.length > 0 ? { options: validOptions } : {}),
        label: field.label.trim(),
        field_type: field.type,
        required: field.required,
        order: index + 1,
      }
    })
}

function FieldCard({
  field,
  onToggle,
  onChange,
  onRemove,
}: {
  field: ConfiguredField
  onToggle: (checked: boolean) => void
  onChange: (nextField: ConfiguredField) => void
  onRemove?: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const IconComponent = FIELD_ICONS[field.type] || FileText

  const setOptionValue = (
    optionIndex: number,
    nextKey: keyof BuilderOption,
    nextValue: string
  ) => {
    const nextOptions = field.options.map((option, index) =>
      index === optionIndex ? { ...option, [nextKey]: nextValue } : option
    )
    onChange({ ...field, options: nextOptions })
  }

  const addOption = () => {
    onChange({
      ...field,
      options: [...field.options, { label: "", value: "" }],
    })
  }

  const removeOption = (optionIndex: number) => {
    onChange({
      ...field,
      options: field.options.filter((_, index) => index !== optionIndex),
    })
  }

  return (
    <Card className={cn(
      "transition-all duration-200",
      field.selected ? "border-primary/40 bg-primary/5" : "border-border"
    )}>
      <CardHeader className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={field.selected}
            onCheckedChange={(checked) => onToggle(Boolean(checked))}
            className="mt-1"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <IconComponent className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium text-sm">{field.label}</h4>
              {field.required && (
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Required</Badge>
              )}
              {field.custom && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">Custom</Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>Key: <code className="font-mono text-xs">{field.key}</code></span>
              <span>•</span>
              <span>Type: {field.type}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Configure field</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {onRemove && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={onRemove}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Remove field</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {field.selected && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <CardContent className="px-4 pb-4 pt-0">
              <Separator className="mb-4" />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Field Label</Label>
                  <Input
                    value={field.label}
                    onChange={(e) => onChange({ ...field, label: e.target.value })}
                    placeholder="Field Name"
                    className="h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Field Type</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-primary"
                    value={field.type}
                    onChange={(e) =>
                      onChange({
                        ...field,
                        type: e.target.value as BuilderFieldType,
                        options: e.target.value === "select" && !field.options.length
                          ? [{ label: "", value: "" }]
                          : field.options,
                      })
                    }
                  >
                    {FIELD_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between py-2">
                <div>
                  <Label className="text-sm font-medium">Required Field</Label>
                  <p className="text-xs text-muted-foreground">
                    Applicant must fill this field
                  </p>
                </div>
                <Switch
                  checked={field.required}
                  onCheckedChange={(checked) => onChange({ ...field, required: Boolean(checked) })}
                />
              </div>

              {field.type === "select" && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Dropdown Options</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addOption}>
                      <Plus className="mr-1 h-3 w-3" />
                      Add Option
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {field.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option.label}
                          placeholder="Display Label"
                          onChange={(e) => setOptionValue(index, "label", e.target.value)}
                          className="h-9"
                        />
                        <Input
                          value={option.value}
                          placeholder="Value"
                          onChange={(e) => setOptionValue(index, "value", e.target.value)}
                          className="h-9"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="h-9 w-9 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

export default function PrincipalFormBuilder({
  onSuccess,
}: {
  onSuccess?: (form: AdmissionFormResponse) => void
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [academicYear, setAcademicYear] = useState("2024-2025")
  const [title, setTitle] = useState("Student Admission Form")
  const [description, setDescription] = useState("")
  const [personalSectionTitle, setPersonalSectionTitle] = useState("Student Information")
  const [documentSectionTitle, setDocumentSectionTitle] = useState("Required Documents")
  const [personalFields, setPersonalFields] = useState(
    PERSONAL_FIELD_TEMPLATES.map((field, index) => cloneField(createConfiguredField(field), index))
  )
  const [documentFields, setDocumentFields] = useState(
    DOCUMENT_FIELD_TEMPLATES.map((field, index) => cloneField(createConfiguredField(field), index))
  )
  const [feesEnabled, setFeesEnabled] = useState(false)
  const [feesAmount, setFeesAmount] = useState("")
  const [errors, setErrors] = useState<ErrorMap>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [createdForm, setCreatedForm] = useState<AdmissionFormResponse | null>(null)
  const [classes, setClasses] = useState<SchoolClass[]>([])

  useEffect(() => {
    async function fetchClasses() {
      try {
        const data = await getSchoolClasses()
        if (data && data.length > 0) {
          setClasses(data)
          
          // Map to options format
          const classOptions = data.map(cls => ({
            label: cls.school_class,
            value: cls.school_class // Using name as value for now
          }))

          // Update initial personal fields if they contain the class selector
          setPersonalFields(current => current.map(field => {
            if (field.label.toLowerCase().includes("class") || field.key.includes("class")) {
              return { ...field, options: classOptions }
            }
            return field
          }))
        }
      } catch (err) {
        console.error("Failed to fetch classes:", err)
      }
    }
    fetchClasses()
  }, [])

  const payload = useMemo<AdmissionFormCreatePayload>(() => {
    const sections = [
      {
        title: personalSectionTitle.trim() || "Student Information",
        order: 1,
        fields: toPayloadFields(personalFields),
      },
    ]

    const document_field = documentFields
      .filter((field) => field.selected)
      .map((field) => field.label.trim())
      
    const feesNum = feesEnabled && feesAmount.trim() ? Number(feesAmount.trim()) : 0
    const formTitle = `${title.trim()} ${academicYear}`.trim()

    return {
      fees_enable: feesEnabled,
      fees: feesEnabled && feesNum > 0 ? feesNum : null,
      title: formTitle,
      description: description.trim() || `Admission form for academic year ${academicYear}`,
      unique_link: slugify(formTitle),
      fee_type: "individual",
      sections,
      document_field,
      fee_structures: feesEnabled && feesNum > 0 ? [{ class_name: 1, amount: feesNum }] : [],
    }
  }, [
    academicYear,
    description,
    documentFields,
    feesAmount,
    feesEnabled,
    personalFields,
    personalSectionTitle,
    title,
  ])

  const validateStep = (step: number) => {
    const nextErrors: ErrorMap = {}

    if (step === 0) {
      if (!title.trim()) {
        nextErrors.title = "Form title is required"
      }
      if (!payload.sections[0].fields.length) {
        nextErrors.personalFields = "At least one student information field is required"
      }
    }

    if (step === 2 && feesEnabled && !feesAmount.trim()) {
      nextErrors.fees = "Application fee amount is required"
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      return
    }
    setCurrentStep((value) => Math.min(value + 1, STEP_TITLES.length - 1))
  }

  const previousStep = () => {
    setErrors({})
    setCurrentStep((value) => Math.max(value - 1, 0))
  }

  const submitForm = async () => {
    if (!validateStep(2)) {
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const response = await createAdmissionForm(payload)
      setCreatedForm(response)
      onSuccess?.(response)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to create admission form")
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyPayload = async () => {
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
  }

  const updateFieldList = (
    section: "personal" | "documents",
    updater: (fields: ConfiguredField[]) => ConfiguredField[]
  ) => {
    if (section === "personal") {
      setPersonalFields((current) => updater(current))
      return
    }
    setDocumentFields((current) => updater(current))
  }

  const getSelectedCount = (fields: ConfiguredField[]) => {
    return fields.filter(f => f.selected).length
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <School className="h-4 w-4" />
            <span>Admission Management</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Form Builder</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Create Admission Form</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Configure the admission form for the upcoming academic session
              </p>
            </div>

            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={academicYear} 
              onChange={(e: any) => setAcademicYear(e.target.value)}
            >
              <option value="2024-2025">Academic Year 2024-2025</option>
              <option value="2025-2026">Academic Year 2025-2026</option>
              <option value="2026-2027">Academic Year 2026-2027</option>
            </select>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEP_TITLES.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === index
              const isComplete = currentStep > index

              return (
                <div key={step.title} className="flex items-center flex-1">
                  <div className={cn(
                    "flex items-center gap-3",
                    index > 0 && "ml-4"
                  )}>
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                      isActive && "border-primary bg-primary text-primary-foreground",
                      isComplete && "border-primary bg-primary/10 text-primary",
                      !isActive && !isComplete && "border-muted-foreground/25 text-muted-foreground"
                    )}>
                      {isComplete ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className={cn(
                      "hidden sm:block",
                      !isActive && "opacity-60"
                    )}>
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>

                  {index < STEP_TITLES.length - 1 && (
                    <div className={cn(
                      "mx-4 h-0.5 flex-1",
                      currentStep > index ? "bg-primary" : "bg-muted"
                    )} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-sm">
          {currentStep === 0 && (
            <>
              <CardHeader>
                <CardTitle>Form Details</CardTitle>
                <CardDescription>
                  Set the basic information and choose student information fields
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Form Metadata */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="form-title">Form Title</Label>
                    <Input
                      id="form-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Class XI Admission"
                    />
                    {errors.title && (
                      <p className="text-xs text-destructive">{errors.title}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="section-title">Section Title</Label>
                    <Input
                      id="section-title"
                      value={personalSectionTitle}
                      onChange={(e) => setPersonalSectionTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="form-description">Description (Optional)</Label>
                    <Textarea
                      id="form-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description about this admission form..."
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                </div>

                <Separator />

                {/* Student Information Fields */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Student Information Fields</h3>
                      <p className="text-sm text-muted-foreground">
                        Select fields to collect from applicants
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {getSelectedCount(personalFields)} selected
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateFieldList("personal", (fields) => [
                            ...fields,
                            createCustomField("personal", fields.filter((f) => f.custom).length),
                          ])
                        }
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add Field
                      </Button>
                    </div>
                  </div>

                  {errors.personalFields && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.personalFields}</AlertDescription>
                    </Alert>
                  )}

                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {personalFields.map((field) => (
                        <FieldCard
                          key={field.id}
                          field={field}
                          onToggle={(checked) =>
                            updateFieldList("personal", (fields) =>
                              fields.map((item) => (item.id === field.id ? { ...item, selected: checked } : item))
                            )
                          }
                          onChange={(nextField) =>
                            updateFieldList("personal", (fields) =>
                              fields.map((item) => (item.id === field.id ? nextField : item))
                            )
                          }
                          onRemove={
                            field.custom
                              ? () =>
                                updateFieldList("personal", (fields) =>
                                  fields.filter((item) => item.id !== field.id)
                                )
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 1 && (
            <>
              <CardHeader>
                <CardTitle>Document Requirements</CardTitle>
                <CardDescription>
                  Configure documents that applicants need to submit
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-1.5 max-w-md">
                  <Label htmlFor="doc-section-title">Section Title</Label>
                  <Input
                    id="doc-section-title"
                    value={documentSectionTitle}
                    onChange={(e) => setDocumentSectionTitle(e.target.value)}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Document Fields</h3>
                      <p className="text-sm text-muted-foreground">
                        Specify required documents and supporting files
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {getSelectedCount(documentFields)} selected
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateFieldList("documents", (fields) => [
                            ...fields,
                            createCustomField("documents", fields.filter((f) => f.custom).length),
                          ])
                        }
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add Field
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {documentFields.map((field) => (
                        <FieldCard
                          key={field.id}
                          field={field}
                          onToggle={(checked) =>
                            updateFieldList("documents", (fields) =>
                              fields.map((item) => (item.id === field.id ? { ...item, selected: checked } : item))
                            )
                          }
                          onChange={(nextField) =>
                            updateFieldList("documents", (fields) =>
                              fields.map((item) => (item.id === field.id ? nextField : item))
                            )
                          }
                          onRemove={
                            field.custom
                              ? () =>
                                updateFieldList("documents", (fields) =>
                                  fields.filter((item) => item.id !== field.id)
                                )
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle>Review & Publish</CardTitle>
                <CardDescription>
                  Set application fee and review the form configuration
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid gap-6 md:max-w-xl">
                  <div className="space-y-4">
                    {/* Application Fee */}
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">Application Fee</h4>
                          <p className="text-sm text-muted-foreground">
                            Charge a fee for form submission
                          </p>
                        </div>
                        <Switch
                          checked={feesEnabled}
                          onCheckedChange={setFeesEnabled}
                        />
                      </div>

                      {feesEnabled && (
                        <div className="space-y-1.5">
                          <Label htmlFor="fees-amount">Amount (INR)</Label>
                          <Input
                            id="fees-amount"
                            type="number"
                            min="0"
                            value={feesAmount}
                            onChange={(e) => setFeesAmount(e.target.value)}
                            placeholder="500"
                          />
                          {errors.fees && (
                            <p className="text-xs text-destructive">{errors.fees}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Form Summary */}
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium mb-3">Form Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Academic Year</span>
                          <span className="font-medium">{academicYear}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Student Fields</span>
                          <span className="font-medium">{getSelectedCount(personalFields)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Document Fields</span>
                          <span className="font-medium">{getSelectedCount(documentFields)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Fields</span>
                          <span className="font-medium">
                            {getSelectedCount(personalFields) + getSelectedCount(documentFields)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Application Fee</span>
                          <span className="font-medium">
                            {feesEnabled ? `₹${feesAmount || '0'}` : 'Free'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Success Message */}
                {createdForm && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-900">Form Created Successfully</AlertTitle>
                    <AlertDescription className="text-green-700">
                      <p>Form ID: {createdForm.id}</p>
                      <p className="mt-1">
                        Share this link with applicants:{" "}
                        <code className="text-xs bg-green-100 px-2 py-0.5 rounded">
                          {createdForm.unique_link}
                        </code>
                      </p>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Error Message */}
                {submitError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </>
          )}

          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <Button
              variant="ghost"
              onClick={previousStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              {currentStep < STEP_TITLES.length - 1 ? (
                <Button onClick={nextStep}>
                  Continue
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={submitForm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Publish Form
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}