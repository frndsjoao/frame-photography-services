import { getDb, Collections } from "../../db";
import { DatabaseError } from "../../errors/AppError";
import { createClientSchema } from "../../schemas/clientSchema";
import { ProtectedHttpRequest, HttpResponse } from "../../types/Http";
import { created } from "../../utils/http";

export class CreateClientController {
  static async handle({ body, userId }: ProtectedHttpRequest): Promise<HttpResponse> {
    const data = createClientSchema.parse(body);
    const db = getDb();

    try {
      const clientRef = db.collection(Collections.CLIENTS).doc();

      await clientRef.set({
        ...data,
        photographerId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return created({ id: clientRef.id });
    } catch (err) {
      throw new DatabaseError("Failed to create client", err);
    }
  }
}
