import React, { useState } from 'react';
import { CarparkItem } from '../types/parking';
import { getAvailabilityStatus } from '../data/parkingData';
import { Search, MapPin, ArrowUpDown, CheckCircle, AlertTriangle, XCircle, ChevronRight } from 'lucide-react';

interface CarparkListDrawerProps {
  carparks: CarparkItem[];
  selectedCarpark: CarparkItem | null;
  onSelectCarpark: (carpark: CarparkItem) => void;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const CarparkListDrawer: React.FC<CarparkListDrawerProps> = ({
  carparks,
  selectedCarpark,
  onSelectCarpark,
  isOpen,
  onClose,
  title,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'availability'>('distance');
  const [filterOnlyAvailable, setFilterOnlyAvailable] = useState(false);

  if (!isOpen) return null;

  const filteredCarparks = carparks
    .filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.estate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.address.toLowerCase().includes(searchQuery.toLowerCase());

      if (filterOnlyAvailable) {
        return matchesSearch && c.availableLots > 0;
      }
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') {
        return a.distanceKm - b.distanceKm;
      } else {
        return b.availableLots - a.availableLots;
      }
    });

  return (
    <div
      id="carpark-list-drawer-overlay"
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        id="carpark-list-drawer"
        className="w-full max-w-md bg-slate-900 h-full border-l border-slate-800 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white">{title}</h2>
            <div className="text-xs text-slate-400">
              Showing {filteredCarparks.length} locations
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition min-w-[44px] min-h-[44px] flex items-center justify-center font-bold text-lg"
            aria-label="Close list"
          >
            ✕
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-3 border-b border-slate-800 space-y-2.5 bg-slate-900/90">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-carpark-search"
              type="text"
              placeholder="Search estate, code, or street (e.g. Bishan, TM21)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-center justify-between text-xs gap-2">
            {/* Sort Toggle */}
            <div className="flex items-center space-x-1">
              <span className="text-slate-400">Sort:</span>
              <button
                onClick={() => setSortBy(sortBy === 'distance' ? 'availability' : 'distance')}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700 font-medium hover:bg-slate-700 transition min-h-[36px]"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
                <span>{sortBy === 'distance' ? 'Nearest First' : 'Most Vacancies'}</span>
              </button>
            </div>

            {/* Filter Vacant Only */}
            <button
              onClick={() => setFilterOnlyAvailable(!filterOnlyAvailable)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold border transition min-h-[36px] ${
                filterOnlyAvailable
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              Vacant Only
            </button>
          </div>
        </div>

        {/* Scrollable Carpark Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-800/60">
          {filteredCarparks.map((carpark) => {
            const status = getAvailabilityStatus(carpark.availableLots, carpark.totalLots);
            const isSelected = selectedCarpark?.id === carpark.id;

            return (
              <div
                key={carpark.id}
                id={`drawer-item-${carpark.code.toLowerCase()}`}
                onClick={() => {
                  onSelectCarpark(carpark);
                  onClose();
                }}
                className={`pt-2.5 first:pt-0 p-2.5 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-800 border-2 border-red-500'
                    : 'bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-300 px-1.5 py-0.5 bg-slate-800 rounded">
                      {carpark.code}
                    </span>
                    <span className="text-xs text-slate-400 truncate">{carpark.estate}</span>
                  </div>

                  <h3 className="font-bold text-sm text-white truncate mt-1">
                    {carpark.name}
                  </h3>

                  <div className="flex items-center text-xs text-slate-400 mt-0.5 space-x-2">
                    <span>{carpark.distanceKm} km away</span>
                    <span>•</span>
                    <span>~{carpark.driveMinutes} min</span>
                    {carpark.heightLimitMeters && (
                      <>
                        <span>•</span>
                        <span className="text-amber-400 font-semibold">{carpark.heightLimitMeters}m limit</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Big Availability Tag for arm's length reading */}
                <div className="shrink-0 text-right">
                  <div
                    className={`px-3 py-1.5 rounded-lg flex flex-col items-center justify-center font-bold ${
                      status === 'available'
                        ? 'bg-emerald-600 text-white'
                        : status === 'limited'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    <span className="text-base font-black leading-none">
                      {carpark.availableLots}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider mt-0.5 font-bold">
                      {carpark.availableLots === 0 ? 'Full' : 'Lots'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    of {carpark.totalLots}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredCarparks.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="font-medium">No matching carparks found</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching another estate or resetting the filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
