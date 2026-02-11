import { getDb, Collections } from "../../../db";
import { NotFoundError, UnauthorizedError } from "../../../errors/AppError";
import { ProtectedHttpRequest, HttpResponse } from "../../../types/Http";
import { ok } from "../../../utils/http";

export class GetFormController {
  static async handle({
    params,
    userId,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb();
    const formDoc = await db.collection(Collections.FORMS).doc(params.id).get();

    if (!formDoc.exists) {
      throw new NotFoundError("Form");
    }

    const form = formDoc.data();

    if (form?.photographerId !== userId) {
      throw new UnauthorizedError("You don't have access to this form");
    }

    return ok({ id: formDoc.id, ...form });
  }
}
