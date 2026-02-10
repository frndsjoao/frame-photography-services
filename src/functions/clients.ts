import { onRequest } from "firebase-functions/v2/https";
import { parseRequest } from "../utils/parseRequest";
import { parseResponse } from "../utils/parseResponse";
import { CreateClientController } from "../controllers/clients/CreateClientController";
import { ListClientsController } from "../controllers/clients/ListClientsController";
import { GetClientController } from "../controllers/clients/GetClientController";
import { DeleteClientController } from "../controllers/clients/DeleteClientController";
import { verifyAuth } from "../middleware/auth";
import { handleError } from "../middleware/errorHandler";
import { methodHandler } from "../utils/methodHandler";
import { UpdateClientController } from "../controllers/clients/UpdateClientController";

export const clients = onRequest({ cors: true }, async (req, res) => {
  try {
    const userId = await verifyAuth(req);
    const request = { ...parseRequest(req), userId };

    // /clients/:id → req.path = "/:id"
    const clientId = req.path.split("/")[1];

    if (clientId) {
      request.params = { id: clientId };
      await methodHandler(req, res, {
        GET: () => GetClientController.handle(request),
        PATCH: () => UpdateClientController.handle(request),
        DELETE: () => DeleteClientController.handle(request),
      });
      return;
    }

    await methodHandler(req, res, {
      GET: () => ListClientsController.handle(request),
      POST: () => CreateClientController.handle(request),
    });
  } catch (error) {
    console.error("CLIENTS endpoint error:", error);
    const errorResponse = handleError(error, req.path);
    parseResponse(res, errorResponse);
  }
});
