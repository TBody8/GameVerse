# PROMPT DE ESPECIFICACIONES DE DISEÑO: MINIJUEGO "TRAIN TRACKS" (VÍAS DE TREN)
Tu objetivo es desarrollar un minigame web basado en el puzzle de lógica clásico "Train Tracks".

---

## 1. CONCEPTO GENERAL DEL JUEGO
El juego consiste en una cuadrícula (por ejemplo, de 6x6 casillas) donde el usuario debe dibujar una única vía de tren continua que conecte un punto de entrada (A) con un punto de salida (B). El desafío radica en que cada fila y columna tiene un número límite de vías permitidas.

---

## 2. COMPONENTES DEL TABLERO
* **La Cuadrícula (Grid):** Un tablero de juego bidimensional (por defecto 6x6, pero escalable a otras dificultades como 8x8 o 10x10).
* **Indicadores Numéricos:** * Cada columna tiene un número en la parte superior.
    * Cada fila tiene un número en la parte derecha.
    * Estos números indican la cantidad EXACTA de casillas en esa línea que deben contener una vía.
* **Estaciones de Origen y Destino:** * Una casilla de entrada etiquetada como "A" en los bordes del tablero.
    * Una casilla de salida etiquetada como "B" en los bordes del tablero.
    * Ambas casillas deben mostrar una pista inicial: un trozo de vía fijo que indique claramente hacia qué dirección entra o sale el tren.

---

## 3. ESTADOS DE LAS CASILLAS Y MECÁNICAS DE INTERACCIÓN
El jugador interactúa con el tablero haciendo clic (en PC) o tocando (en móviles) sobre las casillas vacías. Cada casilla debe alternar entre tres estados cíclicos con cada interacción:

1.  **Estado Vacío (Default):** La casilla no tiene nada.
2.  **Estado Vía de Tren:** Se dibuja un tramo de vía. 
3.  **Estado Bloqueado/Cruz (X):** El jugador coloca una marca visual (como una cruz gris o un punto) para denotar que está seguro de que por esa casilla NO pasa el tren. Ayuda visual indispensable para descartar de forma lógica.

> **Comportamiento visual de las vías:** Los tramos de vía deben auto-orientarse de forma lógica según las casillas adyacentes que también tengan vías, permitiendo únicamente dos formas físicas: **líneas rectas** (horizontales o verticales) y **curvas de 90 grados**.

---

## 4. REGLAS ESTRICTAS DEL PUZZLE (LÓGICA DE VALIDACIÓN)
Para que una solución sea válida, el sistema debe comprobar en tiempo real o al presionar "Verificar" que se cumplan las siguientes condiciones:

* **Regla de Conteo:** El número de casillas con vía en la fila $X$ debe ser exactamente igual al número indicado para esa fila. Lo mismo aplica para las columnas.
* **Camino Único y Continuo:** Debe existir una única línea ininterrumpida que empiece en **A** y termine en **B**.
* **Prohibición de Bucles (Loops):** No puede haber circuitos cerrados aislados en ninguna parte del tablero.
* **Prohibición de Ramificaciones:** Las vías no pueden bifurcarse. Cada fragmento de vía solo puede conectar con exactamente dos casillas vecinas (excepto las puntas en A y B).
* **Prohibición de Vías Muertas:** No puede haber tramos sueltos que no conecten a ningún lado.

---

## 5. REQUISITOS DE INTERFAZ DE USUARIO (UI) Y FEEDBACK
* **Contadores Dinámicos:** Cuando el jugador complete el número exacto de vías en una fila o columna, el número indicador debe cambiar de color (ej. de negro a verde o gris atenuado) para indicarle que cumplió el requisito de esa línea. Si se pasa del número, debe resaltar en rojo.
* **Feedback de Victoria:** Al cumplirse todas las reglas de forma correcta, el juego debe congelar el tablero, mostrar una animación (como un pequeño tren recorriendo la vía desde A hasta B) y desplegar un mensaje de "¡Victoria!".
* **Controles Auxiliares:** El minijuego debe incluir tres botones visibles:
    * **Reiniciar (Reset):** Limpia el tablero conservando solo las pistas iniciales (A y B).
    * **Validar (Opcional):** Si el juego no es autoverificable en tiempo real, un botón para comprobar la solución.
    * **Selector de Nivel/Dificultad:** Para cambiar el tamaño del tablero o cargar un nuevo puzzle.

---

¿Entendido? Confírmame si tienes alguna duda sobre las reglas o el flujo visual antes de proceder a estructurar la arquitectura del código.