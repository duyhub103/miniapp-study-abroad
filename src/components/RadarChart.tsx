"use client";

import { useEffect, useState } from "react";

interface RadarChartProps {
  scores: {
    academics: number;
    language: number;
    finance: number;
    timeline: number;
    direction: number;
  };
}

const DIMENSIONS = [
  { key: "academics", label: "Học lực", icon: "🎓" },
  { key: "language", label: "Ngoại ngữ", icon: "🗣️" },
  { key: "finance", label: "Tài chính", icon: "💰" },
  { key: "timeline", label: "Thời gian", icon: "⏳" },
  { key: "direction", label: "Định hướng", icon: "🎯" },
] as const;

const MAX_SCORE = 5;
const CENTER_X = 170;
const CENTER_Y = 150;
const RADIUS = 80;
const LEVELS = [1, 2, 3, 4, 5];

function polarToCartesian(angle: number, radius: number): { x: number; y: number } {
  // Start from top (-90°), go clockwise
  const radian = ((angle - 90) * Math.PI) / 180;
  return {
    x: CENTER_X + radius * Math.cos(radian),
    y: CENTER_Y + radius * Math.sin(radian),
  };
}

function getScoreColor(avg: number): { fill: string; stroke: string; glow: string } {
  if (avg >= 4) return { fill: "rgba(16, 185, 129, 0.2)", stroke: "#10b981", glow: "#10b981" };
  if (avg >= 3) return { fill: "rgba(59, 130, 246, 0.2)", stroke: "#3b82f6", glow: "#3b82f6" };
  if (avg >= 2) return { fill: "rgba(245, 158, 11, 0.2)", stroke: "#f59e0b", glow: "#f59e0b" };
  return { fill: "rgba(244, 63, 94, 0.2)", stroke: "#f43f5e", glow: "#f43f5e" };
}

function getScoreLabel(avg: number): { text: string; color: string } {
  if (avg >= 4) return { text: "Xuất sắc", color: "text-emerald-600" };
  if (avg >= 3) return { text: "Khá tốt", color: "text-blue-600" };
  if (avg >= 2) return { text: "Cần cải thiện", color: "text-amber-600" };
  return { text: "Cần nỗ lực", color: "text-rose-600" };
}

export default function RadarChart({ scores }: RadarChartProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const dims = DIMENSIONS.map((d, i) => ({
    ...d,
    score: scores[d.key as keyof typeof scores],
    angle: (360 / DIMENSIONS.length) * i,
  }));

  const avgScore = dims.reduce((sum, d) => sum + d.score, 0) / dims.length;
  const colors = getScoreColor(avgScore);
  const label = getScoreLabel(avgScore);

  // Build polygon points for the data shape
  const dataPoints = dims.map((d) => {
    const r = animated ? (d.score / MAX_SCORE) * RADIUS : 0;
    return polarToCartesian(d.angle, r);
  });
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";

  // Build grid level polygons
  const gridPaths = LEVELS.map((level) => {
    const points = dims.map((d) => {
      const r = (level / MAX_SCORE) * RADIUS;
      return polarToCartesian(d.angle, r);
    });
    return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-2">
        <span className="text-base">📊</span>
        Biểu đồ năng lực
      </h3>

      <div className="flex flex-col items-center">
        {/* SVG Radar */}
        <svg viewBox="0 0 340 290" className="w-full max-w-[340px]">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid levels */}
          {gridPaths.map((path, i) => (
            <path
              key={`grid-${i}`}
              d={path}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={i === LEVELS.length - 1 ? 1.5 : 0.5}
              strokeDasharray={i === LEVELS.length - 1 ? "none" : "3,3"}
            />
          ))}

          {/* Axis lines */}
          {dims.map((d, i) => {
            const end = polarToCartesian(d.angle, RADIUS);
            return (
              <line
                key={`axis-${i}`}
                x1={CENTER_X}
                y1={CENTER_Y}
                x2={end.x}
                y2={end.y}
                stroke="#e2e8f0"
                strokeWidth={0.5}
              />
            );
          })}

          {/* Data polygon */}
          <path
            d={dataPath}
            fill={colors.fill}
            stroke={colors.stroke}
            strokeWidth={2}
            strokeLinejoin="round"
            filter="url(#glow)"
            className="transition-all duration-1000 ease-out"
          />

          {/* Data points */}
          {dataPoints.map((p, i) => (
            <circle
              key={`point-${i}`}
              cx={p.x}
              cy={p.y}
              r={animated ? 4 : 0}
              fill="white"
              stroke={colors.stroke}
              strokeWidth={2}
              className="transition-all duration-1000 ease-out"
            />
          ))}

          {/* Labels */}
          {dims.map((d, i) => {
            const pos = polarToCartesian(d.angle, RADIUS + 24);
            // Adjust text anchor based on position
            let anchor: "middle" | "end" | "start" = "middle";
            if (pos.x < CENTER_X - 10) anchor = "end";
            else if (pos.x > CENTER_X + 10) anchor = "start";

            return (
              <g key={`label-${i}`}>
                <text
                  x={pos.x}
                  y={pos.y - 6}
                  textAnchor={anchor}
                  className="text-[10px] fill-slate-500 font-medium"
                >
                  {d.icon} {d.label}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 8}
                  textAnchor={anchor}
                  className="text-[11px] font-bold"
                  fill={colors.stroke}
                >
                  {d.score.toFixed(1)}/5
                </text>
              </g>
            );
          })}

          {/* Center score */}
          <text
            x={CENTER_X}
            y={CENTER_Y - 4}
            textAnchor="middle"
            className="text-[20px] font-black"
            fill={colors.stroke}
          >
            {avgScore.toFixed(1)}
          </text>
          <text
            x={CENTER_X}
            y={CENTER_Y + 12}
            textAnchor="middle"
            className="text-[9px] fill-slate-400 font-medium"
          >
            /5.0
          </text>
        </svg>

        {/* Overall label */}
        <div className={`text-center -mt-2 mb-1`}>
          <span className={`text-sm font-bold ${label.color}`}>{label.text}</span>
          <p className="text-xs text-slate-400 mt-0.5">Điểm đánh giá tổng hợp</p>
        </div>
      </div>
    </div>
  );
}
