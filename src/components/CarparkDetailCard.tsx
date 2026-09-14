import React from 'react';
import { CarparkItem } from '../types/parking';
import {
  MapPin,
  Clock,
  Car,
  Truck,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Info,
  ChevronRight,
  X,
  Compass,
} from 'lucide-react';
import { getAvailabilityStatus } from '../data/parkingData';

interface CarparkDetailCardProps {
  carpark: CarparkItem;
  onClose: () => void;
  onSimulateDrive?: () => void;
}

export const CarparkDetailCard: React.FC<CarparkDetailCardProps> = ({
  carpark,
  onClose,
  onSimulateDrive,
}) => {
  const status = getAvailabilityStatus(carpark.availableLots, carpark.totalLots);
  const occupancyPercent = Math.round(
    ((carpark.totalLots - carpark.availableLots) / carpark.totalLots) * 100
  );

  return (
    <div
      id="carpark-detail-bottom-card"
      className="bg-slate-900 border-t-2 sm:border-2 border-slate-700 sm:rounded-2xl shadow-2xl p-4 sm:p-5 text-white transition-all w-full max-w-4xl mx-auto"
    >
      {/* Top Header Row with Close and Code */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs font-bold">
            {carpark.code}
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800/90 text-slate-300">
            {carpark.estate}
          </span>
          <span className="text-xs text-slate-400">
            {carpark.carparkType}
          </span>
        </div>

        <button
          id="btn-close-detail-card"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
          aria-label="Close detail card"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Carpark Name & Address */}
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
          {carpark.name}
        </h2>
        <div className="flex items-center text-xs sm:text-sm text-slate-400 mt-1 space-x-1.5">
          <MapPin className="w-4 h-4 text-red-400 shrink-0" />
          <span className="truncate">{carpark.address}</span>
        </div>
      </div>

      {/* Primary Arm's-Length Availability Display */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 mb-4">
        {/* Jumbo Vacant Lot Number */}
        <div className="sm:col-span-5 flex items-center space-x-4">
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-inner ${
              status === 'available'
                ? 'bg-emerald-600 text-white'
                : status === 'limited'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-red-600 text-white'
            }`}
          >
            <span className="text-3xl sm:text-4xl font-black tracking-tighter leading-none">
              {carpark.availableLots}
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase mt-0.5 opacity-90">
              Vacant
            </span>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Lot Availability
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              {status === 'available' && (
                <span className="text-emerald-400 font-extrabold">Ample Lots</span>
              )}
              {status === 'limited' && (
                <span className="text-amber-400 font-extrabold">Filling Up Fast</span>
              )}
              {status === 'full' && (
                <span className="text-red-400 font-extrabold">Carpark Full</span>
              )}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {carpark.availableLots} of {carpark.totalLots} total lots
            </div>
            {/* Progress / Occupancy bar */}
            <div className="w-32 sm:w-36 h-2 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  occupancyPercent > 90
                    ? 'bg-red-500'
                    : occupancyPercent > 75
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Proximity & Distance Highlights */}
        <div className="sm:col-span-4 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4 flex flex-col justify-center space-y-2">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Distance</div>
              <div className="text-sm font-bold text-white">
                {carpark.distanceKm} km away (~{carpark.driveMinutes} min drive)
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Grace Period</div>
              <div className="text-sm font-bold text-white">
                {carpark.gracePeriodMinutes} mins free entry
              </div>
            </div>
          </div>
        </div>

        {/* Height Clearance & Vehicle Specs */}
        <div className="sm:col-span-3 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4 flex flex-col justify-center space-y-2">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Height Clearance</div>
            <div className="text-sm font-bold text-amber-300">
              {carpark.heightLimitMeters
                ? `${carpark.heightLimitMeters}m Limit`
                : 'No Limit (Open-Air)'}
            </div>
          </div>

          {carpark.motorcycleLots && (
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Motorcycle Lots</div>
              <div className="text-sm font-bold text-slate-200">
                {carpark.motorcycleLots.available} / {carpark.motorcycleLots.total} vacant
              </div>
            </div>
          )}

          {carpark.vehicleCategory === 'heavy' && (
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Vehicle Class</div>
              <div className="text-xs font-bold text-amber-400">
                Buses • Lorries • Prime Movers
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Parking Rates & Features Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 mb-3 pt-1">
        <div className="flex items-center space-x-1.5">
          <span className="font-semibold text-slate-400">Rate:</span>
          <span className="font-bold text-slate-100">{carpark.rates}</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Last sensor ping: <span className="text-slate-300">{carpark.lastUpdated}</span>
        </div>
      </div>

      {/* Features tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {carpark.features.map((feature, idx) => (
          <span
            key={idx}
            className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700/60"
          >
            {feature}
          </span>
        ))}
      </div>

      {/* Action Buttons: Navigate / Directions & Quick Info */}
      <div className="flex items-center gap-2.5">
        <button
          id="btn-navigate-carpark"
          onClick={onSimulateDrive}
          className="flex-1 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-sm sm:text-base py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition min-h-[48px]"
        >
          <ArrowUpRight className="w-5 h-5" />
          <span>Drive to {carpark.code}</span>
        </button>

        <button
          id="btn-carpark-dismiss"
          onClick={onClose}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm py-3 px-4 rounded-xl border border-slate-700 transition min-h-[48px]"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
