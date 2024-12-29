"use client";
import React, { useState } from "react";
import { Upload, Music, Disc, Grid, Settings, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to manage sidebar visibility on mobile

  const navItems = [
    { icon: Grid, label: "Dashboard", path: "/Dashboard" },
    { icon: Upload, label: "Upload Music", path: "/upload" },
    { icon: Music, label: "My Tracks", path: "/tracks" },
    { icon: Users, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  // Function to toggle sidebar visibility on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex relative ">
      {/* Mobile Hamburger Button */}
      {!sidebarOpen &&
      <button
      className="md:hidden p-4 text-gray-600 float-start dark:text-white"
      onClick={toggleSidebar}
    >
      <div className="absolute top-[2rem]" >
      <div className="w-6 h-1 bg-gray-600 dark:bg-white mb-1"></div>
      <div className="w-6 h-1 bg-gray-600 dark:bg-white mb-1"></div>
      <div className="w-6 h-1 bg-gray-600 dark:bg-white"></div>

      </div>
    </button>
      }

      {/* Sidebar */}
      <div
        className={`w-64 border-r h-full border-gray-200 dark:border-gray-700 p-6 ${
          sidebarOpen ? "absolute z-20 backdrop-blur-sm bg-white/30" : ""
        } ${sidebarOpen ? "block" : "hidden"} md:block`}
      >
        <div className="flex items-center gap-2 mb-8">
          <Disc className="h-8 w-8 text-purple-600" />
          <h1 className="text-xl font-bold dark:text-white">DJ Studio Admin</h1>
          <span
            style={{ display: sidebarOpen ? "block" : "none" }}
            onClick={() => setSidebarOpen(false)}
            className="absolute right-2 top-1 cursor-pointer"
          >
            X
          </span>
        </div>

        <nav className="space-y-1">
          {navItems.map(({ icon: Icon, label, path }) => (
            <button
              key={label}
              onClick={() => router.push(path)}
              className={`flex items-center gap-3 w-full p-3 rounded-lg ${
                pathname === path
                  ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              } transition-colors`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
