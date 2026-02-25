"use client"

import { useParams, useRouter } from "next/navigation"
import { useDeal, useDeleteDeal } from "@/lib/hooks/useDeals"
import { DealDetail } from "@/components/deals/DealDetail"
import { ActivityFeed } from "@/components/deals/ActivityFeed"
import { AIDealAnalysis } from "@/components/deals/AIDealAnalysis"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Trash2 } from "lucide-react"

export default function DealDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: deal, isLoading } = useDeal(id)
  const deleteDeal = useDeleteDeal()
  const { toast } = useToast()

  async function handleDelete() {
    try {
      await deleteDeal.mutateAsync(id)
      toast({ title: "Deal deleted" })
      router.push("/pipeline")
    } catch {
      toast({ title: "Error deleting deal", variant: "destructive" })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (!deal) {
    return <p className="text-muted-foreground">Deal not found.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Deal
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DealDetail deal={deal} />
          <ActivityFeed dealId={deal.id} />
        </div>
        <div>
          <AIDealAnalysis deal={deal} />
        </div>
      </div>
    </div>
  )
}
