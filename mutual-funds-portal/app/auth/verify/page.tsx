"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

export default function VerifyMagicLinkPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const verifyLink = async () => {
      const token = searchParams.get("token");
      const email = searchParams.get("email");

      if (!token || !email) {
        setStatus("error");
        setMessage("Invalid or missing verification link");
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/auth/magic-link/verify?token=${token}&email=${encodeURIComponent(
            email
          )}`,
          {
            method: "GET",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Verification failed");
        }

        // Store tokens
        localStorage.setItem("token", data.data.tokens.accessToken);
        localStorage.setItem("refreshToken", data.data.tokens.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        // Dispatch auth change event
        window.dispatchEvent(new Event("authChange"));

        setStatus("success");
        setMessage("Successfully signed in!");

        toast({
          title: "Welcome! 👋",
          description: "You've been successfully signed in",
        });

        // Redirect to home page
        setTimeout(() => router.push("/"), 1500);
      } catch (error: any) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage(error.message || "Failed to verify magic link");

        toast({
          title: "Verification Failed",
          description: error.message || "The link may have expired",
          variant: "destructive",
        });
      }
    };

    verifyLink();
  }, [searchParams, router, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
      >
        {status === "loading" && (
          <div className="text-center space-y-4">
            <Loader2 className="w-16 h-16 mx-auto text-purple-600 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Verifying Magic Link
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we verify your link...
            </p>
          </div>
        )}

        {status === "success" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center"
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Success!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
            <p className="text-sm text-gray-500">Redirecting you to home...</p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center"
            >
              <X className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              Verification Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
            <Button
              onClick={() => router.push("/auth")}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Back to Sign In
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
