import { getDb, Collections } from "../../db";
import {
  DatabaseError,
  NotFoundError,
  UnauthorizedError,
} from "../../errors/AppError";
import { updateClientSchema } from "../../schemas/clientSchema";
import { ProtectedHttpRequest, HttpResponse } from "../../types/Http";
import { ok } from "../../utils/http";

export class UpdateClientController {
  static async handle({
    params,
    userId,
    body,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const data = updateClientSchema.parse(body);
    const db = getDb();

    const clientRef = db.collection(Collections.CLIENTS).doc(params.id);
    const clientDoc = await clientRef.get();

    if (!clientDoc.exists) {
      throw new NotFoundError("Client");
    }

    const client = clientDoc.data();
    if (client?.photographerId !== userId) {
      throw new UnauthorizedError("You don't have access to this client");
    }

    try {
      await clientRef.update({
        ...data,
        updatedAt: new Date(),
      });

      return ok({ id: clientRef.id });
    } catch (err) {
      throw new DatabaseError("Failed to update client", err);
    }
  }
}
