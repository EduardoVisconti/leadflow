"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { companySchema, type CompanyFormValues } from "@/lib/validations/company.schema"
import { useCreateCompany, useUpdateCompany } from "@/lib/hooks/useCompanies"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import type { Company } from "@/types"

interface AddCompanyModalProps {
  open: boolean
  onClose: () => void
  company?: Company | null
}

export function AddCompanyModal({ open, onClose, company }: AddCompanyModalProps) {
  const createCompany = useCreateCompany()
  const updateCompany = useUpdateCompany()
  const { toast } = useToast()
  const isEditing = !!company

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company?.name ?? "",
      website: company?.website ?? "",
      industry: company?.industry ?? "",
      size: (company?.size as CompanyFormValues["size"]) ?? null,
    },
  })

  const loading = createCompany.isPending || updateCompany.isPending

  async function onSubmit(values: CompanyFormValues) {
    try {
      if (isEditing && company) {
        await updateCompany.mutateAsync({ id: company.id, ...values })
        toast({ title: "Company updated" })
      } else {
        await createCompany.mutateAsync(values)
        toast({ title: "Company created" })
      }
      form.reset()
      onClose()
    } catch {
      toast({ title: "Error saving company", variant: "destructive" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Company" : "New Company"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the company details." : "Add a new company to your CRM."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...form.register("name")} placeholder="e.g. Acme Corp" />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" {...form.register("website")} placeholder="https://example.com" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" {...form.register("industry")} placeholder="e.g. Technology" />
            </div>
            <div className="space-y-2">
              <Label>Size</Label>
              <Select
                value={form.watch("size") ?? "none"}
                onValueChange={(v) => form.setValue("size", v === "none" ? null : v as CompanyFormValues["size"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not specified</SelectItem>
                  <SelectItem value="1-10">1-10</SelectItem>
                  <SelectItem value="11-50">11-50</SelectItem>
                  <SelectItem value="51-200">51-200</SelectItem>
                  <SelectItem value="200+">200+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
