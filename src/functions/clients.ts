import { onRequest } from "firebase-functions/v2/https";
import { parseRequest } from "../utils/parseRequest";
import { parseResponse } from "../utils/parseResponse";
import { CreateClientController } from "../controllers/clients/CreateClientController";
import { ListClientsController } from "../controllers/clients/ListClientsController";
import { GetClientController } from "../controllers/clients/GetClientController";
import { verifyAuth } from "../middleware/auth";
import { handleError } from "../middleware/errorHandler";

export const clients = onRequest({ cors: true }, async (req, res) => {
  try {
    const userId = await verifyAuth(req);
    const request = { ...parseRequest(req), userId };

    // /clients/:id → req.path = "/:id"
    const clientId = req.path.split("/")[1];

    if (clientId) {
      if (req.method !== "GET") {
        res.status(405).json({
          error: { code: "METHOD_NOT_ALLOWED", message: "Only GET is allowed for /clients/:id" },
        });
        return;
      }

      request.params = { id: clientId };
      const response = await GetClientController.handle(request);
      parseResponse(res, response);
      return;
    }

    if (req.method !== "GET" && req.method !== "POST") {
      res.status(405).json({
        error: { code: "METHOD_NOT_ALLOWED", message: "Only GET and POST are allowed" },
      });
      return;
    }

    const response = req.method === "GET"
      ? await ListClientsController.handle(request)
      : await CreateClientController.handle(request);

    parseResponse(res, response);
  } catch (error) {
    console.error("CLIENTS endpoint error:", error);
    const errorResponse = handleError(error, req.path);
    parseResponse(res, errorResponse);
  }
});
