import { z } from "zod";

export const createPhotographerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  photoURL: z.string().url("Invalid photo URL").optional(),
});

export type CreatePhotographerInput = z.infer<typeof createPhotographerSchema>;
