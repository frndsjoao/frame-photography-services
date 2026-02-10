import { getDb, Collections } from "../../db";
import {
  DatabaseError,
  NotFoundError,
  UnauthorizedError,
} from "../../errors/AppError";
import { ProtectedHttpRequest, HttpResponse } from "../../types/Http";
import { noContent } from "../../utils/http";

export class DeleteClientController {
  static async handle({
    params,
    userId,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb();
    const clientRef = await db.collection(Collections.CLIENTS).doc(params.id);
    const clientDoc = await clientRef.get();

    if (!clientDoc.exists) {
      throw new NotFoundError("Client");
    }

    const client = clientDoc.data();
    if (client?.photographerId !== userId) {
      throw new UnauthorizedError("You don't have access to this client");
    }

    try {
      await clientRef.delete();

      return noContent();
    } catch (err) {
      throw new DatabaseError("Failed to delete client", err);
    }
  }
}
