import React from 'react';
import { Text, StyleProp, TextStyle, StyleSheet } from 'react-native';
import { Colors } from '../../constants/tokens';

interface TProps { children: React.ReactNode; style?: StyleProp<TextStyle> }

export function Eyebrow({ children, style }: TProps) {
  return <Text style={[styles.eyebrow, style]}>{children}</Text>;
}

export function BigValue({ children, style }: TProps) {
  return <Text style={[styles.bigValue, style]}>{children}</Text>;
}

export function Title({ children, style }: TProps) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function Body({ children, style }: TProps) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

export function Caption({ children, style }: TProps) {
  return <Text style={[styles.caption, style]}>{children}</Text>;
}

export function Mono({ children, style }: TProps) {
  return <Text style={[styles.mono, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  eyebrow: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    letterSpacing: 1.76,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  bigValue: {
    fontFamily: 'SpaceMono',
    fontSize: 38,
    fontWeight: '500',
    letterSpacing: -0.76,
    color: Colors.textPrimary,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: -0.48,
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 14,
    lineHeight: 22.4,
    color: Colors.textNote,
  },
  caption: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  mono: {
    fontFamily: 'SpaceMono',
    fontSize: 13,
    color: Colors.textPrimary,
  },
});
