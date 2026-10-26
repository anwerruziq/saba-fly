import { useEffect, useRef } from "react";
import gsap from "gsap";

export function GsapAirplaneBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeGroupRef = useRef<SVGGElement>(null);
  const contrail1Ref = useRef<SVGPathElement>(null);
  const contrail2Ref = useRef<SVGPathElement>(null);
  const cloud1Ref = useRef<SVGGElement>(null);
  const cloud2Ref = useRef<SVGGElement>(null);
  const cloud3Ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const plane = planeGroupRef.current;
    if (!plane) return;

    // Timeline for looping cruising trajectory across the sky
    const cruiseTimeline = gsap.timeline({ repeat: -1 });

    // Initial state
    gsap.set(plane, {
      x: -180,
      y: window.innerHeight * 0.25,
      rotation: 12,
      scale: 0.75,
      opacity: 0,
      transformOrigin: "center center",
    });

    // Flight sequence: Enters screen, glides gracefully with altitude variations, exits, loops
    cruiseTimeline
      .to(plane, {
        opacity: 0.95,
        duration: 2.5,
        ease: "power2.out",
      })
      .to(
        plane,
        {
          x: () => window.innerWidth + 200,
          y: () => window.innerHeight * 0.65,
          rotation: 8,
          scale: 1.05,
          duration: 28,
          ease: "none",
        },
        0,
      )
      .to(
        plane,
        {
          opacity: 0,
          duration: 2.5,
          ease: "power2.in",
        },
        "-=2.5",
      );

    // Subtle aerodynamic turbulence bobbing (gentle natural floating)
    const floatAnim = gsap.to(plane, {
      y: "+=22",
      rotation: "+=2.5",
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Contrails animation (subtle pulsing length)
    const contrailAnim = gsap.to([contrail1Ref.current, contrail2Ref.current], {
      strokeDashoffset: -200,
      duration: 1.8,
      repeat: -1,
      ease: "linear",
    });

    // Parallax clouds floating across the background
    if (cloud1Ref.current) {
      gsap.to(cloud1Ref.current, {
        x: () => window.innerWidth + 350,
        duration: 45,
        repeat: -1,
        ease: "none",
      });
    }
    if (cloud2Ref.current) {
      gsap.to(cloud2Ref.current, {
        x: () => window.innerWidth + 400,
        duration: 60,
        delay: 15,
        repeat: -1,
        ease: "none",
      });
    }
    if (cloud3Ref.current) {
      gsap.to(cloud3Ref.current, {
        x: () => window.innerWidth + 300,
        duration: 52,
        delay: 8,
        repeat: -1,
        ease: "none",
      });
    }

    // Scroll reactivity: tilts plane up/down and shifts altitude smoothly based on user scroll
    let lastScroll = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          const delta = currentScroll - lastScroll;
          lastScroll = currentScroll;

          // Banking & pitch tilt based on scroll velocity
          const tiltAdjustment = Math.max(-15, Math.min(18, delta * 0.35));

          gsap.to(plane, {
            rotation: `+=${tiltAdjustment}`,
            duration: 0.8,
            ease: "power2.out",
            overwrite: "auto",
            onComplete: () => {
              // Return smoothly to baseline cruising rotation
              gsap.to(plane, {
                rotation: 10,
                duration: 1.5,
                ease: "power2.inOut",
              });
            },
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cruiseTimeline.kill();
      floatAnim.kill();
      contrailAnim.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Contrail Linear Gradient */}
          <linearGradient id="contrailGrad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="40%" stopColor="#bae6fd" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Jet Engine Glow Gradient */}
          <radialGradient id="engineGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>

          {/* Fuselage Metallic Gradient */}
          <linearGradient id="fuselageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#f1f5f9" />
            <stop offset="75%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Wing Accent Gradient (Saba Navy & Gold) */}
          <linearGradient id="sabaWing" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="70%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>

        {/* Ambient Soft Drifting Clouds */}
        <g ref={cloud1Ref} transform="translate(-300, 180)" opacity="0.22">
          <path
            d="M50 80 Q70 40 120 50 Q160 20 210 50 Q260 30 300 70 Q340 50 380 80 Q410 110 370 140 Q210 160 80 140 Q40 120 50 80 Z"
            fill="#ffffff"
            filter="blur(16px)"
          />
        </g>
        <g ref={cloud2Ref} transform="translate(-400, 520)" opacity="0.18">
          <path
            d="M60 90 Q90 40 160 55 Q210 15 280 50 Q340 30 400 75 Q450 50 500 85 Q540 120 490 150 Q280 180 100 150 Q50 130 60 90 Z"
            fill="#ffffff"
            filter="blur(22px)"
          />
        </g>
        <g ref={cloud3Ref} transform="translate(-300, 780)" opacity="0.15">
          <path
            d="M40 70 Q70 30 130 45 Q170 15 230 45 Q280 25 330 65 Q370 45 410 75 Q440 105 400 135 Q230 155 70 135 Q30 110 40 70 Z"
            fill="#ffffff"
            filter="blur(18px)"
          />
        </g>

        {/* Main Airplane Group */}
        <g ref={planeGroupRef} id="gsap-airplane">
          {/* Contrails (Vapor Trails streaming behind jet engines) */}
          <path
            ref={contrail1Ref}
            d="M-220,12 L-4,12"
            stroke="url(#contrailGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="16,8"
            opacity="0.85"
          />
          <path
            ref={contrail2Ref}
            d="M-220,-12 L-4,-12"
            stroke="url(#contrailGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="16,8"
            opacity="0.85"
          />

          {/* Engine Exhaust Afterglows */}
          <circle cx="-3" cy="12" r="5" fill="url(#engineGlow)" />
          <circle cx="-3" cy="-12" r="5" fill="url(#engineGlow)" />

          {/* Airplane Silhouette & Wings (Aerodynamic Modern Jet Top-Quarter View) */}
          {/* Main Wings */}
          <path
            d="M32,-6 L-10,-52 Q-14,-54 -16,-50 L-12,-10 Z"
            fill="url(#sabaWing)"
            stroke="#94a3b8"
            strokeWidth="0.5"
          />
          <path
            d="M32,6 L-10,52 Q-14,54 -16,50 L-12,10 Z"
            fill="url(#sabaWing)"
            stroke="#94a3b8"
            strokeWidth="0.5"
          />

          {/* Winglets (Golden tips) */}
          <path d="M-10,-52 L-13,-58 L-15,-51 Z" fill="#eab308" />
          <path d="M-10,52 L-13,58 L-15,51 Z" fill="#eab308" />

          {/* Horizontal Stabilizers / Tail Wings */}
          <path d="M-65,-3 L-82,-20 L-86,-18 L-76,-1 Z" fill="#1e293b" />
          <path d="M-65,3 L-82,20 L-86,18 L-76,1 Z" fill="#1e293b" />

          {/* Jet Engines (mounted on wings) */}
          <rect x="-8" y="-14" width="16" height="4.5" rx="2" fill="#334155" />
          <rect x="-8" y="9.5" width="16" height="4.5" rx="2" fill="#334155" />

          {/* Main Fuselage Body */}
          <path
            d="M80,0 Q65,-8 10,-8 L-68,-6 Q-86,0 -68,6 L10,8 Q65,8 80,0 Z"
            fill="url(#fuselageGrad)"
            stroke="#e2e8f0"
            strokeWidth="0.75"
          />

          {/* Cockpit Windows */}
          <path
            d="M68,-1.5 Q72,-0.5 74,0 Q72,0.5 68,1.5 Q66,0 68,-1.5 Z"
            fill="#0284c7"
            opacity="0.85"
          />

          {/* Vertical Tail Fin with Saba Airlines Accent */}
          <path
            d="M-55,0 L-76,0 L-84,0 L-74,0 Z"
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="-75" cy="0" r="1.5" fill="#eab308" />

          {/* Navigation Beacons (Pulsing Aviation Lights) */}
          {/* Port Wing (Red) */}
          <circle cx="-13" cy="-55" r="2.5" fill="#ef4444" className="animate-pulse">
            <animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" />
          </circle>
          {/* Starboard Wing (Green) */}
          <circle cx="-13" cy="55" r="2.5" fill="#22c55e" className="animate-pulse">
            <animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" />
          </circle>
          {/* Tail Strobe (White) */}
          <circle cx="-85" cy="0" r="2.2" fill="#ffffff">
            <animate attributeName="opacity" values="0.1;1;0.1" dur="0.8s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
}
