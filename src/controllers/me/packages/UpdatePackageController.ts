import { getDb, Collections } from "../../../db";
import {
  DatabaseError,
  NotFoundError,
  UnauthorizedError,
} from "../../../errors/AppError";
import { updatePackageSchema } from "../../../schemas/packageSchema";
import { ProtectedHttpRequest, HttpResponse } from "../../../types/Http";
import { ok } from "../../../utils/http";

export class UpdatePackageController {
  static async handle({
    params,
    userId,
    body,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const data = updatePackageSchema.parse(body);
    const db = getDb();

    const packageRef = db.collection(Collections.PACKAGES).doc(params.id);
    const packageDoc = await packageRef.get();

    if (!packageDoc.exists) {
      throw new NotFoundError("Package");
    }

    const pack = packageDoc.data();
    if (pack?.photographerId !== userId) {
      throw new UnauthorizedError("You don't have access to this package");
    }

    try {
      await packageRef.update({
        ...data,
        updatedAt: new Date(),
      });

      return ok({ id: packageRef.id });
    } catch (err) {
      throw new DatabaseError("Failed to update package", err);
    }
  }
}
