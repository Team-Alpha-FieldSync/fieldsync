import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function AuthLayout() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-bg">
      {/* Left Panel - Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-bg-dark">
        {/* Where the image for the left field is supposed to go */}
      </div>

      {/* Right Panel - Auth Form  */}
      <div className="flex-1 w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-12">
        <div className="w-full max-w-md bg-bg-light rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text mb-2">Welcome Back</h2>
            <p className="text-text-muted text-sm">
              Login to continue managing
              <br />
              your field operations.
            </p>
          </div>

          <form className="space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-xl  sm:text-sm transition-colors bg-transparent text-text"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="block w-full pl-10 pr-10 py-2.5 border border-border rounded-xl  sm:text-sm transition-colors bg-transparent text-text"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary border-border rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-text-muted cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-bg-light bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2  focus:ring-primary transition-colors mt-6"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
