import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import useLoginRedirect from "../../auth/LoginRedirect";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function AuthLayout() {
  const { handleLogin, loading, error } = useLoginRedirect();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-bg">
      {/* Left Panel - Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 z-10 mix-blend-multiply"></div>
        <img
          src="https://plus.unsplash.com/premium_photo-1723291359453-aea7e6bcbebd?q=80&w=1023&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Field Operations"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right Panel - Auth Form  */}
      <div className="flex-1 w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-12">
        <div className="w-full max-w-md bg-bg-light rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 z-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-fg mb-2">Welcome Back</h2>
            <p className="text-fg-muted text-sm">
              Login to continue managing
              <br />
              your field operations.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200"
            >
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="space-y-1.5">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                error={error || undefined}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={error || undefined}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-fg-muted hover:text-fg focus:outline-none transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  }
                />
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary border-border-muted rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-fg-muted cursor-pointer"
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
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="w-full mt-6 py-2.5"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
