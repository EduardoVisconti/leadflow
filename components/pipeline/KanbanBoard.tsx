"use client"

import { useState, useCallback } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { usePipeline, useMoveDeal } from "@/lib/hooks/usePipeline"
import { KanbanColumn } from "./KanbanColumn"
import { DealCard } from "./DealCard"
import { Skeleton } from "@/components/ui/skeleton"
import type { DealWithRelations, StageWithDeals } from "@/types"

interface KanbanBoardProps {
  onAddDeal: (stageId: string) => void
  onDealClick: (dealId: string) => void
}

export function KanbanBoard({ onAddDeal, onDealClick }: KanbanBoardProps) {
  const { data: stages, isLoading } = usePipeline()
  const moveDeal = useMoveDeal()
  const [activeDeal, setActiveDeal] = useState<DealWithRelations | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const findStageByDealId = useCallback(
    (dealId: string): StageWithDeals | undefined => {
      return stages?.find((stage) =>
        stage.deals.some((deal) => deal.id === dealId)
      )
    },
    [stages]
  )

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const stage = findStageByDealId(active.id as string)
    const deal = stage?.deals.find((d) => d.id === active.id)
    if (deal) setActiveDeal(deal)
  }

  function handleDragOver(event: DragOverEvent) {
    // Handled in drag end for simplicity with optimistic updates
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveDeal(null)

    if (!over || !stages) return

    const activeId = active.id as string
    const overId = over.id as string

    // Determine target stage: either drop on column or on another deal
    let targetStageId: string
    const overStage = stages.find((s) => s.id === overId)
    if (overStage) {
      targetStageId = overStage.id
    } else {
      const overDealStage = findStageByDealId(overId)
      if (!overDealStage) return
      targetStageId = overDealStage.id
    }

    const sourceStage = findStageByDealId(activeId)
    if (!sourceStage) return

    // Calculate position
    const targetStage = stages.find((s) => s.id === targetStageId)
    let position = 0
    if (targetStage) {
      const overDealIndex = targetStage.deals.findIndex((d) => d.id === overId)
      position = overDealIndex >= 0 ? overDealIndex : targetStage.deals.length
    }

    if (sourceStage.id === targetStageId && position === sourceStage.deals.findIndex((d) => d.id === activeId)) {
      return
    }

    moveDeal.mutate({ dealId: activeId, stageId: targetStageId, position })
  }

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-[300px] shrink-0 space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (!stages?.length) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        <p>Nenhum estágio do pipeline encontrado. Verifique sua configuração do Supabase.</p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            onAddDeal={onAddDeal}
            onDealClick={onDealClick}
          />
        ))}
      </div>
      <DragOverlay>
        {activeDeal ? <DealCard deal={activeDeal} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
