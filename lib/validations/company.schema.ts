import { z } from "zod"

export const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  website: z.string().url("Invalid URL").or(z.literal("")).nullable().optional(),
  industry: z.string().nullable().optional(),
  size: z.enum(["1-10", "11-50", "51-200", "200+"]).nullable().optional(),
})

export type CompanyFormValues = z.infer<typeof companySchema>
