import React from "react"
import { Button } from "../Button"
import { Shield, LogOut } from "lucide-react"

export default function AdminHeader({ onLogout }) {
  return (
    <header className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <Button 
            variant="outline" 
            onClick={onLogout} 
            className="flex items-center gap-2 bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-red-600/20 hover:border-red-500 hover:text-red-300 cursor-pointer transition-all duration-300 backdrop-blur-sm"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
