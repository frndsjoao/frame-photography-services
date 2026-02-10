import { ListPackagesController } from "../../controllers/photographer/packages/ListPackagesController";
import { CreatePackageController } from "../../controllers/photographer/packages/CreatePackageController";
import { GetPackageController } from "../../controllers/photographer/packages/GetPackageController";
import { UpdatePackageController } from "../../controllers/photographer/packages/UpdatePackageController";
import { DeletePackageController } from "../../controllers/photographer/packages/DeletePackageController";
import { ProtectedHttpRequest } from "../../types/Http";
import { Response } from "express";
import { methodHandler } from "../../utils/methodHandler";

export async function handlePackages(
  req: { method: string },
  res: Response,
  request: ProtectedHttpRequest,
  packageId?: string,
) {
  if (packageId) {
    request.params = { id: packageId };
    await methodHandler(req, res, {
      GET: () => GetPackageController.handle(request),
      PATCH: () => UpdatePackageController.handle(request),
      DELETE: () => DeletePackageController.handle(request),
    });
    return;
  }

  await methodHandler(req, res, {
    GET: () => ListPackagesController.handle(request),
    POST: () => CreatePackageController.handle(request),
  });
}
