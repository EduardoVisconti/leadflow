"use client"

import { Handshake, DollarSign, Trophy, TrendingUp } from "lucide-react"
import { useDashboardMetrics } from "@/lib/hooks/useDashboard"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { RecentDeals } from "@/components/dashboard/RecentDeals"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils/currency"

export default function DashboardPage() {
  const { data: metrics, isLoading } = useDashboardMetrics()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your sales pipeline.</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <MetricCard
            title="Total Deals"
            value={String(metrics?.totalDeals ?? 0)}
            icon={Handshake}
          />
          <MetricCard
            title="Total Value"
            value={formatCurrency(metrics?.totalValue ?? 0)}
            icon={DollarSign}
          />
          <MetricCard
            title="Deals Won"
            value={String(metrics?.dealsWon ?? 0)}
            icon={Trophy}
          />
          <MetricCard
            title="Avg Deal Size"
            value={formatCurrency(metrics?.avgDealSize ?? 0)}
            icon={TrendingUp}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentDeals />
      </div>
    </div>
  )
}
