import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  musicUrl?: string;
}

export interface AudioPlayerHandle {
  /** Must be called from inside a user gesture (e.g. a click) so browsers allow sound. */
  play: () => void;
}

/** Extracts a YouTube video id from watch / youtu.be / embed / shorts links. */
function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\.|^m\./, '');
    if (host === 'youtu.be') return u.pathname.slice(1) || null;
    if (host === 'youtube.com' || host === 'music.youtube.com' || host === 'youtube-nocookie.com') {
      if (u.searchParams.get('v')) return u.searchParams.get('v');
      const m = u.pathname.match(/^\/(embed|shorts|live)\/([^/?]+)/);
      if (m) return m[2];
    }
  } catch {
    /* not a URL */
  }
  return null;
}

// --- Minimal YouTube IFrame API typing & loader ---
interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  setVolume(volume: number): void;
  destroy(): void;
}
declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: unknown) => YTPlayer; PlayerState: { PLAYING: number; PAUSED: number; ENDED: number } };
    onYouTubeIframeAPIReady?: () => void;
  }
}

/** How long the music takes to rise from silence to full volume. */
const FADE_IN_MS = 5000;
/** Final volume, 0–1. Kept a little below max so it stays gentle. */
const TARGET_VOLUME = 0.7;

let ytApiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (!ytApiPromise) {
    ytApiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve();
      };
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    });
  }
  return ytApiPromise;
}

export const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(({ musicUrl }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytHostRef = useRef<HTMLDivElement | null>(null);
  const ytPlayerRef = useRef<YTPlayer | null>(null);
  const ytReadyRef = useRef(false);
  const pendingPlayRef = useRef(false);
  const fadeTimerRef = useRef<number | null>(null);
  const needsFadeRef = useRef(false);

  const stopFade = () => {
    if (fadeTimerRef.current !== null) {
      clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  };

  /** Applies a 0–1 volume to whichever player is in use. */
  const applyVolume = (v: number) => {
    if (ytPlayerRef.current) ytPlayerRef.current.setVolume(Math.round(v * 100));
    if (audioRef.current) audioRef.current.volume = v;
  };

  /** Gently raises the volume from silence to TARGET_VOLUME (ease-in curve). */
  const startFadeIn = () => {
    stopFade();
    const start = performance.now();
    applyVolume(0);
    fadeTimerRef.current = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / FADE_IN_MS);
      applyVolume(TARGET_VOLUME * t * t);
      if (t >= 1) stopFade();
    }, 50);
  };

  useEffect(() => stopFade, []);

  const url = musicUrl?.trim() ?? '';
  const youtubeId = url ? getYouTubeId(url) : null;

  // Create a hidden YouTube player up front so play() can run instantly on click.
  useEffect(() => {
    if (!youtubeId || !ytHostRef.current) return;
    let cancelled = false;
    const host = document.createElement('div');
    ytHostRef.current.appendChild(host);

    loadYouTubeApi().then(() => {
      if (cancelled || !window.YT) return;
      ytPlayerRef.current = new window.YT.Player(host, {
        videoId: youtubeId,
        width: 1,
        height: 1,
        playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: youtubeId, playsinline: 1, rel: 0 },
        events: {
          onReady: () => {
            ytReadyRef.current = true;
            ytPlayerRef.current?.setVolume(0);
            if (pendingPlayRef.current) {
              pendingPlayRef.current = false;
              ytPlayerRef.current?.playVideo(); // still silent; fades in on PLAYING
            }
          },
          onStateChange: (e: { data: number }) => {
            const S = window.YT!.PlayerState;
            if (e.data === S.PLAYING) {
              // Begin the fade only once sound actually starts (after buffering)
              if (needsFadeRef.current) {
                needsFadeRef.current = false;
                startFadeIn();
              }
              setIsPlaying(true);
              setHasError(false);
            } else if (e.data === S.PAUSED || e.data === S.ENDED) {
              setIsPlaying(false);
            }
          },
          onError: () => {
            setHasError(true);
            setIsPlaying(false);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      ytReadyRef.current = false;
      ytPlayerRef.current?.destroy();
      ytPlayerRef.current = null;
      host.remove();
    };
  }, [youtubeId]);

  const play = () => {
    needsFadeRef.current = true;
    if (youtubeId) {
      if (ytReadyRef.current && ytPlayerRef.current) {
        ytPlayerRef.current.setVolume(0);
        ytPlayerRef.current.playVideo();
      }
      else pendingPlayRef.current = true;
      return;
    }
    if (!audioRef.current) return;
    setHasError(false);
    audioRef.current.volume = 0;
    audioRef.current
      .play()
      .then(() => {
        needsFadeRef.current = false;
        startFadeIn();
        setIsPlaying(true);
      })
      .catch((err) => {
        console.warn('Audio playback failed:', err);
        setHasError(true);
        setIsPlaying(false);
      });
  };

  const pause = () => {
    stopFade();
    needsFadeRef.current = false;
    if (youtubeId) ytPlayerRef.current?.pauseVideo();
    else audioRef.current?.pause();
    setIsPlaying(false);
  };

  useImperativeHandle(ref, () => ({ play }), [youtubeId]);

  // If no musicUrl is provided, do not render anything
  if (!url) {
    return null;
  }

  const togglePlay = () => (isPlaying ? pause() : play());

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    if (youtubeId) {
      if (nextMuted) ytPlayerRef.current?.mute();
      else ytPlayerRef.current?.unMute();
    } else if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
    setIsMuted(nextMuted);
  };

  return (
    <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-40">
      {youtubeId ? (
        // Hidden (but not display:none, which can block playback) YouTube player
        <div
          ref={ytHostRef}
          aria-hidden="true"
          className="absolute w-px h-px overflow-hidden opacity-0 pointer-events-none"
          style={{ left: -9999, top: -9999 }}
        />
      ) : (
        <audio
          ref={audioRef}
          src={url}
          preload="none"
          loop
          onEnded={() => setIsPlaying(false)}
          onError={() => setHasError(true)}
        />
      )}

      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111724]/80 backdrop-blur-md border border-[#AAA0C8]/20 text-[#F4EFE7] shadow-lg transition-all duration-200 hover:border-[#AAA0C8]/40">
        <button
          type="button"
          onClick={togglePlay}
          className="flex items-center gap-2 text-xs font-sans text-[#F4EFE7] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AAA0C8] rounded px-1"
          aria-label={isPlaying ? 'Ая түр зогсоох' : 'Ая тоглуулах'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 text-[#AAA0C8]" />
          ) : (
            <Play className="w-3.5 h-3.5 text-[#AAA0C8]" />
          )}
          <span className="text-[12px] font-medium tracking-wide">
            {hasError ? 'Ая ачааллахад алдаа гарлаа' : isPlaying ? 'Ая тоглож байна' : 'Ая сонсох'}
          </span>
        </button>

        {isPlaying && (
          <button
            type="button"
            onClick={toggleMute}
            className="p-1 text-[#AAA0C8] hover:text-[#F4EFE7] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AAA0C8] rounded ml-1"
            aria-label={isMuted ? 'Дууг нээх' : 'Дууг хаах'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';
