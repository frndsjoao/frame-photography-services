import { ZodError } from "zod"
import { AppError } from "../errors/AppError"
import { HttpResponse } from "../types/Http"
import { internalServerError } from "../utils/http"

export function handleError(error: unknown, path?: string): HttpResponse {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      body: {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
          timestamp: new Date().toISOString(),
          path,
        },
      },
    }
  }

  if (error instanceof ZodError) {
    const validationDetails = error.issues.map((issue) => ({
      field: issue.path.join(".") || "unknown",
      message: issue.message,
    }))

    return {
      statusCode: 400,
      body: {
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details: validationDetails,
          timestamp: new Date().toISOString(),
          path,
        },
      },
    }
  }

  return internalServerError({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
      timestamp: new Date().toISOString(),
      path,
    },
  })
}
