"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDeals } from "@/lib/hooks/useDeals"
import { usePipeline } from "@/lib/hooks/usePipeline"
import { AddDealModal } from "@/components/pipeline/AddDealModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Search } from "lucide-react"
import { formatCurrency } from "@/lib/utils/currency"
import { formatDate, isOverdue } from "@/lib/utils/date"
import { PRIORITY_CONFIG } from "@/lib/constants/pipeline"
import type { DealPriority } from "@/types"

export default function DealsPage() {
  const { data: deals, isLoading } = useDeals()
  const { data: stages } = usePipeline()
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filtered = deals?.filter((deal) => {
    const matchesSearch = deal.title.toLowerCase().includes(search.toLowerCase())
    const matchesStage = stageFilter === "all" || deal.stage_id === stageFilter
    const matchesPriority = priorityFilter === "all" || deal.priority === priorityFilter
    return matchesSearch && matchesStage && matchesPriority
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Deals</h1>
          <p className="text-muted-foreground">All your deals in one place.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Deal
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search deals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {stages?.map((stage) => (
              <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Close Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!filtered?.length ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No deals found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((deal) => {
                  const priority = PRIORITY_CONFIG[deal.priority as DealPriority]
                  const overdue = isOverdue(deal.expected_close_date)
                  return (
                    <TableRow
                      key={deal.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/deals/${deal.id}`)}
                    >
                      <TableCell className="font-medium">{deal.title}</TableCell>
                      <TableCell>{formatCurrency(deal.value, deal.currency)}</TableCell>
                      <TableCell>
                        {deal.stage && (
                          <Badge variant="secondary" style={{ borderLeftColor: deal.stage.color, borderLeftWidth: 3 }}>
                            {deal.stage.name}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {priority && (
                          <Badge variant="secondary" className={priority.color}>
                            {priority.label}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {deal.contact ? `${deal.contact.first_name} ${deal.contact.last_name}` : "-"}
                      </TableCell>
                      <TableCell>
                        <span className={overdue ? "text-destructive font-medium" : "text-muted-foreground"}>
                          {formatDate(deal.expected_close_date)}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <AddDealModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
