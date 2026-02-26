"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { taskSchema, type TaskFormValues } from "@/lib/validations/task.schema"
import { useCreateTask, useUpdateTask } from "@/lib/hooks/useTasks"
import { useDeals } from "@/lib/hooks/useDeals"
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
import type { TaskWithRelations } from "@/types"

interface AddTaskModalProps {
  open: boolean
  onClose: () => void
  task?: TaskWithRelations | null
}

export function AddTaskModal({ open, onClose, task }: AddTaskModalProps) {
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const { data: deals } = useDeals()
  const { data: contacts } = useContacts()
  const { toast } = useToast()
  const isEditing = !!task

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      deal_id: null,
      contact_id: null,
      due_date: "",
      priority: "medium",
    },
  })

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title ?? "",
        description: task.description ?? "",
        deal_id: task.deal_id ?? null,
        contact_id: task.contact_id ?? null,
        due_date: task.due_date ?? "",
        priority: (task.priority as "low" | "medium" | "high") ?? "medium",
      })
    } else {
      form.reset({
        title: "",
        description: "",
        deal_id: null,
        contact_id: null,
        due_date: "",
        priority: "medium",
      })
    }
  }, [task, form])

  const loading = createTask.isPending || updateTask.isPending

  async function onSubmit(values: TaskFormValues) {
    try {
      if (isEditing && task) {
        await updateTask.mutateAsync({ id: task.id, ...values })
        toast({ title: "Tarefa atualizada" })
      } else {
        await createTask.mutateAsync(values)
        toast({ title: "Tarefa criada" })
      }
      form.reset()
      onClose()
    } catch {
      toast({ title: "Erro ao salvar tarefa", variant: "destructive" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os detalhes da tarefa abaixo."
              : "Adicione uma nova tarefa ou follow-up."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input id="title" {...form.register("title")} placeholder="Ex: Enviar proposta" />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" {...form.register("description")} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Negócio</Label>
              <Select
                value={form.watch("deal_id") ?? "none"}
                onValueChange={(v) => form.setValue("deal_id", v === "none" ? null : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar negócio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {deals?.map((deal) => (
                    <SelectItem key={deal.id} value={deal.id}>
                      {deal.title}
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
                  <SelectItem value="none">Nenhum</SelectItem>
                  {contacts?.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.first_name} {contact.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due_date">Data de vencimento</Label>
              <Input id="due_date" type="date" {...form.register("due_date")} />
            </div>

            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select
                value={form.watch("priority") ?? "medium"}
                onValueChange={(v) => form.setValue("priority", v as "low" | "medium" | "high")}
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
