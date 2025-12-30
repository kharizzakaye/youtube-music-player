export interface Song {
  url: string;
  title: string;
}

export type RepeatMode = "none" | "one" | "all";

export interface PlayerState {
  currentIndex: number;
  isPlaying: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
}
