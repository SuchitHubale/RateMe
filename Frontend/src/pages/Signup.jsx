import { SignupForm } from "../components/SignupForm"

export default function Signup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Illustration Side - Hidden on mobile */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-80 h-80 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center">
            <div className="w-64 h-64 bg-white rounded-full shadow-lg flex items-center justify-center">
              <div className="text-6xl text-teal-600">✨</div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-800">Join Our Community</h1>
            <p className="text-slate-600 max-w-md">
              Create your account and start sharing your experiences with local stores.
            </p>
          </div>
        </div>

        {/* Signup Form Side */}
        <div className="w-full max-w-md mx-auto">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
