"use client"

import { useMemo } from "react"
import { Handshake, DollarSign, Trophy, TrendingUp, CheckSquare, AlertTriangle } from "lucide-react"
import { isToday, isPast, startOfDay, parseISO } from "date-fns"
import { useDashboardMetrics } from "@/lib/hooks/useDashboard"
import { useTasks } from "@/lib/hooks/useTasks"
import { useDeals } from "@/lib/hooks/useDeals"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { RecentDeals } from "@/components/dashboard/RecentDeals"
import { TodaysTasks } from "@/components/dashboard/TodaysTasks"
import { DealsBySource } from "@/components/dashboard/DealsBySource"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils/currency"
import { daysSince } from "@/lib/utils/date"

export default function DashboardPage() {
  const { data: metrics, isLoading } = useDashboardMetrics()
  const { data: tasks, isLoading: isLoadingTasks } = useTasks()
  const { data: deals, isLoading: isLoadingDeals } = useDeals()

  const pendingTasksToday = useMemo(() => {
    if (!tasks) return 0
    return tasks.filter((task) => {
      if (task.done) return false
      if (!task.due_date) return false
      const dueDate = startOfDay(parseISO(task.due_date))
      return isToday(dueDate) || isPast(dueDate)
    }).length
  }, [tasks])

  const dealsAtRisk = useMemo(() => {
    if (!deals) return 0
    return deals.filter((deal) => {
      if (!deal.updated_at) return false
      const stageName = deal.stage?.name
      if (stageName === "Closed Won" || stageName === "Closed Lost") return false
      return daysSince(deal.updated_at) > 7
    }).length
  }, [deals])

  const isLoadingAll = isLoading || isLoadingTasks || isLoadingDeals

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu pipeline de vendas.</p>
      </div>

      {isLoadingAll ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
          <MetricCard
            title="Total de Deals"
            value={String(metrics?.totalDeals ?? 0)}
            icon={Handshake}
          />
          <MetricCard
            title="Valor Total"
            value={formatCurrency(metrics?.totalValue ?? 0)}
            icon={DollarSign}
          />
          <MetricCard
            title="Deals Ganhos"
            value={String(metrics?.dealsWon ?? 0)}
            icon={Trophy}
          />
          <MetricCard
            title="Ticket Médio"
            value={formatCurrency(metrics?.avgDealSize ?? 0)}
            icon={TrendingUp}
          />
          <MetricCard
            title="Tarefas Pendentes Hoje"
            value={String(pendingTasksToday)}
            icon={CheckSquare}
          />
          <MetricCard
            title="Deals em Risco"
            value={String(dealsAtRisk)}
            icon={AlertTriangle}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentDeals />
        <TodaysTasks />
        <DealsBySource />
      </div>
    </div>
  )
}
