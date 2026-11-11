import React, { useState, useMemo } from 'react';
import * as d3 from 'd3';
import { BudgetCategory } from '../store/useBankingStore';
import { PieChart as PieChartIcon, TrendingUp, Info } from 'lucide-react';

interface BudgetPieChartProps {
  categories: BudgetCategory[];
  totalSpending: number;
  monthlyGoal: number;
}

const COLOR_PALETTE = [
  '#005C9D', // Capital One Navy Blue
  '#0284C7', // Sky Blue
  '#0D9488', // Teal
  '#10B981', // Emerald Green
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#DA291C', // Capital One Red
  '#64748B', // Slate
];

export const BudgetPieChart: React.FC<BudgetPieChartProps> = ({
  categories,
  totalSpending,
  monthlyGoal,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<BudgetCategory | null>(null);

  // Filter categories with spending or positive budget
  const activeCategories = useMemo(() => {
    const withSpending = categories.filter((c) => c.spentAmount > 0);
    return withSpending.length > 0 ? withSpending : categories;
  }, [categories]);

  // Compute D3 pie slices
  const pieData = useMemo(() => {
    const pie = d3
      .pie<BudgetCategory>()
      .value((d) => (d.spentAmount > 0 ? d.spentAmount : d.budgetAmount))
      .sort(null)
      .padAngle(0.02);

    return pie(activeCategories);
  }, [activeCategories]);

  // Chart dimensions
  const width = 280;
  const height = 280;
  const radius = Math.min(width, height) / 2;
  const innerRadius = radius * 0.62; // Donut style

  // Arc generator
  const arcGenerator = d3
    .arc<d3.PieArcDatum<BudgetCategory>>()
    .innerRadius(innerRadius)
    .outerRadius(radius - 8)
    .cornerRadius(4);

  // Hovered larger arc generator
  const hoverArcGenerator = d3
    .arc<d3.PieArcDatum<BudgetCategory>>()
    .innerRadius(innerRadius - 2)
    .outerRadius(radius)
    .cornerRadius(4);

  const displayCategory = hoveredCategory || activeCategories[0];
  const displaySpent = displayCategory ? displayCategory.spentAmount : totalSpending;
  const displayPct = totalSpending > 0 && displayCategory
    ? Math.round((displayCategory.spentAmount / totalSpending) * 100)
    : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white">Monthly Spending Breakdown</h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
          D3 Interactive Visualizer
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* D3 Donut Chart SVG */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="overflow-visible"
          >
            <g transform={`translate(${width / 2}, ${height / 2})`}>
              {pieData.map((slice, index) => {
                const color = COLOR_PALETTE[index % COLOR_PALETTE.length];
                const isHovered = hoveredCategory?.id === slice.data.id;
                const path = isHovered
                  ? hoverArcGenerator(slice)
                  : arcGenerator(slice);

                return (
                  <path
                    key={slice.data.id}
                    d={path || undefined}
                    fill={color}
                    className="transition-all duration-200 cursor-pointer hover:opacity-90"
                    onMouseEnter={() => setHoveredCategory(slice.data)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    stroke="#020617"
                    strokeWidth={2}
                  />
                );
              })}
            </g>
          </svg>

          {/* Donut Center Data Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {hoveredCategory ? hoveredCategory.name : 'Total Spent'}
            </span>
            <span className="text-xl font-extrabold text-white font-mono block mt-0.5">
              ${(hoveredCategory ? hoveredCategory.spentAmount : totalSpending).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] font-semibold text-sky-300 block">
              {hoveredCategory ? `${displayPct}% of spending` : `Goal: $${monthlyGoal.toLocaleString()}`}
            </span>
          </div>
        </div>

        {/* Category Legend & Percentage breakdown */}
        <div className="w-full sm:flex-1 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Top Categories
          </span>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {pieData.map((slice, index) => {
              const cat = slice.data;
              const color = COLOR_PALETTE[index % COLOR_PALETTE.length];
              const pct = totalSpending > 0 ? Math.round((cat.spentAmount / totalSpending) * 100) : 0;
              const isSelected = hoveredCategory?.id === cat.id;

              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => setHoveredCategory(cat)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`p-2 rounded-xl border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-sky-500 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-semibold text-slate-200 truncate">{cat.name}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-white block">
                      ${cat.spentAmount.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span>Hover or tap any sector to view specific category shares and monthly expenditures.</span>
      </div>
    </div>
  );
};
