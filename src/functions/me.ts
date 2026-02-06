import { onRequest } from "firebase-functions/v2/https";
import { parseRequest } from "../utils/parseRequest";
import { parseResponse } from "../utils/parseResponse";
import { CreateUserController } from "../controllers/auth/CreateUserController";
import { GetUserController } from "../controllers/auth/GetUserController";
import { verifyAuth } from "../middleware/auth";
import { handleError } from "../middleware/errorHandler";

export const me = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({
      error: { code: "METHOD_NOT_ALLOWED", message: "Only GET and POST are allowed" },
    });
    return;
  }

  try {
    const userId = await verifyAuth(req);
    const request = { ...parseRequest(req), userId };

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
