// src/components/DevModeIndicator.js

import React from 'react';

export default function DevModeIndicator() {
  // Only run in browser
  if (typeof window === 'undefined') return null;
  
  // Check if in development mode
  const isDev = process.env.NODE_ENV === 'development';
  
  // Check if using emulators
  const isUsingEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true';
  
  // Only show in development
  if (!isDev) return null;
  
  return (
    <div className="fixed bottom-2 right-2 z-50 flex items-center space-x-2">
      <div className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
        DEV MODE
      </div>
      
      {isUsingEmulators && (
        <div className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded shadow flex items-center">
          <span className="mr-1">EMULATORS</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
        </div>
      )}
    </div>
  );
}
