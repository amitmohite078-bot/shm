import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';
import { ThreeSystemCore } from '../canvas/ThreeSystemCore';
import { AntigravityCard } from '../ui/AntigravityCard';
import { NexoraLogo, NexoraIcon } from '../ui/NexoraLogo';
import { Terminal, ArrowRight, Key } from 'lucide-react';

export const LoginBootView: React.FC = () => {
  const { setView } = useSystem();
  const [operatorId, setOperatorId] = useState('OPERATOR-NEXORA-01');
  const [accessKey, setAccessKey] = useState('••••••••••••');
  const [isBooting, setIsBooting] = useState(false);
  const [bootStep, setBootStep] = useState(0);

  const bootMessages = [
    "INITIALIZING NEXORA JAVA TELEMETRY DAEMON...",
    "INSTANTIATING GOF PATTERN SINGLETONS & OBSERVERS...",
    "CALIBRATING 3D QUANTUM ORBITAL VIEWPORT...",
    "AUTHENTICATING OPERATOR CIPHER (KYBER-1024)...",
    "ESTABLISHING HIGH-PRECISION FLEET MESH...",
    "NEXORA TELEMETRY ENGINE ONLINE. ACCESS GRANTED."
  ];

  const handleEnterSystem = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooting(true);
    setBootStep(0);
  };

  useEffect(() => {
    if (!isBooting) return;

    const interval = setInterval(() => {
      setBootStep(prev => {
        if (prev < bootMessages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setView('dashboard');
          }, 600);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isBooting, setView]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center relative p-4 select-none">
      
      {/* 3D Core backdrop */}
      <div className="absolute inset-0 flex items-center justify-center opacity-35 pointer-events-none">
        <div className="w-[500px] h-[500px]">
          <ThreeSystemCore className="w-full h-full" />
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <AntigravityCard floatDelay="none" depthZ={20} className="p-8 border-neutral-800 bg-black text-white shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
          
          {/* Header with Nexora Brand Lockup */}
          <div className="text-center space-y-3 mb-8 flex flex-col items-center">
            <div className="relative mb-2">
              <NexoraIcon size={80} animated={true} />
            </div>
            
            <NexoraLogo size="lg" showTagline={true} />
            
            <p className="text-xs font-mono text-neutral-400 max-w-xs mx-auto pt-1">
              High-Precision Java Telemetry & Autonomous Core Console
            </p>
          </div>

          {!isBooting ? (
            <form onSubmit={handleEnterSystem} className="space-y-4">
              
              {/* Operator ID */}
              <div>
                <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5">
                  OPERATOR DESIGNATION
                </label>
                <div className="relative">
                  <Terminal className="w-4 h-4 text-[#00E5FF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={operatorId}
                    onChange={e => setOperatorId(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF] transition-colors"
                  />
                </div>
              </div>

              {/* Access Key */}
              <div>
                <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5">
                  QUANTUM CIPHER KEY
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#00E5FF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={accessKey}
                    onChange={e => setAccessKey(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF] transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-lg bg-[#00E5FF] text-black font-bold font-mono text-xs tracking-widest uppercase hover:bg-white transition-all shadow-[0_0_25px_rgba(0,229,255,0.35)]"
              >
                <span>ENTER NEXORA CORE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-[9px] font-mono text-neutral-400">
                  ENCRYPTED VIA JAVA SPRING BACKEND ENGINE
                </span>
              </div>
            </form>
          ) : (
            /* Futuristic Bootloader Sequence */
            <div className="space-y-6 py-4 font-mono text-xs text-left">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-[10px] text-[#00E5FF] font-bold tracking-wider">
                  NEXORA INITIALIZING
                </span>
                <span className="text-[10px] text-neutral-400">
                  {Math.round(((bootStep + 1) / bootMessages.length) * 100)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                <div 
                  className="h-full bg-[#00E5FF] transition-all duration-300 shadow-[0_0_10px_#00E5FF]"
                  style={{ width: `${((bootStep + 1) / bootMessages.length) * 100}%` }}
                />
              </div>

              {/* Terminal log messages */}
              <div className="space-y-2 min-h-[110px]">
                {bootMessages.slice(0, bootStep + 1).map((msg, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-neutral-300 animate-in fade-in">
                    <span className="text-[#00E5FF]">&gt;</span>
                    <span className={idx === bootStep ? 'text-[#00E5FF] font-bold' : 'text-neutral-400'}>
                      {msg}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </AntigravityCard>
      </div>

    </div>
  );
};
