import { getDb, Collections } from "../../../db";
import { DatabaseError, NotFoundError } from "../../../errors/AppError";
import { updatePaymentPlanSchema } from "../../../schemas/paymentPlanSchema";
import { ProtectedHttpRequest, HttpResponse } from "../../../types/Http";
import { ok } from "../../../utils/http";

export class UpdatePaymentPlanController {
  static async handle({
    body,
    userId,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const data = updatePaymentPlanSchema.parse(body);
    const db = getDb();

    const planRef = db.collection(Collections.PAYMENT_PLANS).doc(userId);
    const planDoc = await planRef.get();

    if (!planDoc.exists) {
      throw new NotFoundError("Payment plan");
    }

    try {
      await planRef.update({
        ...data,
        updatedAt: new Date(),
      });

      return ok({ id: userId });
    } catch (err) {
      throw new DatabaseError("Failed to update payment plan", err);
    }
  }
}
