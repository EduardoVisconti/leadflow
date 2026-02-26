import { z } from "zod"

export const taskSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().nullable().optional(),
  deal_id: z.string().uuid().nullable().optional(),
  contact_id: z.string().uuid().nullable().optional(),
  due_date: z.string().nullable().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
})

export type TaskFormValues = z.infer<typeof taskSchema>
