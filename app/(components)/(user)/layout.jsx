"use client"
import React, { useState } from 'react';
import Sidebar from './sidebar';
const Layout = ({ children }) => {
  
  return (
    <div className="md:flex h-screen bg-white dark:bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar
   
      />
      {/* Main Content Area */}
      <main className="flex-1 p-8 bg-gradient-to-b from-white to-gray-100 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
        {children}
      </main>
    </div>
  );
};

export default Layout;
