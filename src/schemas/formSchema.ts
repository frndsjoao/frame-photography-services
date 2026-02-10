import { z } from "zod";
import { FormFieldType } from "../types/FormFieldType";

export const createFormSchema = z.object({
  name: z.string().min(1, "Form name is required"),
  fields: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        type: z.nativeEnum(FormFieldType),
        required: z.boolean().optional(),
      }),
    )
    .min(1),
  active: z.boolean(),
});

export type CreateFormInput = z.infer<typeof createFormSchema>;

export const updateFormSchema = createFormSchema.partial();

export type UpdateFormInput = z.infer<typeof updateFormSchema>;
