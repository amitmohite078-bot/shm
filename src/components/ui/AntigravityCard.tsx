import React, { useRef, useState } from 'react';
import { useSystem } from '../../context/SystemContext';

interface AntigravityCardProps {
  children: React.ReactNode;
  className?: string;
  floatDelay?: 'slow' | 'mid' | 'fast' | 'none';
  interactive?: boolean;
  glow?: boolean;
  brackets?: boolean;
  depthZ?: number; // 0 to 40px
  onClick?: () => void;
}

export const AntigravityCard: React.FC<AntigravityCardProps> = ({
  children,
  className = '',
  floatDelay = 'slow',
  interactive = true,
  glow = false,
  brackets = true,
  depthZ = 12,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const { physicsConfig } = useSystem();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate tilt angles (-8deg to 8deg)
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;
    
    const maxAngle = 6 * physicsConfig.parallaxIntensity;
    setTilt({
      rx: -normY * maxAngle,
      ry: normX * maxAngle
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
  };

  const floatClass =
    floatDelay === 'slow'
      ? 'antigravity-float-slow'
      : floatDelay === 'mid'
      ? 'antigravity-float-mid'
      : floatDelay === 'fast'
      ? 'antigravity-float-fast'
      : '';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(${isHovered ? depthZ * 1.5 : depthZ}px)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className={`
        relative rounded-xl
        bg-black text-white
        border border-neutral-800 hover:border-[#00E5FF]/60
        shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]
        ${glow ? 'hover:shadow-[0_0_25px_rgba(0,229,255,0.2)]' : ''}
        ${brackets ? 'hud-brackets' : ''}
        ${floatClass}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Specular Inner Edge Highlight */}
      <div className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-b from-white/[0.08] to-transparent" />
      
      {/* Card Content */}
      <div className="relative z-10 p-5 h-full text-white">
        {children}
      </div>
    </div>
  );
};
