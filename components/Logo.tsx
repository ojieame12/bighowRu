import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { type ViewStyle } from 'react-native';
import { PATH_ktPT4, PATH_YpZaw, PATH_80Pc2 } from './logoPathData';

type Props = {
  width?: number;
  height?: number;
  style?: ViewStyle;
};

export function Logo({ width = 102.25, height = 42.73, style }: Props) {
  const scale = width / 102.25;
  const scaledHeight = 42.73 * scale;

  return (
    <Svg
      width={width}
      height={scaledHeight}
      viewBox="0 0 102.25 42.73"
      style={style}
    >
      <Defs>
        <LinearGradient id="logoGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#ff8d76" />
          <Stop offset="1" stopColor="#ef5b3b" />
        </LinearGradient>
      </Defs>
      <G>
        <Path d={PATH_ktPT4} fill="url(#logoGradient)" />
        <Path d={PATH_YpZaw} fill="#ef5a3c" x={4.948} y={4.948} />
        <Path d={PATH_80Pc2} fill="#ffffff" x={6.914} y={6.913} />
      </G>
    </Svg>
  );
}
