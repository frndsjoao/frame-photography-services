import { z } from "zod";

export const createPhotographerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  photoURL: z.string().url("Invalid photo URL").optional(),
  documentType: z.enum(["CNPJ", "CPF"]).optional(),
  document: z.string().optional(),
  status: z.string().optional(),
  cashFlowMode: z.enum(["BY_PAYMENT", "BY_SESSION_COMPLETION"]).optional(),
});

export type CreatePhotographerInput = z.infer<typeof createPhotographerSchema>;

export const updatePhotographerSchema = createPhotographerSchema.partial();

export type UpdatePhotographerInput = z.infer<typeof updatePhotographerSchema>;
