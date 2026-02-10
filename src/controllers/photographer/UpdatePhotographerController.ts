import { getDb, Collections } from "../../db";
import {
  DatabaseError,
  NotFoundError,
  UnauthorizedError,
} from "../../errors/AppError";
import { updatePhotographerSchema } from "../../schemas/photographerSchema";
import { ProtectedHttpRequest, HttpResponse } from "../../types/Http";
import { ok } from "../../utils/http";

export class UpdatePhotographerController {
  static async handle({
    params,
    userId,
    body,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const data = updatePhotographerSchema.parse(body);
    const db = getDb();

    const photographerRef = db.collection(Collections.USERS).doc(params.id);
    const photographerDoc = await photographerRef.get();

    if (!photographerDoc.exists) {
      throw new NotFoundError("Photographer");
    }

    const user = photographerDoc.data();
    if (user?.photographerId !== userId) {
      throw new UnauthorizedError("You don't have access to this photographer");
    }

    try {
      await photographerRef.update({
        ...data,
        updatedAt: new Date(),
      });

      return ok({ id: photographerRef.id });
    } catch (err) {
      throw new DatabaseError("Failed to update photographer", err);
    }
  }
}
