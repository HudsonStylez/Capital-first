import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'color';
}

export const CapitalOneLogo: React.FC<LogoProps> = ({ className = 'h-8', variant = 'color' }) => {
  const textColor = variant === 'light' ? '#FFFFFF' : '#004879';
  const swooshColor = '#DA291C';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 230 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        aria-label="Capital One Logo"
      >
        {/* Unique decorative ring */}
        <circle cx="116" cy="26" r="44" stroke={swooshColor} strokeOpacity="0.12" strokeWidth="10" />
        <circle cx="116" cy="26" r="30" stroke={swooshColor} strokeOpacity="0.08" strokeWidth="14" />
        {/* Signature Capital One Aerodynamic Red Swoosh */}
        <path
          d="M18 22C42 10 94 4 148 8C182 11 202 18 208 22C194 18 166 11 136 9C86 6 42 12 18 22Z"
          fill={swooshColor}
        />
        <path
          d="M142 8C168 11 192 17 206 22C198 20 174 14 146 11C118 8 72 10 32 20C48 14 96 6 142 8Z"
          fill={swooshColor}
        />
        {/* Capital One Brand Typography */}
        <text
          x="12"
          y="36"
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          fontSize="28"
          fontWeight="800"
          letterSpacing="-0.9px"
          fontStyle="italic"
          fill={textColor}
        >
          Capital
        </text>
        <text
          x="106"
          y="36"
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          fontSize="28"
          fontWeight="400"
          letterSpacing="-0.6px"
          fontStyle="italic"
          fill={textColor}
        >
          One
        </text>
        {/* Unique underline accent */}
        <path
          d="M40 46 C 80 40, 160 40, 196 46"
          stroke={swooshColor}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
      </svg>
    </div>
  );
};

export default CapitalOneLogo;
