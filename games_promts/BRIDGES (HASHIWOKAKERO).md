# PROMPT DE ESPECIFICACIONES: MINIJUEGO "BRIDGES" (PUENTES)

Actúa como un Diseñador de Videojuegos y Experto en UX. Tu objetivo es desarrollar un minigame web basado en el puzzle de lógica "Bridges" (Hashiwokakero).

---

## 1. CONCEPTO GENERAL DEL JUEGO
El tablero consiste en una cuadrícula donde hay distribuidos varios círculos con números en su interior, llamados "islas". El objetivo del jugador es conectar todas las islas entre sí trazando puentes (líneas) hasta que formen una única red interconectada.

---

## 2. COMPONENTES Y REGLAS ESTRICTAS
* **Las Islas:** Cada isla contiene un número (generalmente del 1 al 8). Este número indica cuántos puentes EXACTOS deben conectarse a ella.
* **Los Puentes:** Son líneas rectas (solo horizontales o verticales) que unen una isla con otra vecina directa en su línea de visión.
* **Restricción de Cruces:** Los puentes no pueden cruzarse entre sí bajo ninguna circunstancia.
* **Capacidad Máxima:** Entre dos islas vecinas solo puede haber un máximo de DOS puentes (pueden ser puentes simples o puentes dobles paralelos).
* **Red Unificada:** Al finalizar, todas las islas deben estar conectadas en un único grupo continuo. No pueden quedar dos redes de islas aisladas e independientes.

---

## 3. INTERACCIÓN DEL USUARIO (UX)
* **Trazar Puentes:** El jugador hace clic/toca una isla y arrastra hacia una isla vecina para dibujar un puente. 
* **Alternar Puentes:** Alternativamente, hacer clic en una isla vecina legal tras seleccionar la primera:
    * Primer clic: Crea 1 puente (línea simple).
    * Segundo clic: Crea 2 puentes (línea doble).
    * Tercer clic: Elimina los puentes entre esas dos islas.
* **Feedback de Estado:** Cuando una isla alcanza el número exacto de puentes requeridos, el círculo cambia de color (ej. de blanco a verde o gris) para indicar que está "satisfecha". Si se excede, resalta en rojo.

---

## 4. CONDICIÓN DE VICTORIA
El juego se gana automáticamente cuando TODAS las islas tienen el número exacto de puentes requeridos y forman una sola red conectada sin interrupciones.