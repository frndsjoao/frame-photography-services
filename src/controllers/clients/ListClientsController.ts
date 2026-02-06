import { getDb, Collections } from "../../db";
import { ProtectedHttpRequest, HttpResponse } from "../../types/Http";
import { ok } from "../../utils/http";

export class ListClientsController {
  static async handle({ userId }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb();

    const snapshot = await db
      .collection(Collections.CLIENTS)
      .where("photographerId", "==", userId)
      .get();

    const clients = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return ok({ clients });
  }
}
