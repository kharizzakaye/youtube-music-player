"use client";

import React, { useRef, useEffect } from "react";
import { Music } from "lucide-react";
import { getEmbedUrl } from "@/utils/youtube";

interface VideoPlayerProps {
  videoId: string | null;
  isPlaying: boolean;
  videoKey: number; // Add this prop
  onVideoEnd: () => void; // Add this prop
}

export const VideoPlayerComponent: React.FC<VideoPlayerProps> = ({
  videoId,
  isPlaying,
  videoKey,
  onVideoEnd,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for video end event
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // YouTube iframe API sends messages
      if (event.data && typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);
          // Check if video ended (state 0 = ended)
          if (data.event === "onStateChange" && data.info === 0) {
            onVideoEnd();
          }
        } catch (e) {
          // Not a JSON message, ignore
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onVideoEnd]);

  return (
    <div className="bg-black rounded-lg overflow-hidden border-4 border-red-900 shadow-2xl">
      {videoId ? (
        <iframe
          key={videoKey} // This forces iframe to reload when key changes
          ref={iframeRef}
          width="100%"
          height="400"
          src={`${getEmbedUrl(videoId, isPlaying)}&enablejsapi=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full aspect-video"
        />
      ) : (
        <div className="w-full aspect-video bg-gray-900 flex items-center justify-center">
          <Music className="w-24 h-24 text-gray-700" />
        </div>
      )}
    </div>
  );
};
