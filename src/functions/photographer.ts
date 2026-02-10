import { onRequest } from "firebase-functions/v2/https";
import { parseRequest } from "../utils/parseRequest";
import { parseResponse } from "../utils/parseResponse";
import { CreatePhotographerController } from "../controllers/photographer/CreatePhotographerController";
import { GetPhotographerController } from "../controllers/photographer/GetPhotographerController";
import { handlePackages } from "./photographer/packages";
import { verifyAuth } from "../middleware/auth";
import { handleError } from "../middleware/errorHandler";

export const photographer = onRequest({ cors: true }, async (req, res) => {
  try {
    const userId = await verifyAuth(req);
    const request = { ...parseRequest(req), userId };

    const pathParts = req.path.split("/").filter(Boolean);

    // /photographer/packages ou /photographer/packages/:id
    if (pathParts[0] === "packages") {
      await handlePackages(req, res, request, pathParts[1]);
      return;
    }

    // /photographer
    if (req.method !== "GET" && req.method !== "POST") {
      res.status(405).json({
        error: {
          code: "METHOD_NOT_ALLOWED",
          message: "Only GET and POST are allowed",
        },
      });
      return;
    }

    const response =
      req.method === "GET"
        ? await GetPhotographerController.handle(request)
        : await CreatePhotographerController.handle(request);

    parseResponse(res, response);
  } catch (error) {
    console.error("PHOTOGRAPHER endpoint error:", error);
    const errorResponse = handleError(error, req.path);
    parseResponse(res, errorResponse);
  }
});
