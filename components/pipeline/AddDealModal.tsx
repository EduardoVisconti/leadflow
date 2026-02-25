"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { dealSchema, type DealFormValues } from "@/lib/validations/deal.schema"
import { useCreateDeal, useUpdateDeal } from "@/lib/hooks/useDeals"
import { useContacts } from "@/lib/hooks/useContacts"
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
import type { Deal } from "@/types"

interface AddDealModalProps {
  open: boolean
  onClose: () => void
  stageId?: string
  deal?: Deal | null
}

export function AddDealModal({ open, onClose, stageId, deal }: AddDealModalProps) {
  const createDeal = useCreateDeal()
  const updateDeal = useUpdateDeal()
  const { data: contacts } = useContacts()
  const { toast } = useToast()
  const isEditing = !!deal

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: deal?.title ?? "",
      value: deal?.value ?? null,
      currency: deal?.currency ?? "USD",
      priority: (deal?.priority as DealFormValues["priority"]) ?? "medium",
      expected_close_date: deal?.expected_close_date ?? null,
      contact_id: deal?.contact_id ?? null,
      stage_id: deal?.stage_id ?? stageId ?? null,
      notes: deal?.notes ?? null,
    },
  })

  const loading = createDeal.isPending || updateDeal.isPending

  async function onSubmit(values: DealFormValues) {
    try {
      if (isEditing && deal) {
        await updateDeal.mutateAsync({ id: deal.id, ...values })
        toast({ title: "Deal updated" })
      } else {
        await createDeal.mutateAsync(values)
        toast({ title: "Deal created" })
      }
      form.reset()
      onClose()
    } catch {
      toast({ title: "Error saving deal", variant: "destructive" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Deal" : "New Deal"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the deal details below." : "Add a new deal to your pipeline."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...form.register("title")} placeholder="e.g. Website redesign" />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                {...form.register("value")}
                placeholder="10000"
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={form.watch("priority") ?? "medium"}
                onValueChange={(v) => form.setValue("priority", v as DealFormValues["priority"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected_close_date">Expected Close Date</Label>
            <Input
              id="expected_close_date"
              type="date"
              {...form.register("expected_close_date")}
            />
          </div>

          <div className="space-y-2">
            <Label>Contact</Label>
            <Select
              value={form.watch("contact_id") ?? "none"}
              onValueChange={(v) => form.setValue("contact_id", v === "none" ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a contact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No contact</SelectItem>
                {contacts?.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.first_name} {contact.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...form.register("notes")} placeholder="Add notes..." rows={3} />
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
