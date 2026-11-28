import React, { useEffect, useRef, useState } from 'react';
import {
  FolderOpen,
  Headphones,
  Pause,
  Play,
  Repeat,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

interface SanthyaAudioBarProps {
  contextTitle: string;
  tukCount?: number;
  activeTukIndex?: number | null;
  onActiveTukChange?: (index: number | null) => void;
  onAutoAdvanceNext?: () => void;
  canAutoAdvanceNext?: boolean;
}

const SPEED_OPTIONS = [0.75, 1, 1.25];

export const SanthyaAudioBar: React.FC<SanthyaAudioBarProps> = ({
  contextTitle,
  tukCount = 0,
  activeTukIndex = null,
  onActiveTukChange,
  onAutoAdvanceNext,
  canAutoAdvanceNext = false,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeTukRef = useRef<number>(activeTukIndex ?? 0);

  const [localObjectUrl, setLocalObjectUrl] = useState<string | null>(null);
  const [localFileName, setLocalFileName] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    activeTukRef.current = activeTukIndex ?? 0;
  }, [activeTukIndex]);

  useEffect(() => {
    return () => {
      if (localObjectUrl) {
        URL.revokeObjectURL(localObjectUrl);
      }
    };
  }, [localObjectUrl]);

  const clearLocalTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (localObjectUrl) {
      URL.revokeObjectURL(localObjectUrl);
    }
    setLocalObjectUrl(null);
    setLocalFileName('');
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioError(null);
    onActiveTukChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (localObjectUrl) {
      URL.revokeObjectURL(localObjectUrl);
    }
    const nextUrl = URL.createObjectURL(file);
    setLocalObjectUrl(nextUrl);
    setLocalFileName(file.name);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setAudioError(null);
    onActiveTukChange?.(null);
  };

  const togglePlay = async () => {
    setAudioError(null);
    const el = audioRef.current;
    if (!localObjectUrl || !el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      try {
        el.playbackRate = playbackRate;
        el.loop = isLooping;
        el.muted = isMuted;
        await el.play();
        setIsPlaying(true);
        if (tukCount > 0 && activeTukIndex === null) {
          onActiveTukChange?.(0);
        }
      } catch {
        setAudioError('Unable to play the selected local audio file.');
        setIsPlaying(false);
      }
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (audioRef.current) {
      audioRef.current.muted = next;
    }
  };

  const formatTime = (sec: number) => {
    if (!Number.isFinite(sec) || sec <= 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <section
      aria-label="Tatkhalsa Santhya Audio Player"
      className="rounded-xl border pothi-divider pothi-surface p-3.5 sm:px-5"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileSelected}
        className="sr-only"
        aria-label="Load local Tatkhalsa Santhya audio file"
      />

      {localObjectUrl && (
        <audio
          ref={audioRef}
          src={localObjectUrl}
          loop={isLooping}
          onTimeUpdate={(e) => {
            const cur = e.currentTarget.currentTime;
            const dur = e.currentTarget.duration;
            setCurrentTime(cur);
            if (tukCount > 0 && Number.isFinite(dur) && dur > 0) {
              const idx = Math.min(tukCount - 1, Math.floor((cur / dur) * tukCount));
              if (idx !== activeTukRef.current) {
                activeTukRef.current = idx;
                onActiveTukChange?.(idx);
              }
            }
          }}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={() => {
            setIsPlaying(false);
            if (autoAdvance && !isLooping && canAutoAdvanceNext && onAutoAdvanceNext) {
              onAutoAdvanceNext();
            } else {
              onActiveTukChange?.(null);
            }
          }}
          onError={() => {
            setAudioError('Selected local audio file could not be decoded.');
            setIsPlaying(false);
          }}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {localObjectUrl ? (
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause local Santhya audio' : 'Play local Santhya audio'}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-navy)] text-white dark:text-[#0B1220] hover:bg-[var(--accent-navy-hover)] cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" aria-hidden="true" />
              )}
            </button>
          ) : (
            <div
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-subtle)] border pothi-divider text-[var(--accent-gold)]"
              aria-hidden="true"
            >
              <Headphones className="h-4 w-4" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[var(--ink-primary)] truncate">
              {localObjectUrl
                ? localFileName
                : 'In-house Santhya recordings coming soon'}
            </p>
            <p className="text-xs text-[var(--ink-muted)] truncate">
              {localObjectUrl
                ? `Local Audio · ${formatTime(currentTime)} / ${formatTime(duration)}${activeTukIndex !== null && tukCount > 0 ? ` · Tuk ${activeTukIndex + 1} of ${tukCount}` : ''}`
                : `Reserved for original Tatkhalsa Foundation audio (${contextTitle}). Load a local file to practice.`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {localObjectUrl && (
            <>
              <div
                className="flex items-center rounded-lg border pothi-divider p-0.5 bg-[var(--surface-subtle)]"
                role="group"
                aria-label="Santhya playback speed"
              >
                {SPEED_OPTIONS.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    aria-pressed={playbackRate === rate}
                    onClick={() => handleRateChange(rate)}
                    className={`px-2 py-1 text-xs font-mono-nums rounded-md cursor-pointer ${
                      playbackRate === rate
                        ? 'bg-[var(--surface-card)] text-[var(--ink-primary)] font-semibold shadow-xs'
                        : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setAutoAdvance((v) => !v)}
                aria-pressed={autoAdvance}
                aria-label="Toggle auto-advance to next Ang or Baani"
                title="Auto-advance when track completes"
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 h-9 text-xs font-medium cursor-pointer whitespace-nowrap ${
                  autoAdvance
                    ? 'border-[var(--accent-gold)] bg-[var(--accent-gold-soft)] text-[var(--ink-primary)]'
                    : 'pothi-divider text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
                }`}
              >
                <SkipForward className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Auto-Next</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const next = !isLooping;
                  setIsLooping(next);
                  if (audioRef.current) audioRef.current.loop = next;
                }}
                aria-pressed={isLooping}
                aria-label="Toggle loop track"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border cursor-pointer ${
                  isLooping
                    ? 'border-[var(--accent-gold)] bg-[var(--accent-gold-soft)] text-[var(--accent-gold)]'
                    : 'pothi-divider text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
                }`}
              >
                <Repeat className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border pothi-divider text-[var(--ink-muted)] hover:text-[var(--ink-primary)] cursor-pointer"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                onClick={clearLocalTrack}
                aria-label="Unload local audio file"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border pothi-divider text-[var(--ink-muted)] hover:text-[var(--ink-primary)] cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border pothi-divider px-3 py-2 text-xs font-medium text-[var(--ink-secondary)] hover:bg-[var(--surface-subtle)] whitespace-nowrap cursor-pointer min-h-[36px]"
          >
            <FolderOpen className="h-3.5 w-3.5" aria-hidden="true" />
            {localObjectUrl ? 'Change File' : 'Load Local Audio'}
          </button>
        </div>
      </div>

      {localObjectUrl && duration > 0 && (
        <div className="mt-3 flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={duration}
            step={0.5}
            value={currentTime}
            aria-label="Santhya audio timeline"
            onChange={(e) => {
              const t = Number(e.target.value);
              setCurrentTime(t);
              if (audioRef.current) audioRef.current.currentTime = t;
            }}
            className="w-full accent-[var(--accent-gold)] cursor-pointer"
          />
        </div>
      )}

      {audioError && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400" role="alert">
          {audioError}
        </p>
      )}
    </section>
  );
};
