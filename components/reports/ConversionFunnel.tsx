"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StageWithDeals } from "@/types"

interface ConversionFunnelProps {
  stages: StageWithDeals[]
}

export function ConversionFunnel({ stages }: ConversionFunnelProps) {
  const activeStages = stages.filter(
    (s) => s.name !== "Closed Won" && s.name !== "Closed Lost"
  )
  const maxCount = Math.max(...activeStages.map((s) => s.deals.length), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Funil de Conversão</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeStages.map((stage, index) => {
            const width = Math.max((stage.deals.length / maxCount) * 100, 10)
            const prevCount = index > 0 ? activeStages[index - 1].deals.length : null
            const conversionRate =
              prevCount && prevCount > 0
                ? Math.round((stage.deals.length / prevCount) * 100)
                : null

            return (
              <div key={stage.id}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">{stage.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {stage.deals.length} deals
                    </span>
                    {conversionRate !== null && (
                      <span className="text-xs text-muted-foreground">
                        ({conversionRate}%)
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-8 flex items-center justify-center mx-auto">
                  <div
                    className="h-full rounded-full transition-all flex items-center justify-center"
                    style={{
                      width: `${width}%`,
                      backgroundColor: stage.color,
                    }}
                  >
                    <span className="text-xs font-medium text-white drop-shadow">
                      {stage.deals.length}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
