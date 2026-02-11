import { getDb, Collections } from "../../../db";
import {
  DatabaseError,
  NotFoundError,
  UnauthorizedError,
} from "../../../errors/AppError";
import { ProtectedHttpRequest, HttpResponse } from "../../../types/Http";
import { noContent } from "../../../utils/http";

export class DeleteFormController {
  static async handle({
    params,
    userId,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb();
    const formRef = db.collection(Collections.FORMS).doc(params.id);
    const formDoc = await formRef.get();

    if (!formDoc.exists) {
      throw new NotFoundError("Form");
    }

    const form = formDoc.data();
    if (form?.photographerId !== userId) {
      throw new UnauthorizedError("You don't have access to this form");
    }

    try {
      await formRef.delete();

      return noContent();
    } catch (err) {
      throw new DatabaseError("Failed to delete form", err);
    }
  }
}
