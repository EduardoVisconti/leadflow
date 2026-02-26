import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "O nome do produto é obrigatório"),
  brand: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  price: z.coerce.number().min(0).nullable().optional(),
  stock: z.coerce.number().int().min(0).optional(),
  description: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
  active: z.boolean().optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>
