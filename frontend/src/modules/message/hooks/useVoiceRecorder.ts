"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type RecorderState = "idle" | "recording" | "paused" | "stopped";

interface UseVoiceRecorderResult {
  state: RecorderState;
  duration: number; // seconds
  audioLevel: number; // 0..1, for waveform visualization
  error: string | null;
  start: () => Promise<void>;
  stop: () => Promise<{
    blob: Blob;
    mimeType: string;
    duration: number;
  } | null>;
  cancel: () => void;
}

// Pick the best supported MIME type for this browser.
// Order matters: opus is best, mp4 is the iOS fallback.
const pickMimeType = (): string => {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  for (const type of candidates) {
    if (
      typeof MediaRecorder !== "undefined" &&
      MediaRecorder.isTypeSupported(type)
    ) {
      return type;
    }
  }
  return ""; // browser will pick a default
};

export const useVoiceRecorder = (): UseVoiceRecorderResult => {
  const [state, setState] = useState<RecorderState>("idle");
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const mimeTypeRef = useRef<string>("");

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    mediaRecorderRef.current = null;
    setAudioLevel(0);
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const measureLevel = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(data);
    // RMS of waveform centered around 128
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / data.length);
    const amplified = Math.min(1, rms * 8); // much more aggressive scaling
    setAudioLevel((prev) => prev * 0.3 + amplified * 0.7); // smooth with EMA // scale up so quiet voice is visible
    rafRef.current = requestAnimationFrame(measureLevel);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices) {
        throw new Error("Microphone access not supported in this browser.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const mimeType = pickMimeType();
      mimeTypeRef.current = mimeType;
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      // Audio analyser for waveform
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      analyserRef.current = analyser;

      recorder.start(); // collect chunks every 100ms
      startedAtRef.current = Date.now();
      setDuration(0);
      setState("recording");

      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startedAtRef.current) / 1000));
      }, 250);

      measureLevel();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to access microphone.";
      setError(message);
      cleanup();
      setState("idle");
    }
  }, [cleanup, measureLevel]);

  const stop = useCallback((): Promise<{
    blob: Blob;
    mimeType: string;
    duration: number;
  } | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        resolve(null);
        return;
      }
      const finalDuration = Math.floor(
        (Date.now() - startedAtRef.current) / 1000,
      );
      recorder.onstop = () => {
        const mimeType =
          mimeTypeRef.current || chunksRef.current[0]?.type || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];
        cleanup();
        setState("idle");
        setDuration(0);
        resolve({ blob, mimeType, duration: finalDuration });
      };
      setState("stopped");
      recorder.stop();
    });
  }, [cleanup]);

  const cancel = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = null;
      try {
        recorder.stop();
      } catch {
        // ignore
      }
    }
    chunksRef.current = [];
    cleanup();
    setDuration(0);
    setState("idle");
  }, [cleanup]);

  return { state, duration, audioLevel, error, start, stop, cancel };
};
