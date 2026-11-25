import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { calcularMateriasConMetricas, calcularPromedioGeneral } from '../utils/calculos';

export interface EvaluacionItem { id: string; nombre: string; nota: string; peso: string; }
export interface MateriaItem { id: string; nombreMateria: string; metaDeseada: string; evaluaciones: EvaluacionItem[]; }
export interface LibroNotas { id: string; nombreLibro: string; notaAprobacionMinima: string; materias: MateriaItem[]; }

const STORAGE_KEY = '@notafacil_libros_v4';
const LIBROS_INICIALES: LibroNotas[] = [{
  id: '1', nombreLibro: 'Primer Ciclo / Semestre 1', notaAprobacionMinima: '7.0',
  materias: [{
    id: 'm1', nombreMateria: 'Matemáticas', metaDeseada: '8.0',
    evaluaciones: [
      { id: 'e1', nombre: 'Parcial 1', nota: '8.5', peso: '40' },
      { id: 'e2', nombre: 'Proyecto', nota: '9.0', peso: '60' },
    ],
  }],
}];

function sanearLibros(raw: unknown): LibroNotas[] {
  if (!Array.isArray(raw) || raw.length === 0) return LIBROS_INICIALES;
  return raw.map((l: any, i: number) => ({
    id: String(l?.id ?? i + 1),
    nombreLibro: String(l?.nombreLibro ?? `Libro ${i + 1}`),
    notaAprobacionMinima: String(l?.notaAprobacionMinima ?? '7.0'),
    materias: Array.isArray(l?.materias) ? l.materias.map((m: any, j: number) => ({
      id: String(m?.id ?? `m_${j}`),
      nombreMateria: String(m?.nombreMateria ?? `Materia ${j + 1}`),
      metaDeseada: String(m?.metaDeseada ?? '8.0'),
      evaluaciones: Array.isArray(m?.evaluaciones) ? m.evaluaciones.map((e: any, k: number) => ({
        id: String(e?.id ?? `e_${k}`), nombre: String(e?.nombre ?? ''),
        nota: String(e?.nota ?? ''), peso: String(e?.peso ?? ''),
      })) : [],
    })) : [],
  }));
}

export const useNotafacil = () => {
  const [libros, setLibros] = useState<LibroNotas[]>(LIBROS_INICIALES);
  const [libroActivoId, setLibroActivoId] = useState<string>('1');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) { try { setLibros(sanearLibros(JSON.parse(data))); } catch {} }
    });
  }, []);

  useEffect(() => { AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(libros)); }, [libros]);

  const vibrar = () => { try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {} };
  const libroActual = libros.find((l) => l.id === libroActivoId) || libros[0];
  const mutarActual = (fn: (l: LibroNotas) => LibroNotas) =>
    setLibros((prev) => prev.map((l) => (l.id === libroActual.id ? fn(l) : l)));

  const crearNuevoLibro = (nombre: string, notaMin: string) => {
    if (!nombre.trim()) return;
    vibrar();
    const id = Date.now().toString();
    setLibros((prev) => [...prev, {
      id, nombreLibro: nombre.trim(), notaAprobacionMinima: (notaMin || '7.0').trim() || '7.0',
      materias: [{ id: `${id}_m`, nombreMateria: 'Nueva Materia', metaDeseada: '8.0',
        evaluaciones: [{ id: `${id}_e`, nombre: 'Parcial 1', nota: '', peso: '100' }] }],
    }]);
    setLibroActivoId(id);
  };

  const actualizarNotaAprobacionLibro = (val: string) =>
    mutarActual((l) => ({ ...l, notaAprobacionMinima: val ?? '' }));

  const agregarMateria = () => {
    vibrar();
    if (libroActual.materias.length >= 10) { setErrorMsg('Máximo 10 materias por libro.'); return; }
    setErrorMsg(null);
    const id = Date.now().toString();
    mutarActual((l) => ({ ...l, materias: [...l.materias, {
      id, nombreMateria: `Materia ${l.materias.length + 1}`, metaDeseada: '8.0',
      evaluaciones: [{ id: `${id}_1`, nombre: 'Evaluación 1', nota: '', peso: '100' }],
    }] }));
  };

  const actualizarMateriaCampo = (matId: string, campo: 'nombreMateria' | 'metaDeseada', val: string) =>
    mutarActual((l) => ({ ...l, materias: l.materias.map((m) => (m.id === matId ? { ...m, [campo]: val ?? '' } : m)) }));

  const eliminarMateria = (matId: string) => {
    vibrar();
    mutarActual((l) => ({ ...l, materias: l.materias.filter((m) => m.id !== matId) }));
  };

  const agregarEvaluacionAMateria = (matId: string) => {
    vibrar();
    setErrorMsg(null);
    mutarActual((l) => ({ ...l, materias: l.materias.map((m) => {
      if (m.id !== matId || m.evaluaciones.length >= 8) return m;
      return { ...m, evaluaciones: [...m.evaluaciones, {
        id: Date.now().toString(), nombre: `Insumo ${m.evaluaciones.length + 1}`, nota: '', peso: '' }] };
    }) }));
  };

  const actualizarEvaluacion = (matId: string, evId: string, campo: 'nombre' | 'nota' | 'peso', val: string) => {
    setErrorMsg(null);
    const limpio = val ?? '';
    if (campo === 'nota' && limpio !== '') {
      const n = parseFloat(limpio);
      if (Number.isNaN(n) || n < 0 || n > 10) setErrorMsg('La nota debe estar entre 0.00 y 10.00');
    }
    mutarActual((l) => ({ ...l, materias: l.materias.map((m) => m.id !== matId ? m : {
      ...m, evaluaciones: m.evaluaciones.map((e) => (e.id === evId ? { ...e, [campo]: limpio } : e)),
    }) }));
  };

  const eliminarEvaluacion = (matId: string, evId: string) => {
    vibrar();
    mutarActual((l) => ({ ...l, materias: l.materias.map((m) => m.id !== matId ? m : {
      ...m, evaluaciones: m.evaluaciones.filter((e) => e.id !== evId),
    }) }));
  };

  const notaMinimaNum = parseFloat(libroActual.notaAprobacionMinima) || 7.0;
  const calculoMaterias = calcularMateriasConMetricas(libroActual.materias, notaMinimaNum);
  const promedioGeneral = calcularPromedioGeneral(calculoMaterias);

  return {
    libros, libroActual, setLibroActivoId, crearNuevoLibro, actualizarNotaAprobacionLibro,
    agregarMateria, actualizarMateriaCampo, eliminarMateria, agregarEvaluacionAMateria,
    actualizarEvaluacion, eliminarEvaluacion, errorMsg, calculoMaterias, promedioGeneral, notaMinimaNum,
  };
};