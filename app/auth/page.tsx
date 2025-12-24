'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  LogIn,
  UserPlus,
  Shield,
  TrendingUp,
  PieChart,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 px-4 py-12">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 md:p-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm mx-auto mb-6 shadow-lg">
              <span className="text-3xl font-bold text-white">MF</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to MutualFunds.in
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Your trusted partner for smart mutual fund investments
            </p>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 p-8 md:p-12 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                <TrendingUp className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Track Performance
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor your investments in real-time
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <PieChart className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Smart Analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-powered insights and recommendations
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Secure & Safe
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bank-grade security for your data
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-3">
              Get Started Today
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
              Choose how you'd like to continue. Already have an account? Sign in. New here? Create your free account.
            </p>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Login Card */}
              <Link href="/auth/login" className="group">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-xl cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <LogIn className="h-6 w-6 text-white" />
                    </div>
                    <ChevronRight className="h-6 w-6 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Sign In
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Already have an account? Welcome back!
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-600" />
                      Access your portfolio
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-600" />
                      Continue tracking your funds
                    </li>
                  </ul>
                </div>
              </Link>

              {/* Register Card */}
              <Link href="/auth/register" className="group">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:shadow-xl cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UserPlus className="h-6 w-6 text-white" />
                    </div>
                    <ChevronRight className="h-6 w-6 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Create Account
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    New here? Join thousands of investors!
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      Free forever
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      Set up in 2 minutes
                    </li>
                  </ul>
                </div>
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-10 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                By continuing, you agree to our{' '}
                <Link
                  href="/terms"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Trusted by 10,000+ investors across India
          </p>
          <div className="flex items-center justify-center gap-8 text-xs text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Bank-level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Real-time Data</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
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
