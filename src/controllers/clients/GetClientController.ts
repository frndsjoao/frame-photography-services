import { getDb, Collections } from "../../db";
import { NotFoundError, UnauthorizedError } from "../../errors/AppError";
import { ProtectedHttpRequest, HttpResponse } from "../../types/Http";
import { ok } from "../../utils/http";

export class GetClientController {
  static async handle({ params, userId }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb();
    const clientDoc = await db.collection(Collections.CLIENTS).doc(params.id).get();

    if (!clientDoc.exists) {
      throw new NotFoundError("Client");
    }

    const client = clientDoc.data();

    if (client?.photographerId !== userId) {
      throw new UnauthorizedError("You don't have access to this client");
    }

    return ok({ id: clientDoc.id, ...client });
  }
}
