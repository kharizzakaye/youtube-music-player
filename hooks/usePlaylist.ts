import { useState, useEffect, useRef, useCallback } from "react";
import { Song, RepeatMode } from "@/types/music";
import { extractYouTubeId } from "@/utils/youtube";

export const usePlaylist = (initialPlaylist: Song[]) => {
  const [playlist, setPlaylist] = useState<Song[]>(initialPlaylist);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("none");
  const [playOrder, setPlayOrder] = useState<number[]>([]);
  const [videoKey, setVideoKey] = useState(0); // Add this to force iframe reload

  const videoPlayerRef = useRef<{ reload: () => void }>(null);

  // Initialize play order
  useEffect(() => {
    setPlayOrder(Array.from({ length: playlist.length }, (_, i) => i));
  }, [playlist.length]);

  // Shuffle array
  const shuffleArray = (array: number[]): number[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Toggle shuffle
  const toggleShuffle = () => {
    if (!isShuffle) {
      const shuffled = shuffleArray(
        Array.from({ length: playlist.length }, (_, i) => i)
      );
      setPlayOrder(shuffled);
      setCurrentIndex(0);
    } else {
      setPlayOrder(Array.from({ length: playlist.length }, (_, i) => i));
      setCurrentIndex(0);
    }
    setIsShuffle(!isShuffle);
  };

  // Toggle repeat mode
  const toggleRepeat = () => {
    const modes: RepeatMode[] = ["none", "all", "one"];
    const currentModeIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  // Add song
  const addSong = (title: string, url: string) => {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      setPlaylist([...playlist, { url, title: title || "Untitled" }]);
      return true;
    }
    return false;
  };

  // Delete song
  const deleteSong = (index: number) => {
    const newPlaylist = playlist.filter((_, i) => i !== index);
    setPlaylist(newPlaylist);
    if (currentIndex >= newPlaylist.length) {
      setCurrentIndex(Math.max(0, newPlaylist.length - 1));
    }
  };

  // Play song
  const playSong = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
    setVideoKey((prev) => prev + 1); // Force reload
  };

  // Handle video end - This is the key for repeat functionality
  const handleVideoEnd = useCallback(() => {
    if (repeatMode === "one") {
      // Restart the same video
      setVideoKey((prev) => prev + 1);
      setIsPlaying(true);
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < playlist.length) {
      setCurrentIndex(nextIndex);
      setVideoKey((prev) => prev + 1);
    } else if (repeatMode === "all") {
      setCurrentIndex(0);
      setVideoKey((prev) => prev + 1);
    } else {
      setIsPlaying(false);
    }
  }, [currentIndex, playlist.length, repeatMode]);

  // Next song
  const nextSong = () => {
    if (repeatMode === "one") {
      setVideoKey((prev) => prev + 1);
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < playlist.length) {
      setCurrentIndex(nextIndex);
      setVideoKey((prev) => prev + 1);
    } else if (repeatMode === "all") {
      setCurrentIndex(0);
      setVideoKey((prev) => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  // Previous song
  const previousSong = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setVideoKey((prev) => prev + 1);
    } else if (repeatMode === "all") {
      setCurrentIndex(playlist.length - 1);
      setVideoKey((prev) => prev + 1);
    }
  };

  // Get current video ID
  const getCurrentVideoId = (): string | null => {
    if (playlist.length === 0) return null;
    const actualIndex = isShuffle ? playOrder[currentIndex] : currentIndex;
    return extractYouTubeId(playlist[actualIndex]?.url);
  };

  const actualCurrentIndex = isShuffle ? playOrder[currentIndex] : currentIndex;
  const canGoPrevious = currentIndex > 0 || repeatMode === "all";

  return {
    playlist,
    currentIndex,
    isPlaying,
    isShuffle,
    repeatMode,
    actualCurrentIndex,
    canGoPrevious,
    videoPlayerRef,
    videoKey,
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
  };
};
