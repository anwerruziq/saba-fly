import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onLoaded?: () => void;
  minDurationMs?: number;
  isReady?: boolean;
}

export function Preloader({ onLoaded, minDurationMs = 1500, isReady = true }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const isFinishedRef = useRef(false);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    // Keep visible for at least minDurationMs so user sees the clean loading animation
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, minDurationMs);

    return () => clearTimeout(timer);
  }, [minDurationMs]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isFinishedRef.current) return;

    // Only finish when BOTH minimum time has elapsed AND page/video assets are ready!
    if (minTimePassed && isReady) {
      isFinishedRef.current = true;

      if (containerRef.current) {
        const tl = gsap.timeline({
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.display = "none";
            }
            onLoaded?.();
          },
        });

        tl.to(imgRef.current, {
          scale: 1.05,
          duration: 0.6,
          ease: "power2.out",
        }).to(
          containerRef.current,
          {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
          },
          "-=0.3",
        );
      } else {
        onLoaded?.();
      }
    }
  }, [minTimePassed, isReady, onLoaded]);

  // Safety fallback: if anything blocks network for too long (e.g. 7s), let user enter
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!isFinishedRef.current) {
        setMinTimePassed(true);
      }
    }, 7000);
    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white overflow-hidden select-none p-6"
      style={{ willChange: "opacity" }}
    >
      <img
        ref={imgRef}
        src="/72b45c3119f987c6ca1238228d2db393.gif"
        alt="Loading..."
        className="max-w-[85vw] max-h-[70vh] w-auto h-auto sm:max-w-[380px] md:max-w-[440px] object-contain object-center"
      />
    </div>
  );
}
