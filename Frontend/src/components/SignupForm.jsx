import React, { useState } from "react"
import { Button } from "../components/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/Card"
import { Input } from "../components/Input"
import { Label } from "../components/Label"
import { Textarea } from "../components/Textarea"
import { Alert, AlertDescription } from "../components/Alert"
import { Eye, EyeOff, Mail, Lock, User, MapPin } from "lucide-react"
import { NavLink } from "react-router-dom"

import axios from "axios";


export function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name) {
      newErrors.name = "Name is required"
    } else if (formData.name.length < 10 || formData.name.length > 60) {
      newErrors.name = "Name must be between 10 and 60 characters"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.address) {
      newErrors.address = "Address is required"
    } else if (formData.address.length > 400) {
      newErrors.address = "Address must not exceed 400 characters"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8 || formData.password.length > 16) {
      newErrors.password = "Password must be between 8 and 16 characters"
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter"
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    console.log("Signup requesting...");
  e.preventDefault()
  setErrors({})
  setIsLoading(true)

  const validationErrors = validateForm()
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors)
    setIsLoading(false)
    return
  }
console.log("Signup stage 2");
  try {
    const res = await axios.post("http://localhost:4000/api/auth/signup", {
      name: formData.name,
      email: formData.email,
      address: formData.address,
      password: formData.password
    }, {
      headers: { "Content-Type": "application/json" }
    })

    console.log("Signup successful:", res.data)

    // Redirect or show success message
    window.location.href = "/login"
  } catch (err) {
    console.error("Signup error:", err)

    if (err.response?.data?.message) {
      alert(err.response.data.message) // You can replace this with a nicer UI alert
    } else {
      alert("Something went wrong. Please try again.")
    }
  } finally {
    setIsLoading(false)
  }
}


  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }))
    }
  }

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-slate-800">Create Account</CardTitle>
        <CardDescription className="text-slate-600">
          Join our community and start rating stores
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name (20-60 characters)"
                value={formData.name}
                onChange={handleInputChange}
                className={`pl-10 border-slate-200 focus:border-teal-500 focus:ring-teal-500 ${errors.name ? "border-red-500" : ""}`}
                required
              />
            </div>
            {errors.name && (
              <Alert variant="destructive">
                <AlertDescription>{errors.name}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                className={`pl-10 border-slate-200 focus:border-teal-500 focus:ring-teal-500 ${errors.email ? "border-red-500" : ""}`}
                required
              />
            </div>
            {errors.email && (
              <Alert variant="destructive">
                <AlertDescription>{errors.email}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-slate-700">
              Address
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Textarea
                id="address"
                name="address"
                placeholder="Enter your full address (max 400 characters)"
                value={formData.address}
                onChange={handleInputChange}
                className={`pl-10 min-h-[80px] border-slate-200 focus:border-teal-500 focus:ring-teal-500 ${errors.address ? "border-red-500" : ""}`}
                required
              />
            </div>
            <div className="text-xs text-slate-500 text-right">{formData.address.length}/400 characters</div>
            {errors.address && (
              <Alert variant="destructive">
                <AlertDescription>{errors.address}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password (8-16 chars, 1 uppercase, 1 special)"
                value={formData.password}
                onChange={handleInputChange}
                className={`pl-10 pr-10 border-slate-200 focus:border-teal-500 focus:ring-teal-500 ${errors.password ? "border-red-500" : ""}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <Alert variant="destructive">
                <AlertDescription>{errors.password}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-700">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`pl-10 pr-10 border-slate-200 focus:border-teal-500 focus:ring-teal-500 ${errors.confirmPassword ? "border-red-500" : ""}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <Alert variant="destructive">
                <AlertDescription>{errors.confirmPassword}</AlertDescription>
              </Alert>
            )}
          </div>

          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center text-sm text-slate-600">
          Already have an account?{" "}
           <NavLink to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Login
          </NavLink>
        </div>
      </CardContent>
    </Card>
  )
}
