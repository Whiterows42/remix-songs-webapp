"use client";
import React, { useEffect, useState } from "react";
import { Music, Disc, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setActiveCategorySlice } from "@/redux/slices/songSlice";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = [
    "All",
    "Hindi Trending",
    "Remixes",
    "Party Mix",
    "Club Hits",
  ];
  const router = useRouter();
  const dispatch = useDispatch();
  // Toggle the sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    dispatch(setActiveCategorySlice(activeCategory));
  }, [activeCategory]);

  return (
    <div className="relative">
      {/* Mobile Hamburger Button */}
      {!isSidebarOpen && (
        <div className="md:hidden p-4">
          <button
            onClick={toggleSidebar}
            className="text-purple-700 dark:text-purple-500 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed h-full z-50 md:relative md:block md:w-64 md:p-6 transition-all ${
          isSidebarOpen ? "block backdrop-blur-sm p-6 " : "hidden"
        } md:block`}
      >
        <div className="flex items-center gap-2 mb-8">
          <Disc className="h-8 w-8 text-purple-700 dark:text-purple-500" />
          <h1 className="text-xl font-bold">DJ Studio</h1>
          <span
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-6 md:hidden right-0 cursor-pointer"
          >
            X
          </span>
        </div>

        <nav>
          <ul className="space-y-4">
            {categories.map((category) => (
              <li
                key={category}
                className={`cursor-pointer hover:text-purple-500 transition-colors ${
                  activeCategory === category
                    ? "text-purple-500"
                    : "text-gray-300"
                }`}
                onClick={() => {
                  setActiveCategory(category);
                  // router.push(`/category/${category.toLowerCase()}`); // Assuming URL structure for categories
                }}
              >
                <div className="flex items-center gap-3">
                  <Music className="h-5 w-5" />
                  {category}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Authentication */}

      </div>
    </div>
  );
};

export default Sidebar;
