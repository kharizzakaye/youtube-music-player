"use client";

import React from "react";

import { usePlaylist } from "@/hooks/usePlaylist";
import { VideoPlayerComponent } from "@/components/VideoPlayerComponent";
import { NowPlayingComponent } from "@/components/NowPlayingComponent";
import { PlaybackControlsComponent } from "@/components/PlaybackControlsComponent";
import { AddSongFormComponent } from "@/components/AddSongFormComponent";
import { PlaylistComponent } from "@/components/PlaylistComponent";

const initialPlaylist = [
  {
    url: "https://youtu.be/mgIszdutx3k?list=RDMMmgIszdutx3k",
    title: "Faber Drive - Tongue Tied",
  },
  {
    url: "https://youtu.be/KFBNM6EMeWI?list=RDMMmgIszdutx3k",
    title: "Heaven Knows (Rock Cover)",
  },
  {
    url: "https://youtu.be/ntSBKPkk4m4?list=RDMMmgIszdutx3k",
    title: "Simple Plan - Jet Lag ft. Natasha Bedingfield",
  },
];

export default function YouTubeMusicPlayer() {
  const {
    playlist,
    currentIndex,
    isPlaying,
    isShuffle,
    repeatMode,
    actualCurrentIndex,
    canGoPrevious,
    getCurrentVideoId,
    addSong,
    deleteSong,
    playSong,
    nextSong,
    previousSong,
    toggleShuffle,
    toggleRepeat,
    setIsPlaying,
    handleVideoEnd,
  } = usePlaylist(initialPlaylist);

  const handleAddSong = (title: string, url: string) => {
    const success = addSong(title, url);
    if (!success) {
      alert("Please enter a valid YouTube URL");
    }
  };

  const currentVideoId = getCurrentVideoId();
  const currentSong = playlist[actualCurrentIndex] || null;

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-red-950 to-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 text-white">
            YouTube Music Player
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player & Controls */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayerComponent
              videoId={currentVideoId}
              isPlaying={isPlaying}
              onVideoEnd={handleVideoEnd}
            />

            <NowPlayingComponent song={currentSong} />

            <PlaybackControlsComponent
              isPlaying={isPlaying}
              isShuffle={isShuffle}
              repeatMode={repeatMode}
              currentIndex={currentIndex}
              playlistLength={playlist.length}
              canGoPrevious={canGoPrevious}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onToggleShuffle={toggleShuffle}
              onToggleRepeat={toggleRepeat}
              onPrevious={previousSong}
              onNext={nextSong}
            />
          </div>

          {/* Playlist */}
          <div className="space-y-6">
            <AddSongFormComponent onAddSong={handleAddSong} />

            <PlaylistComponent
              songs={playlist}
              currentIndex={actualCurrentIndex}
              isPlaying={isPlaying}
              onPlaySong={playSong}
              onDeleteSong={deleteSong}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(220, 38, 38, 0.6);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(220, 38, 38, 0.8);
        }
      `}</style>
    </div>
  );
}
