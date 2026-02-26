"use client"

import { useState } from "react"
import { isToday, isPast, isThisWeek, startOfDay, parseISO } from "date-fns"
import { useTasks, useToggleTask, useDeleteTask } from "@/lib/hooks/useTasks"
import { formatDate } from "@/lib/utils/date"
import { PRIORITY_CONFIG } from "@/lib/constants/pipeline"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Handshake, User, CalendarClock } from "lucide-react"
import type { TaskWithRelations } from "@/types"

type StatusFilter = "pending" | "done" | "all"
type DateFilter = "all" | "today" | "overdue" | "week"

interface TasksListProps {
  onEdit: (task: TaskWithRelations) => void
}

export function TasksList({ onEdit }: TasksListProps) {
  const { data: tasks, isLoading } = useTasks()
  const toggleTask = useToggleTask()
  const deleteTask = useDeleteTask()
  const { toast } = useToast()

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<DateFilter>("all")

  async function handleToggle(task: TaskWithRelations) {
    try {
      await toggleTask.mutateAsync({ id: task.id, done: !task.done })
    } catch {
      toast({ title: "Erro ao atualizar tarefa", variant: "destructive" })
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTask.mutateAsync(id)
      toast({ title: "Tarefa excluída" })
    } catch {
      toast({ title: "Erro ao excluir tarefa", variant: "destructive" })
    }
  }

  function isDueToday(date: string | null): boolean {
    if (!date) return false
    return isToday(parseISO(date))
  }

  function isOverdue(date: string | null, done: boolean): boolean {
    if (!date || done) return false
    return isPast(startOfDay(parseISO(date))) && !isToday(parseISO(date))
  }

  function isDueThisWeek(date: string | null): boolean {
    if (!date) return false
    return isThisWeek(parseISO(date), { weekStartsOn: 1 })
  }

  const filtered = tasks?.filter((task) => {
    if (statusFilter === "pending" && task.done) return false
    if (statusFilter === "done" && !task.done) return false

    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false

    if (dateFilter === "today" && !isDueToday(task.due_date)) return false
    if (dateFilter === "overdue" && !isOverdue(task.due_date, task.done)) return false
    if (dateFilter === "week" && !isDueThisWeek(task.due_date)) return false

    return true
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  const statusTabs: { value: StatusFilter; label: string }[] = [
    { value: "pending", label: "Pendentes" },
    { value: "done", label: "Concluídas" },
    { value: "all", label: "Todas" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border bg-muted p-1">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === tab.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Data" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="overdue">Atrasadas</SelectItem>
            <SelectItem value="week">Esta semana</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {!filtered?.length ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarClock className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              {statusFilter === "pending"
                ? "Nenhuma tarefa pendente. Ótimo trabalho!"
                : statusFilter === "done"
                  ? "Nenhuma tarefa concluída ainda."
                  : "Nenhuma tarefa encontrada."}
            </p>
          </div>
        ) : (
          filtered.map((task) => {
            const overdue = isOverdue(task.due_date, task.done)
            const dueToday = isDueToday(task.due_date) && !task.done
            const priority = task.priority as keyof typeof PRIORITY_CONFIG | null

            return (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <Checkbox
                  checked={task.done}
                  onCheckedChange={() => handleToggle(task)}
                  aria-label={`Marcar "${task.title}" como ${task.done ? "pendente" : "concluída"}`}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium ${task.done ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </span>
                    {priority && PRIORITY_CONFIG[priority] && (
                      <Badge variant="secondary" className={`text-xs ${PRIORITY_CONFIG[priority].color}`}>
                        {PRIORITY_CONFIG[priority].label}
                      </Badge>
                    )}
                    {overdue && (
                      <Badge variant="destructive" className="text-xs">
                        Atrasada
                      </Badge>
                    )}
                    {dueToday && (
                      <Badge className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 hover:bg-yellow-100">
                        Hoje
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    {task.deal && (
                      <span className="flex items-center gap-1">
                        <Handshake className="h-3 w-3" />
                        {task.deal.title}
                      </span>
                    )}
                    {task.contact && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {task.contact.first_name} {task.contact.last_name}
                      </span>
                    )}
                    {task.due_date && (
                      <span>{formatDate(task.due_date)}</span>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      <Pencil className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(task.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
