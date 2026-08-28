import React, { useMemo } from 'react';
import { MetricHistoryPoint } from '../../types';

interface MonochromeChartProps {
  data: MetricHistoryPoint[];
  dataKey: 'cpu' | 'ram' | 'disk' | 'network' | 'quantumDrift' | 'thermalC';
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  unit?: string;
  className?: string;
}

export const MonochromeChart: React.FC<MonochromeChartProps> = ({
  data,
  dataKey,
  height = 140,
  showGrid = true,
  showLabels = true,
  unit = '%',
  className = ''
}) => {
  const points = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(d => Number(d[dataKey]));
  }, [data, dataKey]);

  const minVal = useMemo(() => Math.min(...points, 0), [points]);
  const maxVal = useMemo(() => Math.max(...points, 100), [points]);

  const svgPath = useMemo(() => {
    if (points.length < 2) return '';
    const width = 500;
    const h = height - 20;
    const dx = width / (points.length - 1);
    const range = maxVal - minVal || 1;

    let path = `M 0 ${h - ((points[0] - minVal) / range) * h + 10}`;

    for (let i = 1; i < points.length; i++) {
      const prevX = (i - 1) * dx;
      const prevY = h - ((points[i - 1] - minVal) / range) * h + 10;
      const currX = i * dx;
      const currY = h - ((points[i] - minVal) / range) * h + 10;

      const cx1 = prevX + dx * 0.45;
      const cy1 = prevY;
      const cx2 = currX - dx * 0.45;
      const cy2 = currY;

      path += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${currX} ${currY}`;
    }

    return path;
  }, [points, minVal, maxVal, height]);

  const fillAreaPath = useMemo(() => {
    if (!svgPath) return '';
    const width = 500;
    const h = height - 10;
    return `${svgPath} L ${width} ${h} L 0 ${h} Z`;
  }, [svgPath, height]);

  const latestVal = points.length > 0 ? points[points.length - 1] : 0;

  return (
    <div className={`relative w-full select-none ${className}`}>
      {showLabels && (
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] pulse-blue-dot" />
            <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
              TELEMETRY // {dataKey.toUpperCase()}
            </span>
          </div>
          <span className="text-lg font-bold font-display text-white">
            {latestVal}
            <span className="text-xs text-[#00E5FF] font-mono ml-0.5">{unit}</span>
          </span>
        </div>
      )}

      <div className="relative w-full overflow-hidden" style={{ height }}>
        <svg
          viewBox={`0 0 500 ${height}`}
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {showGrid && (
            <g opacity="0.2">
              <line x1="0" y1={height * 0.25} x2="500" y2={height * 0.25} stroke="#555555" strokeDasharray="3 3" strokeWidth="0.8" />
              <line x1="0" y1={height * 0.5} x2="500" y2={height * 0.5} stroke="#555555" strokeDasharray="3 3" strokeWidth="0.8" />
              <line x1="0" y1={height * 0.75} x2="500" y2={height * 0.75} stroke="#555555" strokeDasharray="3 3" strokeWidth="0.8" />
            </g>
          )}

          {fillAreaPath && (
            <path
              d={fillAreaPath}
              fill={`url(#grad-${dataKey})`}
              className="transition-all duration-300 ease-out"
            />
          )}

          {svgPath && (
            <path
              d={svgPath}
              fill="none"
              stroke="#00E5FF"
              strokeWidth="2.0"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300 ease-out drop-shadow-[0_0_10px_rgba(0,229,255,0.6)]"
            />
          )}

          {points.length > 0 && (
            <g transform={`translate(500, ${height - 20 - ((latestVal - minVal) / (maxVal - minVal || 1)) * (height - 20) + 10})`}>
              <circle r="4.5" fill="#00E5FF" />
              <circle r="9" fill="none" stroke="#00E5FF" opacity="0.6" className="pulse-blue-dot" />
            </g>
          )}
        </svg>
      </div>

      {data.length > 0 && (
        <div className="flex justify-between text-[9px] font-mono text-neutral-400 mt-1">
          <span>{data[0]?.time}</span>
          <span className="text-[#00E5FF] font-semibold">LIVE BUFFER</span>
          <span>{data[data.length - 1]?.time}</span>
        </div>
      )}
    </div>
  );
};
