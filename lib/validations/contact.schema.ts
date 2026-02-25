import { z } from "zod"

export const contactSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").or(z.literal("")).nullable().optional(),
  phone: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  company_id: z.string().uuid().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export type ContactFormValues = z.infer<typeof contactSchema>
