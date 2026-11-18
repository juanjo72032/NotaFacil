# NotaFácil: Simulador y Calculadora de Promedios Escolares

## Problema
Las plataformas institucionales suelen mostrar las notas frías, pero los estudiantes batallan para calcular de forma rápida cuánto necesitan sacarse en el examen final o en los deberes pendientes para aprobar una materia o subir su promedio.

## Solución
Permitirá a los estudiantes ingresar sus notas actuales y los porcentajes de ponderación (tareas, proyectos, exámenes) para calcular su promedio ponderado al instante y simular escenarios futuros ("¿Qué nota necesito en el próximo proyecto para tener 9 en la materia?").

## Objetivos
- Permitir registrar hasta 10 materias sin cierres inesperados, bloqueando entradas inválidas como letras o notas fuera del rango 0 a 10 mediante alertas de error inmediatas.
- Calcular el promedio ponderado en menos de 1 segundo, validando obligatoriamente que la suma de los porcentajes de evaluación sea exactamente igual al 100 por ciento antes de mostrar el resultado.
- Desplegar un indicador visual automático de estado académico en verde si el promedio es mayor o igual a 7 o en rojo si es menor, junto con la nota exacta necesaria para aprobar comprobable mediante 3 casos de prueba.

## Habilidades
- Lógica matemática y manejo de estados en React Native.
- Formularios dinámicos y validación de datos con TypeScript.
- Diseño de interfaces limpias y responsivas.
- Persistencia de datos locales en dispositivos móviles.

## Alcance inicial
Pantalla de registro de notas con ponderaciones personalizables por porcentaje y validación de errores en pantalla.

Cálculo automático del promedio actual de la materia al cumplirse el 100% de ponderación.

Simulador rápido de nota necesaria para alcanzar la calificación deseada (mínimo 7.00).

## Restricciones
- La aplicación funcionará de manera 100% local en el dispositivo del estudiante como herramienta de apoyo personal, sin requerir conexión a internet ni sincronización con el sistema del colegio.
- Se probará y demostrará en dispositivos móviles a través de Expo Go con un límite máximo de 10 materias registradas en memoria local.
