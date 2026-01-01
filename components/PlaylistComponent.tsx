"use client";

import React from "react";
import { Song } from "@/types/music";
import { PlaylistItemComponent } from "./PlaylistItemComponent";

interface PlaylistProps {
  songs: Song[];
  currentIndex: number;
  isPlaying: boolean;
  onPlaySong: (index: number) => void;
  onDeleteSong: (index: number) => void;
}

export const PlaylistComponent: React.FC<PlaylistProps> = ({
  songs,
  currentIndex,
  isPlaying,
  onPlaySong,
  onDeleteSong,
}) => {
  return (
    <div className="bg-black/50 border-2 border-red-900 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">
        My Playlist ({songs.length} songs)
      </h3>
      <div className="space-y-3 max-h-150 overflow-y-auto pr-2 custom-scrollbar">
        {songs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No songs available</p>
        ) : (
          songs.map((item, index) => (
            <PlaylistItemComponent
              key={index}
              item={item}
              index={index}
              isActive={index === currentIndex && isPlaying}
              onPlay={onPlaySong}
              onDelete={onDeleteSong}
            />
          ))
        )}
      </div>
    </div>
  );
};
