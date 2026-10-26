import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onLoaded?: () => void;
  minDurationMs?: number;
}

export function Preloader({ onLoaded, minDurationMs = 1400 }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const isFinishedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let isWindowLoaded = document.readyState === "complete";

    const finishLoading = () => {
      if (isFinishedRef.current) return;
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
          duration: 0.7,
          ease: "power2.out",
        }).to(
          containerRef.current,
          {
            opacity: 0,
            duration: 0.7,
            ease: "power2.inOut",
          },
          "-=0.5",
        );
      } else {
        onLoaded?.();
      }
    };

    const timer = setTimeout(() => {
      if (isWindowLoaded) {
        finishLoading();
      } else {
        window.addEventListener("load", finishLoading, { once: true });
        // Fallback max timeout
        setTimeout(finishLoading, 2500);
      }
    }, minDurationMs);

    return () => {
      clearTimeout(timer);
    };
  }, [minDurationMs, onLoaded]);

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
