import React from 'react';
import { SystemProvider, useSystem } from './context/SystemContext';
import { Header } from './components/layout/Header';
import { FloatingSidebar } from './components/layout/FloatingSidebar';
import { AntigravityParticles } from './components/canvas/AntigravityParticles';
import { CommandPalette } from './components/ui/CommandPalette';
import { TelemetryPermissionModal } from './components/ui/TelemetryPermissionModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { DevicesView } from './components/views/DevicesView';
import { TopologyView } from './components/views/TopologyView';
import { MetricsView } from './components/views/MetricsView';
import { ProcessesView } from './components/views/ProcessesView';
import { AlertsView } from './components/views/AlertsView';
import { SettingsView } from './components/views/SettingsView';
import { LoginBootView } from './components/views/LoginBootView';

import { WifiOff, RotateCcw } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { view, physicsConfig, isOnline, toggleOnline } = useSystem();

  return (
    <div className={`min-h-screen bg-white text-black relative selection:bg-black selection:text-white overflow-x-hidden ${physicsConfig.enableScanlines ? 'hud-scanline' : ''}`}>
      
      {/* Pure Crisp Plain White Space - No Grids */}
      <div className="fixed inset-0 bg-[#FFFFFF] z-0 pointer-events-none" />

      {/* Antigravity Particle Constellation */}
      <AntigravityParticles />

      {/* Offline Mode Alert Banner */}
      {!isOnline && (
        <div className="sticky top-0 z-50 w-full bg-black text-white py-2 px-4 font-mono text-xs font-bold flex items-center justify-between border-b border-[#00E5FF]/40 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2.5">
            <WifiOff className="w-4 h-4 text-[#00E5FF] animate-pulse" />
            <span>NEXORA GATEWAY OFFLINE // LAST TELEMETRY PACKET BUFFERED</span>
          </div>
          <button
            onClick={toggleOnline}
            className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#00E5FF] text-black rounded text-[10px] hover:bg-white transition-all font-mono font-bold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RECONNECT</span>
          </button>
        </div>
      )}

      {view !== 'login' && (
        <>
          <Header />
          <FloatingSidebar />
        </>
      )}

      {/* Main Spatial Content Viewport - Compact Edge-to-Edge */}
      <main className={`relative z-10 transition-all duration-200 ${view !== 'login' ? 'lg:pl-16 p-3 sm:p-4 w-full' : 'p-4'}`}>
        <div className="perspective-container w-full">
          {view === 'login' && <LoginBootView />}
          {view === 'dashboard' && <DashboardView />}
          {view === 'devices' && <DevicesView />}
          {view === 'topology' && <TopologyView />}
          {view === 'metrics' && <MetricsView />}
          {view === 'processes' && <ProcessesView />}
          {view === 'alerts' && <AlertsView />}
          {view === 'settings' && <SettingsView />}
        </div>
      </main>

      {/* Global Interactive Command Center (CTRL+K) */}
      <CommandPalette />

      {/* Permission Gate for Real Host Hardware Telemetry */}
      <TelemetryPermissionModal />

    </div>
  );
};

export function App() {
  return (
    <SystemProvider>
      <MainLayout />
    </SystemProvider>
  );
}

export default App;
