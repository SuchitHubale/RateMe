import React from "react"
import { Button } from "../Button"
import { Store, LogOut } from "lucide-react"

export default function StoreOwnerHeader({ storeName, onLogout }) {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Store className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-200">
                Store Owner Dashboard
              </h1>
              <p className="text-sm text-gray-400">{storeName}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onLogout}
            className="flex items-center gap-2 bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-red-600/20 hover:border-red-500 hover:text-red-300 cursor-pointer transition-all duration-300 backdrop-blur-sm"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
