import { getDb, Collections } from "../../db";
import { DatabaseError } from "../../errors/AppError";
import { createSessionSchema } from "../../schemas/sessionSchema";
import { ProtectedHttpRequest, HttpResponse } from "../../types/Http";
import { created } from "../../utils/http";

export class CreateSessionController {
  static async handle({
    body,
    userId,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const data = createSessionSchema.parse(body);
    const db = getDb();

    try {
      const sessionRef = db.collection(Collections.SESSIONS).doc();

      await sessionRef.set({
        ...data,
        photographerId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return created({ id: sessionRef.id });
    } catch (err) {
      throw new DatabaseError("Failed to create new session", err);
    }
  }
}
