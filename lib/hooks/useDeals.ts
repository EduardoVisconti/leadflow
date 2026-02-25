"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { DealWithRelations } from "@/types"

export function useDeals() {
  const supabase = createClient()

  return useQuery({
    queryKey: ["deals"],
    queryFn: async (): Promise<DealWithRelations[]> => {
      const { data, error } = await supabase
        .from("deals")
        .select(`*, contact:contacts(*), company:companies(*), stage:pipeline_stages(*)`)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as unknown as DealWithRelations[]
    },
  })
}

export function useDeal(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ["deals", id],
    queryFn: async (): Promise<DealWithRelations> => {
      const { data, error } = await supabase
        .from("deals")
        .select(`*, contact:contacts(*), company:companies(*), stage:pipeline_stages(*)`)
        .eq("id", id)
        .single()

      if (error) throw error
      return data as unknown as DealWithRelations
    },
    enabled: !!id,
  })
}

export function useCreateDeal() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (deal: Record<string, unknown>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("deals")
        .insert({ ...deal, user_id: user.id } as Record<string, unknown>)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] })
      queryClient.invalidateQueries({ queryKey: ["pipeline"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}

export function useUpdateDeal() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...update }: { id: string; [key: string]: unknown }) => {
      const { data, error } = await supabase
        .from("deals")
        .update(update as Record<string, unknown>)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data as { id: string }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["deals"] })
      queryClient.invalidateQueries({ queryKey: ["deals", data.id] })
      queryClient.invalidateQueries({ queryKey: ["pipeline"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}

export function useDeleteDeal() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("deals").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] })
      queryClient.invalidateQueries({ queryKey: ["pipeline"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}
