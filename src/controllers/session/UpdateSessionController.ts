import { getDb, Collections } from "../../db";
import {
  DatabaseError,
  NotFoundError,
  UnauthorizedError,
} from "../../errors/AppError";
import { updateSessionSchema } from "../../schemas/sessionSchema";
import { ProtectedHttpRequest, HttpResponse } from "../../types/Http";
import { ok } from "../../utils/http";

export class UpdateSessionController {
  static async handle({
    params,
    userId,
    body,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const data = updateSessionSchema.parse(body);
    const db = getDb();

    const sessionRef = db.collection(Collections.SESSIONS).doc(params.id);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      throw new NotFoundError("Session");
    }

    const session = sessionDoc.data();
    if (session?.photographerId !== userId) {
      throw new UnauthorizedError("You don't have access to this session");
    }

    try {
      await sessionRef.update({
        ...data,
        updatedAt: new Date(),
      });

      return ok({ id: sessionRef.id });
    } catch (err) {
      throw new DatabaseError("Failed to update session", err);
    }
  }
}
