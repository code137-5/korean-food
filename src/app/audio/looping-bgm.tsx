import { useCallback, useEffect, useRef } from "react";

import { resolvePublicAssetUrl } from "@/shared/lib/url";

const BGM_URL = "bgm/Stillness_at_Noon.mp3";
const FADE_DURATION_MS = 500;
const LOOP_CHECK_INTERVAL_MS = 100;
const INTERACTION_EVENTS = ["pointerdown", "keydown", "touchstart"] as const;

function clampVolume(volume: number) {
  return Math.min(Math.max(volume, 0), 1);
}

type LoopingBgmProps = {
  isEnabled: boolean;
};

export function LoopingBgm({ isEnabled }: LoopingBgmProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const fadeOutStartedRef = useRef(false);
  const startPlaybackRef = useRef<(() => void) | null>(null);

  const stopFade = useCallback(() => {
    if (fadeFrameRef.current === null) {
      return;
    }

    window.cancelAnimationFrame(fadeFrameRef.current);
    fadeFrameRef.current = null;
  }, []);

  const fadeVolume = useCallback(
    (audio: HTMLAudioElement, targetVolume: number) => {
      stopFade();

      const startTime = performance.now();
      const startVolume = audio.volume;
      const nextVolume = clampVolume(targetVolume);

      const tick = (time: number) => {
        const progress = Math.min((time - startTime) / FADE_DURATION_MS, 1);
        audio.volume = startVolume + (nextVolume - startVolume) * progress;

        if (progress < 1) {
          fadeFrameRef.current = window.requestAnimationFrame(tick);
          return;
        }

        fadeFrameRef.current = null;
      };

      fadeFrameRef.current = window.requestAnimationFrame(tick);
    },
    [stopFade],
  );

  useEffect(() => {
    const audio = new Audio(resolvePublicAssetUrl(BGM_URL));
    audio.preload = "auto";
    audio.loop = false;
    audio.volume = 0;
    audioRef.current = audio;

    const removeInteractionFallback = () => {
      INTERACTION_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleInteractionFallback);
      });
    };

    const addInteractionFallback = () => {
      INTERACTION_EVENTS.forEach((eventName) => {
        window.addEventListener(eventName, handleInteractionFallback, {
          once: true,
        });
      });
    };

    const startPlayback = () => {
      removeInteractionFallback();
      fadeOutStartedRef.current = false;
      audio.volume = 0;

      void audio
        .play()
        .then(() => {
          fadeVolume(audio, 1);
        })
        .catch(() => {
          addInteractionFallback();
        });
    };

    function handleInteractionFallback() {
      startPlayback();
    }

    const handleEnded = () => {
      audio.currentTime = 0;
      startPlayback();
    };

    const loopCheckId = window.setInterval(() => {
      if (
        audio.paused ||
        fadeOutStartedRef.current ||
        !Number.isFinite(audio.duration)
      ) {
        return;
      }

      const remainingMs = (audio.duration - audio.currentTime) * 1000;

      if (remainingMs <= FADE_DURATION_MS) {
        fadeOutStartedRef.current = true;
        fadeVolume(audio, 0);
      }
    }, LOOP_CHECK_INTERVAL_MS);

    audio.addEventListener("ended", handleEnded);
    startPlaybackRef.current = startPlayback;

    return () => {
      window.clearInterval(loopCheckId);
      removeInteractionFallback();
      stopFade();
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audioRef.current = null;
      startPlaybackRef.current = null;
    };
  }, [fadeVolume, stopFade]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    startPlaybackRef.current?.();
  }, [isEnabled]);

  return null;
}
