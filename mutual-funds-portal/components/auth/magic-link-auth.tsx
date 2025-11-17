"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowRight, Check, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

export function MagicLinkAuth() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/magic-link/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send magic link");
      }

      setSent(true);
      toast({
        title: "Magic Link Sent! ✨",
        description: "Check your email for the login link",
      });

      // For development - show the link
      if (data.data?.magicLinkUrl) {
        console.log("🔐 Magic Link:", data.data.magicLinkUrl);
      }
    } catch (error: any) {
      console.error("Magic link error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send magic link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center"
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            Check Your Email!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            We've sent a magic link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Click the link in the email to sign in (expires in 15 minutes)
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <button
            onClick={() => setSent(false)}
            className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
          >
            Use a different email
          </button>

          <div className="flex gap-2">
            <Button
              onClick={handleSendMagicLink}
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={loading}
            >
              Resend Link
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSendMagicLink} className="space-y-4">
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
            className="pl-10"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Magic Link
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>

      <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          No password needed! We'll email you a secure login link
        </p>
      </div>
    </form>
  );
}
