"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { ContactWithCompany } from "@/types"

export function useContacts() {
  const supabase = createClient()

  return useQuery({
    queryKey: ["contacts"],
    queryFn: async (): Promise<ContactWithCompany[]> => {
      const { data, error } = await supabase
        .from("contacts")
        .select("*, company:companies(*)")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as unknown as ContactWithCompany[]
    },
  })
}

export function useContact(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ["contacts", id],
    queryFn: async (): Promise<ContactWithCompany> => {
      const { data, error } = await supabase
        .from("contacts")
        .select("*, company:companies(*)")
        .eq("id", id)
        .single()

      if (error) throw error
      return data as unknown as ContactWithCompany
    },
    enabled: !!id,
  })
}

export function useCreateContact() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (contact: Record<string, unknown>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("contacts")
        .insert({ ...contact, user_id: user.id } as Record<string, unknown>)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] })
    },
  })
}

export function useUpdateContact() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...update }: { id: string; [key: string]: unknown }) => {
      const { data, error } = await supabase
        .from("contacts")
        .update(update as Record<string, unknown>)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data as { id: string }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] })
      queryClient.invalidateQueries({ queryKey: ["contacts", data.id] })
    },
  })
}

export function useDeleteContact() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contacts").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] })
    },
  })
}
