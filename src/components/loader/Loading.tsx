"use client";

import { Music2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
        <div className="absolute inset-0 rounded-full border-4 border-t-amber-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Music2 className="w-5 h-5 text-amber-400" />
        </div>
      </div>
      <p className="text-amber-500 text-sm font-medium animate-pulse">Loading...</p>
    </div>
  );
}
