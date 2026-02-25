"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { KanbanBoard } from "@/components/pipeline/KanbanBoard"
import { AddDealModal } from "@/components/pipeline/AddDealModal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function PipelinePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStageId, setSelectedStageId] = useState<string | undefined>()
  const router = useRouter()

  function handleAddDeal(stageId: string) {
    setSelectedStageId(stageId)
    setModalOpen(true)
  }

  function handleDealClick(dealId: string) {
    router.push(`/deals/${dealId}`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-muted-foreground">Drag deals between stages to update their progress.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Deal
        </Button>
      </div>

      <KanbanBoard onAddDeal={handleAddDeal} onDealClick={handleDealClick} />

      <AddDealModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedStageId(undefined)
        }}
        stageId={selectedStageId}
      />
    </div>
  )
}
