import { getDb, Collections } from "../../../db";
import { DatabaseError } from "../../../errors/AppError";
import { createPackageSchema } from "../../../schemas/packageSchema";
import { ProtectedHttpRequest, HttpResponse } from "../../../types/Http";
import { created } from "../../../utils/http";

export class CreatePackageController {
  static async handle({
    body,
    userId,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const data = createPackageSchema.parse(body);
    const db = getDb();

    try {
      const packageRef = db.collection(Collections.PACKAGES).doc();

      await packageRef.set({
        ...data,
        photographerId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return created({ id: packageRef.id });
    } catch (err) {
      throw new DatabaseError("Failed to create new package", err);
    }
  }
}
