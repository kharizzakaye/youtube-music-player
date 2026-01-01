"use client";

import React, { useEffect, useRef } from "react";
import { Music } from "lucide-react";

interface VideoPlayerProps {
  videoId: string | null;
  isPlaying: boolean;
  onVideoEnd: () => void;
}

// Declare YouTube types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const VideoPlayerComponent: React.FC<VideoPlayerProps> = ({
  videoId,
  isPlaying,
  onVideoEnd,
}) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load YouTube IFrame API
  useEffect(() => {
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      return;
    }

    // Load the IFrame Player API code asynchronously
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  }, []);

  // Initialize player when videoId changes
  useEffect(() => {
    if (!videoId || !window.YT || !window.YT.Player) return;

    // Destroy previous player
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    // Create new player
    playerRef.current = new window.YT.Player(containerRef.current, {
      height: "400",
      width: "100%",
      videoId: videoId,
      playerVars: {
        autoplay: isPlaying ? 1 : 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: (event: any) => {
          console.log("Player ready");
          // If should be playing when ready, start playback
          if (isPlaying) {
            event.target.playVideo();
          }
        },
        onStateChange: (event: any) => {
          console.log("Player state changed:", event.data);
          // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: cued
          if (event.data === 0) {
            console.log("Video ended - calling onVideoEnd");
            onVideoEnd();
          }
        },
      },
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  // Handle play/pause changes
  useEffect(() => {
    if (!playerRef.current) return;

    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch (error) {
      console.error("Error controlling player:", error);
    }
  }, [isPlaying]);

  return (
    <div className="bg-black rounded-lg overflow-hidden border-4 border-red-900 shadow-2xl">
      {videoId ? (
        <div ref={containerRef} className="w-full aspect-video" />
      ) : (
        <div className="w-full aspect-video bg-gray-900 flex items-center justify-center">
          <Music className="w-24 h-24 text-gray-700" />
        </div>
      )}
    </div>
  );
};
