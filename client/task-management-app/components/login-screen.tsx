"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { LogIn, Shield, CheckCircle } from "lucide-react"

export default function LoginScreen() {
  const { login, isLoading } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleSignIn = () => {
    setIsSigningIn(true)
    login()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Manager</h1>
          <p className="text-gray-600">Sign in to manage your tasks efficiently</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="space-y-6">
            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                <span>Secure Microsoft authentication</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                <span>Manage tasks with ease</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                <span>Track progress and deadlines</span>
              </div>
            </div>

            {/* Sign In Button */}
            <Button
              onClick={handleSignIn}
              disabled={isLoading || isSigningIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
              size="lg"
            >
              {isSigningIn ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                  Redirecting to Microsoft...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="w-5 h-5 mr-3" />
                  Sign in with Microsoft
                </div>
              )}
            </Button>

            {/* Info */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
