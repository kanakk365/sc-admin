'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center font-sans">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/login.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Black dull filter overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-2xl mx-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back, <span className="text-[#4A148C]">Aleena</span>
          </h1>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Email / Username"
                className="w-full border-b border-gray-300 py-3 text-gray-900 placeholder-gray-500 focus:border-[#4A148C] focus:outline-none transition-colors bg-transparent"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border-b border-gray-300 py-3 text-gray-900 placeholder-gray-500 focus:border-[#4A148C] focus:outline-none transition-colors bg-transparent pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOffIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded transition-colors flex items-center justify-center ${
                  rememberMe ? 'bg-[#4A148C] border-[#4A148C]' : 'border-gray-400'
                }`}>
                  {rememberMe && <CheckIcon className="w-3 h-3 text-white" />}
                </div>
              </div>
              <span className="text-xs text-gray-600">
                I have read and agree to the Terms & Conditions.
              </span>
            </label>
            
            <Link href="#" className="text-xs font-semibold text-[#4A148C] hover:underline">
              Forgot password
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2e0d5e] text-white py-2 rounded-lg font-semibold text-lg hover:bg-[#3c117a] transition-colors mt-8"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

