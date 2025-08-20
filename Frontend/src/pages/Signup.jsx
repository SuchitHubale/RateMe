import { SignupForm } from "../components/SignupForm"

export default function Signup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      
        {/* Signup Form Side */}
        <div className="w-full max-w-md mx-auto">
          <SignupForm />
        </div>
    </div>
   
  )
}
