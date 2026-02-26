"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { dealSchema, type DealFormValues } from "@/lib/validations/deal.schema"
import { useCreateDeal, useUpdateDeal } from "@/lib/hooks/useDeals"
import { useContacts } from "@/lib/hooks/useContacts"
import { useProducts } from "@/lib/hooks/useProducts"
import { usePipeline } from "@/lib/hooks/usePipeline"
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
import { Loader2, MessageCircle, Instagram, Users, Globe, HelpCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils/currency"
import type { Deal } from "@/types"

const SOURCE_OPTIONS = [
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "indicacao", label: "Indicação", icon: Users },
  { value: "site", label: "Site", icon: Globe },
  { value: "outro", label: "Outro", icon: HelpCircle },
] as const

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
  const { data: products } = useProducts()
  const { data: stages } = usePipeline()
  const { toast } = useToast()
  const isEditing = !!deal

  const firstStageId = stages?.[0]?.id ?? null

  const activeProducts = products?.filter((p) => p.active)

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: deal?.title ?? "",
      value: deal?.value ?? null,
      currency: deal?.currency ?? "BRL",
      priority: (deal?.priority as DealFormValues["priority"]) ?? "medium",
      expected_close_date: deal?.expected_close_date ?? null,
      contact_id: deal?.contact_id ?? null,
      stage_id: deal?.stage_id ?? stageId ?? firstStageId,
      notes: deal?.notes ?? null,
      source: (deal?.source as DealFormValues["source"]) ?? "whatsapp",
      product_id: deal?.product_id ?? null,
    },
  })

  useEffect(() => {
    if (deal) {
      form.reset({
        title: deal.title ?? "",
        value: deal.value ?? null,
        currency: deal.currency ?? "BRL",
        priority: (deal.priority as DealFormValues["priority"]) ?? "medium",
        expected_close_date: deal.expected_close_date ?? null,
        contact_id: deal.contact_id ?? null,
        stage_id: deal.stage_id ?? stageId ?? firstStageId,
        notes: deal.notes ?? null,
        source: (deal.source as DealFormValues["source"]) ?? "whatsapp",
        product_id: deal.product_id ?? null,
      })
    } else {
      form.reset({
        title: "",
        value: null,
        currency: "BRL",
        priority: "medium",
        expected_close_date: null,
        contact_id: null,
        stage_id: stageId ?? firstStageId,
        notes: null,
        source: "whatsapp",
        product_id: null,
      })
    }
  }, [deal, stageId, firstStageId, form])

  const loading = createDeal.isPending || updateDeal.isPending

  async function onSubmit(values: DealFormValues) {
    try {
      const payload = {
        ...values,
        expected_close_date: values.expected_close_date || null,
      }
      if (isEditing && deal) {
        await updateDeal.mutateAsync({ id: deal.id, ...payload })
        toast({ title: "Deal atualizado" })
      } else {
        await createDeal.mutateAsync(payload)
        toast({ title: "Deal criado" })
      }
      form.reset()
      onClose()
    } catch {
      toast({ title: "Erro ao salvar deal", variant: "destructive" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Deal" : "Novo Deal"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize os detalhes do deal abaixo." : "Adicione um novo deal ao seu pipeline."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input id="title" {...form.register("title")} placeholder="Ex: iPhone 15 Pro Max" />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Estágio *</Label>
            <Select
              value={form.watch("stage_id") ?? firstStageId ?? ""}
              onValueChange={(v) => form.setValue("stage_id", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar estágio" />
              </SelectTrigger>
              <SelectContent>
                {stages?.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: stage.color }}
                      />
                      {stage.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Valor</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                {...form.register("value")}
                placeholder="10000"
              />
            </div>
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select
                value={form.watch("priority") ?? "medium"}
                onValueChange={(v) => form.setValue("priority", v as DealFormValues["priority"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Origem</Label>
              <Select
                value={form.watch("source") ?? "whatsapp"}
                onValueChange={(v) => form.setValue("source", v as DealFormValues["source"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <opt.icon className="h-3.5 w-3.5" />
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected_close_date">Data de Fechamento</Label>
              <Input
                id="expected_close_date"
                type="date"
                {...form.register("expected_close_date")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Produto de Interesse</Label>
            <Select
              value={form.watch("product_id") ?? "none"}
              onValueChange={(v) => form.setValue("product_id", v === "none" ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar produto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum produto</SelectItem>
                {activeProducts?.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} {product.price ? `- ${formatCurrency(product.price)}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Contato</Label>
            <Select
              value={form.watch("contact_id") ?? "none"}
              onValueChange={(v) => form.setValue("contact_id", v === "none" ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar contato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem contato</SelectItem>
                {contacts?.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.first_name} {contact.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea id="notes" {...form.register("notes")} placeholder="Adicionar observações..." rows={3} />
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
