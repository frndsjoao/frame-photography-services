import { getDb, Collections } from "../../../db";
import { ProtectedHttpRequest, HttpResponse } from "../../../types/Http";
import { ok } from "../../../utils/http";

export class ListFormsController {
  static async handle({ userId }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb();

    const snapshot = await db
      .collection(Collections.FORMS)
      .where("photographerId", "==", userId)
      .get();

    const forms = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return ok({ forms });
  }
}
