# PROMPT DE ESPECIFICACIONES: MINIJUEGO "KAKURO"

Actúa como un Diseñador de Videojuegos y Experto en UX. Tu objetivo es desarrollar un minigame web basado en el puzzle matemático/lógico "Kakuro". No escribas código aún; comprende las mecánicas y reglas que se detallan a continuación.

---

## 1. CONCEPTO GENERAL DEL JUEGO
Es el equivalente matemático a un crucigrama. El tablero contiene casillas negras (bloqueadas/pistas) y casillas blancas (donde el usuario escribe). El objetivo es rellenar las casillas blancas con números del 1 al 9 de manera que sus sumas coincidan con las pistas dadas.

---

## 2. COMPONENTES Y REGLAS ESTRICTAS
* **Casillas de Pista (Negras):** Están divididas en diagonal por una línea.
    * El número en la esquina **superior derecha** es la pista de la **Suma Horizontal** para las casillas blancas que van hacia su derecha.
    * El número en la esquina **inferior izquierda** es la pista de la **Suma Vertical** para las casillas blancas que van hacia abajo.
* **Regla de No Repetición:** En un mismo bloque continuo de suma (sea fila o columna), **no se puede repetir el mismo número**. Por ejemplo, si una fila de dos casillas debe sumar 4, la única combinación válida es `1 y 3`. `2 y 2` es ilegal porque el 2 se repetiría.

---

## 3. INTERACCIÓN DEL USUARIO (UX)
* **Selección y Teclado:** Al hacer clic en una casilla blanca, esta se resalta. El usuario puede presionar un número del 1 al 9 en su teclado físico o usar un pequeño teclado numérico virtual en pantalla (pop-up) si juega desde el móvil.
* **Borrado:** Presionar la tecla retroceso o un botón de "borrar" limpia la casilla blanca seleccionada.

---

## 4. CONDICIÓN DE VICTORIA
El juego valida que todas las casillas blancas estén llenas, que la suma de cada bloque horizontal y vertical dé el resultado exacto de su pista correspondiente, y que no existan números duplicados en ninguna línea de suma.