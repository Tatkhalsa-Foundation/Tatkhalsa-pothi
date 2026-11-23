import React, { useEffect, useRef, useState } from 'react';
import {
  Link2,
  Pause,
  Play,
  Repeat,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface SanthyaAudioBarProps {
  trackLabel: string;
  initialAudioUrl?: string;
}

const SPEED_OPTIONS = [0.75, 1, 1.25];

export const SanthyaAudioBar: React.FC<SanthyaAudioBarProps> = ({
  trackLabel,
  initialAudioUrl = '',
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscNodesRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  const [audioUrl, setAudioUrl] = useState(initialAudioUrl);
  const [urlInput, setUrlInput] = useState(initialAudioUrl);
  const [showUrlEditor, setShowUrlEditor] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    setAudioUrl(initialAudioUrl);
    setUrlInput(initialAudioUrl);
    setCurrentTime(0);
    setDuration(0);
    setAudioError(null);
    stopDrone();
    setIsPlaying(false);
  }, [initialAudioUrl, trackLabel]);

  useEffect(() => {
    return () => {
      stopDrone();
    };
  }, []);

  const stopDrone = () => {
    for (const osc of oscNodesRef.current) {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // already stopped
      }
    }
    oscNodesRef.current = [];
    if (gainNodeRef.current) {
      try {
        gainNodeRef.current.disconnect();
      } catch {
        // ignore
      }
      gainNodeRef.current = null;
    }
  };

  const startGentleTanpuraDrone = () => {
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }
      stopDrone();

      const masterGain = ctx.createGain();
      masterGain.gain.value = isMuted ? 0 : 0.045;
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Soft Sa-Pa-Sa tanpura harmonic pitch (C#3 / G#3 / C#4) for meditative Santhya accompaniment
      const freqs = [138.59, 207.65, 277.18];
      oscNodesRef.current = freqs.map((f, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx === 1 ? 'triangle' : 'sine';
        osc.frequency.value = f;
        osc.connect(masterGain);
        osc.start();
        return osc;
      });
    } catch {
      setAudioError('Browser audio playback is restricted until interacted.');
    }
  };

  const togglePlay = async () => {
    setAudioError(null);
    if (audioUrl.trim()) {
      const el = audioRef.current;
      if (!el) return;
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
        } catch {
          setAudioError('Unable to load audio stream URL. Check CORS or try another MP3/OGG URL.');
          setIsPlaying(false);
        }
      }
    } else {
      if (isPlaying) {
        stopDrone();
        setIsPlaying(false);
      } else {
        startGentleTanpuraDrone();
        setIsPlaying(true);
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
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = next ? 0 : 0.045;
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    stopDrone();
    setIsPlaying(false);
    setAudioError(null);
    setAudioUrl(urlInput.trim());
    setShowUrlEditor(false);
  };

  const formatTime = (sec: number) => {
    if (!Number.isFinite(sec) || sec <= 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <section
      aria-label="Santhya Audio Player"
      className="rounded-xl border pothi-divider pothi-surface p-3.5 sm:px-5"
    >
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          loop={isLooping}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            setAudioError('Audio source could not be loaded.');
            setIsPlaying(false);
          }}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause Santhya audio' : 'Play Santhya audio'}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-navy)] text-white dark:text-[#0c1220] hover:bg-[var(--accent-navy-hover)] transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" aria-hidden="true" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[var(--ink-primary)] truncate">
              {trackLabel}
            </p>
            <p className="text-xs text-[var(--ink-muted)] truncate">
              {audioUrl
                ? `Custom Audio Track · ${formatTime(currentTime)} / ${formatTime(duration)}`
                : isPlaying
                  ? 'Tanpura Santhya Pitch Active · Add any MP3/OGG URL for guided audio'
                  : 'Ready for Santhya track URL or gentle Tanpura pitch'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div
            className="flex items-center rounded-lg border pothi-divider p-0.5 bg-[var(--surface-subtle)]"
            role="group"
            aria-label="Santhya playback speed"
          >
            {SPEED_OPTIONS.map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => handleRateChange(rate)}
                className={`px-2 py-1 text-xs font-mono-nums rounded-md transition-colors cursor-pointer ${
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
            onClick={() => {
              const next = !isLooping;
              setIsLooping(next);
              if (audioRef.current) audioRef.current.loop = next;
            }}
            aria-pressed={isLooping}
            aria-label="Toggle loop track"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border pothi-divider text-[var(--ink-muted)] hover:text-[var(--ink-primary)] transition-colors cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Volume2 className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowUrlEditor((v) => !v)}
            aria-expanded={showUrlEditor}
            aria-label="Set Santhya audio URL"
            className="inline-flex items-center gap-1.5 rounded-lg border pothi-divider px-3 py-2 text-xs font-medium text-[var(--ink-secondary)] hover:bg-[var(--surface-subtle)] transition-colors whitespace-nowrap cursor-pointer"
          >
            <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
            Track URL
          </button>
        </div>
      </div>

      {audioUrl && duration > 0 && (
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

      {showUrlEditor && (
        <form onSubmit={handleApplyUrl} className="mt-3 flex flex-col sm:flex-row gap-2 pt-3 border-t pothi-divider">
          <label htmlFor="santhya-audio-url" className="sr-only">
            Santhya Audio Track URL
          </label>
          <input
            id="santhya-audio-url"
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.org/santhya/japji-sahib.mp3"
            className="flex-1 rounded-lg border pothi-divider bg-[var(--surface-canvas)] px-3 py-2 text-xs text-[var(--ink-primary)] focus:outline-2 focus:outline-[var(--accent-gold)]"
          />
          <button
            type="submit"
            className="rounded-lg bg-[var(--accent-navy)] px-4 py-2 text-xs font-medium text-white dark:text-[#0c1220] hover:bg-[var(--accent-navy-hover)] cursor-pointer whitespace-nowrap"
          >
            Load Track
          </button>
          {audioUrl && (
            <button
              type="button"
              onClick={() => {
                setAudioUrl('');
                setUrlInput('');
                setAudioError(null);
              }}
              className="rounded-lg border pothi-divider px-3 py-2 text-xs text-[var(--ink-muted)] hover:text-[var(--ink-primary)] cursor-pointer whitespace-nowrap"
            >
              Reset
            </button>
          )}
        </form>
      )}

      {audioError && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400" role="alert">
          {audioError}
        </p>
      )}
    </section>
  );
};
