import { Response } from "express";
import { ProtectedHttpRequest } from "../../types/Http";
import { methodHandler } from "../../utils/methodHandler";
import { GetPaymentPlanController } from "../../controllers/photographer/paymentPlan/GetPaymentPlanController";
import { CreatePaymentPlanController } from "../../controllers/photographer/paymentPlan/CreatePaymentPlanController";
import { UpdatePaymentPlanController } from "../../controllers/photographer/paymentPlan/UpdatePaymentPlanController";

export async function handlePaymentPlan(
  req: { method: string },
  res: Response,
  request: ProtectedHttpRequest,
) {
  await methodHandler(req, res, {
    GET: () => GetPaymentPlanController.handle(request),
    POST: () => CreatePaymentPlanController.handle(request),
    PATCH: () => UpdatePaymentPlanController.handle(request),
  });
}
