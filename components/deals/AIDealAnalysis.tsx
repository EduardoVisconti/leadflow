"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles, RefreshCw } from "lucide-react"
import { useAIAnalysis } from "@/lib/hooks/useAIAnalysis"
import { daysSince } from "@/lib/utils/date"
import { useActivities } from "@/lib/hooks/useActivities"
import type { DealWithRelations, AIAnalysis } from "@/types"

const statusConfig = {
  hot: { label: "Quente", class: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
  on_track: { label: "No Caminho", class: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
  at_risk: { label: "Em Risco", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
  stalled: { label: "Parado", class: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
}

interface AIDealAnalysisProps {
  deal: DealWithRelations
}

export function AIDealAnalysis({ deal }: AIDealAnalysisProps) {
  const { data: activities } = useActivities(deal.id)
  const analyze = useAIAnalysis()
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)

  const lastActivity = activities?.[0]
  const daysInStage = daysSince(deal.updated_at)

  async function handleAnalyze() {
    try {
      const result = await analyze.mutateAsync({
        title: deal.title,
        value: deal.value,
        stage: deal.stage?.name ?? "Unknown",
        daysInStage,
        lastActivityDate: lastActivity?.created_at ?? null,
        activityCount: activities?.length ?? 0,
        expectedCloseDate: deal.expected_close_date,
        priority: deal.priority,
      })
      setAnalysis(result)
    } catch {
      // Error handled by mutation
    }
  }

  const status = analysis ? statusConfig[analysis.status] : null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          Análise IA
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAnalyze}
          disabled={analyze.isPending}
        >
          <RefreshCw className={`mr-1 h-3 w-3 ${analyze.isPending ? "animate-spin" : ""}`} />
          {analysis ? "Atualizar" : "Analisar"}
        </Button>
      </CardHeader>
      <CardContent>
        {analyze.isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : analysis ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Score de Saúde</p>
                <p className="text-3xl font-bold">{analysis.score}</p>
              </div>
              {status && (
                <Badge className={status.class}>{status.label}</Badge>
              )}
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${analysis.score}%` }}
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Insight</p>
              <p className="text-sm">{analysis.insight}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Próxima Ação Sugerida</p>
              <p className="text-sm font-medium">{analysis.next_action}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">
            Clique em &quot;Analisar&quot; para obter insights com IA sobre este deal.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
