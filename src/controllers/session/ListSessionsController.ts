import { getDb, Collections } from "../../db";
import { ProtectedHttpRequest, HttpResponse } from "../../types/Http";
import { ok } from "../../utils/http";

export class ListSessionsController {
  static async handle({ userId }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb();

    const snapshot = await db
      .collection(Collections.SESSIONS)
      .where("photographerId", "==", userId)
      .get();

    const sessions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return ok({ sessions });
  }
}
