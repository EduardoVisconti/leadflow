"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  FileText,
  Phone,
  Mail,
  Calendar,
  CheckSquare,
  Check,
  Search,
} from "lucide-react"
import { timeAgo } from "@/lib/utils/date"
import { ACTIVITY_TYPES } from "@/lib/constants/pipeline"
import type { Activity, ActivityType } from "@/types"

const iconMap = {
  note: FileText,
  call: Phone,
  email: Mail,
  meeting: Calendar,
  task: CheckSquare,
}

interface ActivityWithRelations extends Activity {
  deal?: { id: string; title: string } | null
  contact?: { id: string; first_name: string; last_name: string } | null
}

async function fetchAllActivities(): Promise<ActivityWithRelations[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("activities")
    .select("*, deal:deals(id, title), contact:contacts(id, first_name, last_name)")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as ActivityWithRelations[]
}

export default function ActivitiesPage() {
  const [search, setSearch] = useState("")

  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities", "all"],
    queryFn: fetchAllActivities,
  })

  const filtered = activities?.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Histórico</h1>
        <p className="text-muted-foreground">
          Todas as atividades e interações registradas.
        </p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : !filtered?.length ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {search ? "Nenhuma atividade encontrada na busca." : "Nenhuma atividade registrada."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((activity) => {
            const Icon = iconMap[activity.type as ActivityType] || FileText
            const isTask = activity.type === "task"

            return (
              <Card key={activity.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {isTask && activity.done ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className={`text-sm font-medium ${
                            isTask && activity.done
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {activity.title}
                        </p>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {ACTIVITY_TYPES[activity.type as ActivityType]?.label ||
                            activity.type}
                        </Badge>
                      </div>
                      {activity.body && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.body}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                        {activity.deal && (
                          <Link
                            href={`/deals/${activity.deal.id}`}
                            className="text-primary hover:underline font-medium"
                          >
                            {activity.deal.title}
                          </Link>
                        )}
                        <span>{timeAgo(activity.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
