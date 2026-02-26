"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { PipelineStage, StageWithDeals, DealWithRelations } from "@/types"

export function usePipeline() {
  const supabase = createClient()

  return useQuery({
    queryKey: ["pipeline"],
    queryFn: async (): Promise<StageWithDeals[]> => {
      const { data: stages, error: stagesError } = await supabase
        .from("pipeline_stages")
        .select("*")
        .order("position")

      if (stagesError) throw stagesError

      const { data: deals, error: dealsError } = await supabase
        .from("deals")
        .select(`*, contact:contacts(*), company:companies(*), product:products(*)`)
        .order("position")

      if (dealsError) throw dealsError

      const typedStages = stages as PipelineStage[]
      const typedDeals = deals as unknown as DealWithRelations[]

      return typedStages.map((stage) => ({
        ...stage,
        deals: typedDeals.filter((deal) => deal.stage_id === stage.id),
      }))
    },
  })
}

export function useMoveDeal() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      dealId,
      stageId,
      position,
    }: {
      dealId: string
      stageId: string
      position: number
    }) => {
      const { error } = await supabase
        .from("deals")
        .update({ stage_id: stageId, position } as Record<string, unknown>)
        .eq("id", dealId)

      if (error) throw error
    },
    onMutate: async ({ dealId, stageId, position }) => {
      await queryClient.cancelQueries({ queryKey: ["pipeline"] })
      const previous = queryClient.getQueryData<StageWithDeals[]>(["pipeline"])

      queryClient.setQueryData<StageWithDeals[]>(["pipeline"], (old) => {
        if (!old) return old

        let movedDeal: DealWithRelations | undefined

        const withoutDeal = old.map((stage) => ({
          ...stage,
          deals: stage.deals.filter((deal) => {
            if (deal.id === dealId) {
              movedDeal = { ...deal, stage_id: stageId, position }
              return false
            }
            return true
          }),
        }))

        if (!movedDeal) return old

        return withoutDeal.map((stage) => {
          if (stage.id !== stageId) return stage
          const deals = [...stage.deals]
          deals.splice(position, 0, movedDeal!)
          return { ...stage, deals }
        })
      })

      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["pipeline"], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline"] })
    },
  })
}
