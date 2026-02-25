"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Activity } from "@/types"

export function useActivities(dealId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ["activities", dealId],
    queryFn: async (): Promise<Activity[]> => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("deal_id", dealId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as Activity[]
    },
    enabled: !!dealId,
  })
}

export function useCreateActivity() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (activity: Record<string, unknown>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("activities")
        .insert({ ...activity, user_id: user.id } as Record<string, unknown>)
        .select()
        .single()

      if (error) throw error
      return data as Activity
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["activities", data.deal_id] })
    },
  })
}

export function useToggleActivity() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, done }: { id: string; done: boolean }) => {
      const { data, error } = await supabase
        .from("activities")
        .update({ done } as Record<string, unknown>)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data as Activity
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["activities", data.deal_id] })
    },
  })
}

export function useDeleteActivity() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, dealId }: { id: string; dealId: string }) => {
      const { error } = await supabase.from("activities").delete().eq("id", id)
      if (error) throw error
      return dealId
    },
    onSuccess: (dealId) => {
      queryClient.invalidateQueries({ queryKey: ["activities", dealId] })
    },
  })
}
