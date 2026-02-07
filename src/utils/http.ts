import { HttpResponse } from "../types/Http"

export function ok(body?: Record<string, unknown>): HttpResponse {
  return { statusCode: 200, body }
}

export function created(body?: Record<string, unknown>): HttpResponse {
  return { statusCode: 201, body }
}

export function noContent(): HttpResponse {
  return { statusCode: 204 }
}

export function badRequest(body?: Record<string, unknown>): HttpResponse {
  return { statusCode: 400, body }
}

export function notFound(body?: Record<string, unknown>): HttpResponse {
  return { statusCode: 404, body }
}

export function unauthorized(body?: Record<string, unknown>): HttpResponse {
  return { statusCode: 401, body }
}

export function conflict(body?: Record<string, unknown>): HttpResponse {
  return { statusCode: 409, body }
}

export function internalServerError(body?: Record<string, unknown>): HttpResponse {
  return { statusCode: 500, body }
}
