import React, { useState } from 'react';
import { ActiveScreen, CarparkItem } from './types/parking';
import {
  HDB_STANDARD_CARPARKS,
  HDB_HEAVY_VEHICLE_CARPARKS,
} from './data/parkingData';
import { Header } from './components/Header';
import { StandardCarparksScreen } from './components/StandardCarparksScreen';
import { HeavyVehicleScreen } from './components/HeavyVehicleScreen';
import { Navigation, Check, X } from 'lucide-react';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('standard');
  const [standardData, setStandardData] = useState<CarparkItem[]>(HDB_STANDARD_CARPARKS);
  const [heavyData, setHeavyData] = useState<CarparkItem[]>(HDB_HEAVY_VEHICLE_CARPARKS);
  const [isSimulatingRefresh, setIsSimulatingRefresh] = useState(false);
  const [navigationNotice, setNavigationNotice] = useState<{
    carpark: CarparkItem;
  } | null>(null);

  // Client-side local simulation of live lot sensor updates (no outside fetch or external service)
  const handleRefreshSimulation = () => {
    setIsSimulatingRefresh(true);
    setTimeout(() => {
      // Randomly adjust lot counts by -2 to +2 to simulate cars driving in/out
      setStandardData((prev) =>
        prev.map((item, idx) => {
          if (idx % 2 === 0) {
            const delta = Math.floor(Math.random() * 5) - 2;
            const newCount = Math.max(0, Math.min(item.totalLots, item.availableLots + delta));
            return {
              ...item,
              availableLots: newCount,
              lastUpdated: 'Just now',
            };
          }
          return item;
        })
      );

      setHeavyData((prev) =>
        prev.map((item, idx) => {
          if (idx % 3 === 0) {
            const delta = Math.floor(Math.random() * 3) - 1;
            const newCount = Math.max(0, Math.min(item.totalLots, item.availableLots + delta));
            return {
              ...item,
              availableLots: newCount,
              lastUpdated: 'Just now',
            };
          }
          return item;
        })
      );

      setIsSimulatingRefresh(false);
    }, 450);
  };

  const handleSimulateDrive = (carpark: CarparkItem) => {
    setNavigationNotice({ carpark });
  };

  // Calculate totals for active screen badges
  const currentDataset = activeScreen === 'standard' ? standardData : heavyData;
  const totalAvailableLots = currentDataset.reduce((sum, c) => sum + c.availableLots, 0);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Navigation & Header */}
      <Header
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
        onRefreshSimulation={handleRefreshSimulation}
        isSimulatingRefresh={isSimulatingRefresh}
        totalAvailable={totalAvailableLots}
        totalCarparksCount={currentDataset.length}
      />

      {/* Simulated Navigation Route Banner Overlay */}
      {navigationNotice && (
        <div
          id="navigation-simulation-banner"
          className="bg-emerald-600 text-white px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm z-30 shadow-lg border-b border-emerald-500 animate-in fade-in slide-in-from-top duration-150"
        >
          <div className="flex items-center space-x-2 truncate">
            <Navigation className="w-4 h-4 text-white shrink-0 animate-pulse" />
            <span className="font-bold truncate">
              Route to {navigationNotice.carpark.name} ({navigationNotice.carpark.code})
            </span>
            <span className="opacity-90 hidden sm:inline">
              • {navigationNotice.carpark.distanceKm} km (~{navigationNotice.carpark.driveMinutes} mins)
            </span>
          </div>
          <button
            onClick={() => setNavigationNotice(null)}
            className="p-1 hover:bg-emerald-700 rounded transition ml-2 shrink-0 min-w-[32px] min-h-[32px] flex items-center justify-center"
            aria-label="Dismiss route banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary Screen Views (Switched seamlessly without page reload) */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {activeScreen === 'standard' ? (
          <StandardCarparksScreen
            carparks={standardData}
            onSimulateDrive={handleSimulateDrive}
          />
        ) : (
          <HeavyVehicleScreen
            carparks={heavyData}
            onSimulateDrive={handleSimulateDrive}
          />
        )}
      </main>

      {/* Minimal Footer for Phone Motorist Context */}
      <footer className="bg-slate-950 border-t border-slate-800/80 px-4 py-1.5 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
        <div>
          <span>Singapore HDB Live Parking</span>
          <span className="mx-1.5">•</span>
          <span className="text-slate-400">Electronic Parking System (EPS)</span>
        </div>
        <div className="text-[10px] text-slate-500 hidden sm:block">
          MGMT 6110 Human-AI Collaboration
        </div>
      </footer>
    </div>
  );
}
