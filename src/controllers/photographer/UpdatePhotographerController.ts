import { getDb, Collections } from "../../db";
import { DatabaseError, NotFoundError } from "../../errors/AppError";
import { updatePhotographerSchema } from "../../schemas/photographerSchema";
import { ProtectedHttpRequest, HttpResponse } from "../../types/Http";
import { ok } from "../../utils/http";

export class UpdatePhotographerController {
  static async handle({
    userId,
    body,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const data = updatePhotographerSchema.parse(body);
    const db = getDb();

    const photographerRef = db.collection(Collections.USERS).doc(userId);
    const photographerDoc = await photographerRef.get();

    if (!photographerDoc.exists) {
      throw new NotFoundError("Photographer");
    }

    try {
      await photographerRef.update({
        ...data,
        updatedAt: new Date(),
      });

      return ok({ id: userId });
    } catch (err) {
      throw new DatabaseError("Failed to update photographer", err);
    }
  }
}
