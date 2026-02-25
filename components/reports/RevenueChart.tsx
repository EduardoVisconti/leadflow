"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format, parseISO, startOfMonth } from "date-fns"
import type { Deal } from "@/types"

interface RevenueChartProps {
  deals: Deal[]
}

export function RevenueChart({ deals }: RevenueChartProps) {
  const wonDeals = deals.filter((d) => {
    // We check if it's in Closed Won - this is passed from the parent
    return d.value && d.value > 0
  })

  const monthlyData = wonDeals.reduce<Record<string, number>>((acc, deal) => {
    const month = format(startOfMonth(parseISO(deal.created_at)), "yyyy-MM")
    acc[month] = (acc[month] || 0) + Number(deal.value || 0)
    return acc
  }, {})

  const data = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => ({
      month: format(parseISO(`${month}-01`), "MMM yyyy"),
      value,
    }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Revenue Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No revenue data yet. Close some deals to see trends.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 12 }} />
              <YAxis className="text-xs" tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(value)
                }
                contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
