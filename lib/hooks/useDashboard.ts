"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { DashboardMetrics, DealWithRelations, Deal } from "@/types"

export function useDashboardMetrics() {
  const supabase = createClient()

  return useQuery({
    queryKey: ["dashboard", "metrics"],
    queryFn: async (): Promise<DashboardMetrics> => {
      const { data, error } = await supabase
        .from("deals")
        .select("*, stage:pipeline_stages(*)")

      if (error) throw error

      const deals = data as unknown as DealWithRelations[]
      const totalDeals = deals.length
      const totalValue = deals.reduce((sum, d) => sum + (Number(d.value) || 0), 0)
      const dealsWon = deals.filter((d) => d.stage?.name === "Closed Won").length
      const avgDealSize = totalDeals > 0 ? totalValue / totalDeals : 0

      return { totalDeals, totalValue, dealsWon, avgDealSize }
    },
  })
}

export function useRecentDeals() {
  const supabase = createClient()

  return useQuery({
    queryKey: ["dashboard", "recent-deals"],
    queryFn: async (): Promise<DealWithRelations[]> => {
      const { data, error } = await supabase
        .from("deals")
        .select(`*, contact:contacts(*), company:companies(*), stage:pipeline_stages(*)`)
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) throw error
      return data as unknown as DealWithRelations[]
    },
  })
}
