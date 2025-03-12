"use client"; // Mark this as a Client Component

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      // Send a POST request to the registration API
      const response = await axios.post("http://localhost:3000/auth/register", {
        email,
        password,
      });

      // Show a success toast
      toast.success("Check your email for verification!");

      // Redirect to the waiting page
      router.push("/waiting");
    } catch (error) {
      // Show an error toast
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Registration failed. Please try again.",
        );
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6">Registration form</h1>
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-400"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-violet-700 focus:border-violet-700"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-400"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-violet-700 focus:border-violet-700"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-violet-800 text-white py-2 px-4 rounded-md hover:bg-violet-900 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
