import { getDb, Collections } from "../../../db";
import { DatabaseError } from "../../../errors/AppError";
import { createFormSchema } from "../../../schemas/formSchema";
import { ProtectedHttpRequest, HttpResponse } from "../../../types/Http";
import { created } from "../../../utils/http";

export class CreateFormController {
  static async handle({
    body,
    userId,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const data = createFormSchema.parse(body);
    const db = getDb();

    try {
      const formRef = db.collection(Collections.FORMS).doc();

      await formRef.set({
        ...data,
        photographerId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return created({ id: formRef.id });
    } catch (err) {
      throw new DatabaseError("Failed to create form", err);
    }
  }
}
