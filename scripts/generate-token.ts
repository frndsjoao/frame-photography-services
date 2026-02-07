import { initializeApp, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

const SERVICE_ACCOUNT_PATH = process.env.SERVICE_ACCOUNT_PATH || "./serviceAccountKey.json"
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY
const UID = process.argv[2]

async function main() {
  if (!UID) {
    console.error("Usage: npx tsx scripts/generate-token.ts <uid>")
    console.error("Example: npx tsx scripts/generate-token.ts abc123")
    process.exit(1)
  }

  if (!FIREBASE_API_KEY) {
    console.error("Missing FIREBASE_API_KEY environment variable")
    console.error("You can find it in Firebase Console > Project Settings > Web API Key")
    process.exit(1)
  }

  const app = initializeApp({
    credential: cert(SERVICE_ACCOUNT_PATH),
  })

  const customToken = await getAuth(app).createCustomToken(UID)

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: customToken, returnSecureToken: true }),
    },
  )

  const data = await res.json()

  if (!data.idToken) {
    console.error("Failed to generate token:", data)
    process.exit(1)
  }

  console.log(data.idToken)
}

main()
