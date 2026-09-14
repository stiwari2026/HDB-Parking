import React, { useState, useMemo } from 'react';
import { CarparkItem } from '../types/parking';
import { InteractiveMap } from './InteractiveMap';
import { CarparkDetailCard } from './CarparkDetailCard';
import { CarparkListDrawer } from './CarparkListDrawer';
import { Car, List, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

interface StandardCarparksScreenProps {
  carparks: CarparkItem[];
  onSimulateDrive: (carpark: CarparkItem) => void;
}

export const StandardCarparksScreen: React.FC<StandardCarparksScreenProps> = ({
  carparks,
  onSimulateDrive,
}) => {
  const [selectedCarpark, setSelectedCarpark] = useState<CarparkItem | null>(() => carparks[0] || null);
  const [isListDrawerOpen, setIsListDrawerOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'mscp' | 'surface' | 'ample'>('all');

  // Filter carparks based on quick toggle
  const displayedCarparks = useMemo(() => {
    return carparks.filter((item) => {
      if (filterType === 'mscp') return item.carparkType === 'Multi-Storey';
      if (filterType === 'surface') return item.carparkType === 'Surface';
      if (filterType === 'ample') return item.availableLots >= 50;
      return true;
    });
  }, [carparks, filterType]);

  const totalVacancies = useMemo(
    () => carparks.reduce((sum, c) => sum + c.availableLots, 0),
    [carparks]
  );

  const nearestCarpark = useMemo(() => {
    return [...carparks].sort((a, b) => a.distanceKm - b.distanceKm)[0];
  }, [carparks]);

  return (
    <div id="screen-1-standard-carparks" className="flex flex-col h-full relative">
      {/* Screen 1 Subheader / Quick Context Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-2 z-10 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-extrabold text-white">
                Nearby HDB Motorcar &amp; Motorcycle Parking
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {totalVacancies} Vacant Lots
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Live electronic vacancy feed for passenger cars &amp; motorcycles across Singapore
            </p>
          </div>
        </div>

        {/* Quick List Toggle & Nearest Action */}
        <div className="flex items-center space-x-2">
          {nearestCarpark && (
            <button
              id="btn-select-nearest-standard"
              onClick={() => setSelectedCarpark(nearestCarpark)}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition min-h-[38px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Nearest ({nearestCarpark.code} - {nearestCarpark.distanceKm}km)</span>
            </button>
          )}

          <button
            id="btn-open-standard-list"
            onClick={() => setIsListDrawerOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white text-xs font-bold rounded-lg border border-slate-700 transition shadow min-h-[40px]"
          >
            <List className="w-4 h-4 text-slate-300" />
            <span>Carpark List ({displayedCarparks.length})</span>
          </button>
        </div>
      </div>

      {/* Quick Filter Pill Bar */}
      <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto text-xs shrink-0 no-scrollbar">
        <span className="text-slate-400 text-[11px] font-semibold whitespace-nowrap pl-1">
          Filter:
        </span>
        <button
          id="filter-all-carparks"
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-semibold transition min-h-[34px] ${
            filterType === 'all'
              ? 'bg-red-600 text-white shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          All ({carparks.length})
        </button>
        <button
          id="filter-mscp-carparks"
          onClick={() => setFilterType('mscp')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-semibold transition min-h-[34px] ${
            filterType === 'mscp'
              ? 'bg-red-600 text-white shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          Multi-Storey MSCP
        </button>
        <button
          id="filter-surface-carparks"
          onClick={() => setFilterType('surface')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-semibold transition min-h-[34px] ${
            filterType === 'surface'
              ? 'bg-red-600 text-white shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          Open Surface Lots
        </button>
        <button
          id="filter-ample-carparks"
          onClick={() => setFilterType('ample')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-semibold transition min-h-[34px] ${
            filterType === 'ample'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          High Vacancy (&ge;50 Lots)
        </button>
      </div>

      {/* Main Map View Area */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <InteractiveMap
          carparks={displayedCarparks}
          selectedCarpark={selectedCarpark}
          onSelectCarpark={setSelectedCarpark}
          mode="standard"
        />

        {/* Selected Carpark Bottom Card */}
        {selectedCarpark && (
          <div className="absolute bottom-0 left-0 right-0 z-30 p-2 sm:p-4 pointer-events-none">
            <div className="pointer-events-auto">
              <CarparkDetailCard
                carpark={selectedCarpark}
                onClose={() => setSelectedCarpark(null)}
                onSimulateDrive={() => onSimulateDrive(selectedCarpark)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Side List Drawer */}
      <CarparkListDrawer
        carparks={displayedCarparks}
        selectedCarpark={selectedCarpark}
        onSelectCarpark={setSelectedCarpark}
        isOpen={isListDrawerOpen}
        onClose={() => setIsListDrawerOpen(false)}
        title="Standard HDB Carparks"
      />
    </div>
  );
};
