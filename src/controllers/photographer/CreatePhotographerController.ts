import { getDb, Collections } from "../../db";
import { DatabaseError } from "../../errors/AppError";
import { createPhotographerSchema } from "../../schemas/photographerSchema";
import { ProtectedHttpRequest, HttpResponse } from "../../types/Http";
import { created } from "../../utils/http";

export class CreatePhotographerController {
  static async handle({
    body,
    userId,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const data = createPhotographerSchema.parse(body);
    const db = getDb();

    try {
      await db
        .collection(Collections.USERS)
        .doc(userId)
        .set({
          name: data.name,
          email: data.email,
          avatarURL: data.photoURL ?? null,
          documentType: null,
          document: null,
          status: "active",
          cashFlowMode: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      return created({ id: userId });
    } catch (err) {
      throw new DatabaseError("Failed to create photographer", err);
    }
  }
}
