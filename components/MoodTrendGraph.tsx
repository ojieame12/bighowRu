import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Circle,
} from 'react-native-svg';
import { useMood } from '@/constants/MoodContext';
import { themeColors, typography } from '@/constants/tokens';

type DataPoint = {
  label: string; // "Mon", "Tue", etc.
  value: number; // 0-3 (matching checkin score range)
};

type Props = {
  data: DataPoint[];
  width?: number;
  height?: number;
};

/** Build a smooth cubic bezier path through the points */
function buildSmoothPath(
  points: { x: number; y: number }[],
): string {
  if (points.length < 2) return '';

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    const tension = 0.3;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return d;
}

export function MoodTrendGraph({ data, width = 280, height = 120 }: Props) {
  const { themed } = useMood();
  const lineColor = themed(themeColors.accent);
  const dotColor = themed(themeColors.accent);
  const labelColor = themed(themeColors.moodTextSecondary);
  const idRef = useRef(`trendFill-${Math.random().toString(36).slice(2, 8)}`);
  const fillId = idRef.current;

  const padX = 16;
  const padTop = 16;
  const padBottom = 24;
  const graphW = width - padX * 2;
  const graphH = height - padTop - padBottom;
  const maxVal = 3;

  const points = data.map((d, i) => ({
    x: padX + (i / Math.max(data.length - 1, 1)) * graphW,
    y: padTop + graphH - (d.value / maxVal) * graphH,
  }));

  const linePath = buildSmoothPath(points);

  // Fill path: line path → close at bottom
  const fillPath = linePath
    ? `${linePath} L ${points[points.length - 1].x} ${padTop + graphH} L ${points[0].x} ${padTop + graphH} Z`
    : '';

  return (
    <View style={{ width, height: height + 4 }}>
      <Svg width={width} height={height}>
        <Defs>
          <SvgGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={lineColor} stopOpacity="0.25" />
            <Stop offset="1" stopColor={lineColor} stopOpacity="0.02" />
          </SvgGradient>
        </Defs>

        {/* Gradient fill under curve */}
        {fillPath ? (
          <Path d={fillPath} fill={`url(#${fillId})`} />
        ) : null}

        {/* Smooth line */}
        {linePath ? (
          <Path
            d={linePath}
            stroke={lineColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : null}

        {/* Dots at each point */}
        {points.map((p, i) => (
          <React.Fragment key={i}>
            {/* Outer glow */}
            <Circle
              cx={p.x}
              cy={p.y}
              r={6}
              fill={dotColor}
              opacity={0.15}
            />
            {/* Inner dot */}
            <Circle
              cx={p.x}
              cy={p.y}
              r={3}
              fill="#FFFFFF"
              stroke={dotColor}
              strokeWidth={2}
            />
          </React.Fragment>
        ))}
      </Svg>

      {/* Day labels */}
      <View style={[styles.labels, { paddingHorizontal: padX }]}>
        {data.map((d, i) => (
          <Text
            key={i}
            style={[
              styles.label,
              { color: labelColor },
              i === data.length - 1 && styles.labelLatest,
            ]}
          >
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -18,
  },
  label: {
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  labelLatest: {
    fontWeight: '700',
    opacity: 1,
  },
});
