"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { AuthState } from "@/types/auth"
import { authService } from "@/services/authService"

interface AuthContextType extends AuthState {
  login: () => void
  logout: () => Promise<void>
  handleAuthCallback: (code: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const tokens = authService.getStoredTokens()
      const user = authService.getStoredUser()

      if (tokens && user) {
        setAuthState({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        setAuthState({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    }

    checkAuth()
  }, [])

  const login = () => {
    const loginUrl = authService.getMicrosoftLoginUrl()
    window.location.href = loginUrl
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setAuthState({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  }

  const handleAuthCallback = async (code: string): Promise<boolean> => {
    console.log("handleAuthCallback called with code:", code)
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    try {
      const result = await authService.exchangeCodeForTokens(code)

      if (result) {
        const { user, tokens } = result
        console.log("Authentication successful, storing tokens and user")

        // Store in localStorage
        authService.storeTokens(tokens)
        authService.storeUser(user)

        setAuthState({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        })

        return true
      } else {
        console.log("Authentication failed - no result from token exchange")
        setAuthState({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
        })
        return false
      }
    } catch (error) {
      console.error("Authentication callback failed:", error)
      setAuthState({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
      })
      return false
    }
  }

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    handleAuthCallback,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
