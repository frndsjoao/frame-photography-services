import { getDb, Collections } from "../../db";
import { NotFoundError, UnauthorizedError } from "../../errors/AppError";
import { ProtectedHttpRequest, HttpResponse } from "../../types/Http";
import { ok } from "../../utils/http";

export class GetSessionController {
  static async handle({
    params,
    userId,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb();
    const sessionDoc = await db
      .collection(Collections.SESSIONS)
      .doc(params.id)
      .get();

    if (!sessionDoc.exists) {
      throw new NotFoundError("Session");
    }

    const session = sessionDoc.data();

    if (session?.photographerId !== userId) {
      throw new UnauthorizedError("You don't have access to this session");
    }

    return ok({ id: sessionDoc.id, ...session });
  }
}
