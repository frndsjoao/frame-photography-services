import { Response } from "express"
import { HttpResponse } from "../types/Http"

export function parseResponse(res: Response, { statusCode, body }: HttpResponse): void {
  res.set("Access-Control-Allow-Origin", "*")
  res.set("Access-Control-Allow-Headers", "Content-Type,Authorization")
  res.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
  res.set("Content-Type", "application/json")

  if (body) {
    res.status(statusCode).json(body)
  } else {
    res.status(statusCode).end()
  }
}
