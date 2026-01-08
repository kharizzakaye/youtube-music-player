"use client";

import React, { useEffect, useRef, useState } from "react";
import { Music } from "lucide-react";

interface VideoPlayerProps {
  videoId: string | null;
  isPlaying: boolean;
  onVideoEnd: () => void;
  onPlayerReady: (ready: boolean) => void;
  shouldRestart?: boolean;
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
  onPlayerReady,
  shouldRestart = false,
}) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

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

    setIsPlayerReady(false);
    onPlayerReady(false);

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
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: (event: any) => {
          console.log("Player ready");
          setIsPlayerReady(true);
          onPlayerReady(true);
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

  // Handle restart
  useEffect(() => {
    if (shouldRestart && playerRef.current && isPlayerReady) {
      try {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
      } catch (error) {
        console.error("Error restarting video:", error);
      }
    }
  }, [shouldRestart, isPlayerReady]);

  // Handle play/pause changes
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return;

    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch (error) {
      console.error("Error controlling player:", error);
    }
  }, [isPlaying, isPlayerReady]);

  return (
    <div className="bg-black rounded-lg overflow-hidden border-4 border-red-900 shadow-2xl relative">
      {videoId ? (
        <>
          <div ref={containerRef} className="w-full aspect-video" />
          {!isPlayerReady && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mx-auto mb-4"></div>
                <p className="text-white text-xl font-semibold">
                  Loading YouTube Player...
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full aspect-video bg-gray-900 flex items-center justify-center">
          <Music className="w-24 h-24 text-gray-700" />
        </div>
      )}
    </div>
  );
};
