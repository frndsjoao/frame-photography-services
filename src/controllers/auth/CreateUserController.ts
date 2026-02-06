import { getDb, Collections } from "../../db";
import { DatabaseError } from "../../errors/AppError";
import { createUserSchema } from "../../schemas/userSchema";
import { ProtectedHttpRequest, HttpResponse } from "../../types/Http";
import { created } from "../../utils/http";

export class CreateUserController {
  static async handle({
    body,
    userId,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const data = createUserSchema.parse(body);
    const db = getDb();

    try {
      await db
        .collection(Collections.USERS)
        .doc(userId)
        .set({
          name: data.name,
          email: data.email,
          avatar: data.email ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      return created({ id: userId });
    } catch (err) {
      throw new DatabaseError("Failed to create user", err);
    }
  }
}
