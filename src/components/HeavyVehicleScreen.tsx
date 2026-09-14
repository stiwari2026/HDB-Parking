import React, { useState, useMemo } from 'react';
import { CarparkItem } from '../types/parking';
import { InteractiveMap } from './InteractiveMap';
import { CarparkDetailCard } from './CarparkDetailCard';
import { CarparkListDrawer } from './CarparkListDrawer';
import { Truck, List, Container, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface HeavyVehicleScreenProps {
  carparks: CarparkItem[];
  onSimulateDrive: (carpark: CarparkItem) => void;
}

export const HeavyVehicleScreen: React.FC<HeavyVehicleScreenProps> = ({
  carparks,
  onSimulateDrive,
}) => {
  const [selectedCarpark, setSelectedCarpark] = useState<CarparkItem | null>(() => carparks[0] || null);
  const [isListDrawerOpen, setIsListDrawerOpen] = useState(false);
  const [filterRegion, setFilterRegion] = useState<'all' | 'west' | 'east' | 'north' | 'ample'>('all');

  // Filter carparks based on industrial regions or vacancies
  const displayedCarparks = useMemo(() => {
    return carparks.filter((item) => {
      if (filterRegion === 'west') {
        return (
          item.estate.toLowerCase().includes('tuas') ||
          item.estate.toLowerCase().includes('jurong') ||
          item.estate.toLowerCase().includes('pioneer') ||
          item.estate.toLowerCase().includes('batok')
        );
      }
      if (filterRegion === 'east') {
        return (
          item.estate.toLowerCase().includes('changi') ||
          item.estate.toLowerCase().includes('loyang') ||
          item.estate.toLowerCase().includes('defu') ||
          item.estate.toLowerCase().includes('kaki') ||
          item.estate.toLowerCase().includes('ubi')
        );
      }
      if (filterRegion === 'north') {
        return (
          item.estate.toLowerCase().includes('woodlands') ||
          item.estate.toLowerCase().includes('sungei') ||
          item.estate.toLowerCase().includes('yishun') ||
          item.estate.toLowerCase().includes('ang mo kio')
        );
      }
      if (filterRegion === 'ample') {
        return item.availableLots >= 25;
      }
      return true;
    });
  }, [carparks, filterRegion]);

  const totalVacancies = useMemo(
    () => carparks.reduce((sum, c) => sum + c.availableLots, 0),
    [carparks]
  );

  const nearestCarpark = useMemo(() => {
    return [...carparks].sort((a, b) => a.distanceKm - b.distanceKm)[0];
  }, [carparks]);

  return (
    <div id="screen-2-heavy-vehicle-carparks" className="flex flex-col h-full relative">
      {/* Screen 2 Subheader / Heavy Vehicle Advisory Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-2 z-10 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-extrabold text-white">
                Heavy Vehicle (HV) HDB Parking Map
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                {totalVacancies} Vacant Heavy Bays
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Designated lots for Prime Movers, 40ft Trailers, Lorries, Buses &amp; Heavy Machinery
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {nearestCarpark && (
            <button
              id="btn-select-nearest-heavy"
              onClick={() => setSelectedCarpark(nearestCarpark)}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition min-h-[38px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Nearest ({nearestCarpark.code} - {nearestCarpark.distanceKm}km)</span>
            </button>
          )}

          <button
            id="btn-open-heavy-list"
            onClick={() => setIsListDrawerOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white text-xs font-bold rounded-lg border border-slate-700 transition shadow min-h-[40px]"
          >
            <List className="w-4 h-4 text-slate-300" />
            <span>Heavy Lots List ({displayedCarparks.length})</span>
          </button>
        </div>
      </div>

      {/* Heavy Vehicle Region Filter Bar */}
      <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto text-xs shrink-0 no-scrollbar">
        <span className="text-slate-400 text-[11px] font-semibold whitespace-nowrap pl-1">
          Sector:
        </span>
        <button
          id="filter-heavy-all"
          onClick={() => setFilterRegion('all')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-semibold transition min-h-[34px] ${
            filterRegion === 'all'
              ? 'bg-amber-500 text-slate-950 font-black shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          All Sectors ({carparks.length})
        </button>
        <button
          id="filter-heavy-west"
          onClick={() => setFilterRegion('west')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-semibold transition min-h-[34px] ${
            filterRegion === 'west'
              ? 'bg-amber-500 text-slate-950 font-black shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          West (Tuas / Pioneer / Jurong)
        </button>
        <button
          id="filter-heavy-north"
          onClick={() => setFilterRegion('north')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-semibold transition min-h-[34px] ${
            filterRegion === 'north'
              ? 'bg-amber-500 text-slate-950 font-black shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          North (Woodlands / S. Kadut / Yishun)
        </button>
        <button
          id="filter-heavy-east"
          onClick={() => setFilterRegion('east')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-semibold transition min-h-[34px] ${
            filterRegion === 'east'
              ? 'bg-amber-500 text-slate-950 font-black shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          East (Changi / Defu / Kaki Bukit)
        </button>
        <button
          id="filter-heavy-ample"
          onClick={() => setFilterRegion('ample')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-semibold transition min-h-[34px] ${
            filterRegion === 'ample'
              ? 'bg-emerald-600 text-white font-bold shadow'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          High Vacancy (&ge;25 Lots)
        </button>
      </div>

      {/* Main Map View Area */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <InteractiveMap
          carparks={displayedCarparks}
          selectedCarpark={selectedCarpark}
          onSelectCarpark={setSelectedCarpark}
          mode="heavy"
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
        title="Heavy Vehicle HDB Parking Lots"
      />
    </div>
  );
};
