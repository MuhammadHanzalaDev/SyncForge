"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { NormalizedAttachment } from "@/modules/file/file.types";

type Props = {
  item: NormalizedAttachment;
  isOwn?: boolean;
};

const BAR_COUNT = 32;

const formatTime = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${sec}`;
};

// Deterministic pseudo-waveform from the attachment id, so each message
// has a stable but unique bar pattern without decoding the audio.
const generateBars = (seed: string): number[] => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return Array.from({ length: BAR_COUNT }, () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    const v = (h % 1000) / 1000; // 0..1
    return 0.25 + v * 0.75; // 0.25..1.0 so no flat bars
  });
};

export default function VoiceMessageTile({ item, isOwn }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [currentTime, setCurrentTime] = useState(0);

  // Use stored duration if available; otherwise fall back to audio metadata.
  const [duration, setDuration] = useState(item.durationSec ?? 0);

  const bars = generateBars(item.id);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      if (!item.durationSec && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsLoading(false);
    };
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      const d = duration || audio.duration || 0;
      setProgress(d > 0 ? audio.currentTime / d : 0);
    };
    const onEnd = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      audio.currentTime = 0;
    };
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    const onError = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("error", onError);
    audio.addEventListener("stalled", onError);
    audio.addEventListener("abort", onError);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("stalled", onError);
      audio.removeEventListener("abort", onError);
    };
  }, [duration, item.durationSec]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setIsLoading(true);

      audio.load();

      await audio.play();
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(
      1,
      Math.max(0, (e.clientX - rect.left) / rect.width),
    );
    audio.currentTime = ratio * duration;
    setProgress(ratio);
    setCurrentTime(audio.currentTime);
  };

  const displayTime = isPlaying || currentTime > 0 ? currentTime : duration;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3 py-2 max-w-[280px] min-w-[240px]",
        isOwn
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-foreground",
      )}
    >
      <button
        type="button"
        onClick={togglePlay}
        disabled={!item.src}
        aria-label={isPlaying ? "Pause voice message" : "Play voice message"}
        className={cn(
          "flex items-center justify-center h-9 w-9 rounded-full shrink-0 transition-colors",
          isOwn
            ? "bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
            : "bg-background hover:bg-background/80 text-foreground border",
        )}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 ml-0.5" />
        )}
      </button>

      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div
          onClick={handleSeek}
          className="relative flex items-center gap-[2px] h-7 cursor-pointer"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={duration || 0}
          aria-valuenow={currentTime}
        >
          {bars.map((h, i) => {
            const barProgress = (i + 1) / BAR_COUNT;
            const played = barProgress <= progress;
            return (
              <span
                key={i}
                className={cn(
                  "flex-1 rounded-full transition-colors",
                  played
                    ? isOwn
                      ? "bg-primary-foreground"
                      : "bg-primary"
                    : isOwn
                      ? "bg-primary-foreground/40"
                      : "bg-foreground/30",
                )}
                style={{
                  height: `${Math.max(20, h * 100)}%`,
                  minWidth: 2,
                }}
              />
            );
          })}
        </div>

        <span
          className={cn(
            "text-[10px] font-mono tabular-nums",
            isOwn ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {formatTime(displayTime)}
        </span>
      </div>

      <audio
        key={item.src}
        ref={audioRef}
        src={item.src}
        preload="auto"
        className="hidden"
      />
    </div>
  );
}
