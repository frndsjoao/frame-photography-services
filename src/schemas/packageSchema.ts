import { z } from "zod";

export const createPackageSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  price: z.number().min(1, "Price of the package is required"),
  description: z.string().optional(),
});

export type CreatePackageInput = z.infer<typeof createPackageSchema>;

export const updatePackageSchema = createPackageSchema.partial();

export type UpdatePackageInput = z.infer<typeof updatePackageSchema>;
