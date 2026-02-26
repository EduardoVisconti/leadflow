"use client"

import { useMemo } from "react"
import Link from "next/link"
import { isToday, isPast, startOfDay, parseISO } from "date-fns"
import { useTasks, useToggleTask } from "@/lib/hooks/useTasks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { PRIORITY_CONFIG } from "@/lib/constants/pipeline"
import type { DealPriority } from "@/types"

export function TodaysTasks() {
  const { data: tasks, isLoading } = useTasks()
  const toggleTask = useToggleTask()

  const todayTasks = useMemo(() => {
    if (!tasks) return []

    const now = startOfDay(new Date())

    return tasks
      .filter((task) => {
        if (task.done) return false
        if (!task.due_date) return false
        const dueDate = startOfDay(parseISO(task.due_date))
        return isToday(dueDate) || isPast(dueDate)
      })
      .slice(0, 5)
  }, [tasks])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tarefas de Hoje</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tarefas de Hoje</CardTitle>
      </CardHeader>
      <CardContent>
        {todayTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma tarefa para hoje. Ótimo trabalho!
          </p>
        ) : (
          <div className="space-y-3">
            {todayTasks.map((task) => {
              const priority = PRIORITY_CONFIG[task.priority as DealPriority]
              const dueDate = task.due_date ? parseISO(task.due_date) : null
              const overdue = dueDate ? isPast(startOfDay(dueDate)) && !isToday(dueDate) : false

              return (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={task.done}
                    onCheckedChange={(checked) =>
                      toggleTask.mutate({ id: task.id, done: checked === true })
                    }
                    className="mt-0.5"
                    aria-label={`Marcar "${task.title}" como concluída`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-tight">{task.title}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      {overdue ? (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                          Atrasada
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          Hoje
                        </Badge>
                      )}
                      {priority && (
                        <Badge
                          variant="secondary"
                          className={`text-[10px] px-1.5 py-0 ${priority.color}`}
                        >
                          {priority.label}
                        </Badge>
                      )}
                      {task.deal && (
                        <span className="text-[11px] text-muted-foreground truncate max-w-[120px]">
                          {task.deal.title}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <div className="mt-4 text-center">
          <Link
            href="/tasks"
            className="text-sm text-primary hover:underline font-medium"
          >
            Ver todas as tarefas
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
