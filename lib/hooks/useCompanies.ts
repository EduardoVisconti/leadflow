"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Company, Contact, DealWithRelations } from "@/types"

export function useCompanies() {
  const supabase = createClient()

  return useQuery({
    queryKey: ["companies"],
    queryFn: async (): Promise<Company[]> => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as Company[]
    },
  })
}

export function useCompany(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ["companies", id],
    queryFn: async () => {
      const [companyRes, contactsRes, dealsRes] = await Promise.all([
        supabase.from("companies").select("*").eq("id", id).single(),
        supabase.from("contacts").select("*").eq("company_id", id).order("created_at", { ascending: false }),
        supabase
          .from("deals")
          .select("*, stage:pipeline_stages(*), contact:contacts(*)")
          .eq("company_id", id)
          .order("created_at", { ascending: false }),
      ])

      if (companyRes.error) throw companyRes.error

      return {
        company: companyRes.data as unknown as Company,
        contacts: (contactsRes.data ?? []) as unknown as Contact[],
        deals: (dealsRes.data ?? []) as unknown as DealWithRelations[],
      }
    },
    enabled: !!id,
  })
}

export function useCreateCompany() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (company: Record<string, unknown>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("companies")
        .insert({ ...company, user_id: user.id } as Record<string, unknown>)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
  })
}

export function useUpdateCompany() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...update }: { id: string; [key: string]: unknown }) => {
      const { data, error } = await supabase
        .from("companies")
        .update(update as Record<string, unknown>)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data as { id: string }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      queryClient.invalidateQueries({ queryKey: ["companies", data.id] })
    },
  })
}

export function useDeleteCompany() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("companies").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
  })
}
