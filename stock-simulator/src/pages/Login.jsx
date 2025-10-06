import { useState } from "react";
import Logo from "../components/Logo";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (email) {
      onLogin(email);
    }
  };

  const handleGoogleSignIn = () => {
    onLogin("google-user@example.com");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 text-green-400 font-mono text-sm">
            48.000
          </div>
          <div className="absolute top-40 right-20 text-green-400 font-mono text-sm">
            1255.001
          </div>
          <div className="absolute bottom-40 left-20 text-blue-300 font-mono text-sm">
            LV 4.2
          </div>
          <div className="absolute bottom-60 right-10 text-green-400 font-mono text-sm">
            + 40.66
          </div>
          <div className="absolute top-1/2 left-1/4 text-blue-200 font-mono text-xs">
            TRENDING
          </div>
          <div className="absolute top-1/3 right-1/3 text-green-300 font-mono text-xs">
            62.901.35
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Trusted partner
            <br />
            in building stock portfolio.
          </h1>
        </div>

        {/* Geometric shapes */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full text-cyan-300">
            <polygon
              points="100,10 40,180 190,60 10,60 160,180"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <Logo />
          </div>

          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe01@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Send OTP Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
            >
              Send OTP to this mail ID
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm">Or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-blue-700 font-semibold hover:underline"
              >
                Sign up here
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
