import React from 'react';

interface NexoraLogoProps {
  variant?: 'full' | 'icon' | 'badge' | 'lockup';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * NexoraIcon: High-precision cybernetic emblem with cyan orbital ring,
 * green status beacon nodes, and center ECG telemetry pulse wave.
 */
export const NexoraIcon: React.FC<{ size?: number | string; animated?: boolean; className?: string }> = ({
  size = 36,
  animated = true,
  className = ''
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-[0_0_10px_rgba(0,229,255,0.35)] ${animated ? 'hover:scale-105 transition-transform duration-300' : ''}`}
      >
        <defs>
          {/* Main Gradient */}
          <linearGradient id="nexoraCyanGreen" x1="0" y1="120" x2="120" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0070F3" />
            <stop offset="35%" stopColor="#00E5FF" />
            <stop offset="75%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>

          {/* Pulse Glow Gradient */}
          <linearGradient id="ecgGlow" x1="20" y1="60" x2="100" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="50%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#4ADE80" />
          </linearGradient>

          {/* Core Disc Gradient */}
          <radialGradient id="coreDisc" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="80%" stopColor="#02050D" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
        </defs>

        {/* Backdrop Disc */}
        <circle cx="60" cy="60" r="46" fill="url(#coreDisc)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.2" />

        {/* Outer Orbit Circle */}
        <circle
          cx="60"
          cy="60"
          r="48"
          stroke="url(#nexoraCyanGreen)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Inner Secondary Ring */}
        <circle
          cx="60"
          cy="60"
          r="34"
          stroke="rgba(0, 229, 255, 0.3)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Status Nodes */}
        {/* Node 1: Top-Right (Lime) */}
        <circle cx="94" cy="26" r="6" fill="#4ADE80" />
        <circle cx="94" cy="26" r="2.5" fill="#FFFFFF" />

        {/* Node 2: Right (Emerald) */}
        <circle cx="107" cy="60" r="6" fill="#22C55E" />
        <circle cx="107" cy="60" r="2.5" fill="#FFFFFF" />

        {/* Node 3: Left (Cyan) */}
        <circle cx="13" cy="60" r="6" fill="#00E5FF" />
        <circle cx="13" cy="60" r="2.5" fill="#FFFFFF" />

        {/* Heartbeat ECG Pulse Wave */}
        <path
          d="M 30 60 L 46 60 L 52 60 L 58 32 L 66 88 L 73 52 L 78 64 L 84 60 L 90 60"
          stroke="url(#ecgGlow)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className={animated ? 'animate-pulse' : ''}
          style={{ filter: 'drop-shadow(0 0 5px rgba(0, 229, 255, 0.7))' }}
        />
      </svg>
    </div>
  );
};

/**
 * NexoraLogo: Crisp, perfectly formatted brand wordmark & tagline.
 */
export const NexoraLogo: React.FC<NexoraLogoProps> = ({
  variant = 'full',
  size = 'md',
  showTagline = true,
  animated = true,
  className = ''
}) => {
  const sizeConfig = {
    xs: { icon: 22, title: 'text-xs', tagline: 'text-[7px]', gap: 'gap-2' },
    sm: { icon: 28, title: 'text-sm', tagline: 'text-[8px]', gap: 'gap-2.5' },
    md: { icon: 36, title: 'text-base', tagline: 'text-[9px]', gap: 'gap-3' },
    lg: { icon: 52, title: 'text-2xl', tagline: 'text-[11px]', gap: 'gap-3.5' },
    xl: { icon: 72, title: 'text-4xl', tagline: 'text-xs', gap: 'gap-4' },
  }[size];

  if (variant === 'icon') {
    return <NexoraIcon size={sizeConfig.icon} animated={animated} className={className} />;
  }

  return (
    <div className={`inline-flex items-center ${sizeConfig.gap} select-none ${className}`}>
      {/* Brand Icon */}
      <NexoraIcon size={sizeConfig.icon} animated={animated} />

      {/* Typography Header */}
      <div className="flex flex-col justify-center text-left">
        {/* Wordmark: NEXORA */}
        <div className={`font-display font-extrabold tracking-[0.2em] text-white flex items-center leading-tight ${sizeConfig.title}`}>
          <span className="text-white">NEX</span>
          <span className="text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">O</span>
          <span className="text-white">RA</span>
        </div>

        {/* Tagline */}
        {showTagline && (
          <div className={`flex items-center gap-1.5 font-mono font-semibold tracking-[0.25em] uppercase mt-0.5 ${sizeConfig.tagline}`}>
            <span className="text-[#00E5FF]">NEVER MISS A BEAT</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NexoraLogo;
