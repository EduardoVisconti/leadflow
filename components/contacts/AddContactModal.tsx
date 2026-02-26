"use client"

import { useEffect } from "react"
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
      channel: (contact?.channel as ContactFormValues["channel"]) ?? null,
      instagram_handle: contact?.instagram_handle ?? "",
      whatsapp: contact?.whatsapp ?? "",
    },
  })

  useEffect(() => {
    if (contact) {
      form.reset({
        first_name: contact.first_name ?? "",
        last_name: contact.last_name ?? "",
        email: contact.email ?? "",
        phone: contact.phone ?? "",
        role: contact.role ?? "",
        company_id: contact.company_id ?? null,
        notes: contact.notes ?? "",
        channel: (contact.channel as ContactFormValues["channel"]) ?? null,
        instagram_handle: contact.instagram_handle ?? "",
        whatsapp: contact.whatsapp ?? "",
      })
    } else {
      form.reset({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        role: "",
        company_id: null,
        notes: "",
        channel: null,
        instagram_handle: "",
        whatsapp: "",
      })
    }
  }, [contact, form])

  const loading = createContact.isPending || updateContact.isPending

  async function onSubmit(values: ContactFormValues) {
    try {
      if (isEditing && contact) {
        await updateContact.mutateAsync({ id: contact.id, ...values })
        toast({ title: "Contato atualizado" })
      } else {
        await createContact.mutateAsync(values)
        toast({ title: "Contato criado" })
      }
      form.reset()
      onClose()
    } catch {
      toast({ title: "Erro ao salvar contato", variant: "destructive" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Contato" : "Novo Contato"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize os detalhes do contato abaixo." : "Adicione um novo contato ao seu CRM."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Nome *</Label>
              <Input id="first_name" {...form.register("first_name")} />
              {form.formState.errors.first_name && (
                <p className="text-xs text-destructive">{form.formState.errors.first_name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Sobrenome *</Label>
              <Input id="last_name" {...form.register("last_name")} />
              {form.formState.errors.last_name && (
                <p className="text-xs text-destructive">{form.formState.errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} placeholder="email@exemplo.com" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" {...form.register("phone")} placeholder="(11) 99999-0000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Cargo</Label>
              <Input id="role" {...form.register("role")} placeholder="Ex: Gerente" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Canal Preferido</Label>
              <Select
                value={form.watch("channel") ?? "none"}
                onValueChange={(v) => form.setValue("channel", v === "none" ? null : v as "whatsapp" | "instagram" | "telefone" | "email")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="telefone">Telefone</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input id="whatsapp" {...form.register("whatsapp")} placeholder="(11) 99999-0000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram_handle">Instagram</Label>
              <Input id="instagram_handle" {...form.register("instagram_handle")} placeholder="@usuario" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Empresa</Label>
            <Select
              value={form.watch("company_id") ?? "none"}
              onValueChange={(v) => form.setValue("company_id", v === "none" ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem empresa</SelectItem>
                {companies?.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea id="notes" {...form.register("notes")} rows={3} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
