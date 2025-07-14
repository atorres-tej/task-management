"use client"

import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, RefreshCw, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthCallback() {
  const { handleAuthCallback } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [showContinueButton, setShowContinueButton] = useState(false)
  const hasProcessed = useRef(false)

  useEffect(() => {
    const processCallback = async () => {
      // Evitar procesar múltiples veces
      if (hasProcessed.current) {
        return
      }
      hasProcessed.current = true

      const code = searchParams.get("code")
      const error = searchParams.get("error")

      if (error) {
        setStatus("error")
        setMessage("Authentication was cancelled or failed.")
        setTimeout(() => router.push("/"), 3000)
        return
      }

      if (!code) {
        setStatus("error")
        setMessage("No authorization code received.")
        setTimeout(() => router.push("/"), 3000)
        return
      }

      try {
        console.log("Processing auth callback with code:", code)
        const success = await handleAuthCallback(code)

        if (success) {
          setStatus("success")
          setMessage("Successfully signed in! Redirecting...")
          
          // Mostrar botón de continuar después de unos segundos como respaldo
          setTimeout(() => {
            setShowContinueButton(true)
          }, 3000)
          
          setTimeout(() => {
            console.log("Redirecting to home page")
            router.push("/")
          }, 2000)
        } else {
          setStatus("error")
          setMessage("Authentication failed. Please try again.")
          setTimeout(() => router.push("/"), 3000)
        }
      } catch (error) {
        console.error("Auth callback error:", error)
        setStatus("error")
        setMessage("An unexpected error occurred.")
        setTimeout(() => router.push("/"), 3000)
      }
    }

    processCallback()
  }, [])

  const handleContinue = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          {status === "loading" && (
            <>
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Authentication</h2>
              <p className="text-gray-600">Please wait while we complete your sign-in...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign-in Successful!</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              {showContinueButton && (
                <Button onClick={handleContinue} className="mt-4">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continue to Dashboard
                </Button>
              )}
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign-in Failed</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
