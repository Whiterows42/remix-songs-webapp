"use client"
import Image from "next/image";
import "./globals.css";
import { useRouter } from "next/navigation";
export default function Home() {

  const router  = useRouter()
  const handleGetStarted = () => {
    router.push("/login")
  }
  
  return (
    <>
   <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to the DJ Song Platform</h1>
      <p className="text-lg text-center max-w-lg mb-6">
        Explore the latest DJ songs, enjoy seamless playback, and customize your
        experience with light or dark themes.
      </p>
      <button onClick={handleGetStarted} className="px-6 py-3 bg-blue-500 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-800 transition duration-300">
        Get Started
      </button>
    </div>
    </>
  );
}
