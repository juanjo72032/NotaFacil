import React, { useState } from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface Props {
  label: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Boton({
  label,
  onPress,
  color = '#2563EB',
  textColor = '#FFFFFF',
  style,
  textStyle,
  icon,
}: Props) {
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.button, { backgroundColor: pressed ? '#1D4ED8' : color }, style]}
      activeOpacity={0.85}
    >
      {icon}
      <Text style={[styles.text, { color: textColor }, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 8,
    elevation: 2,
  },
  text: { fontSize: 15, fontWeight: '700' },
});