import { z } from "zod";
import { MaritalStatus } from "../types/MaritalStatus";

export const createClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  cpf: z.string().min(11, "Invalid CPF").max(14, "Invalid CPF").optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().min(11, "Phone must have the DDD").optional(),
  rg: z.string().optional(),
  nationality: z.string().optional(),
  maritalStatus: z.nativeEnum(MaritalStatus).optional(),
  address: z.string().optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
