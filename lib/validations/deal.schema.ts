import { z } from "zod"

export const dealSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  value: z.coerce.number().min(0).nullable().optional(),
  currency: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  expected_close_date: z.string().nullable().optional(),
  contact_id: z.string().uuid().nullable().optional(),
  company_id: z.string().uuid().nullable().optional(),
  stage_id: z.string().uuid().nullable().optional(),
  notes: z.string().nullable().optional(),
  source: z.enum(["whatsapp", "instagram", "indicacao", "site", "outro"]).optional(),
  product_id: z.string().uuid().nullable().optional(),
})

export type DealFormValues = z.infer<typeof dealSchema>
