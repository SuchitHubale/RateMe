import React from 'react'
import { LoginForm } from '../components/LoginForm'
import { Star, Shield, TrendingUp } from 'lucide-react'

function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Branding Side */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-8 p-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <Star className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-gray-900" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              RateMe Platform
            </h1>
            <p className="text-gray-300 max-w-md text-lg leading-relaxed">
              Discover, rate, and review stores with our advanced analytics platform. 
              Join thousands of trusted reviewers making informed decisions.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-4 w-full max-w-md">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 hover:bg-gray-700/50 transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Advanced Analytics</h3>
                  <p className="text-gray-400 text-sm">Real-time insights and trends</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 hover:bg-gray-700/50 transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Secure Platform</h3>
                  <p className="text-gray-400 text-sm">Enterprise-grade security</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form Side */}
        <div className="w-full max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
    </div>
  )
}

export default Login