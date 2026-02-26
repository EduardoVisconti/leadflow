"use client"

import { useState } from "react"
import { useActivities, useCreateActivity, useToggleActivity, useDeleteActivity } from "@/lib/hooks/useActivities"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  FileText,
  Phone,
  Mail,
  Calendar,
  CheckSquare,
  Plus,
  Trash2,
  Check,
  Circle,
} from "lucide-react"
import { timeAgo } from "@/lib/utils/date"
import { ACTIVITY_TYPES } from "@/lib/constants/pipeline"
import type { ActivityType } from "@/types"

const iconMap = {
  note: FileText,
  call: Phone,
  email: Mail,
  meeting: Calendar,
  task: CheckSquare,
}

interface ActivityFeedProps {
  dealId: string
}

export function ActivityFeed({ dealId }: ActivityFeedProps) {
  const { data: activities, isLoading } = useActivities(dealId)
  const createActivity = useCreateActivity()
  const toggleActivity = useToggleActivity()
  const deleteActivity = useDeleteActivity()
  const { toast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState<ActivityType>("note")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    try {
      await createActivity.mutateAsync({
        deal_id: dealId,
        type,
        title: title.trim(),
        body: body.trim() || null,
      })
      setTitle("")
      setBody("")
      setShowForm(false)
      toast({ title: "Atividade registrada" })
    } catch {
      toast({ title: "Erro ao registrar atividade", variant: "destructive" })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Atividades</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Atividades</CardTitle>
        <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-1 h-3 w-3" />
          Registrar Atividade
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-4 space-y-3 rounded-lg border p-3">
            <div className="flex gap-2">
              <Select value={type} onValueChange={(v) => setType(v as ActivityType)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ACTIVITY_TYPES).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <Textarea
              placeholder="Detalhes (opcional)"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={2}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" size="sm" disabled={createActivity.isPending}>
                Salvar
              </Button>
            </div>
          </form>
        )}

        {!activities?.length ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhuma atividade registrada.
          </p>
        ) : (
          <div className="space-y-1">
            {activities.map((activity) => {
              const Icon = iconMap[activity.type as ActivityType] || FileText
              const isTask = activity.type === "task"

              return (
                <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 group">
                  <div className="mt-0.5 shrink-0">
                    {isTask ? (
                      <button
                        onClick={() => toggleActivity.mutate({ id: activity.id, done: !activity.done })}
                        className="text-muted-foreground hover:text-primary"
                      >
                        {activity.done ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </button>
                    ) : (
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${isTask && activity.done ? "line-through text-muted-foreground" : ""}`}>
                        {activity.title}
                      </p>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {ACTIVITY_TYPES[activity.type as ActivityType]?.label || activity.type}
                      </Badge>
                    </div>
                    {activity.body && (
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.body}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{timeAgo(activity.created_at)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 shrink-0"
                    onClick={() => deleteActivity.mutate({ id: activity.id, dealId })}
                  >
                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
