import React from 'react';
import { useSystem } from '../../context/SystemContext';
import { AntigravityCard } from '../ui/AntigravityCard';
import { 
  Sliders, 
  Eye, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  RotateCcw,
  Monitor
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { physicsConfig, setPhysicsConfig } = useSystem();

  const resetToDefault = () => {
    setPhysicsConfig({
      gravityScale: 0.8,
      floatSpeed: 1.0,
      particleCount: 65,
      parallaxIntensity: 1.0,
      enableScanlines: true,
      enableSoundSim: false,
      highContrastMono: true
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 select-none max-w-4xl">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
            PHYSICS MATRIX & VISUAL ENGINE
          </span>
        </div>
        <h1 className="text-3xl font-bold font-display text-white tracking-wide mt-0.5">
          ANTIGRAVITY CONFIGURATION
        </h1>
        <p className="text-xs font-mono text-neutral-400 mt-1">
          Adjust 3D floating dynamics, mouse parallax sensitivity, and monochrome rendering modes.
        </p>
      </div>

      {/* Settings Panel 1: Physics Engine */}
      <AntigravityCard floatDelay="none" depthZ={12} className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-white" />
            <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">
              3D GRAVITATIONAL PHYSICS
            </span>
          </div>
          <button
            onClick={resetToDefault}
            className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET TO DEFAULT</span>
          </button>
        </div>

        <div className="space-y-5 text-xs font-mono">
          
          {/* Gravity Constant */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-neutral-300">GRAVITY VECTOR CONSTANT</span>
              <span className="text-white font-bold">{physicsConfig.gravityScale.toFixed(2)}G</span>
            </div>
            <input
              type="range"
              min="0"
              max="2.0"
              step="0.05"
              value={physicsConfig.gravityScale}
              onChange={e => setPhysicsConfig(p => ({ ...p, gravityScale: parseFloat(e.target.value) }))}
              className="w-full accent-white cursor-pointer"
            />
            <span className="text-[10px] text-neutral-400 mt-1 block">
              Controls the upward buoyant velocity and floating amplitude of all dashboard cards.
            </span>
          </div>

          {/* Mouse Parallax */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-neutral-300">MOUSE PARALLAX INTENSITY</span>
              <span className="text-white font-bold">{physicsConfig.parallaxIntensity.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0"
              max="2.5"
              step="0.1"
              value={physicsConfig.parallaxIntensity}
              onChange={e => setPhysicsConfig(p => ({ ...p, parallaxIntensity: parseFloat(e.target.value) }))}
              className="w-full accent-white cursor-pointer"
            />
            <span className="text-[10px] text-neutral-400 mt-1 block">
              Tilt degrees and spatial perspective shifting when moving mouse across viewport.
            </span>
          </div>

          {/* Particle Density */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-neutral-300">PARTICLE CONSTELLATION DENSITY</span>
              <span className="text-white font-bold">{physicsConfig.particleCount} PARTICLES</span>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              step="5"
              value={physicsConfig.particleCount}
              onChange={e => setPhysicsConfig(p => ({ ...p, particleCount: parseInt(e.target.value) }))}
              className="w-full accent-white cursor-pointer"
            />
            <span className="text-[10px] text-neutral-400 mt-1 block">
              Subtle background particle field nodes in Layer 2 digital space.
            </span>
          </div>

        </div>
      </AntigravityCard>

      {/* Settings Panel 2: Visual Overlays & Accessibility */}
      <AntigravityCard floatDelay="none" depthZ={10} className="space-y-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <Eye className="w-4 h-4 text-white" />
          <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">
            VISUAL RENDERING & ACCESSIBILITY
          </span>
        </div>

        <div className="space-y-4 text-xs font-mono">
          
          {/* Scanlines Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-white/10">
            <div>
              <div className="text-white font-semibold">CRT HUD Scanline Overlay</div>
              <div className="text-[10px] text-neutral-400">Micro horizontal scanlines for 2035 terminal look</div>
            </div>
            <button
              onClick={() => setPhysicsConfig(p => ({ ...p, enableScanlines: !p.enableScanlines }))}
              className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                physicsConfig.enableScanlines 
                  ? 'bg-white text-black font-bold' 
                  : 'bg-neutral-950 text-neutral-400 border border-white/10'
              }`}
            >
              {physicsConfig.enableScanlines ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* High Contrast Monochrome */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-white/10">
            <div>
              <div className="text-white font-semibold">Strict Monochrome Enforcement</div>
              <div className="text-[10px] text-neutral-400">Pure 100% black & white color space with no chroma</div>
            </div>
            <button
              onClick={() => setPhysicsConfig(p => ({ ...p, highContrastMono: !p.highContrastMono }))}
              className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                physicsConfig.highContrastMono 
                  ? 'bg-white text-black font-bold' 
                  : 'bg-neutral-950 text-neutral-400 border border-white/10'
              }`}
            >
              {physicsConfig.highContrastMono ? 'ACTIVE' : 'OFF'}
            </button>
          </div>

        </div>
      </AntigravityCard>

    </div>
  );
};
