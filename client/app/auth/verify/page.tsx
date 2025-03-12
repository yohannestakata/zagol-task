"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid verification link.");
      router.push("/");
      return;
    }

    // Send the token to the backend for verification
    const verifyToken = async () => {
      try {
        const response = await axios.post("http://localhost:3000/auth/verify", {
          token, // Send the token in the request body
        });

        // Show success message
        toast.success("Email verified successfully!");

        // Wait for 3 seconds, then redirect to the user info page
        setTimeout(() => {
          router.push(`/user/${response.data.user.id}`);
        }, 1000);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Verification failed.");
        } else {
          toast.error("Verification failed.");
        }
        router.push("/");
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-lg shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-6">Verifying Your Email</h1>
        <p className="text-zinc-400">
          Please wait while we verify your email...
        </p>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
