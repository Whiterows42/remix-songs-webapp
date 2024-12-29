"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react"; // Assuming you're using lucide-react for icons
import { Provider } from 'react-redux';
import store from "@/redux/store"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState("light");

  // Load the theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.add(storedTheme);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Provider store={store}>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-black dark:text-white`}
      >
        <header className="relative">
          <span className="absolute right-6 top-1 z-[9999999]">
            <div className="flex justify-center items-center">
              <button
                onClick={toggleTheme} // Activate the theme toggle
                className="rounded-full"
              >
                {theme === "dark" ? (
                  <Sun className="h-6 w-6 text-white" />
                ) : (
                  <Moon className="h-6 w-6 text-gray-800" />
                )}
              </button>
            </div>
          </span>
        </header>
        {children}
      </body>
    </html>
    </Provider>
  );
}
