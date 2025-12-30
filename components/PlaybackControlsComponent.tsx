"use client";

import React from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Repeat1,
} from "lucide-react";
import { RepeatMode } from "@/types/music";

interface PlaybackControlsProps {
  isPlaying: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  currentIndex: number;
  playlistLength: number;
  canGoPrevious: boolean;
  onTogglePlay: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const PlaybackControlsComponent: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  isShuffle,
  repeatMode,
  currentIndex,
  playlistLength,
  canGoPrevious,
  onTogglePlay,
  onToggleShuffle,
  onToggleRepeat,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="bg-black/50 border-2 border-red-900 rounded-lg p-6">
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={onToggleShuffle}
          className={`p-3 rounded-full transition-all ${
            isShuffle
              ? "bg-red-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          <Shuffle className="w-5 h-5" />
        </button>

        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SkipBack className="w-6 h-6" />
        </button>

        <button
          onClick={onTogglePlay}
          className="p-6 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-full transition-all transform hover:scale-110 shadow-lg shadow-red-900/50"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </button>

        <button
          onClick={onNext}
          className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-all"
        >
          <SkipForward className="w-6 h-6" />
        </button>

        <button
          onClick={onToggleRepeat}
          className={`p-3 rounded-full transition-all ${
            repeatMode !== "none"
              ? "bg-red-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          {repeatMode === "one" ? (
            <Repeat1 className="w-5 h-5" />
          ) : (
            <Repeat className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-center gap-6 text-sm">
        <span className="text-gray-400">
          Shuffle:{" "}
          <span className={isShuffle ? "text-red-500 font-bold" : "text-white"}>
            {isShuffle ? "ON" : "OFF"}
          </span>
        </span>
        <span className="text-gray-400">
          Repeat:{" "}
          <span className="text-white font-bold">
            {repeatMode === "none"
              ? "OFF"
              : repeatMode === "one"
              ? "ONE"
              : "ALL"}
          </span>
        </span>
        <span className="text-gray-400">
          Track:{" "}
          <span className="text-white font-bold">
            {currentIndex + 1} / {playlistLength}
          </span>
        </span>
      </div>
    </div>
  );
};
