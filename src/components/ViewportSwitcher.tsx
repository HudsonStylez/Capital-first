import React from 'react';
import { Smartphone, Tablet, Monitor, RotateCcw } from 'lucide-react';

export type DeviceMode = 'mobile' | 'tablet' | 'desktop';

interface ViewportSwitcherProps {
  activeMode: DeviceMode;
  onChangeMode: (mode: DeviceMode) => void;
  currentPath: string;
  onNavigate: (path: string) => void;
  onReset?: () => void;
}

export const ViewportSwitcher: React.FC<ViewportSwitcherProps> = ({
  activeMode,
  onChangeMode,
  currentPath,
  onNavigate,
  onReset,
}) => {
  return (
    <div className="bg-slate-900 text-white text-xs px-4 py-2 flex flex-wrap items-center justify-between border-b border-slate-800 shadow-md sticky top-0 z-50 gap-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-semibold tracking-wide text-slate-200">Device:</span>
          <span className="text-slate-400 font-mono hidden sm:inline">
            {activeMode === 'mobile' && '390 × 844'}
            {activeMode === 'tablet' && '768 × 1024'}
            {activeMode === 'desktop' && 'Responsive (1440px)'}
          </span>
        </div>

        {/* Route Selector Dropdown */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700">
          <span className="text-slate-400 text-[11px] font-semibold hidden md:inline">Route:</span>
          <select
            value={currentPath}
            onChange={(e) => onNavigate(e.target.value)}
            className="bg-slate-800 text-sky-200 border border-slate-700 rounded px-2.5 py-1 text-xs font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-[#005C9D] cursor-pointer"
          >
            <option value="/">/ (Public Home)</option>
            <option value="/interstitial">/interstitial (Mobile App)</option>
            <option value="/signin">/signin (Official Sign In)</option>
            <option value="/enroll">/enroll (Enrollment Flow)</option>
            <option value="/enroll/security-check">/enroll/security-check</option>
            <option value="/enroll/account-lock">/enroll/account-lock (Lock Screen)</option>
            <option value="/sign-in-help">/sign-in-help (Username Recovery)</option>
            <option value="/dashboard">/dashboard (Banking Dashboard)</option>
            <option value="/profile">/profile (User Profile & Security)</option>
            <option value="/admin">/admin (Admin Console · 123456)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-lg border border-slate-700/60">
        <button
          type="button"
          onClick={() => onChangeMode('mobile')}
          className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
            activeMode === 'mobile'
              ? 'bg-[#005C9D] text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
          title="Mobile View (390px)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeMode('tablet')}
          className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
            activeMode === 'tablet'
              ? 'bg-[#005C9D] text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
          title="Tablet View (768px)"
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>Tablet</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeMode('desktop')}
          className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
            activeMode === 'desktop'
              ? 'bg-[#005C9D] text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
          title="Desktop Full Screen"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Desktop</span>
        </button>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded ml-1 transition-colors cursor-pointer"
            title="Reset to Top"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
