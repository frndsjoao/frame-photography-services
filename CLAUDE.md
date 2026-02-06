# frame-photography-services

Backend em Node.js + TypeScript integrado com Firebase (Cloud Functions + Firestore).

## Estrutura do projeto

```
src/
├── controllers/       # Lógica de negócio (recebe HttpRequest, retorna HttpResponse)
├── db/                # Singleton Firestore + constantes de collections
├── errors/            # Hierarquia de erros (AppError, ValidationError, ConflictError, etc)
├── functions/         # Entry points das Cloud Functions
├── middleware/        # Tratamento centralizado de erros
├── schemas/           # Validação de dados com Zod
├── types/             # Tipagens (HttpRequest, HttpResponse, ProtectedHttpRequest)
├── utils/             # Helpers (status codes, parse request/response)
└── index.ts           # Export central de todas as functions
```

## Como criar uma nova function

1. **Schema** em `src/schemas/` — definir validação com Zod
2. **Controller** em `src/controllers/` — lógica de negócio com método estático `handle`
3. **Function** em `src/functions/` — entry point que conecta request → controller → response
4. **Export** no `src/index.ts` — exportar a nova function

### Exemplo: criando um endpoint GET /users

**1. Schema** (`src/schemas/userSchema.ts`)

```ts
export const listUsersQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
})
```

**2. Controller** (`src/controllers/ListUsersController.ts`)

```ts
export class ListUsersController {
  static async handle({ queryParams }: HttpRequest): Promise<HttpResponse> {
    const { success, error, data } = listUsersQuerySchema.safeParse(queryParams)
    if (!success) throw new ValidationError("Invalid params", error.issues)

    const db = getDb()
    const snapshot = await db.collection(Collections.USERS).limit(50).get()
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

    return ok({ users })
  }
}
```

**3. Function** (`src/functions/users.ts`)

```ts
export const users = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: { code: "METHOD_NOT_ALLOWED", message: "Only GET is allowed" } })
    return
  }

  try {
    const request = parseRequest(req)
    const response = await ListUsersController.handle(request)
    parseResponse(res, response)
  } catch (error) {
    const errorResponse = handleError(error, req.path)
    parseResponse(res, errorResponse)
  }
})
```

**4. Export** (`src/index.ts`)

```ts
export { me } from "./functions/me"
export { users } from "./functions/users"
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run build` | Compila TypeScript para `dist/` |
| `npm run serve` | Build + emuladores locais do Firebase |
| `npm run deploy` | Build + deploy das functions para o Firebase |
| `npm run logs` | Exibe logs das functions em produção |

## Padrões

- **Controllers** usam métodos estáticos (`Controller.handle(request)`)
- **Erros** são lançados como classes que estendem `AppError` e capturados pelo `handleError`
- **Validação** sempre via Zod com `safeParse` — erros de Zod são tratados automaticamente pelo middleware
- **Collections** do Firestore ficam centralizadas em `src/db/index.ts`
- **Tipagens** de request/response ficam em `src/types/Http.ts`
