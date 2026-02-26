import { z } from "zod"

export const contactSchema = z.object({
  first_name: z.string().min(1, "O nome é obrigatório"),
  last_name: z.string().min(1, "O sobrenome é obrigatório"),
  email: z.string().email("Email inválido").or(z.literal("")).nullable().optional(),
  phone: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  company_id: z.string().uuid().nullable().optional(),
  notes: z.string().nullable().optional(),
  channel: z.enum(["whatsapp", "instagram", "telefone", "email"]).nullable().optional(),
  instagram_handle: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
})

export type ContactFormValues = z.infer<typeof contactSchema>
