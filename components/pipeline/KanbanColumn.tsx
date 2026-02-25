"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DealCard } from "./DealCard"
import { formatCurrency } from "@/lib/utils/currency"
import type { StageWithDeals } from "@/types"

interface KanbanColumnProps {
  stage: StageWithDeals
  onAddDeal: (stageId: string) => void
  onDealClick: (dealId: string) => void
}

export function KanbanColumn({ stage, onAddDeal, onDealClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })

  const totalValue = stage.deals.reduce((sum, deal) => sum + (deal.value || 0), 0)
  const dealIds = stage.deals.map((deal) => deal.id)

  return (
    <div className="flex flex-col w-[300px] shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: stage.color }}
          />
          <h3 className="font-semibold text-sm">{stage.name}</h3>
          <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
            {stage.deals.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onAddDeal(stage.id)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {totalValue > 0 && (
        <p className="text-xs text-muted-foreground mb-2 px-1">
          {formatCurrency(totalValue)}
        </p>
      )}

      <SortableContext items={dealIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex-1 space-y-2 rounded-lg p-2 min-h-[200px] transition-colors ${
            isOver ? "bg-primary/5 ring-2 ring-primary/20" : "bg-muted/30"
          }`}
        >
          {stage.deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onClick={() => onDealClick(deal.id)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
