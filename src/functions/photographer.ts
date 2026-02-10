import { onRequest } from "firebase-functions/v2/https";
import { parseRequest } from "../utils/parseRequest";
import { parseResponse } from "../utils/parseResponse";
import { CreatePhotographerController } from "../controllers/photographer/CreatePhotographerController";
import { GetPhotographerController } from "../controllers/photographer/GetPhotographerController";
import { UpdatePhotographerController } from "../controllers/photographer/UpdatePhotographerController";
import { handlePackages } from "./photographer/packages";
import { verifyAuth } from "../middleware/auth";
import { handleError } from "../middleware/errorHandler";
import { methodHandler } from "../utils/methodHandler";

export const photographer = onRequest({ cors: true }, async (req, res) => {
  try {
    const userId = await verifyAuth(req);
    const request = { ...parseRequest(req), userId };

    const pathParts = req.path.split("/").filter(Boolean);

    // /photographer/packages or /photographer/packages/:id
    if (pathParts[0] === "packages") {
      await handlePackages(req, res, request, pathParts[1]);
      return;
    }

    // /photographer
    await methodHandler(req, res, {
      GET: () => GetPhotographerController.handle(request),
      POST: () => CreatePhotographerController.handle(request),
      PATCH: () => UpdatePhotographerController.handle(request),
    });
  } catch (error) {
    console.error("PHOTOGRAPHER endpoint error:", error);
    const errorResponse = handleError(error, req.path);
    parseResponse(res, errorResponse);
  }
});
