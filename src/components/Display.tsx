import { StyleSheet, View } from 'react-native';
import { CustomText } from './CustomText';

interface Props {
  promedio: number;
  notaMinima: number;
  totalMaterias: number;
}

export function Display({ promedio, notaMinima, totalMaterias }: Props) {
  const aprobado = promedio >= notaMinima;
  const colorEstado = aprobado ? '#10B981' : '#EF4444';

  return (
    <View style={[styles.card, { borderColor: colorEstado }]}>
      <View style={styles.row}>
        <View>
          <CustomText variant="caption">PROMEDIO GENERAL ({totalMaterias} MATERIAS)</CustomText>
          <CustomText variant="title" style={styles.score}>
            {promedio.toFixed(2)} <CustomText style={styles.max}>/ 10</CustomText>
          </CustomText>
        </View>
        <View style={[styles.badge, { backgroundColor: aprobado ? '#D1FAE5' : '#FEE2E2' }]}>
          <CustomText style={[styles.badgeText, { color: aprobado ? '#065F46' : '#991B1B' }]}>
            {aprobado ? '✓ APROBADO' : '⚠ EN RIESGO'}
          </CustomText>
        </View>
      </View>
      <CustomText variant="caption" style={styles.ruleText}>
        Regla de aprobación activa: mínimo {notaMinima.toFixed(1)}
      </CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 2,
    elevation: 2,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  score: { fontSize: 32, color: '#0F172A', marginTop: 2 },
  max: { fontSize: 16, color: '#94A3B8', fontWeight: '600' },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  badgeText: { fontSize: 11, fontWeight: '800' },
  ruleText: { marginTop: 8, color: '#475569' },
});