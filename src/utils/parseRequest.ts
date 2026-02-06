import { Request } from "express"
import { HttpRequest } from "../types/Http"

export function parseRequest(req: Request): HttpRequest {
  return {
    body: (req.body as Record<string, unknown>) ?? {},
    queryParams: (req.query as Record<string, unknown>) ?? {},
    params: (req.params as Record<string, string>) ?? {},
  }
}
