import { getDb, Collections } from "../../../db";
import {
  DatabaseError,
  NotFoundError,
  UnauthorizedError,
} from "../../../errors/AppError";
import { ProtectedHttpRequest, HttpResponse } from "../../../types/Http";
import { noContent } from "../../../utils/http";

export class DeletePackageController {
  static async handle({
    params,
    userId,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb();
    const packageRef = await db.collection(Collections.PACKAGES).doc(params.id);
    const packageDoc = await packageRef.get();

    if (!packageDoc.exists) {
      throw new NotFoundError("Package");
    }

    const pack = packageDoc.data();
    if (pack?.photographerId !== userId) {
      throw new UnauthorizedError("You don't have access to this package");
    }

    try {
      await packageRef.delete();

      return noContent();
    } catch (err) {
      throw new DatabaseError("Failed to delete package", err);
    }
  }
}
