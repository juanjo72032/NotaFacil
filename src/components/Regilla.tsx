import { Trash2 } from 'lucide-react-native';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { EvaluacionItem } from '../hooks/useNotafacil';
import { CustomText } from './CustomText';

interface Props {
  materiaId: string;
  evaluaciones: EvaluacionItem[];
  onUpdate: (materiaId: string, evalId: string, campo: 'nombre' | 'nota' | 'peso', valor: string) => void;
  onDelete: (materiaId: string, evalId: string) => void;
}

export function Regilla({ materiaId, evaluaciones, onUpdate, onDelete }: Props) {
  return (
    <View style={styles.container}>
      {/* Guía visual indicando dónde va la Nota y el Porcentaje */}
      <View style={styles.tableHeaderGuide}>
        <CustomText variant="caption" style={{ flex: 2 }}>Insumo / Evaluación</CustomText>
        <CustomText variant="caption" style={{ flex: 1, textAlign: 'center', color: '#2563EB' }}>Nota (0-10)</CustomText>
        <CustomText variant="caption" style={{ flex: 0.9, textAlign: 'center', color: '#D97706' }}>Porcentaje %</CustomText>
        <View style={{ width: 24 }} />
      </View>

      {evaluaciones.map((ev) => {
        const notaNum = parseFloat(ev.nota);
        const errorNota = ev.nota !== '' && (isNaN(notaNum) || notaNum < 0 || notaNum > 10);

        return (
          <View key={ev.id} style={[styles.evalRow, errorNota && styles.evalErrorBorder]}>
            <TextInput
              style={styles.inputEvalNombre}
              value={ev.nombre}
              onChangeText={(val) => onUpdate(materiaId, ev.id, 'nombre', val)}
              placeholder="Nombre"
              placeholderTextColor="#94A3B8"
            />
            <TextInput
              style={[styles.inputEvalNota, errorNota && styles.inputErrorBg]}
              value={ev.nota}
              onChangeText={(val) => onUpdate(materiaId, ev.id, 'nota', val)}
              keyboardType="numeric"
              placeholder="0.0"
              placeholderTextColor="#94A3B8"
              maxLength={5}
            />
            <TextInput
              style={styles.inputEvalPeso}
              value={ev.peso}
              onChangeText={(val) => onUpdate(materiaId, ev.id, 'peso', val)}
              keyboardType="numeric"
              placeholder="%"
              placeholderTextColor="#94A3B8"
              maxLength={3}
            />
            <TouchableOpacity onPress={() => onDelete(materiaId, ev.id)} style={styles.deleteEvalBtn}>
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
  tableHeaderGuide: { flexDirection: 'row', paddingHorizontal: 4, marginBottom: 4, alignItems: 'center' },
  evalRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8, backgroundColor: '#F8FAFC', padding: 6, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  evalErrorBorder: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  inputEvalNombre: { flex: 2, height: 34, fontSize: 13, color: '#0F172A', paddingHorizontal: 6 },
  inputEvalNota: { flex: 1, height: 34, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 6, textAlign: 'center', fontSize: 13, fontWeight: '600', color: '#0F172A' },
  inputEvalPeso: { flex: 0.9, height: 34, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 6, textAlign: 'center', fontSize: 13, fontWeight: '600', color: '#0F172A' },
  inputErrorBg: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
  deleteEvalBtn: { padding: 4 },
});