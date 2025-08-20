import React from "react";
import { Link } from "react-router-dom"; // Use react-router Link
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import { Home, Search, User, Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardContent className="pt-8 pb-6">
          {/* 404 Illustration */}
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-6xl font-bold text-slate-800 mb-2">404</h1>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">
              Page Not Found
            </h2>
            <p className="text-slate-600 mb-6">
              Sorry, we couldn't find the page you're looking for. It might have
              been moved or doesn't exist.
            </p>
          </div>

          {/* Navigation Options */}
          <div className="space-y-3">
            

            
          </div>

          {/* Help Text */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Need help? Contact our support team or try searching for what you
              need.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
