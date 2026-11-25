import { EvaluacionItem, MateriaItem } from '../hooks/useNotafacil';

export interface MateriaCalculada extends MateriaItem {
  sumaPesos: number;
  promedioMateria: number;
  notaNecesaria: number;
}

export function sumarPesos(evaluaciones: EvaluacionItem[]): number {
  return evaluaciones.reduce((acc, ev) => {
    const peso = parseFloat(ev.peso);
    return acc + (Number.isNaN(peso) ? 0 : peso);
  }, 0);
}

export function calcularPromedioMateria(evaluaciones: EvaluacionItem[]): number {
  return evaluaciones.reduce((acc, ev) => {
    const nota = parseFloat(ev.nota);
    const peso = parseFloat(ev.peso);
    if (Number.isNaN(nota) || Number.isNaN(peso)) return acc;
    return acc + nota * (peso / 100);
  }, 0);
}

export function calcularNotaNecesaria(
  acumulado: number,
  sumaPesos: number,
  meta: number
): number {
  const restante = 100 - sumaPesos;
  if (restante <= 0) return 0;
  const requerida = (meta - acumulado) / (restante / 100);
  return requerida < 0 ? 0 : requerida;
}

export function calcularMateriasConMetricas(
  materias: MateriaItem[],
  notaMinima: number
): MateriaCalculada[] {
  return materias.map((mat) => {
    const sumaPesos = sumarPesos(mat.evaluaciones);
    const promedioMateria = calcularPromedioMateria(mat.evaluaciones);
    const metaMat = parseFloat(mat.metaDeseada);
    const metaValida = Number.isNaN(metaMat) ? notaMinima : metaMat;
    const notaNecesaria = calcularNotaNecesaria(promedioMateria, sumaPesos, metaValida);
    return { ...mat, sumaPesos, promedioMateria, notaNecesaria };
  });
}

export function calcularPromedioGeneral(materiasCalc: MateriaCalculada[]): number {
  if (materiasCalc.length === 0) return 0;
  const total = materiasCalc.reduce((acc, m) => acc + m.promedioMateria, 0);
  return total / materiasCalc.length;
}