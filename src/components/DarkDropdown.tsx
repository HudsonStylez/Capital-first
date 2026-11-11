import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  id: string;
  label: string;
  sublabel?: string;
  badge?: string;
  disabled?: boolean;
}

interface DarkDropdownProps {
  label?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const DarkDropdown: React.FC<DarkDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.id === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full text-left" ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#2d2d2d] text-white border border-[#444444] hover:border-slate-500 rounded-xl px-3.5 py-3 text-xs font-medium flex items-center justify-between shadow-sm cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 truncate">
          {/* Selected Radio Indicator Preview */}
          <div className="w-4 h-4 rounded-full border-2 border-[#005C9D] flex items-center justify-center shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#005C9D]" />
          </div>
          <div className="text-left truncate">
            <span className="font-semibold block truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            {selectedOption?.sublabel && (
              <span className="text-[11px] text-slate-400 block font-mono">
                {selectedOption.sublabel}
              </span>
            )}
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Panel (Exact #2d2d2d Dark Charcoal) */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1.5 z-50 bg-[#2d2d2d] border border-[#444444] rounded-xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150 max-h-64 overflow-y-auto">
          {options.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-400">No options available</div>
          ) : (
            options.map((opt) => {
              const isSelected = opt.id === value;

              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    if (!opt.disabled) {
                      onChange(opt.id);
                      setIsOpen(false);
                    }
                  }}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    opt.disabled
                      ? 'opacity-40 cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#383838] text-white'
                      : 'hover:bg-[#383838]/70 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    {/* Circular Radio Button: Blue when selected, grey outline when unselected */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'border-[#005C9D] bg-transparent'
                          : 'border-slate-500 bg-transparent'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#005C9D] animate-in zoom-in-50" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <span className="text-xs font-bold block text-white truncate">
                        {opt.label}
                      </span>
                      {opt.sublabel && (
                        <span className="text-[11px] text-slate-400 block font-mono">
                          {opt.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {opt.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                      {opt.badge}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
