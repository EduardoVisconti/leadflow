"use client"

import { usePipeline } from "@/lib/hooks/usePipeline"
import { useDeals } from "@/lib/hooks/useDeals"
import { PipelineChart } from "@/components/reports/PipelineChart"
import { ConversionFunnel } from "@/components/reports/ConversionFunnel"
import { RevenueChart } from "@/components/reports/RevenueChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils/currency"
import type { DealWithRelations } from "@/types"

export default function ReportsPage() {
  const { data: stages, isLoading: stagesLoading } = usePipeline()
  const { data: deals, isLoading: dealsLoading } = useDeals()

  const isLoading = stagesLoading || dealsLoading

  // Won deals for revenue chart
  const wonDeals = deals?.filter((d) => d.stage?.name === "Closed Won") ?? []

  // Top 5 biggest open deals (excluding Closed Won and Closed Lost)
  const openDeals = deals
    ?.filter((d) => d.stage?.name !== "Closed Won" && d.stage?.name !== "Closed Lost")
    .sort((a, b) => (Number(b.value) || 0) - (Number(a.value) || 0))
    .slice(0, 5) as DealWithRelations[] | undefined

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">Análises e insights do seu pipeline.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {stages && <PipelineChart stages={stages} />}
        {stages && <ConversionFunnel stages={stages} />}
        <RevenueChart deals={wonDeals} />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Maiores Deals em Aberto</CardTitle>
          </CardHeader>
          <CardContent>
            {!openDeals?.length ? (
              <p className="text-sm text-muted-foreground text-center py-6">Nenhum deal em aberto.</p>
            ) : (
              <div className="space-y-3">
                {openDeals.map((deal, i) => (
                  <div key={deal.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
                      <div>
                        <p className="text-sm font-medium">{deal.title}</p>
                        <p className="text-xs text-muted-foreground">{deal.stage?.name}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{formatCurrency(deal.value, deal.currency)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
