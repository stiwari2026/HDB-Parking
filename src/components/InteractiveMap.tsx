import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { CarparkItem } from '../types/parking';
import { ZoomIn, ZoomOut, Compass, Navigation2, Layers, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { getAvailabilityStatus } from '../data/parkingData';

interface InteractiveMapProps {
  carparks: CarparkItem[];
  selectedCarpark: CarparkItem | null;
  onSelectCarpark: (carpark: CarparkItem) => void;
  userPosition?: { x: number; y: number };
  mode: 'standard' | 'heavy';
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  carparks,
  selectedCarpark,
  onSelectCarpark,
  userPosition = { x: 50.5, y: 46.0 }, // Bishan / Central SG coordinate
  mode,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showRoadNames, setShowRoadNames] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Center on selected carpark if changed
  useEffect(() => {
    if (selectedCarpark) {
      // Calculate target offset to center the carpark in the current view
      const targetPanX = (50 - selectedCarpark.x) * 4;
      const targetPanY = (50 - selectedCarpark.y) * 4;
      setPanOffset({
        x: Math.max(-160, Math.min(160, targetPanX)),
        y: Math.max(-140, Math.min(140, targetPanY)),
      });
      if (zoomLevel < 1.3) {
        setZoomLevel(1.35);
      }
    }
  }, [selectedCarpark?.id]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.35, 2.6));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.35, 0.9));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleCenterUser = () => {
    const targetPanX = (50 - userPosition.x) * 4;
    const targetPanY = (50 - userPosition.y) * 4;
    setPanOffset({ x: targetPanX, y: targetPanY });
    setZoomLevel(1.4);
  };

  // Drag & Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag if left click
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panOffset.x,
        y: e.touches[0].clientY - panOffset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPanOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Quick stats for the current screen
  const totalVacantInView = useMemo(
    () => carparks.reduce((sum, c) => sum + c.availableLots, 0),
    [carparks]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[420px] bg-slate-950 overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      id="singapore-live-parking-map"
    >
      {/* Map Canvas with SVG schematic vector lines */}
      <div
        className="w-full h-full absolute inset-0 transition-transform duration-200 ease-out origin-center"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
        }}
      >
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Gradient for Singapore mainland */}
            <linearGradient id="mainlandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Industrial Zones (Tuas, Jurong, Sungei Kadut) subtle tint */}
            <pattern id="industrialPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0,20 l 20,-20 M 0,0 l 20,20" stroke="#334155" strokeWidth="1" opacity="0.3" />
            </pattern>
          </defs>

          {/* Waterway / Ocean Background */}
          <rect width="1000" height="650" fill="#020617" />

          {/* Grid lines for clean tactical GPS look */}
          <g stroke="#1e293b" strokeWidth="0.8" opacity="0.4">
            <line x1="100" y1="0" x2="100" y2="650" />
            <line x1="250" y1="0" x2="250" y2="650" />
            <line x1="400" y1="0" x2="400" y2="650" />
            <line x1="550" y1="0" x2="550" y2="650" />
            <line x1="700" y1="0" x2="700" y2="650" />
            <line x1="850" y1="0" x2="850" y2="650" />
            <line x1="0" y1="100" x2="1000" y2="100" />
            <line x1="0" y1="220" x2="1000" y2="220" />
            <line x1="0" y1="340" x2="1000" y2="340" />
            <line x1="0" y1="460" x2="1000" y2="460" />
            <line x1="0" y1="580" x2="1000" y2="580" />
          </g>

          {/* Singapore Mainland Shape (Simplified geographic outline) */}
          <path
            d="M 120 420 
               C 80 430, 70 470, 90 500
               C 100 520, 140 500, 160 480
               C 210 470, 240 450, 270 460
               C 310 480, 360 490, 420 500
               C 450 510, 480 490, 520 480
               C 560 470, 620 460, 670 470
               C 740 460, 800 450, 850 430
               C 900 400, 890 350, 860 310
               C 830 280, 790 270, 750 260
               C 700 240, 670 230, 630 240
               C 590 220, 560 210, 520 200
               C 480 180, 440 170, 390 180
               C 350 190, 320 220, 290 250
               C 260 280, 240 310, 210 330
               C 180 360, 140 390, 120 420 Z"
            fill="url(#mainlandGradient)"
            stroke="#334155"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Jurong Island */}
          <path
            d="M 170 510 C 150 520, 160 550, 190 560 C 230 565, 250 540, 230 520 C 210 505, 190 505, 170 510 Z"
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="2"
          />

          {/* Pulau Ubin & Tekong */}
          <ellipse cx="780" cy="220" rx="35" ry="12" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          <ellipse cx="860" cy="210" rx="30" ry="18" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

          {/* Sentosa Island */}
          <path
            d="M 440 525 C 430 535, 470 555, 510 540 C 530 530, 510 520, 470 520 Z"
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Major Expressways (PIE, CTE, AYE, SLE, TPE, ECP, KPE) */}
          <g stroke="#475569" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
            {/* PIE (Pan Island Expressway): Tuas/Jurong -> Changi */}
            <path d="M 190 410 Q 300 370, 450 380 T 650 370 T 830 380" stroke="#64748b" strokeWidth="4" fill="none" />
            
            {/* AYE (Ayer Rajah Expressway): Tuas -> Marina Bay */}
            <path d="M 120 460 Q 250 460, 400 470 T 520 485" stroke="#64748b" strokeWidth="3.5" fill="none" />

            {/* CTE (Central Expressway): Yishun/AMK -> Chinatown/CBD */}
            <path d="M 520 220 Q 525 330, 510 400 T 495 480" stroke="#64748b" strokeWidth="3.5" fill="none" />

            {/* SLE (Seletar Expressway) & BKE (Bukit Timah Expressway) */}
            <path d="M 400 190 L 400 340 L 460 410" stroke="#64748b" strokeWidth="3" fill="none" />
            <path d="M 400 210 Q 470 200, 560 250" stroke="#64748b" strokeWidth="3" fill="none" />

            {/* TPE (Tampines Expressway): Seletar -> Punggol -> Pasir Ris -> Changi */}
            <path d="M 560 250 Q 660 240, 750 300 T 820 370" stroke="#64748b" strokeWidth="3" fill="none" />

            {/* ECP (East Coast Parkway): Marina -> Changi Airport */}
            <path d="M 520 490 Q 640 470, 750 440 T 840 400" stroke="#64748b" strokeWidth="3" fill="none" />
          </g>

          {/* Primary Waterways (Singapore River / Marina Basin / Reservoir) */}
          <path d="M 500 460 Q 515 475, 530 480" stroke="#0284c7" strokeWidth="3" fill="none" opacity="0.7" />
          <ellipse cx="480" cy="310" rx="35" ry="18" fill="#0369a1" opacity="0.4" /> {/* MacRitchie / Central Catchment */}
          <ellipse cx="420" cy="270" rx="20" ry="12" fill="#0369a1" opacity="0.4" /> {/* Upper Seletar */}

          {/* Singapore Expressway & Region Labels */}
          {showRoadNames && (
            <g className="text-[11px] font-bold fill-slate-400 select-none" opacity="0.75">
              <text x="500" y="365" textAnchor="middle" fill="#94a3b8">PIE</text>
              <text x="535" y="320" textAnchor="start" fill="#94a3b8">CTE</text>
              <text x="280" y="450" textAnchor="middle" fill="#94a3b8">AYE</text>
              <text x="680" y="275" textAnchor="middle" fill="#94a3b8">TPE</text>
              <text x="660" y="475" textAnchor="middle" fill="#94a3b8">ECP</text>
              <text x="410" y="280" textAnchor="end" fill="#94a3b8">BKE</text>

              {/* District Labels */}
              <text x="520" y="415" textAnchor="middle" fill="#cbd5e1" className="text-[13px] font-extrabold tracking-wider">
                BISHAN / TP
              </text>
              <text x="760" y="400" textAnchor="middle" fill="#cbd5e1" className="text-[12px] font-bold">
                TAMPINES / BEDOK
              </text>
              <text x="280" y="410" textAnchor="middle" fill="#cbd5e1" className="text-[12px] font-bold">
                JURONG
              </text>
              <text x="400" y="165" textAnchor="middle" fill="#cbd5e1" className="text-[12px] font-bold">
                WOODLANDS
              </text>
              <text x="120" y="440" textAnchor="middle" fill="#fbbf24" className="text-[11px] font-semibold">
                TUAS INDUSTRIAL
              </text>
              <text x="680" y="235" textAnchor="middle" fill="#94a3b8" className="text-[11px]">
                PUNGGOL
              </text>
              <text x="520" y="525" textAnchor="middle" fill="#64748b" className="text-[10px] tracking-widest">
                SINGAPORE STRAIT
              </text>
              <text x="450" y="90" textAnchor="middle" fill="#64748b" className="text-[10px] tracking-widest">
                JOHOR STRAIT
              </text>
            </g>
          )}

          {/* User Location Radar Wave / Ripple */}
          <g>
            <circle
              cx={`${userPosition.x * 10}`}
              cy={`${userPosition.y * 6.5}`}
              r="24"
              fill="#3b82f6"
              opacity="0.15"
              className="animate-ping"
            />
            <circle
              cx={`${userPosition.x * 10}`}
              cy={`${userPosition.y * 6.5}`}
              r="14"
              fill="#2563eb"
              opacity="0.3"
            />
            <circle
              cx={`${userPosition.x * 10}`}
              cy={`${userPosition.y * 6.5}`}
              r="6"
              fill="#60a5fa"
              stroke="#ffffff"
              strokeWidth="2"
            />
          </g>
        </svg>

        {/* User Location Label (HTML Overlay) */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-9 pointer-events-none z-10"
          style={{
            left: `${userPosition.x}%`,
            top: `${userPosition.y}%`,
          }}
        >
          <div className="bg-blue-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded shadow border border-blue-400/50 whitespace-nowrap flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>YOU ARE HERE</span>
          </div>
        </div>

        {/* Interactive Carpark Markers - Large, High-Contrast for Phone Arm's-Length Readability */}
        {carparks.map((carpark) => {
          const isSelected = selectedCarpark?.id === carpark.id;
          const status = getAvailabilityStatus(carpark.availableLots, carpark.totalLots);

          // Arm's-length color pairing:
          // Available (>20): High contrast Emerald Green with white bold text
          // Limited (1-20): Amber/Orange with black/dark slate text
          // Full (0): High contrast Red with white text
          let badgeBg = 'bg-emerald-600 hover:bg-emerald-500 text-white';
          let borderColor = 'border-emerald-400';
          let ringEffect = 'ring-2 ring-emerald-400/40';

          if (status === 'limited') {
            badgeBg = 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black';
            borderColor = 'border-amber-300';
            ringEffect = 'ring-2 ring-amber-400/50';
          } else if (status === 'full') {
            badgeBg = 'bg-red-600 hover:bg-red-500 text-white font-black';
            borderColor = 'border-red-400';
            ringEffect = 'ring-2 ring-red-500/50';
          }

          return (
            <div
              key={carpark.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-150 z-20 ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-110'
              }`}
              style={{
                left: `${carpark.x}%`,
                top: `${carpark.y}%`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectCarpark(carpark);
              }}
            >
              {/* Pulsing ring for selected pin */}
              {isSelected && (
                <div className="absolute -inset-2 rounded-xl bg-white/20 animate-pulse pointer-events-none" />
              )}

              {/* Marker Button: min-h-[44px] touch target, big legible lot count */}
              <button
                id={`marker-${carpark.code.toLowerCase()}`}
                className={`relative px-2.5 py-1.5 rounded-lg shadow-lg border flex items-center space-x-1.5 transition-transform ${badgeBg} ${borderColor} ${
                  isSelected ? 'ring-4 ring-white ring-offset-2 ring-offset-slate-900 shadow-2xl' : ringEffect
                }`}
                style={{ minWidth: '58px', minHeight: '38px' }}
                aria-label={`${carpark.name}: ${carpark.availableLots} available lots`}
              >
                {/* Status dot icon */}
                <div className="shrink-0">
                  {status === 'available' && <CheckCircle2 className="w-3.5 h-3.5 text-white/90" />}
                  {status === 'limited' && <AlertTriangle className="w-3.5 h-3.5 text-slate-950" />}
                  {status === 'full' && <XCircle className="w-3.5 h-3.5 text-white" />}
                </div>

                {/* Big Bold Vacant Lots Number */}
                <div className="flex flex-col items-start leading-none text-left">
                  <span className="text-sm font-extrabold tracking-tight">
                    {carpark.availableLots === 0 ? 'FULL' : carpark.availableLots}
                  </span>
                  <span className="text-[9px] font-semibold uppercase opacity-90 tracking-wider">
                    {carpark.availableLots === 0 ? '0 LOT' : 'LOTS'}
                  </span>
                </div>
              </button>

              {/* Carpark Short Code Pill underneath */}
              <div className="text-center mt-0.5">
                <span className="inline-block bg-slate-900/90 text-slate-200 border border-slate-700 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded shadow">
                  {carpark.code}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Tactical Map Controls */}
      <div className="absolute top-3 right-3 flex flex-col space-y-2 z-20">
        {/* Zoom In */}
        <button
          id="btn-map-zoom-in"
          onClick={handleZoomIn}
          className="w-11 h-11 bg-slate-900/95 hover:bg-slate-800 text-white border border-slate-700 rounded-lg flex items-center justify-center shadow-lg active:scale-95 transition"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-slate-200" />
        </button>

        {/* Zoom Out */}
        <button
          id="btn-map-zoom-out"
          onClick={handleZoomOut}
          className="w-11 h-11 bg-slate-900/95 hover:bg-slate-800 text-white border border-slate-700 rounded-lg flex items-center justify-center shadow-lg active:scale-95 transition"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-slate-200" />
        </button>

        {/* Center on User Location */}
        <button
          id="btn-map-center-user"
          onClick={handleCenterUser}
          className="w-11 h-11 bg-blue-600 hover:bg-blue-500 text-white border border-blue-400 rounded-lg flex items-center justify-center shadow-lg active:scale-95 transition"
          title="Center on My Location (Bishan)"
          aria-label="Center on My Location"
        >
          <Navigation2 className="w-5 h-5 text-white" />
        </button>

        {/* Reset Map View */}
        <button
          id="btn-map-reset-view"
          onClick={handleReset}
          className="w-11 h-11 bg-slate-900/95 hover:bg-slate-800 text-white border border-slate-700 rounded-lg flex items-center justify-center shadow-lg active:scale-95 transition"
          title="Reset Whole Island View"
          aria-label="Reset View"
        >
          <Compass className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      {/* Floating Status & Readability Legend (Top Left) */}
      <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm border border-slate-800 p-2.5 rounded-xl shadow-lg z-20 max-w-[210px] hidden xs:block">
        <div className="text-[11px] font-bold text-slate-300 mb-1.5 flex items-center justify-between">
          <span>VACANCY STATUS</span>
          <span className="text-[10px] text-slate-400 font-mono">
            {carparks.length} Carparks
          </span>
        </div>
        <div className="space-y-1 text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 shrink-0" />
            <span className="text-slate-200 font-medium">&gt; 20 Lots Vacant</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-500/20 shrink-0" />
            <span className="text-slate-200 font-medium">1 - 20 Lots (Filling Fast)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-600 ring-2 ring-red-600/20 shrink-0" />
            <span className="text-slate-200 font-medium">Full (0 Lots)</span>
          </div>
        </div>
      </div>

      {/* Quick Map Pan Notice for Mobile Motorists */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-900/80 backdrop-blur border border-slate-800 px-3 py-1 rounded-full text-[11px] text-slate-400 pointer-events-none shadow">
        <span>Tap any pin to view lot vacancy &amp; height limit</span>
      </div>
    </div>
  );
};
