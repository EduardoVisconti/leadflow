"use client"

import Link from "next/link"
import { useRecentDeals } from "@/lib/hooks/useDashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils/currency"
import { timeAgo } from "@/lib/utils/date"
import { PRIORITY_CONFIG } from "@/lib/constants/pipeline"
import type { DealPriority } from "@/types"

export function RecentDeals() {
  const { data: deals, isLoading } = useRecentDeals()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Deals Recentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deals Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {!deals?.length ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum deal ainda. Crie seu primeiro deal no Pipeline.
          </p>
        ) : (
          <div className="space-y-4">
            {deals.map((deal) => {
              const priority = PRIORITY_CONFIG[deal.priority as DealPriority]
              return (
                <Link
                  key={deal.id}
                  href={`/deals/${deal.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{deal.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {deal.stage && (
                        <span className="text-xs text-muted-foreground">{deal.stage.name}</span>
                      )}
                      {priority && (
                        <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${priority.color}`}>
                          {priority.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-sm font-semibold">{formatCurrency(deal.value, deal.currency)}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(deal.created_at)}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
