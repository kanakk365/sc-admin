'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth } = useAuthStore();
  const accessToken = useAuthStore((state) => state.accessToken);
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (accessToken) {
      router.push('/dashboard');
    }
  }, [accessToken, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('https://scapi.elitceler.com/api/v1/admins/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed. Please check your credentials.');
      }

      const data = await response.json();
      
      // Store auth data in Zustand store (which persists to localStorage)
      setAuth(data.accessToken, data.email);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

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
            Welcome Back
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email / Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full border-b border-gray-300 py-3 text-gray-900 placeholder-gray-500 focus:border-[#4A148C] focus:outline-none transition-colors bg-transparent disabled:opacity-50"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full border-b border-gray-300 py-3 text-gray-900 placeholder-gray-500 focus:border-[#4A148C] focus:outline-none transition-colors bg-transparent pr-10 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-0 top-3 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOffIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <Link href="#" className="text-xs font-semibold text-[#4A148C] hover:underline">
              Forgot password
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2e0d5e] text-white py-2 rounded-lg font-semibold text-lg hover:bg-[#3c117a] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
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


