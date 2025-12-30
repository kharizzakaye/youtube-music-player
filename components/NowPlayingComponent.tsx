"use client";

import React from "react";
import { Song } from "@/types/music";
import { PlayCircleIcon } from "lucide-react";

interface NowPlayingProps {
  song: Song | null;
}

export const NowPlayingComponent: React.FC<NowPlayingProps> = ({ song }) => {
  if (!song) return null;

  return (
    <div className="bg-linear-to-r from-red-900/50 to-red-800/50 border-2 border-red-700 rounded-lg p-6">
      <p className=" text-yellow-400 mb-1 flex items-center">
        <PlayCircleIcon className="h-4 w-4 mr-1" /> Now Playing
      </p>
      <h2 className="text-2xl font-bold text-white">{song.title}</h2>
    </div>
  );
};
