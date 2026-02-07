import { getDb, Collections } from "../../../db";
import { ProtectedHttpRequest, HttpResponse } from "../../../types/Http";
import { ok } from "../../../utils/http";

export class ListPackagesController {
  static async handle({ userId }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb();

    const snapshot = await db
      .collection(Collections.PACKAGES)
      .where("photographerId", "==", userId)
      .get();

    const packages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return ok({ packages });
  }
}
