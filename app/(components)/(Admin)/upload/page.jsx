"use client";
import React, { useState, useRef } from "react";
import {
  Upload,
  Music,
  Disc,
  Grid,
  Settings,
  Users,
  ChevronRight,
  Plus,
  MoreVertical,
  Search,
  X,
} from "lucide-react";
import axios from "axios";

const UploadMusic = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadedSongs, setUploadedSongs] = useState([
    {
      id: 1,
      title: "Summer Vibes Remix",
      category: "Remixes",
      status: "Published",
      uploadDate: "2024-12-28",
    },
    {
      id: 2,
      title: "Bollywood Dance Mix",
      category: "Hindi Trending",
      status: "Draft",
      uploadDate: "2024-12-29",
    },
  ]);
  const [formState, setFormState] = useState({
    title: "",
    category: "",
    artist: "",
    releaseDate: "",
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && isValidFileType(file)) {
      setSelectedFile(file);
      setFormState((prev) => ({
        ...prev,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      }));
    } else {
      alert("Please upload a valid audio file (MP3, WAV, or FLAC)");
    }
  };

  const isValidFileType = (file) => {
    const validTypes = ["audio/mpeg", "audio/wav", "audio/flac"];
    return validTypes.includes(file.type);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && isValidFileType(file)) {
      setSelectedFile(file);
      setFormState((prev) => ({
        ...prev,
        title: file.name.replace(/\.[^/.]+$/, ""),
      }));
    } else {
      alert("Please upload a valid audio file (MP3, WAV, or FLAC)");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }
  
    if (!formState.title || !formState.category) {
      alert("Please fill in all required fields");
      return;
    }
  
    try {
      // Fetch Cloudinary signature from your API
      const signatureResponse = await fetch("/api/cloudinary");
      const { signature, timestamp, cloudName, apiKey } = await signatureResponse.json();
  
      // Create form data for direct Cloudinary upload
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
  
      // Upload file to Cloudinary
      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        formData
      );
  
      // Extract the secure URL from Cloudinary response
      const { secure_url } = uploadResponse.data;
  
      // Payload for your API to store metadata in MongoDB
      const payload = {
        title: formState.title,
        category: formState.category,
        artist: formState.artist,
        releaseDate: formState.releaseDate,
        url: secure_url, // Cloudinary file URL
      };
  
      // Save metadata to your database
      const response = await fetch("/api/uploadsong", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (data.success) {
        // Update uploaded songs state
        setUploadedSongs((prev) => [
          {
            id: Date.now(),
            title: formState.title,
            category: formState.category,
            status: "Draft",
            uploadDate: new Date().toISOString().split("T")[0],
          },
          ...prev,
        ]);
  
        // Reset form state
        setSelectedFile(null);
        setFormState({
          title: "",
          category: "",
          artist: "",
          releaseDate: "",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
  
        alert("Upload successful!");
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    }
  };
  

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold dark:text-white">Upload Music</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tracks..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Upload Area */}
        <div className="p-6 space-y-6">
          {/* Drag & Drop Zone */}
          <div
            onClick={handleUploadClick}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 ${
              dragActive
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                : "border-gray-300 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500"
            } transition-colors cursor-pointer relative`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="audio/mpeg,audio/wav,audio/flac"
              onChange={handleFileSelect}
            />

            {selectedFile ? (
              <div className="flex flex-col items-center gap-4">
                <Music className="h-12 w-12 text-purple-500" />
                <div className="text-center">
                  <p className="text-lg font-medium dark:text-white">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Upload className="h-12 w-12 text-gray-400" />
                <div className="text-center">
                  <p className="text-lg font-medium dark:text-white">
                    Drag and drop your audio file here
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    or click to browse from your computer
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  Supported formats: MP3, WAV, FLAC (Max size: 50MB)
                </p>
              </div>
            )}
          </div>

          {/* Upload Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 dark:text-gray-300">
                  Track Title <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  name="title"
                  value={formState.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </label>
              <label className="block">
                <span className="text-gray-700 dark:text-gray-300">
                  Category <span className="text-red-500">*</span>
                </span>
                <select
                  name="category"
                  value={formState.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  <option>Hindi Trending</option>
                  <option>Remixes</option>
                  <option>Party Mix</option>
                  <option>Club Hits</option>
                </select>
              </label>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 dark:text-gray-300">
                  Artist Name
                </span>
                <input
                  type="text"
                  name="artist"
                  value={formState.artist}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </label>
              <label className="block">
                <span className="text-gray-700 dark:text-gray-300">
                  Release Date
                </span>
                <input
                  type="date"
                  name="releaseDate"
                  value={formState.releaseDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              disabled={
                !selectedFile || !formState.title || !formState.category
              }
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Upload Track
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMusic;
