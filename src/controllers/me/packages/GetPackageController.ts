import { getDb, Collections } from "../../../db";
import { NotFoundError, UnauthorizedError } from "../../../errors/AppError";
import { ProtectedHttpRequest, HttpResponse } from "../../../types/Http";
import { ok } from "../../../utils/http";

export class GetPackageController {
  static async handle({
    params,
    userId,
  }: ProtectedHttpRequest): Promise<HttpResponse> {
    const db = getDb();
    const packageDoc = await db
      .collection(Collections.PACKAGES)
      .doc(params.id)
      .get();

    if (!packageDoc.exists) {
      throw new NotFoundError("Package");
    }

    const pack = packageDoc.data();

    if (pack?.photographerId !== userId) {
      throw new UnauthorizedError("You don't have access to this package");
    }

    return ok({ id: packageDoc.id, ...pack });
  }
}
