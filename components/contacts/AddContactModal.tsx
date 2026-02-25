"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactSchema, type ContactFormValues } from "@/lib/validations/contact.schema"
import { useCreateContact, useUpdateContact } from "@/lib/hooks/useContacts"
import { useCompanies } from "@/lib/hooks/useCompanies"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import type { Contact } from "@/types"

interface AddContactModalProps {
  open: boolean
  onClose: () => void
  contact?: Contact | null
}

export function AddContactModal({ open, onClose, contact }: AddContactModalProps) {
  const createContact = useCreateContact()
  const updateContact = useUpdateContact()
  const { data: companies } = useCompanies()
  const { toast } = useToast()
  const isEditing = !!contact

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      first_name: contact?.first_name ?? "",
      last_name: contact?.last_name ?? "",
      email: contact?.email ?? "",
      phone: contact?.phone ?? "",
      role: contact?.role ?? "",
      company_id: contact?.company_id ?? null,
      notes: contact?.notes ?? "",
    },
  })

  const loading = createContact.isPending || updateContact.isPending

  async function onSubmit(values: ContactFormValues) {
    try {
      if (isEditing && contact) {
        await updateContact.mutateAsync({ id: contact.id, ...values })
        toast({ title: "Contact updated" })
      } else {
        await createContact.mutateAsync(values)
        toast({ title: "Contact created" })
      }
      form.reset()
      onClose()
    } catch {
      toast({ title: "Error saving contact", variant: "destructive" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Contact" : "New Contact"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the contact details below." : "Add a new contact to your CRM."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input id="first_name" {...form.register("first_name")} />
              {form.formState.errors.first_name && (
                <p className="text-xs text-destructive">{form.formState.errors.first_name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input id="last_name" {...form.register("last_name")} />
              {form.formState.errors.last_name && (
                <p className="text-xs text-destructive">{form.formState.errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} placeholder="email@example.com" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...form.register("phone")} placeholder="+1 555 0123" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" {...form.register("role")} placeholder="e.g. CEO" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Company</Label>
            <Select
              value={form.watch("company_id") ?? "none"}
              onValueChange={(v) => form.setValue("company_id", v === "none" ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No company</SelectItem>
                {companies?.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...form.register("notes")} rows={3} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
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
