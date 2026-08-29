import React from 'react';
import { useSystem } from '../../context/SystemContext';
import { ViewMode } from '../../types';
import { 
  LayoutDashboard, 
  Server, 
  Activity, 
  Network, 
  Cpu, 
  AlertTriangle, 
  Settings,
  LogOut,
  Code2
} from 'lucide-react';

interface NavItem {
  id: ViewMode;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export const FloatingSidebar: React.FC = () => {
  const { view, setView, alerts } = useSystem();

  const unackAlertsCount = alerts.filter(a => !a.acknowledged).length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'DASHBOARD', sublabel: 'Core Overview', icon: LayoutDashboard },
    { id: 'devices', label: 'NODES & FLEET', sublabel: 'Cluster Devices', icon: Server, badge: '6/6' },
    { id: 'topology', label: 'TOPOLOGY', sublabel: '3D Mesh Network', icon: Network },
    { id: 'metrics', label: 'DEEP METRICS', sublabel: 'Telemetry Stream', icon: Activity },
    { id: 'processes', label: 'PROCESSES', sublabel: 'Thread Matrix', icon: Cpu },
    { id: 'alerts', label: 'INCIDENTS', sublabel: 'Threat Hub', icon: AlertTriangle, badge: unackAlertsCount > 0 ? unackAlertsCount : undefined },
    { id: 'tech-stack', label: 'TECH & JAVA', sublabel: 'Concepts & GoF', icon: Code2, badge: 'NEW' },
    { id: 'settings', label: 'GRAVITY & FX', sublabel: 'Physics Controls', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-[49px] bottom-0 z-30 hidden lg:flex flex-col justify-between py-3 px-1.5 bg-black text-white border-r border-neutral-800 shadow-xl select-none transition-all duration-200 w-14 hover:w-56 group">
      
      {/* Upper Navigation */}
      <div className="flex flex-col gap-1 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`
                relative flex items-center gap-3 w-full p-2 rounded-lg transition-all duration-150 text-left
                ${isActive 
                  ? 'bg-neutral-900 text-white font-semibold border border-[#00E5FF]/40' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                }
              `}
            >
              <div className="relative flex items-center justify-center min-w-[20px]">
                <Icon className={`w-4 h-4 transition-transform duration-150 ${isActive ? 'text-[#00E5FF] scale-110' : 'group-hover:scale-105'}`} />
                
                {isActive && (
                  <span className="absolute -left-2 w-1.5 h-1.5 bg-[#00E5FF] rounded-full shadow-[0_0_6px_#00E5FF] pulse-blue-dot" />
                )}
              </div>

              {/* Extended label on hover */}
              <div className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-1 flex items-center justify-between">
                <div>
                  <div className={`text-xs font-mono tracking-wider ${isActive ? 'text-[#00E5FF] font-bold' : 'text-white'}`}>
                    {item.label}
                  </div>
                  <div className="text-[8px] font-mono leading-none text-neutral-400">
                    {item.sublabel}
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                    isActive ? 'bg-[#00E5FF] text-black font-bold' : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Lower Actions */}
      <div className="flex flex-col gap-1 w-full pt-2 border-t border-neutral-800">
        <button
          onClick={() => setView('login')}
          className="flex items-center gap-3 w-full p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all text-left"
          title="Lock Console"
        >
          <div className="min-w-[20px] flex items-center justify-center">
            <LogOut className="w-4 h-4 text-neutral-400" />
          </div>
          <span className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-xs font-mono">
            LOCK CONSOLE
          </span>
        </button>
      </div>
    </aside>
  );
};
