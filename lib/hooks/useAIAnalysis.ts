"use client"

import { useMutation } from "@tanstack/react-query"
import type { AIAnalysis } from "@/types"

interface AnalyzeInput {
  title: string
  value: number | null
  stage: string
  daysInStage: number
  lastActivityDate: string | null
  activityCount: number
  expectedCloseDate: string | null
  priority: string
}

export function useAIAnalysis() {
  return useMutation({
    mutationFn: async (input: AnalyzeInput): Promise<AIAnalysis> => {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deal: input }),
      })

      if (response.status === 401) {
        // Session ended while the page was open.
        window.location.href = "/login"
      }

      if (!response.ok) {
        throw new Error("Failed to analyze deal")
      }

      return response.json()
    },
  })
}
