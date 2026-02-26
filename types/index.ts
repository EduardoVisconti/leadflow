import type { Database } from "@/lib/supabase/types"

export type Company = Database["public"]["Tables"]["companies"]["Row"]
export type CompanyInsert = Database["public"]["Tables"]["companies"]["Insert"]
export type CompanyUpdate = Database["public"]["Tables"]["companies"]["Update"]

export type Contact = Database["public"]["Tables"]["contacts"]["Row"]
export type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"]
export type ContactUpdate = Database["public"]["Tables"]["contacts"]["Update"]

export type PipelineStage = Database["public"]["Tables"]["pipeline_stages"]["Row"]
export type PipelineStageInsert = Database["public"]["Tables"]["pipeline_stages"]["Insert"]

export type Deal = Database["public"]["Tables"]["deals"]["Row"]
export type DealInsert = Database["public"]["Tables"]["deals"]["Insert"]
export type DealUpdate = Database["public"]["Tables"]["deals"]["Update"]

export type Activity = Database["public"]["Tables"]["activities"]["Row"]
export type ActivityInsert = Database["public"]["Tables"]["activities"]["Insert"]
export type ActivityUpdate = Database["public"]["Tables"]["activities"]["Update"]

export type Product = Database["public"]["Tables"]["products"]["Row"]
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"]
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"]

export type Task = Database["public"]["Tables"]["tasks"]["Row"]
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"]
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"]

export type ActivityType = "note" | "call" | "email" | "meeting" | "task"
export type DealPriority = "low" | "medium" | "high"
export type DealStatus = "hot" | "on_track" | "at_risk" | "stalled"
export type DealSource = "whatsapp" | "instagram" | "indicacao" | "site" | "outro"

export interface DealWithRelations extends Deal {
  contact?: Contact | null
  company?: Company | null
  stage?: PipelineStage | null
  product?: Product | null
}

export interface ContactWithCompany extends Contact {
  company?: Company | null
}

export interface StageWithDeals extends PipelineStage {
  deals: DealWithRelations[]
}

export interface TaskWithRelations extends Task {
  deal?: Deal | null
  contact?: Contact | null
}

export interface AIAnalysis {
  score: number
  status: DealStatus
  insight: string
  next_action: string
}

export interface DashboardMetrics {
  totalDeals: number
  totalValue: number
  dealsWon: number
  avgDealSize: number
}
