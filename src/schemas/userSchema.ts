import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  photoURL: z.string().url("Invalid avatar URL").optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
