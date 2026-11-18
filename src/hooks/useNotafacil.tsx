import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';

export interface EvaluacionItem {
  id: string;
  nombre: string;
  nota: string;
  peso: string;
}

export interface MateriaItem {
  id: string;
  nombreMateria: string;
  metaDeseada: string;
  evaluaciones: EvaluacionItem[];
}

export interface LibroNotas {
  id: string;
  nombreLibro: string;
  notaAprobacionMinima: string;
  materias: MateriaItem[];
}

const STORAGE_KEY = '@notafacil_libros_v3';

export const useNotafacil = () => {
  const [libros, setLibros] = LibroNotasInit();
  const [libroActivoId, setLibroActivoId] = useState<string>('1');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function LibroNotasInit() {
    return useState<LibroNotas[]>([
      {
        id: '1',
        nombreLibro: 'Primer Ciclo / Semestre 1',
        notaAprobacionMinima: '7.0',
        materias: [
          {
            id: 'm1',
            nombreMateria: 'Matemáticas',
            metaDeseada: '8.0',
            evaluaciones: [
              { id: 'e1', nombre: 'Parcial 1', nota: '8.5', peso: '40' },
              { id: 'e2', nombre: 'Proyecto', nota: '9.0', peso: '60' },
            ],
          },
        ],
      },
    ]);
  }

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed.length > 0) {
            // Aseguramos que ningún campo cargado desde AsyncStorage sea undefined
            const sanitized = parsed.map((libro: any) => ({
              ...libro,
              notaAprobacionMinima: libro.notaAprobacionMinima ?? '7.0',
              materias: libro.materias.map((mat: any) => ({
                ...mat,
                nombreMateria: mat.nombreMateria ?? '',
                metaDeseada: mat.metaDeseada ?? '8.0',
                evaluaciones: mat.evaluaciones.map((ev: any) => ({
                  ...ev,
                  nombre: ev.nombre ?? '',
                  nota: ev.nota ?? '',
                  peso: ev.peso ?? '',
                })),
              })),
            }));
            setLibros(sanitized);
          }
        } catch (e) {}
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(libros));
  }, [libros]);

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
  };

  const libroActual = libros.find((l) => l.id === libroActivoId) || libros[0];

  const crearNuevoLibro = (nombrePersonalizado: string, notaMinima: string) => {
    triggerHaptic();
    if (!nombrePersonalizado.trim()) return;
    const nuevoLibro: LibroNotas = {
      id: Date.now().toString(),
      nombreLibro: nombrePersonalizado,
      notaAprobacionMinima: notaMinima.trim() || '7.0',
      materias: [
        {
          id: Date.now().toString() + '_m',
          nombreMateria: 'Nueva Materia',
          metaDeseada: '8.0',
          evaluaciones: [{ id: Date.now().toString() + '_e', nombre: 'Examen 1', nota: '8.0', peso: '100' }],
        },
      ],
    };
    setLibros([...libros, nuevoLibro]);
    setLibroActivoId(nuevoLibro.id);
  };

  const actualizarNotaAprobacionLibro = (nuevaNota: string) => {
    setLibros(
      libros.map((l) => (l.id === libroActual.id ? { ...l, notaAprobacionMinima: nuevaNota ?? '' } : l))
    );
  };

  const agregarMateria = () => {
    triggerHaptic();
    if (libroActual.materias.length >= 10) {
      setErrorMsg('Límite alcanzado: máximo 10 materias por libro.');
      return;
    }
    setErrorMsg(null);
    const nuevaMateria: MateriaItem = {
      id: Date.now().toString(),
      nombreMateria: `Materia ${libroActual.materias.length + 1}`,
      metaDeseada: '8.0',
      evaluaciones: [{ id: Date.now().toString() + '_1', nombre: 'Parcial', nota: '', peso: '100' }],
    };

    setLibros(
      libros.map((l) => (l.id === libroActual.id ? { ...l, materias: [...l.materias, nuevaMateria] } : l))
    );
  };

  const actualizarMateriaCampo = (materiaId: string, campo: 'nombreMateria' | 'metaDeseada', valor: string) => {
    setLibros(
      libros.map((l) => {
        if (l.id !== libroActual.id) return l;
        return {
          ...l,
          materias: l.materias.map((m) => (m.id === materiaId ? { ...m, [campo]: valor ?? '' } : m)),
        };
      })
    );
  };

  const agregarEvaluacionAMateria = (materiaId: string) => {
    triggerHaptic();
    setErrorMsg(null);
    setLibros(
      libros.map((l) => {
        if (l.id !== libroActual.id) return l;
        return {
          ...l,
          materias: l.materias.map((m) => {
            if (m.id !== materiaId) return m;
            if (m.evaluaciones.length >= 8) return m;
            return {
              ...m,
              evaluaciones: [
                ...m.evaluaciones,
                { id: Date.now().toString(), nombre: `Insumo ${m.evaluaciones.length + 1}`, nota: '', peso: '' },
              ],
            };
          }),
        };
      })
    );
  };

  const actualizarEvaluacion = (
    materiaId: string,
    evalId: string,
    campo: 'nombre' | 'nota' | 'peso',
    valor: string
  ) => {
    setErrorMsg(null);
    const valorLimpio = valor ?? ''; // Evita estrictamente el undefined

    if (campo === 'nota' && valorLimpio !== '') {
      const num = parseFloat(valorLimpio);
      if (isNaN(num) || num < 0 || num > 10) {
        setErrorMsg('Error: La nota debe estar entre 0.00 y 10.00');
      }
    }

    setLibros(
      libros.map((l) => {
        if (l.id !== libroActual.id) return l;
        return {
          ...l,
          materias: l.materias.map((m) => {
            if (m.id !== materiaId) return m;
            return {
              ...m,
              evaluaciones: m.evaluaciones.map((e) => (e.id === evalId ? { ...e, [campo]: valorLimpio } : e)),
            };
          }),
        };
      })
    );
  };

  const eliminarEvaluacion = (materiaId: string, evalId: string) => {
    triggerHaptic();
    setLibros(
      libros.map((l) => {
        if (l.id !== libroActual.id) return l;
        return {
          ...l,
          materias: l.materias.map((m) => {
            if (m.id !== materiaId) return m;
            return {
              ...m,
              evaluaciones: m.evaluaciones.filter((e) => e.id !== evalId),
            };
          }),
        };
      })
    );
  };

  const eliminarMateria = (materiaId: string) => {
    triggerHaptic();
    setLibros(
      libros.map((l) => {
        if (l.id !== libroActual.id) return l;
        return {
          ...l,
          materias: l.materias.filter((m) => m.id !== materiaId),
        };
      })
    );
  };

  const notaMinimaNum = parseFloat(libroActual.notaAprobacionMinima) || 7.0;

  const calculoMaterias = libroActual.materias.map((m) => {
    const sumaPesos = m.evaluaciones.reduce((acc, e) => acc + (parseFloat(e.peso) || 0), 0);
    const promedioMateria = m.evaluaciones.reduce((acc, e) => {
      const n = parseFloat(e.nota);
      const p = parseFloat(e.peso);
      if (isNaN(n) || isNaN(p)) return acc;
      return acc + n * (p / 100);
    }, 0);
    return { ...m, sumaPesos, promedioMateria };
  });

  const promedioGeneral =
    calculoMaterias.length > 0
      ? calculoMaterias.reduce((acc, m) => acc + m.promedioMateria, 0) / calculoMaterias.length
      : 0;

  return {
    libros,
    libroActual,
    libroActivoId,
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
  };
};