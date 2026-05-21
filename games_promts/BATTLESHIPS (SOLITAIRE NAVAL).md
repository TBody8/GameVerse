# PROMPT DE ESPECIFICACIONES: MINIJUEGO "BATTLESHIPS SOLITAIRE"

Actúa como un Diseñador de Videojuegos y Experto en UX. Tu objetivo es desarrollar un minigame web basado en el puzzle de lógica "Battleships Solitaire" (Batalla Naval Lógica).
---

## 1. CONCEPTO GENERAL DEL JUEGO
En una cuadrícula (ej. 6x6 o 10x10), hay una flota de barcos escondida en el océano. Utilizando pistas numéricas en los bordes de las filas y columnas, el jugador debe deducir la posición exacta de cada barco.

---

## 2. COMPONENTES Y LA FLOTA
* **La Flota Estándar (ejemplo para 6x6):** El juego define de antemano qué barcos hay que buscar. Por ejemplo:
    * 1 Submarino (1 casilla de tamaño).
    * 2 Destructores (2 casillas de largo).
    * 1 Crucero (3 casillas de largo).
* **Indicadores de Línea:** Al igual que en "Train Tracks", cada fila y columna tiene un número que indica cuántos fragmentos de barco hay EXACTAMENTE en esa línea.

---

## 3. REGLAS ESTRICTAS DE COLOCACIÓN
* **Aislamiento:** Los barcos no pueden tocarse entre sí bajo ninguna circunstancia, ni siquiera en diagonal. Deben estar completamente rodeados de agua (o por los bordes del tablero).
* **Orientación:** Los barcos multicasilla solo pueden ser perfectamente horizontales o verticales; nunca diagonales.

---

## 4. INTERACCIÓN DEL USUARIO (UX)
Cada casilla vacía cicla entre tres estados al hacer clic/toque:
1.  **Vacío:** (Estado inicial).
2.  **Agua (Océano):** Representado por un color azul claro o una pequeña ola. Sirve para que el jugador descarte casillas de forma lógica.
3.  **Fragmento de Barco:** Representado por un cuadrado o forma de casco de barco.
    * *Opcional estético:* El juego puede auto-formatear los fragmentos visualmente (puntas redondeadas para los extremos del barco, cuadrados para el medio, y un círculo para el submarino de 1 casilla).

---

## 5. CONDICIÓN DE VICTORIA
El juego verifica que todas las filas y columnas coincidan con sus números indicadores, y que la flota descubierta coincida exactamente en cantidad y tamaño con los barcos requeridos, respetando la regla de no-contacto diagonal.