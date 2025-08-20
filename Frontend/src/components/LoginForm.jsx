import { useState } from "react";

import { Button } from "../components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/Card";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import { Alert, AlertDescription } from "../components/Alert";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  if (!formData.email || !formData.password) {
    setError("Please fill in all fields");
    setIsLoading(false);
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    setError("Please enter a valid email address");
    setIsLoading(false);
    return;
  }

  try {
    const res = await axios.post("http://localhost:4000/api/auth/login", {
      email: formData.email,
      password: formData.password,
    });

    // Save token and user in localStorage
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    console.log("Login successful:", res.data.user);

    // Redirect based on role
    switch (res.data.user.role) {
      case "ADMIN":
        window.location.href = "/admin-dashboard";
        navigate("/admin-dashboard");
        break;
      case "OWNER":
        // window.location.href = "/store-owner-dashboard";
        navigate("/store-owner-dashboard");
        break;
      default:
        // window.location.href = "/user-dashboard";
        navigate("/user-dashboard");

    }
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Login failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card className="shadow-2xl border-gray-700/50 bg-gray-800/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
        <CardDescription className="text-gray-300">Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-red-900/50 border-red-700/50 text-red-300">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-200">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-gray-700/70 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-200">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-gray-700/70 transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-200 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white cursor-pointer transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-300">
          Don't have an account?{" "}
          <NavLink to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
            Sign up
          </NavLink>
        </div>
      </CardContent>
    </Card>
  );
}
