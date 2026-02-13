"use client"

import { useEffect } from "react"
import { isJwtExpiringSoon } from "@/lib/jwt"

async function refreshTokenOnce(currentToken: string) {
  const res = await fetch("http://localhost:8080/api/v1/auth/token/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: currentToken }),
  })
  const data = await res.json()
  if (!res.ok || data.code !== 200) {
    throw new Error(data.msg || "refresh failed")
  }
  return data.data as { token: string; expiresAt?: number }
}

/**
 * MVP: silent sliding refresh for access token.
 * - If token will expire within 24h, refresh it.
 * - Check periodically in background.
 */
export function AuthAutoRefresh() {
  useEffect(() => {
    let stopped = false

    const tick = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        // Refresh when expiring soon (within 24 hours)
        if (!isJwtExpiringSoon(token, 24 * 60 * 60 * 1000)) return

        const refreshed = await refreshTokenOnce(token)
        if (stopped) return
        if (refreshed?.token) {
          localStorage.setItem("token", refreshed.token)
        }
      } catch {
        // If refresh fails, do nothing (user can re-login if needed).
      }
    }

    // run immediately, then every 5 minutes
    tick()
    const id = setInterval(tick, 5 * 60 * 1000)

    return () => {
      stopped = true
      clearInterval(id)
    }
  }, [])

  return null
}

