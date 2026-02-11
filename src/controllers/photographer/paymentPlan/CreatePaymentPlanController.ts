import { getDb, Collections } from "../../../db";
import { DatabaseError } from "../../../errors/AppError";
import { createPaymentPlanSchema } from "../../../schemas/paymentPlanSchema";
import { ProtectedHttpRequest, HttpResponse } from "../../../types/Http";
import { created } from "../../../utils/http";

export class CreatePaymentPlanController {
  static async handle({
    body,
    userId,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const data = createPaymentPlanSchema.parse(body);
    const db = getDb();

    try {
      await db.collection(Collections.PAYMENT_PLANS).doc(userId).set({
        ...data,
        photographerId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return created({ id: userId });
    } catch (err) {
      throw new DatabaseError("Failed to create payment plan", err);
    }
  }
}
