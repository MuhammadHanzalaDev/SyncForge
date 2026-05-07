"use client";

import { useEffect, useState } from "react";
import { Mic, Trash2, Send, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useVoiceRecorder } from "@/modules/message/hooks/useVoiceRecorder";

interface VoiceRecorderProps {
  onSend: (file: File, durationSec: number) => void;
  onClose: () => void;
  // Auto-start recording when mounted (caller pressed mic button)
  autoStart?: boolean;
  maxDurationSec?: number;
}

const formatTime = (s: number) => {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

const BAR_COUNT = 28;

const VoiceRecorder = ({
  onSend,
  onClose,
  autoStart = true,
  maxDurationSec = 300, // 5 minutes
}: VoiceRecorderProps) => {
  const { state, duration, audioLevel, error, start, stop, cancel } =
    useVoiceRecorder();
  const [bars, setBars] = useState<number[]>(() => Array(BAR_COUNT).fill(0.05));
  const [submitting, setSubmitting] = useState(false);

  // Kick off recording on mount
  useEffect(() => {
    if (autoStart && state === "idle") {
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push audio level into a sliding bar buffer for waveform feel
  useEffect(() => {
    if (state !== "recording") return;
    setBars((prev) => {
      const next = prev.slice(1);
      next.push(Math.max(0.05, audioLevel));
      return next;
    });
  }, [audioLevel, state]);

  // Enforce max duration
  useEffect(() => {
    if (duration >= maxDurationSec && state === "recording") {
      handleSend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, maxDurationSec, state]);

  const handleCancel = () => {
    cancel();
    onClose();
  };

  const handleSend = async () => {
    if (state !== "recording") return;
    setSubmitting(true);
    const result = await stop();
    setSubmitting(false);
    if (!result) {
      onClose();
      return;
    }
    const ext = result.mimeType.includes("mp4")
      ? "m4a"
      : result.mimeType.includes("ogg")
        ? "ogg"
        : "webm";
    const file = new File(
      [result.blob],
      `voice-${Date.now()}.${ext}`,
      { type: result.mimeType },
    );
    onSend(file, result.duration);
    onClose();
  };

  if (error) {
    return (
      <div className="flex items-center justify-between gap-2 px-3 py-2 text-sm text-destructive">
        <span>Microphone error: {error}</span>
        <button
          onClick={onClose}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 bg-background">
      {/* Cancel */}
      <button
        type="button"
        onClick={handleCancel}
        className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
        aria-label="Cancel recording"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* Pulse + waveform + timer */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={cn(
              "h-2 w-2 rounded-full bg-red-500",
              state === "recording" && "animate-pulse",
            )}
          />
          <Mic className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex-1 flex items-center gap-[2px] h-8 min-w-0">
          {bars.map((level, i) => (
            <span
              key={i}
              className="flex-1 rounded-full bg-primary/60 transition-[height] duration-75"
              style={{
                height: `${Math.max(8, level * 100)}%`,
                minWidth: 2,
              }}
            />
          ))}
        </div>

        <span className="text-xs font-mono tabular-nums text-muted-foreground shrink-0">
          {formatTime(duration)}
        </span>
      </div>

      {/* Send */}
      <button
        type="button"
        onClick={handleSend}
        disabled={submitting || state !== "recording" || duration < 1}
        className={cn(
          "flex items-center justify-center h-8 w-8 rounded-lg shrink-0 transition-all",
          submitting || state !== "recording" || duration < 1
            ? "text-muted-foreground/40 cursor-not-allowed"
            : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        )}
        aria-label="Send voice message"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default VoiceRecorder;