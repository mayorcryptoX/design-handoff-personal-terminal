import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../../constants/tokens';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  radius?: number;
  pad?: number;
}

export function Card({ children, style, radius = 20, pad = Spacing.cardPad }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        { borderRadius: radius, padding: pad },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.hairlineCard,
  },
});
