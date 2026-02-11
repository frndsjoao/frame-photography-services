import { getDb, Collections } from "../../../db";
import {
  DatabaseError,
  NotFoundError,
  UnauthorizedError,
} from "../../../errors/AppError";
import { updateFormSchema } from "../../../schemas/formSchema";
import { ProtectedHttpRequest, HttpResponse } from "../../../types/Http";
import { ok } from "../../../utils/http";

export class UpdateFormController {
  static async handle({
    params,
    userId,
    body,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const data = updateFormSchema.parse(body);
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
      await formRef.update({
        ...data,
        updatedAt: new Date(),
      });

      return ok({ id: formRef.id });
    } catch (err) {
      throw new DatabaseError("Failed to update form", err);
    }
  }
}
