"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

interface AddSongFormProps {
  onAddSong: (title: string, url: string) => void;
}

export const AddSongFormComponent: React.FC<AddSongFormProps> = ({
  onAddSong,
}) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = () => {
    if (url.trim()) {
      onAddSong(title, url);
      setTitle("");
      setUrl("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="bg-black/50 border-2 border-red-900 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-red-500" />
        Add to Playlist
      </h3>
      <input
        type="text"
        placeholder="Song Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white mb-3 focus:outline-none focus:border-red-600"
      />
      <input
        type="text"
        placeholder="YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white mb-3 focus:outline-none focus:border-red-600"
      />
      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-bold transition-all"
      >
        Add Song
      </button>
    </div>
  );
};
