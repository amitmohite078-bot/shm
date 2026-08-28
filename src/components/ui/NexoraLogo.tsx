import React from 'react';

interface NexoraLogoProps {
  variant?: 'full' | 'icon' | 'badge' | 'lockup';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * NexoraIcon: Vector rendering of the circular orbit with ECG heartbeat pulse
 * matching the official Nexora cyber-emblem.
 */
export const NexoraIcon: React.FC<{ size?: number | string; animated?: boolean; className?: string }> = ({
  size = 36,
  animated = true,
  className = ''
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-[0_0_12px_rgba(0,229,255,0.4)] ${animated ? 'hover:scale-105 transition-transform duration-300' : ''}`}
      >
        <defs>
          {/* Main Ring Gradient (Cyan to Lime Green) */}
          <linearGradient id="nexoraRingGrad" x1="10" y1="110" x2="110" y2="10" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0070F3" />
            <stop offset="25%" stopColor="#00E5FF" />
            <stop offset="70%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#4ADE80" />
          </linearGradient>

          {/* Inner Glow Gradient */}
          <linearGradient id="nexoraInnerGrad" x1="25" y1="95" x2="95" y2="25" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0052B4" />
            <stop offset="40%" stopColor="#00E5FF" />
            <stop offset="80%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>

          {/* Pulse Line Green Glow */}
          <linearGradient id="pulseGlowGrad" x1="20" y1="60" x2="100" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="45%" stopColor="#4ADE80" />
            <stop offset="55%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>

          {/* Dark Disc Background Gradient */}
          <radialGradient id="discBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="70%" stopColor="#050814" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>

          {/* Node Glow Filter */}
          <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Inner dark backdrop disc */}
        <circle cx="60" cy="60" r="46" fill="url(#discBg)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />

        {/* Outer Orbit Arc Segments */}
        <path
          d="M 60 12 A 48 48 0 0 1 108 60"
          stroke="url(#nexoraRingGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M 108 60 A 48 48 0 0 1 60 108"
          stroke="url(#nexoraRingGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M 60 108 A 48 48 0 0 1 12 60"
          stroke="url(#nexoraRingGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M 12 60 A 48 48 0 0 1 54 12"
          stroke="url(#nexoraRingGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Inner Concentric Circle */}
        <circle
          cx="60"
          cy="60"
          r="33"
          stroke="url(#nexoraInnerGrad)"
          strokeWidth="3.2"
          fill="none"
          opacity="0.85"
        />

        {/* Orbit Satellite Nodes */}
        {/* Node 1: Top-Right (Lime) */}
        <circle cx="94" cy="26" r="6.5" fill="#4ADE80" filter="url(#nodeGlow)" />
        <circle cx="94" cy="26" r="3" fill="#FFFFFF" opacity="0.9" />

        {/* Node 2: Right (Lime) */}
        <circle cx="107" cy="60" r="6.5" fill="#22C55E" filter="url(#nodeGlow)" />
        <circle cx="107" cy="60" r="2.5" fill="#DCFCE7" />

        {/* Node 3: Bottom-Right (Green) */}
        <circle cx="93" cy="94" r="6.5" fill="#16A34A" filter="url(#nodeGlow)" />
        <circle cx="93" cy="94" r="2.5" fill="#86EFAC" />

        {/* Node 4: Left (Cyan) */}
        <circle cx="13" cy="60" r="6.5" fill="#00E5FF" filter="url(#nodeGlow)" />
        <circle cx="13" cy="60" r="3" fill="#FFFFFF" opacity="0.9" />

        {/* Heartbeat ECG Pulse Wave in Center */}
        <path
          d="M 28 60 L 44 60 L 51 60 L 58 29 L 66 88 L 73 54 L 79 64 L 84 60 L 92 60"
          stroke="url(#pulseGlowGrad)"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className={animated ? 'animate-pulse' : ''}
          style={{ filter: 'drop-shadow(0 0 6px rgba(74, 222, 128, 0.8))' }}
        />
      </svg>
    </div>
  );
};

/**
 * NexoraLogo: Complete brand header with the stylized futuristic typography & tagline.
 */
export const NexoraLogo: React.FC<NexoraLogoProps> = ({
  variant = 'full',
  size = 'md',
  showTagline = true,
  animated = true,
  className = ''
}) => {
  // Size mapping
  const sizeConfig = {
    xs: { icon: 22, title: 'text-xs', tagline: 'text-[7px]', gap: 'gap-1.5' },
    sm: { icon: 28, title: 'text-sm', tagline: 'text-[8px]', gap: 'gap-2' },
    md: { icon: 34, title: 'text-base', tagline: 'text-[9px]', gap: 'gap-2.5' },
    lg: { icon: 48, title: 'text-2xl', tagline: 'text-[11px]', gap: 'gap-3' },
    xl: { icon: 64, title: 'text-4xl', tagline: 'text-xs', gap: 'gap-4' },
  }[size];

  if (variant === 'icon') {
    return <NexoraIcon size={sizeConfig.icon} animated={animated} className={className} />;
  }

  return (
    <div className={`inline-flex items-center ${sizeConfig.gap} select-none ${className}`}>
      {/* Icon */}
      <NexoraIcon size={sizeConfig.icon} animated={animated} />

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        {/* Wordmark: N E X O R A */}
        <div className={`font-display font-extrabold tracking-[0.22em] text-white flex items-center leading-none ${sizeConfig.title}`}>
          <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">NE</span>
          
          {/* Stylized 'X' with cyan-lime crossing */}
          <span className="relative inline-flex items-center justify-center mx-[0.06em]">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#00E5FF] to-[#0070F3] drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
              \
            </span>
            <span className="absolute text-transparent bg-clip-text bg-gradient-to-bl from-[#4ADE80] to-[#22C55E] drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]">
              /
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#38BDF8] to-[#4ADE80]">
              X
            </span>
          </span>

          <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">OR</span>

          {/* Stylized 'A' with green glowing node */}
          <span className="relative inline-flex items-center justify-center">
            <span className="text-white">A</span>
            <span className="absolute bottom-[22%] left-1/2 -translate-x-1/2 w-[18%] h-[18%] bg-[#4ADE80] rounded-full shadow-[0_0_6px_#4ADE80]" />
          </span>
        </div>

        {/* Tagline: NEVER MISS A BEAT */}
        {showTagline && (
          <div className={`flex items-center gap-1.5 mt-0.5 font-mono font-semibold tracking-[0.25em] uppercase text-neutral-300 ${sizeConfig.tagline}`}>
            <span className="h-[1px] w-2.5 bg-gradient-to-r from-transparent to-[#00E5FF]" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-neutral-200 to-[#4ADE80]">
              NEVER MISS A BEAT
            </span>
            <span className="h-[1px] w-2.5 bg-gradient-to-l from-transparent to-[#4ADE80]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default NexoraLogo;
