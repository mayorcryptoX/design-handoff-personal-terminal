import React from 'react';
import Svg, { Polyline, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../../constants/tokens';

interface AreaChartProps {
  data: number[];
  width?: number;
  height?: number;
}

export function AreaChart({ data, width = 280, height = 84 }: AreaChartProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 6;

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * (width - pad * 2) + pad,
    y: height - pad - ((v - min) / range) * (height - pad * 3),
  }));

  const linePoints = pts.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPoints = [
    `${pts[0].x},${height}`,
    ...pts.map((p) => `${p.x},${p.y}`),
    `${pts[pts.length - 1].x},${height}`,
  ].join(' ');

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={Colors.textPrimary} stopOpacity="0.28" />
          <Stop offset="1" stopColor={Colors.textPrimary} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Polygon points={areaPoints} fill="url(#areaGrad)" />
      <Polyline points={linePoints} fill="none" stroke={Colors.textPrimary} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
