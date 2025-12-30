"use client";

import React from "react";
import { Music, Trash2 } from "lucide-react";
import Image from "next/image";
import { Song } from "@/types/music";
import { extractYouTubeId, getThumbnailUrl } from "@/utils/youtube";

interface PlaylistItemProps {
  item: Song;
  index: number;
  isActive: boolean;
  onPlay: (index: number) => void;
  onDelete: (index: number) => void;
}

export const PlaylistItemComponent: React.FC<PlaylistItemProps> = ({
  item,
  index,
  isActive,
  onPlay,
  onDelete,
}) => {
  const videoId = extractYouTubeId(item.url);
  const thumbnailUrl = videoId ? getThumbnailUrl(videoId) : null;

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer group
        ${
          isActive
            ? "bg-linear-to-r from-red-900/50 to-red-800/50 border-red-500"
            : "bg-black/30 border-gray-700 hover:border-red-700 hover:bg-black/50"
        }`}
      onClick={() => onPlay(index)}
    >
      <div
        className={`shrink-0 w-12 h-12 rounded flex items-center justify-center text-gray-400 font-bold ${
          isActive ? "bg-black" : "bg-gray-800 "
        }`}
      >
        {isActive ? (
          <Music className="w-6 h-6 text-white animate-pulse" />
        ) : (
          <span>{index + 1}</span>
        )}
      </div>

      {thumbnailUrl && (
        <Image
          src={thumbnailUrl}
          alt="Thumbnail"
          className="w-20 h-14 object-cover rounded"
          width={80}
          height={56}
        />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">
          {item.title || "Untitled"}
        </p>
        {/* <p className="text-gray-400 text-sm truncate">{item.url}</p> */}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(index);
        }}
        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-600 rounded-full transition-all cursor-pointer"
      >
        <Trash2 className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};
