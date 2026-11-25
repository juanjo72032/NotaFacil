import { Trash2 } from 'lucide-react-native';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { EvaluacionItem } from '../hooks/useNotafacil';
import { CustomText } from './CustomText';

interface Props {
  materiaId: string;
  evaluaciones: EvaluacionItem[];
  onUpdate: (matId: string, evId: string, campo: 'nombre' | 'nota' | 'peso', val: string) => void;
  onDelete: (matId: string, evId: string) => void;
}

export function Regilla({ materiaId, evaluaciones, onUpdate, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.headerGuide}>
        <CustomText variant="caption" style={{ flex: 2 }}>Insumo</CustomText>
        <CustomText variant="caption" style={[styles.center, { flex: 1, color: '#2563EB' }]}>Nota (0-10)</CustomText>
        <CustomText variant="caption" style={[styles.center, { flex: 0.9, color: '#D97706' }]}>Porcentaje %</CustomText>
        <View style={{ width: 24 }} />
      </View>

      {evaluaciones.map((ev) => {
        const notaVal = ev.nota ?? '';
        const pesoVal = ev.peso ?? '';
        const num = parseFloat(notaVal);
        const invalida = notaVal !== '' && (Number.isNaN(num) || num < 0 || num > 10);

        return (
          <View key={ev.id} style={[styles.row, invalida && styles.rowError]}>
            <TextInput
              style={styles.inputNombre}
              value={ev.nombre ?? ''}
              onChangeText={(v) => onUpdate(materiaId, ev.id, 'nombre', v)}
              placeholder="Evaluación"
              placeholderTextColor="#94A3B8"
            />
            <TextInput
              style={[styles.inputNum, invalida && styles.inputError]}
              value={notaVal}
              onChangeText={(v) => onUpdate(materiaId, ev.id, 'nota', v)}
              keyboardType="numeric"
              placeholder="0.0"
              placeholderTextColor="#94A3B8"
              maxLength={5}
            />
            <TextInput
              style={styles.inputNum}
              value={pesoVal}
              onChangeText={(v) => onUpdate(materiaId, ev.id, 'peso', v)}
              keyboardType="numeric"
              placeholder="%"
              placeholderTextColor="#94A3B8"
              maxLength={3}
            />
            <TouchableOpacity onPress={() => onDelete(materiaId, ev.id)} style={styles.delBtn}>
              <Trash2 size={15} color="#EF4444" />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 6 },
  headerGuide: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, marginBottom: 4 },
  center: { textAlign: 'center' },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8,
    backgroundColor: '#F8FAFC', padding: 6, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0',
  },
  rowError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  inputNombre: { flex: 2, height: 34, fontSize: 13, color: '#0F172A', paddingHorizontal: 6 },
  inputNum: {
    flex: 1, height: 34, backgroundColor: '#FFFFFF', borderWidth: 1,
    borderColor: '#CBD5E1', borderRadius: 6, textAlign: 'center', fontSize: 13, fontWeight: '600', color: '#0F172A',
  },
  inputError: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
  delBtn: { padding: 4 },
});