"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { setToken, setRefreshToken, setUser } from "@/lib/api";

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    console.log("🔵 Auth Success Page - Processing...");
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const userParam = searchParams.get("user");

    console.log("Tokens received:", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasUser: !!userParam,
    });

    if (accessToken && refreshToken) {
      try {
        // Store tokens using API utility
        console.log("📝 Storing tokens in localStorage...");
        setToken(accessToken);
        setRefreshToken(refreshToken);

        // Store user data
        if (userParam) {
          try {
            const userData = JSON.parse(decodeURIComponent(userParam));
            console.log("✅ User data parsed:", userData);
            setUser(userData);
          } catch (e) {
            console.error("Error parsing user data from URL:", e);
            // Fallback: extract from token
            try {
              const payload = JSON.parse(atob(accessToken.split(".")[1]));
              const user = {
                id: payload.id,
                email: payload.email,
                name: payload.name || payload.email,
                role: payload.role,
                profilePicture: payload.picture,
              };
              console.log("✅ User data extracted from token:", user);
              setUser(user);
            } catch (e2) {
              console.error("Error parsing token:", e2);
            }
          }
        } else {
          // No user param, extract from token
          try {
            const payload = JSON.parse(atob(accessToken.split(".")[1]));
            const user = {
              id: payload.id,
              email: payload.email,
              name: payload.name || payload.email,
              role: payload.role,
              profilePicture: payload.picture,
            };
            console.log("✅ User data from token:", user);
            setUser(user);
          } catch (e) {
            console.error("Error parsing token:", e);
          }
        }

        console.log("✅ All data stored successfully");

        // Dispatch events to notify header (for any components still mounted)
        console.log("📡 Dispatching authChange event...");
        try {
          window.dispatchEvent(new Event("authChange"));
          window.dispatchEvent(
            new StorageEvent("storage", {
              key: "varta_token",
              newValue: accessToken,
            })
          );
        } catch (e) {
          console.log("Event dispatch skipped:", e);
        }

        // Show success message with user info
        const storedUser = localStorage.getItem("varta_user");
        let userName = "there";
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            userName = user.name || user.email || "there";
          } catch (e) {
            console.error("Error parsing stored user:", e);
          }
        }

        toast({
          title: "Welcome back!",
          description: `Successfully signed in as ${userName}`,
        });

        // Redirect to home page with full reload to ensure header updates
        console.log("🔄 Redirecting to home page...");
        setRedirecting(true);

        setTimeout(() => {
          console.log("➡️ Executing redirect with full page reload...");
          window.location.href = "/";
        }, 800);
      } catch (error) {
        console.error("❌ Error during auth success:", error);

        let errorMessage = "Something went wrong. Please try again.";
        if (error instanceof Error) {
          errorMessage = error.message;
        }

        toast({
          title: "Authentication Error",
          description: errorMessage,
          variant: "destructive",
        });

        setTimeout(() => {
          router.push("/auth");
        }, 2000);
      }
    } else {
      // No tokens received, redirect back to auth page
      console.error("❌ No tokens received");

      let errorMsg = "Could not complete sign-in. Please try again.";

      // Check if there's an error in the URL params
      const errorParam = searchParams.get("error");
      if (errorParam) {
        errorMsg = decodeURIComponent(errorParam);
      }

      toast({
        title: "Authentication Failed",
        description: errorMsg,
        variant: "destructive",
      });

      setTimeout(() => {
        router.push("/auth");
      }, 2000);
    }
  }, [searchParams, router, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {redirecting ? "Redirecting to home..." : "Completing sign-in..."}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we redirect you
        </p>
      </div>
    </div>
  );
}
