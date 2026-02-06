export type HttpRequest = {
  body: Record<string, unknown>
  queryParams: Record<string, unknown>
  params: Record<string, string>
}

export type ProtectedHttpRequest = HttpRequest & {
  userId: string
}

export type HttpResponse = {
  statusCode: number
  body?: Record<string, unknown>
}
