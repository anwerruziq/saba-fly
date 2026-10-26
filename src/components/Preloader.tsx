import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import logo from "../assets/logo.png";

interface PreloaderProps {
  onLoaded?: () => void;
  minDurationMs?: number;
}

export function Preloader({ onLoaded, minDurationMs = 1800 }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("جاري فحص أنظمة الطيران...");
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isFinishedRef = useRef(false);

  useEffect(() => {
    const startTime = Date.now();
    let isWindowLoaded = document.readyState === "complete";

    const onWindowLoad = () => {
      isWindowLoaded = true;
    };

    if (!isWindowLoaded) {
      window.addEventListener("load", onWindowLoad);
    }

    // Status message cycling
    const statusInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed > 1200) {
        setStatusText("جاهزون للإقلاع، أهلاً بكم على متن سبأ للطيران...");
      } else if (elapsed > 600) {
        setStatusText("تحديث بيانات وجداول الرحلات...");
      }
    }, 400);

    // Progress counting with GSAP
    const progressObj = { value: 0 };
    const tween = gsap.to(progressObj, {
      value: 100,
      duration: minDurationMs / 1000,
      ease: "power1.inOut",
      onUpdate: () => {
        setProgress(Math.floor(progressObj.value));
      },
      onComplete: () => {
        finishLoading();
      },
    });

    const finishLoading = () => {
      if (isFinishedRef.current) return;
      isFinishedRef.current = true;
      clearInterval(statusInterval);

      if (cardRef.current && containerRef.current) {
        const tl = gsap.timeline({
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.display = "none";
            }
            onLoaded?.();
          },
        });

        tl.to(cardRef.current, {
          scale: 0.96,
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: "power2.in",
        }).to(
          containerRef.current,
          {
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.2",
        );
      } else {
        onLoaded?.();
      }
    };

    return () => {
      clearInterval(statusInterval);
      window.removeEventListener("load", onWindowLoad);
      tween.kill();
    };
  }, [minDurationMs, onLoaded]);

  return (
    <div
      ref={containerRef}
      dir="rtl"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070b14] overflow-hidden select-none transition-opacity"
    >
      {/* Ambient background glow using the loading gif blurred */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 blur-3xl scale-125 bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url('/72b45c3119f987c6ca1238228d2db393.gif')` }}
      />

      {/* Decorative radial gradients */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none -top-24 -left-24" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none -bottom-24 -right-24" />

      {/* Centerpiece Card */}
      <div
        ref={cardRef}
        className="relative z-10 w-[90%] max-w-sm rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-2xl text-center flex flex-col items-center"
      >
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2.5 mb-4">
          <img src={logo} alt="سبأ للطيران" className="h-10 w-auto drop-shadow-md" />
          <div className="text-right">
            <h1 className="text-lg font-bold text-white tracking-wide">سبأ للطيران</h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-wider">SABA AIRLINES</p>
          </div>
        </div>

        {/* User GIF preview with luxury frame */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-inner bg-black/50 mb-5 group">
          <img
            src="/72b45c3119f987c6ca1238228d2db393.gif"
            alt="شاشة الانتظار - سبأ للطيران"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Subtle vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
          
          {/* Badge */}
          <div className="absolute bottom-2.5 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-semibold text-cyan-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>نظام الحجز والرحلات</span>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-gray-300 px-1">
            <span className="text-[11px] text-gray-400 font-normal truncate max-w-[200px]">{statusText}</span>
            <span className="font-mono text-cyan-400">{progress}%</span>
          </div>

          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full bg-gradient-to-l from-cyan-400 via-blue-500 to-indigo-500 rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(34,211,238,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
