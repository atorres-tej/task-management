import type { User, AuthTokens } from "@/types/auth"

// Microsoft OAuth2 configuration
const MICROSOFT_CLIENT_ID = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || "your-client-id"
const MICROSOFT_TENANT_ID = process.env.NEXT_PUBLIC_MICROSOFT_TENANT_ID || "common"
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000/auth/callback"

const MICROSOFT_AUTH_URL = `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize`
const MICROSOFT_TOKEN_URL = `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/token`

export const authService = {
  // Generate Microsoft OAuth2 login URL
  getMicrosoftLoginUrl(): string {
    const params = new URLSearchParams({
      client_id: MICROSOFT_CLIENT_ID,
      response_type: "code",
      redirect_uri: REDIRECT_URI,
      scope: "openid profile email User.Read",
      response_mode: "query",
      state: Math.random().toString(36).substring(7), // CSRF protection
    })

    return `${MICROSOFT_AUTH_URL}?${params.toString()}`
  },

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code: string): Promise<{ user: User; tokens: AuthTokens } | null> {
    try {
      console.log("Exchanging code for tokens via API...")
      
      // Use our API endpoint instead of calling Microsoft directly
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Token exchange failed:', errorData)
        return null
      }

      const data = await response.json()
      
      if (data.error) {
        console.error('Token exchange error:', data.error)
        return null
      }

      console.log("Token exchange successful via API")
      return {
        user: data.user,
        tokens: data.tokens,
      }
    } catch (error) {
      console.error("Token exchange error:", error)
      return null
    }
  },

  // Store tokens in localStorage
  storeTokens(tokens: AuthTokens): void {
    localStorage.setItem("auth_tokens", JSON.stringify(tokens))
  },

  // Store user info in localStorage
  storeUser(user: User): void {
    localStorage.setItem("auth_user", JSON.stringify(user))
  },

  // Refresh access token using refresh token
  async refreshAccessToken(): Promise<AuthTokens | null> {
    try {
      const currentTokens = this.getStoredTokens()
      if (!currentTokens?.refreshToken) {
        return null
      }

      // Use our API endpoint for token refresh too
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: currentTokens.refreshToken }),
      })

      if (!response.ok) {
        console.error('Token refresh failed')
        this.clearStoredAuth()
        return null
      }

      const data = await response.json()
      
      if (data.error) {
        console.error('Token refresh error:', data.error)
        this.clearStoredAuth()
        return null
      }

      const newTokens: AuthTokens = {
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken || currentTokens.refreshToken,
        expiresAt: data.tokens.expiresAt,
      }

      this.storeTokens(newTokens)
      return newTokens
    } catch (error) {
      console.error('Error refreshing token:', error)
      this.clearStoredAuth()
      return null
    }
  },

  // Get stored tokens
  getStoredTokens(): AuthTokens | null {
    try {
      const stored = localStorage.getItem("auth_tokens")
      if (!stored) return null

      const tokens: AuthTokens = JSON.parse(stored)

      // Check if token is expired
      if (tokens.expiresAt <= Date.now()) {
        this.clearStoredAuth()
        return null
      }

      return tokens
    } catch {
      return null
    }
  },

  // Get stored user
  getStoredUser(): User | null {
    try {
      const stored = localStorage.getItem("auth_user")
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  },

  // Clear stored authentication data
  clearStoredAuth(): void {
    localStorage.removeItem("auth_tokens")
    localStorage.removeItem("auth_user")
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const tokens = this.getStoredTokens()
    return tokens !== null && tokens.expiresAt > Date.now()
  },

  // Logout
  async logout(): Promise<void> {
    const tokens = this.getStoredTokens()
    
    // Clear local storage first
    this.clearStoredAuth()
    
    // Try to revoke the token with Microsoft
    if (tokens?.accessToken) {
      try {
        await fetch(`https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            token: tokens.accessToken,
            token_type_hint: 'access_token',
          }),
        })
      } catch (error) {
        console.log('Token revocation failed, but user is logged out locally')
      }
    }
  },
}
