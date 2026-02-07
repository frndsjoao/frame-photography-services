import { onRequest } from "firebase-functions/v2/https";
import { parseRequest } from "../utils/parseRequest";
import { parseResponse } from "../utils/parseResponse";
import { CreateUserController } from "../controllers/auth/CreateUserController";
import { GetUserController } from "../controllers/auth/GetUserController";
import { handlePackages } from "./me/packages";
import { verifyAuth } from "../middleware/auth";
import { handleError } from "../middleware/errorHandler";

export const me = onRequest({ cors: true }, async (req, res) => {
  try {
    const userId = await verifyAuth(req);
    const request = { ...parseRequest(req), userId };

    const pathParts = req.path.split("/").filter(Boolean);

    // /me/packages ou /me/packages/:id
    if (pathParts[0] === "packages") {
      await handlePackages(req, res, request, pathParts[1]);
      return;
    }

    // /me
    if (req.method !== "GET" && req.method !== "POST") {
      res.status(405).json({
        error: { code: "METHOD_NOT_ALLOWED", message: "Only GET and POST are allowed" },
      });
      return;
    }

    const response = req.method === "GET"
      ? await GetUserController.handle(request)
      : await CreateUserController.handle(request);

    parseResponse(res, response);
  } catch (error) {
    console.error("ME endpoint error:", error);
    const errorResponse = handleError(error, req.path);
    parseResponse(res, errorResponse);
  }
});
