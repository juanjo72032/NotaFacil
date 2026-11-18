import { StyleSheet, View } from 'react-native';
import { CustomText } from './CustomText';

interface Props {
  promedio: number;
  sumaPesos: number;
  estadoSimulador: string;
  notaNecesaria: number;
  meta: string;
}

export function Display({ promedio, sumaPesos, estadoSimulador, notaNecesaria, meta }: Props) {
  const esAprobado = promedio >= 7.0;

  return (
    <View style={[styles.card, { borderColor: sumaPesos === 100 ? (esAprobado ? '#10B981' : '#EF4444') : '#3B82F6' }]}>
      <View style={styles.row}>
        <View>
          <CustomText variant="caption">PROMEDIO PONDERADO</CustomText>
          <CustomText variant="title" style={styles.scoreText}>
            {promedio.toFixed(2)} <CustomText style={styles.maxScore}>/ 10</CustomText>
          </CustomText>
        </View>
        <View style={[styles.badge, { backgroundColor: sumaPesos === 100 ? (esAprobado ? '#D1FAE5' : '#FEE2E2') : '#DBEAFE' }]}>
          <CustomText style={[styles.badgeText, { color: sumaPesos === 100 ? (esAprobado ? '#065F46' : '#991B1B') : '#1E40AF' }]}>
            {sumaPesos === 100 ? (esAprobado ? '✓ APROBADO' : '⚠ EN RIESGO') : `${sumaPesos}% / 100%`}
          </CustomText>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.simulatorInfo}>
        <CustomText variant="caption">SIMULADOR DE META (OBJETIVO: {meta})</CustomText>
        {sumaPesos === 100 ? (
          <CustomText variant="body" style={styles.simResult}>
            {esAprobado ? '🎉 ¡Has superado la meta establecida!' : '⚠️ Promedio por debajo de la meta mínima.'}
          </CustomText>
        ) : estadoSimulador === 'imposible' ? (
          <CustomText variant="body" style={[styles.simResult, { color: '#EF4444' }]}>
            ❌ Nota imposible: requieres más de 10 en el resto.
          </CustomText>
        ) : (
          <CustomText variant="body" style={styles.simResult}>
            🎯 Necesitas sacar al menos <CustomText style={styles.highlight}>{notaNecesaria.toFixed(2)}</CustomText> en el {100 - sumaPesos}% restante.
          </CustomText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scoreText: { fontSize: 36, color: '#0F172A', marginTop: 4 },
  maxScore: { fontSize: 18, color: '#94A3B8', fontWeight: '600' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },
  simulatorInfo: { gap: 4 },
  simResult: { fontSize: 14, color: '#334155', marginTop: 2 },
  highlight: { fontWeight: '800', color: '#2563EB' },
});