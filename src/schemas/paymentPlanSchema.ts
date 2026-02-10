import { z } from "zod";
import { PaymentPlanType } from "../types/PaymentPlanType";

export const createPaymentPlanSchema = z.object({
  type: z.nativeEnum(PaymentPlanType),

  // just for DEPOSIT_AND_FINAL
  depositPercentage: z.number().min(0).max(100).optional(),

  // just for INSTALLMENTS
  installmentsCount: z.number().min(1).optional(),

  active: z.boolean().default(true),
});

export type CreatePaymentPlanInput = z.infer<typeof createPaymentPlanSchema>;

export const updatePaymentPlanSchema = createPaymentPlanSchema.partial();

export type UpdatePaymentPlanInput = z.infer<typeof updatePaymentPlanSchema>;
