'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleSignInRedirect } from '@/components/google-signin-redirect';
import { useLanguage } from '@/lib/hooks/use-language';
import { getTranslation } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Shield,
  TrendingUp,
  Bell,
} from 'lucide-react';

const BASE_URL = 'https://mutualfun-backend.vercel.app'; // no trailing /
const API_URL = process.env.NEXT_PUBLIC_API_URL || `${BASE_URL}/api`;

export default function AuthPage() {
  const router = useRouter();
  const { language, mounted } = useLanguage();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const t = (key: string) => getTranslation(language, key);

  if (!mounted) return null;

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);

    try {
      if (isSignUp) {
        // Registration
        if (password.length < 8) {
          toast({
            title: 'Error',
            description: 'Password must be at least 8 characters long',
            variant: 'destructive',
          });
          setEmailLoading(false);
          return;
        }
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            name,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        // Store tokens
        localStorage.setItem('accessToken', data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        // Dispatch event to update header
        window.dispatchEvent(new Event('authChange'));

        toast({
          title: 'Success!',
          description: 'Account created successfully. Welcome!',
        });

        // Redirect to home page
        setTimeout(() => router.push('/'), 500);
      } else {
        // Login
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Login failed');
        }

        // Store tokens
        localStorage.setItem('accessToken', data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        // Dispatch event to update header
        window.dispatchEvent(new Event('authChange'));

        toast({
          title: 'Success!',
          description: 'You have been logged in successfully',
        });

        // Redirect to home page
        setTimeout(() => router.push('/'), 500);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: isSignUp ? 'Registration Failed' : 'Login Failed',
        description: error.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setEmailLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Marketing Content */}
          <div className="hidden lg:block space-y-8 pr-12">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Start Your Investment Journey
              </div>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Invest Smarter with{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Mutual Funds
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Join thousands of investors who trust us with their financial
                future. Get personalized recommendations, track your portfolio,
                and achieve your investment goals.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Secure & Trusted
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bank-level security with encrypted data protection
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Smart Analytics
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    AI-powered insights and personalized recommendations
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Bell className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Real-time Alerts
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get notified about important market movements
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">MF</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isSignUp
                    ? 'Start your investment journey today'
                    : 'Sign in to continue to your account'}
                </p>
              </div>

              {/* Google Sign-In Button */}
              <GoogleSignInRedirect />

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Or continue with
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/50"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    {!isSignUp && (
                      <Link
                        href="#"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      >
                        Forgot?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full pl-10 pr-12 py-3 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {isSignUp && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Must be at least 8 characters long
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={emailLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span className="flex items-center justify-center gap-2">
                    {emailLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {isSignUp ? 'Create Account' : 'Sign In'}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </Button>
              </form>

              {/* Toggle Sign Up / Sign In */}
              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isSignUp
                    ? 'Already have an account?'
                    : "Don't have an account?"}{' '}
                  <button
                    onClick={toggleMode}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>

              {/* Footer */}
              {isSignUp && (
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  By signing up, you agree to our{' '}
                  <Link
                    href="#"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="#"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              )}
            </div>

            {/* Mobile Info Box */}
            <div className="lg:hidden mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-5 space-y-3">
              <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Why join us?
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  Save watchlist across devices
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                  Get personalized recommendations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                  Track portfolio performance
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                  Receive market alerts
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
