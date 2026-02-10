import { Response } from "express";
import { HttpResponse } from "../types/Http";
import { parseResponse } from "./parseResponse";

export async function methodHandler(
  req: { method: string },
  res: Response,
  handlers: Record<string, () => Promise<HttpResponse>>,
): Promise<boolean> {
  const handler = handlers[req.method];

  if (!handler) {
    const allowed = Object.keys(handlers).join(", ");
    res.status(405).json({
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: `Only ${allowed} are allowed`,
      },
    });
    return false;
  }

  parseResponse(res, await handler());
  return true;
}
