"use client"; // Mark this as a Client Component

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

interface User {
  id: number;
  email: string;
  name: string | null;
  profileImage: string | null;
  isVerified: boolean;
}

export default function UserPage() {
  const params = useParams();
  const userId = params.id;
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/auth/user/${userId}`,
        );
        setUser(response.data);
        setName(response.data.name || ""); // Prefill name
        setProfileImage(response.data.profileImage || ""); // Prefill profile image
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Failed to fetch user data.",
          );
        } else {
          toast.error("Failed to fetch user data.");
        }
      }
    };

    fetchUser();
  }, [userId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      let imageUrl = profileImage;

      // Upload the file if a new file is selected
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        // Upload to a free image hosting service (e.g., ImgBB)
        const uploadResponse = await axios.post(
          "https://api.imgbb.com/1/upload?key=373429e8dbe8b443646ab18fb3b7804d", // Replace with your ImgBB API key
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        imageUrl = uploadResponse.data.data.url; // Get the uploaded image URL
      }

      // Update the user's profile
      const response = await axios.put(
        `http://localhost:3000/auth/user/${userId}`,
        {
          name,
          profileImage: imageUrl,
        },
      );

      setUser(response.data); // Update the user data
      setProfileImage(imageUrl); // Update the profile image URL
      toast.success("Profile updated successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to update profile.",
        );
      } else {
        toast.error("Failed to update profile.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-lg shadow-md w-full max-w-sm text-center">
          <p className="text-zinc-400">Loading user data...</p>
        </div>

        {/* Toast Notifications */}
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-lg shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-6">User Information</h1>
        {profileImage && (
          <div className="mt-4">
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto"
            />
          </div>
        )}
        <div className="text-zinc-400 text-left space-y-4">
          {/* Email (non-editable) */}
          <div>
            <label className="block text-sm font-medium text-zinc-400">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="mt-1 block w-full px-4 py-2 border border-zinc-700 rounded-md shadow-sm bg-zinc-800 text-zinc-400"
            />
          </div>

          {/* Name (editable) */}
          <div>
            <label className="block text-sm font-medium text-zinc-400">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-zinc-700 rounded-md shadow-sm bg-zinc-800 text-zinc-400 focus:outline-none focus:ring-violet-700 focus:border-violet-700"
            />
          </div>

          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm font-medium text-zinc-400">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full px-4 py-2 border border-zinc-700 rounded-md shadow-sm bg-zinc-800 text-zinc-400 focus:outline-none focus:ring-violet-700 focus:border-violet-700"
            />
          </div>

          {/* Verified Status (non-editable) */}
          <div>
            <label className="block text-sm font-medium text-zinc-400">
              Verified
            </label>
            <input
              type="text"
              value={user.isVerified ? "Yes" : "No"}
              disabled
              className="mt-1 block w-full px-4 py-2 border border-zinc-700 rounded-md shadow-sm bg-zinc-800 text-zinc-400"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-violet-800 text-white py-2 px-4 rounded-md hover:bg-violet-900 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 cursor-pointer duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
