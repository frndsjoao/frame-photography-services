import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  cpf: z.string().min(11, "Invalid CPF").max(14, "Invalid CPF"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
