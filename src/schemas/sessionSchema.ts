import { z } from "zod";
import { PaymentPlanType } from "../types/PaymentPlanType";
import { SessionStatus } from "../types/SessionStatus";

export const createSessionSchema = z.object({
  clientId: z.string(),
  source: z.enum(["FORM", "MANUAL"]),
  status: z.nativeEnum(SessionStatus),

  eventDateTime: z.string().optional(),
  eventLocation: z.string().optional(),

  packageId: z.string().optional(),
  packageSnapshot: z
    .object({
      name: z.string(),
      basePrice: z.number(),
      description: z.string(),
    })
    .optional(),

  finalPrice: z.number().optional(),
  paymentPlanSnapshot: z
    .object({
      type: z.nativeEnum(PaymentPlanType),
      depositPercentage: z.number().optional(),
      maxInstallments: z.number().min(1),
    })
    .optional(),
  paymentSnapshot: z
    .object({
      depositAmount: z.number().optional(),
      depositPercentage: z.number().optional(),
      finalAmount: z.number(),
      installmentsCount: z.number().min(1),
      installmentValue: z.number(),
      totalAmount: z.number(),
    })
    .optional(),

  notes: z.string().optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

export const updateSessionSchema = createSessionSchema.partial();

export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
