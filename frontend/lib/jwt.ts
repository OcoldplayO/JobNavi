"use client"

export type JwtPayload = {
  exp?: number
  sub?: string
  [k: string]: any
}

function base64UrlToBase64(input: string) {
  return input.replace(/-/g, "+").replace(/_/g, "/")
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".")
    if (parts.length < 2) return null
    const payload = parts[1]
    const json = atob(base64UrlToBase64(payload))
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function getJwtExpMs(token: string): number | null {
  const payload = decodeJwtPayload(token)
  if (!payload?.exp) return null
  return payload.exp * 1000
}

export function isJwtExpiringSoon(token: string, withinMs: number) {
  const expMs = getJwtExpMs(token)
  if (!expMs) return false
  return expMs - Date.now() <= withinMs
}

