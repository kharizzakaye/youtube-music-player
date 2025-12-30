import { useState, useEffect, useCallback } from "react";
import { Song, RepeatMode } from "@/types/music";
import { extractYouTubeId } from "@/utils/youtube";

export const usePlaylist = (initialPlaylist: Song[]) => {
  const [playlist, setPlaylist] = useState<Song[]>(initialPlaylist);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("none");
  const [playOrder, setPlayOrder] = useState<number[]>([]);

  // Initialize play order
  useEffect(() => {
    setPlayOrder(Array.from({ length: playlist.length }, (_, i) => i));
  }, [playlist.length]);

  const shuffleArray = (array: number[]): number[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

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

  const toggleRepeat = () => {
    const modes: RepeatMode[] = ["none", "all", "one"];
    const currentModeIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const addSong = (title: string, url: string) => {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      setPlaylist([...playlist, { url, title: title || "Untitled" }]);
      return true;
    }
    return false;
  };

  const deleteSong = (index: number) => {
    const newPlaylist = playlist.filter((_, i) => i !== index);
    setPlaylist(newPlaylist);
    if (currentIndex >= newPlaylist.length) {
      setCurrentIndex(Math.max(0, newPlaylist.length - 1));
    }
  };

  const playSong = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  // This is called when video ends
  const handleVideoEnd = useCallback(() => {
    console.log("Video ended. Repeat mode:", repeatMode);

    if (repeatMode === "one") {
      // Force reload same video by toggling play state
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
      return;
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex < playlist.length) {
      // Play next song
      console.log("Playing next song:", nextIndex);
      setCurrentIndex(nextIndex);
      setIsPlaying(true);
    } else if (repeatMode === "all") {
      // Loop back to start
      console.log("Looping back to start");
      setCurrentIndex(0);
      setIsPlaying(true);
    } else {
      // Stop playing
      console.log("Playlist ended");
      setIsPlaying(false);
    }
  }, [currentIndex, playlist.length, repeatMode]);

  const nextSong = () => {
    if (repeatMode === "one") {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
      return;
    }

    console.log("currentIndex next", currentIndex);

    const nextIndex = currentIndex + 1;

    console.log("nextIndex", nextIndex);
    if (nextIndex < playlist.length) {
      setCurrentIndex(nextIndex);
    } else if (repeatMode === "all") {
      setCurrentIndex(0);
    } else {
      setIsPlaying(false);
    }
  };

  const previousSong = () => {
    console.log("currentIndex prev", currentIndex);

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (repeatMode === "all") {
      setCurrentIndex(playlist.length - 1);
    }
  };

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
