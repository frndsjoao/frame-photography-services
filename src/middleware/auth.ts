import { getAuth } from "firebase-admin/auth"
import { getApps, initializeApp } from "firebase-admin/app"
import { Request } from "express"
import { UnauthorizedError } from "../errors/AppError"

export async function verifyAuth(req: Request): Promise<string> {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid authorization header")
  }

  const token = authHeader.split("Bearer ")[1]

  try {
    if (getApps().length === 0) {
      initializeApp()
    }

    const decoded = await getAuth().verifyIdToken(token)
    return decoded.uid
  } catch {
    throw new UnauthorizedError("Invalid or expired token")
  }
}
