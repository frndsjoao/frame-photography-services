import { getDb, Collections } from "../../../db";
import { NotFoundError } from "../../../errors/AppError";
import { ProtectedHttpRequest, HttpResponse } from "../../../types/Http";
import { ok } from "../../../utils/http";

export class GetPaymentPlanController {
  static async handle({ userId }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb();
    const planDoc = await db.collection(Collections.PAYMENT_PLANS).doc(userId).get();

    if (!planDoc.exists) {
      throw new NotFoundError("Payment plan");
    }

    return ok({ id: planDoc.id, ...planDoc.data() });
  }
}
