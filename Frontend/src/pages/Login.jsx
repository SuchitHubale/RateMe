import React from 'react'
import { LoginForm } from '../components/LoginForm'
function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Illustration Side - Hidden on mobile */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center">
            <div className="w-64 h-64 bg-white rounded-full shadow-lg flex items-center justify-center">
              <div className="text-6xl text-blue-600">🏪</div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-800">Store Rating Platform</h1>
            <p className="text-slate-600 max-w-md">
              Discover, rate, and review stores in your area. Join our community of trusted reviewers.
            </p>
          </div>
        </div>

        {/* Login Form Side */}
        <div className="w-full max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default Login