import { parseResponse } from "../../utils/parseResponse";
import { ListPackagesController } from "../../controllers/me/packages/ListPackagesController";
import { CreatePackageController } from "../../controllers/me/packages/CreatePackageController";
import { GetPackageController } from "../../controllers/me/packages/GetPackageController";
import { UpdatePackageController } from "../../controllers/me/packages/UpdatePackageController";
import { DeletePackageController } from "../../controllers/me/packages/DeletePackageController";
import { ProtectedHttpRequest } from "../../types/Http";
import { Response } from "express";

export async function handlePackages(
  req: { method: string },
  res: Response,
  request: ProtectedHttpRequest,
  packageId?: string,
) {
  if (packageId) {
    request.params = { id: packageId };

    if (req.method === "GET") {
      parseResponse(res, await GetPackageController.handle(request));
    } else if (req.method === "PUT") {
      parseResponse(res, await UpdatePackageController.handle(request));
    } else if (req.method === "DELETE") {
      parseResponse(res, await DeletePackageController.handle(request));
    } else {
      res.status(405).json({
        error: { code: "METHOD_NOT_ALLOWED", message: "Only GET, PUT and DELETE are allowed for /me/packages/:id" },
      });
    }
    return;
  }

  if (req.method === "GET") {
    parseResponse(res, await ListPackagesController.handle(request));
  } else if (req.method === "POST") {
    parseResponse(res, await CreatePackageController.handle(request));
  } else {
    res.status(405).json({
      error: { code: "METHOD_NOT_ALLOWED", message: "Only GET and POST are allowed for /me/packages" },
    });
  }
}
