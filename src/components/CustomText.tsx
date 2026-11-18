import { StyleSheet, Text, type TextProps } from 'react-native';

interface Props extends TextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
}

export function CustomText({ children, variant = 'body', style, ...rest }: Props) {
  return (
    <Text
      style={[
        styles.base,
        variant === 'title' && styles.title,
        variant === 'subtitle' && styles.subtitle,
        variant === 'body' && styles.body,
        variant === 'caption' && styles.caption,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: { color: '#0F172A' },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 18, fontWeight: '700', color: '#334155' },
  body: { fontSize: 15, fontWeight: '500', color: '#475569' },
  caption: { fontSize: 12, fontWeight: '600', color: '#64748B' },
});