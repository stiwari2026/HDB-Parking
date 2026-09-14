import React from 'react';
import { Car, Truck, Radio, RotateCw } from 'lucide-react';
import { ActiveScreen } from '../types/parking';

interface HeaderProps {
  activeScreen: ActiveScreen;
  onScreenChange: (screen: ActiveScreen) => void;
  onRefreshSimulation: () => void;
  isSimulatingRefresh: boolean;
  totalAvailable: number;
  totalCarparksCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onScreenChange,
  onRefreshSimulation,
  isSimulatingRefresh,
  totalAvailable,
  totalCarparksCount,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shrink-0 sticky top-0 z-30 shadow-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="bg-red-600 text-white font-black text-sm px-2 py-1 rounded tracking-wider shadow">
            HDB
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
              HDB Live Parking
            </h1>
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-emerald-400">EPS LIVE FEED</span>
              <span>•</span>
              <span>{totalCarparksCount} carparks tracked</span>
            </div>
          </div>
        </div>

        {/* Live Simulation Refresh Button */}
        <button
          id="btn-refresh-parking-data"
          onClick={onRefreshSimulation}
          disabled={isSimulatingRefresh}
          className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 text-xs px-3 py-2 rounded-lg border border-slate-700 transition min-h-[44px]"
          title="Simulate live carpark vacancy sensor update"
        >
          <RotateCw
            className={`w-4 h-4 text-emerald-400 ${
              isSimulatingRefresh ? 'animate-spin' : ''
            }`}
          />
          <span className="hidden sm:inline font-medium">Live Sync</span>
        </button>
      </div>

      {/* Screen 1 / Screen 2 Tab Navigation - High contrast, arm's-length readable */}
      <div className="bg-slate-950 px-2 sm:px-4 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-stretch">
          {/* Screen 1 Button */}
          <button
            id="tab-screen-1-standard"
            onClick={() => onScreenChange('standard')}
            className={`flex-1 py-3 px-2 sm:px-4 flex items-center justify-center space-x-2 font-bold text-sm sm:text-base border-b-2 transition min-h-[48px] ${
              activeScreen === 'standard'
                ? 'border-red-500 text-white bg-slate-900/90'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Car className={`w-5 h-5 ${activeScreen === 'standard' ? 'text-red-400' : 'text-slate-400'}`} />
            <div className="text-left">
              <div className="leading-tight">Standard Carparks</div>
              <div className="text-[10px] font-normal text-slate-400 hidden xs:block">
                Cars &amp; Motorcycles
              </div>
            </div>
            {activeScreen === 'standard' && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {totalAvailable} lots
              </span>
            )}
          </button>

          {/* Screen 2 Button */}
          <button
            id="tab-screen-2-heavy"
            onClick={() => onScreenChange('heavy')}
            className={`flex-1 py-3 px-2 sm:px-4 flex items-center justify-center space-x-2 font-bold text-sm sm:text-base border-b-2 transition min-h-[48px] ${
              activeScreen === 'heavy'
                ? 'border-amber-500 text-white bg-slate-900/90'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Truck className={`w-5 h-5 ${activeScreen === 'heavy' ? 'text-amber-400' : 'text-slate-400'}`} />
            <div className="text-left">
              <div className="leading-tight">Heavy Vehicle Lots</div>
              <div className="text-[10px] font-normal text-slate-400 hidden xs:block">
                Lorries, Buses, Trailers
              </div>
            </div>
            {activeScreen === 'heavy' && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                {totalAvailable} lots
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
