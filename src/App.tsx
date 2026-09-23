import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ActiveScreen, CarparkItem } from './types/parking';
import {
  HDB_STANDARD_CARPARKS,
  HDB_HEAVY_VEHICLE_CARPARKS,
} from './data/parkingData';
import { Header } from './components/Header';
import { StandardCarparksScreen } from './components/StandardCarparksScreen';
import { HeavyVehicleScreen } from './components/HeavyVehicleScreen';
import { DisqusComments } from './components/DisqusComments';
import {
  Navigation,
  X,
  AlertCircle,
  WifiOff,
  Inbox,
  Radio,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export type FeedStatus = 'loading' | 'empty' | 'refused' | 'unreachable' | 'success';

interface LiveCarparkRecord {
  carpark_number: string;
  update_datetime: string;
  lots: Array<{
    lot_type: string;
    total_lots: number;
    lots_available: number;
  }>;
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('standard');
  const [standardData, setStandardData] = useState<CarparkItem[]>(HDB_STANDARD_CARPARKS);
  const [heavyData, setHeavyData] = useState<CarparkItem[]>(HDB_HEAVY_VEHICLE_CARPARKS);
  const [feedStatus, setFeedStatus] = useState<FeedStatus>('loading');
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [navigationNotice, setNavigationNotice] = useState<{
    carpark: CarparkItem;
  } | null>(null);

  // Four explicit, distinct sentences for the four states (not a spinner)
  const STATUS_SENTENCES: Record<FeedStatus, string> = {
    loading: 'Fetching live HDB carpark lot availability from Singapore Electronic Parking System...',
    empty: 'No carpark vacancy records were returned by the parking availability feed.',
    refused: 'The parking data service refused our request due to invalid or unconfigured credentials.',
    unreachable: 'Unable to establish a connection to the Singapore Government parking availability service.',
    success: 'Live HDB lot availability synchronized successfully from Electronic Parking System.',
  };

  // Formatted access date for Singapore Open Data Licence compliance
  const accessDateString = useMemo(() => {
    return new Intl.DateTimeFormat('en-SG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }, []);

  // Fetch real data from serverless API endpoint
  const fetchLiveParkingData = useCallback(async () => {
    setFeedStatus('loading');
    try {
      const response = await fetch('/api/hdb_parking', {
        headers: {
          Accept: 'application/json',
        },
      });

      const contentType = response.headers.get('content-type') || '';

      // If response is not JSON (e.g., HTML from dev proxy fallback or unexpected format), treat as unreachable
      if (!contentType.includes('application/json')) {
        setFeedStatus('unreachable');
        return;
      }

      const payload = await response.json();

      // Case 3: Upstream refused (e.g. 503 missing credential, 401/403 unauthorized/forbidden)
      if (
        response.status === 503 ||
        response.status === 401 ||
        response.status === 403 ||
        payload.error === 'Upstream refused'
      ) {
        setFeedStatus('refused');
        return;
      }

      // If other HTTP error codes
      if (!response.ok) {
        if (response.status === 502 || response.status === 504) {
          setFeedStatus('unreachable');
        } else {
          setFeedStatus('refused');
        }
        return;
      }

      const carparks: LiveCarparkRecord[] = payload.carparks || [];

      // Case 2: Data is empty
      if (carparks.length === 0) {
        setFeedStatus('empty');
        return;
      }

      // Build quick lookup map for incoming live carparks
      const liveLookup = new Map<string, LiveCarparkRecord>();
      carparks.forEach((cp) => {
        if (cp.carpark_number) {
          liveLookup.set(cp.carpark_number.trim().toUpperCase(), cp);
        }
      });

      const formattedSyncTime = new Date().toLocaleTimeString('en-SG', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      // Update standard car/motorcycle carparks with live lot numbers
      setStandardData((prevList) =>
        prevList.map((item) => {
          const live = liveLookup.get(item.code.toUpperCase());
          if (live && live.lots) {
            const carLot = live.lots.find((l) => l.lot_type === 'C');
            const motoLot = live.lots.find((l) => l.lot_type === 'Y');
            return {
              ...item,
              availableLots:
                carLot && typeof carLot.lots_available === 'number'
                  ? carLot.lots_available
                  : item.availableLots,
              totalLots:
                carLot && carLot.total_lots > 0
                  ? carLot.total_lots
                  : item.totalLots,
              motorcycleLots: motoLot
                ? { total: motoLot.total_lots, available: motoLot.lots_available }
                : item.motorcycleLots,
              lastUpdated: `Live ${formattedSyncTime}`,
            };
          }
          return item;
        })
      );

      // Update heavy vehicle carparks with live lot numbers (type 'H')
      setHeavyData((prevList) =>
        prevList.map((item) => {
          const live = liveLookup.get(item.code.toUpperCase());
          if (live && live.lots) {
            const heavyLot = live.lots.find((l) => l.lot_type === 'H');
            return {
              ...item,
              availableLots:
                heavyLot && typeof heavyLot.lots_available === 'number'
                  ? heavyLot.lots_available
                  : item.availableLots,
              totalLots:
                heavyLot && heavyLot.total_lots > 0
                  ? heavyLot.total_lots
                  : item.totalLots,
              lastUpdated: `Live ${formattedSyncTime}`,
            };
          }
          return item;
        })
      );

      setLastSyncTime(formattedSyncTime);
      setFeedStatus('success');
    } catch {
      // Case 4: Upstream is unreachable (fetch error, network disconnect, timeout)
      setFeedStatus('unreachable');
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchLiveParkingData();
  }, [fetchLiveParkingData]);

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
        onRefreshSimulation={fetchLiveParkingData}
        isSimulatingRefresh={feedStatus === 'loading'}
        totalAvailable={totalAvailableLots}
        totalCarparksCount={currentDataset.length}
      />

      {/* Feed Status Banner (Four distinct sentences for: loading, empty, refused, unreachable) */}
      <div
        id="api-status-banner"
        className={`px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between border-b transition-colors duration-200 z-20 ${
          feedStatus === 'loading'
            ? 'bg-blue-950/80 text-blue-200 border-blue-800'
            : feedStatus === 'empty'
            ? 'bg-amber-950/90 text-amber-200 border-amber-800'
            : feedStatus === 'refused'
            ? 'bg-rose-950/90 text-rose-200 border-rose-800'
            : feedStatus === 'unreachable'
            ? 'bg-purple-950/90 text-purple-200 border-purple-800'
            : 'bg-emerald-950/60 text-emerald-200 border-emerald-900/60'
        }`}
      >
        <div className="flex items-center space-x-2.5 flex-1 min-w-0 pr-2">
          {feedStatus === 'loading' && (
            <Radio className="w-4 h-4 text-blue-400 shrink-0 animate-pulse" />
          )}
          {feedStatus === 'empty' && (
            <Inbox className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          {feedStatus === 'refused' && (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          {feedStatus === 'unreachable' && (
            <WifiOff className="w-4 h-4 text-purple-400 shrink-0" />
          )}
          {feedStatus === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}

          <span className="leading-snug">
            {STATUS_SENTENCES[feedStatus]}
            {feedStatus === 'success' && lastSyncTime && (
              <span className="text-emerald-300 ml-1.5 opacity-90 font-mono text-xs">
                ({lastSyncTime})
              </span>
            )}
          </span>
        </div>

        {/* Retry / Reload Action */}
        <button
          id="btn-retry-parking-feed"
          onClick={fetchLiveParkingData}
          disabled={feedStatus === 'loading'}
          className="shrink-0 px-2.5 py-1 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center space-x-1.5 transition min-h-[32px]"
          title="Retry fetching live data from api/hdb_parking"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${feedStatus === 'loading' ? 'animate-spin' : ''}`} />
          <span className="hidden xs:inline">Re-check</span>
        </button>
      </div>

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

      {/* Visitor feedback thread (single Disqus thread for the home page) */}
      <DisqusComments />

      {/* Mandatory Provider Attribution Footer (Singapore Open Data Licence) */}
      <footer className="bg-slate-950 border-t border-slate-800/80 px-3 sm:px-4 py-2 text-[11px] sm:text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 shrink-0">
        <div className="leading-relaxed">
          Contains information from Carpark Availability accessed on{' '}
          <span className="text-slate-300 font-medium">{accessDateString}</span> from{' '}
          <span className="text-slate-300 font-medium">data.gov.sg</span> which is made
          available under the terms of the{' '}
          <a
            href="https://data.gov.sg/open-data-licence"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 underline hover:text-white"
          >
            Singapore Open Data Licence version 1.0
          </a>
          .
        </div>
        <div className="text-[10px] text-slate-500 whitespace-nowrap">
          HDB Electronic Parking System (EPS)
        </div>
      </footer>
    </div>
  );
}
