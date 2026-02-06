import { getDb, Collections } from "../../db";
import { NotFoundError } from "../../errors/AppError";
import { ProtectedHttpRequest, HttpResponse } from "../../types/Http";
import { ok } from "../../utils/http";

export class GetUserController {
  static async handle({ userId }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb();
    const userDoc = await db.collection(Collections.USERS).doc(userId).get();

    if (!userDoc.exists) {
      throw new NotFoundError("User");
    }

    return ok({ id: userDoc.id, ...userDoc.data() });
  }
}
