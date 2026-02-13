import { onRequest } from "firebase-functions/v2/https";
import { parseRequest } from "../utils/parseRequest";
import { parseResponse } from "../utils/parseResponse";
import { ListSessionsController } from "../controllers/session/ListSessionsController";
import { CreateSessionController } from "../controllers/session/CreateSessionController";
import { GetSessionController } from "../controllers/session/GetSessionController";
import { UpdateSessionController } from "../controllers/session/UpdateSessionController";
import { verifyAuth } from "../middleware/auth";
import { handleError } from "../middleware/errorHandler";
import { methodHandler } from "../utils/methodHandler";

export const sessions = onRequest({ cors: true }, async (req, res) => {
  try {
    const userId = await verifyAuth(req);
    const request = { ...parseRequest(req), userId };

    // /sessions/:id
    const sessionId = req.path.split("/")[1];

    if (sessionId) {
      request.params = { id: sessionId };
      await methodHandler(req, res, {
        GET: () => GetSessionController.handle(request),
        PATCH: () => UpdateSessionController.handle(request),
      });
      return;
    }

    // /sessions
    await methodHandler(req, res, {
      GET: () => ListSessionsController.handle(request),
      POST: () => CreateSessionController.handle(request),
    });
  } catch (error) {
    console.error("SESSIONS endpoint error:", error);
    const errorResponse = handleError(error, req.path);
    parseResponse(res, errorResponse);
  }
});
