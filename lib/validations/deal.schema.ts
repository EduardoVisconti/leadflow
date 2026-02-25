import { z } from "zod"

export const dealSchema = z.object({
  title: z.string().min(1, "Title is required"),
  value: z.coerce.number().min(0).nullable().optional(),
  currency: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  expected_close_date: z.string().nullable().optional(),
  contact_id: z.string().uuid().nullable().optional(),
  company_id: z.string().uuid().nullable().optional(),
  stage_id: z.string().uuid().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export type DealFormValues = z.infer<typeof dealSchema>
