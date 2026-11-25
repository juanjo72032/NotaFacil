import { AlertCircle, BookOpen, FolderPlus, Plus, Settings, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Boton } from '../components/Boton';
import { CustomText } from '../components/CustomText';
import { Display } from '../components/Display';
import { Regilla } from '../components/Regilla';
import { useNotafacil } from '../hooks/useNotafacil';

export default function NotaFacilScreen() {
  const {
    libros, libroActual, setLibroActivoId, crearNuevoLibro, actualizarNotaAprobacionLibro,
    agregarMateria, actualizarMateriaCampo, eliminarMateria, agregarEvaluacionAMateria,
    actualizarEvaluacion, eliminarEvaluacion, errorMsg, calculoMaterias, promedioGeneral, notaMinimaNum,
  } = useNotafacil();

  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaMetaMin, setNuevaMetaMin] = useState('7.0');

  const guardarLibro = () => {
    if (!nuevoNombre.trim()) return;
    crearNuevoLibro(nuevoNombre, nuevaMetaMin);
    setNuevoNombre('');
    setNuevaMetaMin('7.0');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleRow}><BookOpen size={26} color="#2563EB" /><CustomText variant="title">NotaFácil</CustomText></View>
          <CustomText variant="caption">Libros, Materias e Insumos con Guardado Local</CustomText>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <CustomText variant="caption">LIBRO ACTIVO</CustomText>
              <CustomText variant="subtitle" style={styles.libroTitle}>{libroActual.nombreLibro}</CustomText>
            </View>
            <TouchableOpacity style={styles.newBookBtn} onPress={() => setModalVisible(true)}>
              <FolderPlus size={16} color="#FFFFFF" /><CustomText style={styles.newBookText}>Nuevo Libro</CustomText>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
            {libros.map((l) => {
              const activa = l.id === libroActual.id;
              return (
                <TouchableOpacity key={l.id} style={[styles.chip, activa && styles.chipActive]} onPress={() => setLibroActivoId(l.id)}>
                  <CustomText style={[styles.chipText, activa && styles.chipTextActive]}>{l.nombreLibro}</CustomText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={styles.ruleRow}>
            <View style={styles.ruleLabel}><Settings size={14} color="#64748B" /><CustomText variant="caption">Nota para aprobar:</CustomText></View>
            <TextInput style={styles.ruleInput} value={libroActual.notaAprobacionMinima ?? ''} onChangeText={actualizarNotaAprobacionLibro} keyboardType="numeric" maxLength={4} />
          </View>
        </View>

        <Display promedio={promedioGeneral} notaMinima={notaMinimaNum} totalMaterias={calculoMaterias.length} />

        {errorMsg && <View style={styles.errBox}><AlertCircle size={17} color="#EF4444" /><CustomText style={styles.errText}>{errorMsg}</CustomText></View>}

        <CustomText variant="subtitle" style={styles.secTitle}>Materias ({calculoMaterias.length})</CustomText>
        {calculoMaterias.map((mat) => {
          const ok = mat.promedioMateria >= notaMinimaNum;
          const badgeBg = mat.sumaPesos === 100 ? (ok ? '#D1FAE5' : '#FEE2E2') : '#FEF3C7';
          const badgeFg = mat.sumaPesos === 100 ? (ok ? '#065F46' : '#991B1B') : '#B45309';
          return (
            <View key={mat.id} style={styles.card}>
              <View style={styles.rowBetween}>
                <TextInput style={styles.matInput} value={mat.nombreMateria ?? ''} onChangeText={(v) => actualizarMateriaCampo(mat.id, 'nombreMateria', v)} placeholder="Materia" placeholderTextColor="#94A3B8" />
                <View style={styles.matRight}>
                  <View style={[styles.badge, { backgroundColor: badgeBg }]}><CustomText style={{ fontSize: 12, fontWeight: '800', color: badgeFg }}>{mat.sumaPesos === 100 ? mat.promedioMateria.toFixed(2) : `${mat.sumaPesos}%`}</CustomText></View>
                  <TouchableOpacity onPress={() => eliminarMateria(mat.id)}><Trash2 size={18} color="#EF4444" /></TouchableOpacity>
                </View>
              </View>
              <Regilla materiaId={mat.id} evaluaciones={mat.evaluaciones} onUpdate={actualizarEvaluacion} onDelete={eliminarEvaluacion} />
              <TouchableOpacity style={styles.addEvalBtn} onPress={() => agregarEvaluacionAMateria(mat.id)}>
                <Plus size={14} color="#2563EB" /><CustomText style={styles.addEvalText}>Agregar Insumo</CustomText>
              </TouchableOpacity>
            </View>
          );
        })}

        <Boton label="Agregar Materia" onPress={agregarMateria} icon={<Plus size={20} color="#FFFFFF" />} />
      </ScrollView>

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <CustomText variant="subtitle">Nuevo Libro / Semestre</CustomText>
            <TextInput style={styles.mInput} value={nuevoNombre} onChangeText={setNuevoNombre} placeholder="Ej. Quimestre 2" placeholderTextColor="#94A3B8" />
            <CustomText variant="caption">Nota mínima para aprobar</CustomText>
            <TextInput style={styles.mInput} value={nuevaMetaMin} onChangeText={setNuevaMetaMin} keyboardType="numeric" maxLength={4} />
            <View style={styles.mActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.mCancel}><CustomText style={{ color: '#64748B', fontWeight: '700' }}>Cancelar</CustomText></TouchableOpacity>
              <TouchableOpacity onPress={guardarLibro} style={styles.mSave}><CustomText style={{ color: '#FFFFFF', fontWeight: '700' }}>Crear</CustomText></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' }, scroll: { padding: 18, paddingBottom: 36 },
  header: { marginBottom: 14 }, titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', elevation: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  libroTitle: { fontSize: 16, color: '#0F172A', marginTop: 2 },
  newBookBtn: { backgroundColor: '#2563EB', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  newBookText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  chips: { flexDirection: 'row', marginTop: 10, marginBottom: 10 },
  chip: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginRight: 8, borderWidth: 1, borderColor: '#CBD5E1' },
  chipActive: { backgroundColor: '#EFF6FF', borderColor: '#2563EB' },
  chipText: { fontSize: 12, fontWeight: '600', color: '#475569' }, chipTextActive: { color: '#2563EB' },
  ruleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10 },
  ruleLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ruleInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, width: 58, height: 32, textAlign: 'center', fontWeight: '700', color: '#0F172A' },
  errBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FCA5A5', borderRadius: 12, padding: 10, marginBottom: 12 },
  errText: { color: '#991B1B', fontSize: 12, fontWeight: '600', flex: 1 }, secTitle: { marginBottom: 10 },
  matInput: { flex: 1, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 10, height: 38, fontWeight: '700', color: '#0F172A' },
  matRight: { flexDirection: 'row', alignItems: 'center', gap: 8 }, badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  addEvalBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingTop: 6 }, addEvalText: { fontSize: 12, fontWeight: '700', color: '#2563EB' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18, width: '100%', maxWidth: 340, gap: 8 },
  mInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, height: 40, paddingHorizontal: 12, fontWeight: '600', color: '#0F172A' },
  mActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 6 },
  mCancel: { paddingVertical: 8, paddingHorizontal: 12 }, mSave: { backgroundColor: '#2563EB', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
});