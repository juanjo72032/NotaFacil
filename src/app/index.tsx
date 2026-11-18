import { AlertCircle, BookOpen, FolderPlus, Plus, Settings, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Boton } from '../components/Boton';
import { CustomText } from '../components/CustomText';
import { Regilla } from '../components/Regilla';
import { useNotafacil } from '../hooks/useNotafacil';

export default function NotaFacilScreen() {
  const {
    libros,
    libroActual,
    setLibroActivoId,
    crearNuevoLibro,
    actualizarNotaAprobacionLibro,
    agregarMateria,
    actualizarMateriaCampo,
    agregarEvaluacionAMateria,
    actualizarEvaluacion,
    eliminarEvaluacion,
    eliminarMateria,
    errorMsg,
    calculoMaterias,
    promedioGeneral,
    notaMinimaNum,
  } = useNotafacil();

  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoLibroNombre, setNuevoLibroNombre] = useState('');
  const [nuevaNotaMinima, setNuevaNotaMinima] = useState('7.0');

  const handleCrearLibro = () => {
    if (nuevoLibroNombre.trim()) {
      crearNuevoLibro(nuevoLibroNombre, nuevaNotaMinima);
      setNuevoLibroNombre('');
      setNuevaNotaMinima('7.0');
      setModalVisible(false);
    }
  };

  const esGeneralAprobado = promedioGeneral >= notaMinimaNum;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View style={styles.appTitleRow}>
            <BookOpen size={28} color="#2563EB" />
            <CustomText variant="title" style={styles.mainTitle}>NotaFácil</CustomText>
          </View>
          <CustomText variant="caption">Gestor Académico Multi-Libro con Reglas Personalizables</CustomText>
        </View>

        {/* Selector de Libro / Historial */}
        <View style={styles.libroCard}>
          <View style={styles.libroRow}>
            <View style={{ flex: 1 }}>
              <CustomText variant="caption">LIBRO / SEMESTRE ACTIVO</CustomText>
              <CustomText variant="subtitle" style={styles.libroNameText}>{libroActual.nombreLibro}</CustomText>
            </View>
            <TouchableOpacity 
              style={styles.nuevoLibroBtn} 
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <FolderPlus size={18} color="#FFFFFF" />
              <CustomText style={styles.nuevoLibroBtnText}>Nuevo Libro</CustomText>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.librosScroll}>
            {libros.map((l) => (
              <TouchableOpacity
                key={l.id}
                style={[styles.libroChip, l.id === libroActual.id && styles.libroChipActive]}
                onPress={() => setLibroActivoId(l.id)}
              >
                <CustomText style={[styles.libroChipText, l.id === libroActual.id && styles.libroChipTextActive]}>
                  {l.nombreLibro}
                </CustomText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.configAprobacionRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Settings size={14} color="#64748B" />
              <CustomText variant="caption">Nota mínima para aprobar:</CustomText>
            </View>
            <TextInput
              style={styles.inputNotaMinima}
              value={libroActual.notaAprobacionMinima}
              onChangeText={actualizarNotaAprobacionLibro}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>
        </View>

        {/* Tarjeta de Promedio General */}
        <View style={[styles.cardGeneral, { borderColor: esGeneralAprobado ? '#10B981' : '#EF4444' }]}>
          <View style={styles.row}>
            <View>
              <CustomText variant="caption">PROMEDIO GENERAL DEL LIBRO</CustomText>
              <CustomText variant="title" style={styles.scoreText}>
                {promedioGeneral.toFixed(2)} <CustomText style={styles.maxScore}>/ 10</CustomText>
              </CustomText>
            </View>
            <View style={[styles.badge, { backgroundColor: esGeneralAprobado ? '#D1FAE5' : '#FEE2E2' }]}>
              <CustomText style={[styles.badgeText, { color: esGeneralAprobado ? '#065F46' : '#991B1B' }]}>
                {esGeneralAprobado ? '✓ GENERAL APROBADO' : '⚠ EN RIESGO'}
              </CustomText>
            </View>
          </View>
        </View>

        {errorMsg && (
          <View style={styles.errorBox}>
            <AlertCircle size={18} color="#EF4444" />
            <CustomText style={styles.errorText}>{errorMsg}</CustomText>
          </View>
        )}

        <CustomText variant="subtitle" style={styles.sectionTitle}>Materias Registradas ({calculoMaterias.length})</CustomText>

        {calculoMaterias.map((mat) => {
          const esMateriaAprobada = mat.promedioMateria >= notaMinimaNum;
          return (
            <View key={mat.id} style={styles.materiaCard}>
              <View style={styles.materiaHeader}>
                <TextInput
                  style={styles.inputMateriaNombre}
                  value={mat.nombreMateria}
                  onChangeText={(val) => actualizarMateriaCampo(mat.id, 'nombreMateria', val)}
                  placeholder="Nombre de Materia"
                  placeholderTextColor="#94A3B8"
                />
                <View style={styles.materiaHeaderRight}>
                  <View style={[styles.miniBadge, { backgroundColor: mat.sumaPesos === 100 ? (esMateriaAprobada ? '#D1FAE5' : '#FEE2E2') : '#FEF3C7' }]}>
                    <CustomText style={[styles.miniBadgeText, { color: mat.sumaPesos === 100 ? (esMateriaAprobada ? '#065F46' : '#991B1B') : '#B45309' }]}>
                      {mat.sumaPesos === 100 ? `${mat.promedioMateria.toFixed(2)}` : `${mat.sumaPesos}%`}
                    </CustomText>
                  </View>
                  <TouchableOpacity onPress={() => eliminarMateria(mat.id)} style={styles.deleteMateriaBtn}>
                    <Trash2 size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Aquí usamos tu componente modular Regilla.tsx */}
              <Regilla
                materiaId={mat.id}
                evaluaciones={mat.evaluaciones}
                onUpdate={actualizarEvaluacion}
                onDelete={eliminarEvaluacion}
              />

              <TouchableOpacity 
                style={styles.addEvalBtn} 
                onPress={() => agregarEvaluacionAMateria(mat.id)}
                activeOpacity={0.7}
              >
                <Plus size={14} color="#2563EB" />
                <CustomText style={styles.addEvalText}>Agregar Insumo / Evaluación</CustomText>
              </TouchableOpacity>
            </View>
          );
        })}

        <Boton
          label="Agregar Nueva Materia"
          onPress={agregarMateria}
          color="#2563EB"
          style={styles.addMateriaButton}
          icon={<Plus size={20} color="#FFFFFF" />}
        />

      </ScrollView>

      {/* Modal para Crear Nuevo Libro */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <CustomText variant="subtitle" style={styles.modalTitle}>Crear Nuevo Libro</CustomText>
            <CustomText variant="caption" style={{ marginBottom: 10 }}>
              Define el nombre y la nota mínima requerida para aprobar.
            </CustomText>
            
            <CustomText variant="caption" style={{ marginBottom: 2 }}>Nombre del Libro / Semestre</CustomText>
            <TextInput
              style={styles.modalInput}
              value={nuevoLibroNombre}
              onChangeText={setNuevoLibroNombre}
              placeholder="Ej. Segundo Quimestre"
              placeholderTextColor="#94A3B8"
            />

            <CustomText variant="caption" style={{ marginBottom: 2 }}>Nota Mínima de Aprobación</CustomText>
            <TextInput
              style={styles.modalInput}
              value={nuevaNotaMinima}
              onChangeText={setNuevaNotaMinima}
              keyboardType="numeric"
              placeholder="7.0"
              placeholderTextColor="#94A3B8"
              maxLength={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setModalVisible(false)}>
                <CustomText style={{ color: '#64748B', fontWeight: '700' }}>Cancelar</CustomText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleCrearLibro}>
                <CustomText style={{ color: '#FFFFFF', fontWeight: '700' }}>Crear Libro</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 16 },
  appTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 2 },
  mainTitle: { fontSize: 26, color: '#0F172A' },
  libroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    elevation: 2,
  },
  libroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  libroNameText: { fontSize: 16, color: '#1E293B', marginTop: 2 },
  nuevoLibroBtn: { backgroundColor: '#2563EB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, gap: 6 },
  nuevoLibroBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  librosScroll: { flexDirection: 'row', marginTop: 4, marginBottom: 12 },
  libroChip: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginRight: 8, borderWidth: 1, borderColor: '#CBD5E1' },
  libroChipActive: { backgroundColor: '#EFF6FF', borderColor: '#2563EB' },
  libroChipText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  libroChipTextActive: { color: '#2563EB' },
  configAprobacionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10 },
  inputNotaMinima: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, width: 60, height: 32, textAlign: 'center', fontWeight: '700', fontSize: 13, color: '#0F172A' },
  cardGeneral: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 2,
    elevation: 3,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scoreText: { fontSize: 32, color: '#0F172A', marginTop: 2 },
  maxScore: { fontSize: 16, color: '#94A3B8', fontWeight: '600' },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  errorText: { color: '#991B1B', fontSize: 12, fontWeight: '600', flex: 1 },
  sectionTitle: { marginBottom: 10, color: '#0F172A' },
  materiaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  materiaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8 },
  inputMateriaNombre: { flex: 1, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 10, height: 38, fontSize: 14, fontWeight: '700', color: '#0F172A' },
  materiaHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  miniBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  miniBadgeText: { fontSize: 12, fontWeight: '800' },
  deleteMateriaBtn: { padding: 4 },
  addEvalBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 6, gap: 4, marginTop: 4 },
  addEvalText: { fontSize: 12, fontWeight: '700', color: '#2563EB' },
  addMateriaButton: { marginTop: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, width: '100%', maxWidth: 340, elevation: 5 },
  modalTitle: { fontSize: 18, marginBottom: 4, color: '#0F172A' },
  modalInput: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 12, height: 42, fontSize: 14, backgroundColor: '#F8FAFC', marginBottom: 14, color: '#0F172A', fontWeight: '600' },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 4 },
  modalCancelBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  modalSaveBtn: { backgroundColor: '#2563EB', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
});