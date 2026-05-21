# PROMPT DE ESPECIFICACIONES: MINIJUEGO "SLITHERLINK" (EL CERCADO)

Actúa como un Diseñador de Videojuegos y Experto en UX. Tu objetivo es desarrollar un minigame web basado en el puzzle de lógica "SlitherLINK". No escribas código aún; comprende las mecánicas y reglas que se detallan a continuación.

---

## 1. CONCEPTO GENERAL DEL JUEGO
El tablero es una cuadrícula de **puntos**. El objetivo del jugador es conectar estos puntos mediante líneas horizontales y verticales para formar un **único circuito cerrado gigante** (un lazo o valla continua) que no se cruce a sí mismo en ningún momento.

---

## 2. COMPONENTES Y REGLAS ESTRICTAS
* **Números de Pista:** Dentro de algunas casillas de la cuadrícula hay números (0, 1, 2 o 3). 
    * El número indica cuántos de los CUATRO lados de esa casilla específica deben ser líneas del circuito.
    * Si una casilla tiene un **0**, significa que ninguna de sus 4 paredes puede tener una línea.
    * Las casillas vacías (sin número) pueden tener cualquier cantidad de líneas alrededor.
* **El Lazo Único:** Al final, debe haber una sola línea continua que empiece y termine en el mismo sitio. No puede haber "líneas muertas" (sueltas), ni bifurcaciones en forma de "T" o "X".

---

## 3. INTERACCIÓN DEL USUARIO (UX)
El usuario interactúa directamente con los **espacios entre los puntos** (las aristas o bordes):
* **Primer clic/toque en un borde:** Dibuja una sección de la línea (la valla).
* **Segundo clic/toque:** Coloca una "X" (para marcar que por ahí sabe con certeza que no pasa la línea).
* **Tercer clic/toque:** Vuelve a dejar el borde vacío.

---

## 4. CONDICIÓN DE VICTORIA
Se logra la victoria cuando todas las casillas con números tienen la cantidad exacta de líneas perimetrales exigidas y todas esas líneas forman un único circuito cerrado perfecto.