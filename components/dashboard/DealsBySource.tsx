"use client"

import { useMemo } from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { useDeals } from "@/lib/hooks/useDeals"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const SOURCE_CONFIG: Record<string, { label: string; color: string }> = {
  whatsapp: { label: "WhatsApp", color: "#25D366" },
  instagram: { label: "Instagram", color: "#E4405F" },
  indicacao: { label: "Indicação", color: "#60a5fa" },
  site: { label: "Site", color: "#f59e0b" },
  outro: { label: "Outro", color: "#94a3b8" },
}

export function DealsBySource() {
  const { data: deals, isLoading } = useDeals()

  const chartData = useMemo(() => {
    if (!deals?.length) return []

    const counts: Record<string, number> = {}

    deals.forEach((deal) => {
      const source = deal.source && deal.source in SOURCE_CONFIG ? deal.source : "outro"
      counts[source] = (counts[source] || 0) + 1
    })

    return Object.entries(counts).map(([key, value]) => ({
      name: SOURCE_CONFIG[key].label,
      value,
      color: SOURCE_CONFIG[key].color,
    }))
  }, [deals])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Deals por Origem</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <Skeleton className="h-[250px] w-[250px] rounded-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deals por Origem</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum dado disponível.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value} deals`, ""]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--popover))",
                  color: "hsl(var(--popover-foreground))",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
