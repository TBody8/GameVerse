import { KakuroPuzzle, KakuroCell } from './types'

function shuffle<T>(array: T[]): T[] {
  const newArr = [...array]
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}

// Determinar el tamanio de la cuadricula segun dificultad
export function getSizeForDifficulty(difficulty: string): number {
  if (difficulty === 'easy') return 6
  if (difficulty === 'medium') return 8
  if (difficulty === 'hard') return 10
  return 12 // expert
}

// Validar que un layout es legal para Kakuro (sin bloques de 1, sin >9, conectado)
function isValidLayout(layout: string[][], size: number): boolean {
  let whiteCount = 0
  let firstWhite: number[] | null = null

  // Verificar filas
  for (let r = 1; r < size; r++) {
    let run = 0
    for (let c = 1; c < size; c++) {
      if (layout[r][c] === 'playable') {
        run++
        whiteCount++
        if (!firstWhite) firstWhite = [r, c]
      } else {
        if (run === 1 || run > 9) return false
        run = 0
      }
    }
    if (run === 1 || run > 9) return false
  }

  // Verificar columnas
  for (let c = 1; c < size; c++) {
    let run = 0
    for (let r = 1; r < size; r++) {
      if (layout[r][c] === 'playable') {
        run++
      } else {
        if (run === 1 || run > 9) return false
        run = 0
      }
    }
    if (run === 1 || run > 9) return false
  }

  if (whiteCount === 0 || !firstWhite) return false

  // Verificar conectividad (Flood fill)
  const visited = Array.from({ length: size }, () => Array(size).fill(false))
  let connectedCount = 0
  const stack = [firstWhite]
  visited[firstWhite[0]][firstWhite[1]] = true

  while(stack.length > 0) {
    const [r, c] = stack.pop()!
    connectedCount++

    const dirs = [[-1,0],[1,0],[0,-1],[0,1]]
    for (const [dr, dc] of dirs) {
      const nr = r + dr
      const nc = c + dc
      if (nr >= 1 && nr < size && nc >= 1 && nc < size) {
        if (layout[nr][nc] === 'playable' && !visited[nr][nc]) {
          visited[nr][nc] = true
          stack.push([nr, nc])
        }
      }
    }
  }

  return connectedCount === whiteCount
}

// Genera un patron procedural simetrico, aleatorio y 100% legal
function generateProceduralLayout(size: number): string[][] {
  const layout = Array.from({ length: size }, () => Array(size).fill('empty'))
  
  if (size === 6) {
    for (let r = 1; r < size; r++) {
      for (let c = 1; c < size; c++) {
        layout[r][c] = 'playable'
      }
    }
    layout[3][3] = 'empty'
  } else if (size === 8) {
    for (let r = 1; r < size; r++) {
      for (let c = 1; c < size; c++) {
        layout[r][c] = 'playable'
      }
    }
    layout[1][1] = 'empty'; layout[1][2] = 'empty'; layout[2][1] = 'empty';
    layout[1][7] = 'empty'; layout[1][6] = 'empty'; layout[2][7] = 'empty';
    layout[7][1] = 'empty'; layout[7][2] = 'empty'; layout[6][1] = 'empty';
    layout[7][7] = 'empty'; layout[7][6] = 'empty'; layout[6][7] = 'empty';
  } else if (size === 10) {
    for (let r = 1; r < size; r++) {
      for (let c = 1; c < size; c++) {
        layout[r][c] = 'playable'
      }
    }
    layout[1][1] = 'empty'; layout[1][2] = 'empty'; layout[1][3] = 'empty';
    layout[2][1] = 'empty'; layout[2][2] = 'empty'; layout[3][1] = 'empty';
    layout[1][9] = 'empty'; layout[1][8] = 'empty'; layout[1][7] = 'empty';
    layout[2][9] = 'empty'; layout[2][8] = 'empty'; layout[3][9] = 'empty';
    layout[9][1] = 'empty'; layout[9][2] = 'empty'; layout[9][3] = 'empty';
    layout[8][1] = 'empty'; layout[8][2] = 'empty'; layout[7][1] = 'empty';
    layout[9][9] = 'empty'; layout[9][8] = 'empty'; layout[9][7] = 'empty';
    layout[8][9] = 'empty'; layout[8][8] = 'empty'; layout[7][9] = 'empty';
  } else if (size === 12) {
    const template = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        layout[r][c] = template[r][c] === 1 ? 'playable' : 'empty'
      }
    }
  }

  // Mutacion aleatoria procedural (Simetria de 180 grados)
  // Aumentamos a miles de iteraciones para dar formas totalmente diferentes al esqueleto
  const mutations = size === 6 ? 100 : size === 8 ? 500 : size === 10 ? 2000 : 4000
  
  for (let i = 0; i < mutations; i++) {
    const r = Math.floor(Math.random() * (size - 1)) + 1
    const c = Math.floor(Math.random() * (size - 1)) + 1
    const symR = size - r
    const symC = size - c

    const original = layout[r][c]
    const toggled = original === 'playable' ? 'empty' : 'playable'

    layout[r][c] = toggled
    layout[symR][symC] = toggled

    if (!isValidLayout(layout, size)) {
      // Revertir si la mutacion rompe las reglas (crea bloques de 1, etc.)
      layout[r][c] = original
      layout[symR][symC] = original
    }
  }

  return layout
}

// Obtener los bloques actuales para validar durante el backtracking
function getBlocksForCell(layout: string[][], grid: number[][], r: number, c: number) {
  const horizontal: number[] = []
  const vertical: number[] = []

  // Horizontal (hacia la izquierda)
  let currC = c - 1
  while (currC >= 0 && layout[r][currC] === 'playable') {
    if (grid[r][currC] !== 0) horizontal.push(grid[r][currC])
    currC--
  }

  // Vertical (hacia arriba)
  let currR = r - 1
  while (currR >= 0 && layout[currR][c] === 'playable') {
    if (grid[currR][c] !== 0) vertical.push(grid[currR][c])
    currR--
  }

  return { horizontal, vertical }
}

function solveLayout(layout: string[][], grid: number[][], r: number, c: number, size: number, state: { iterations: number }): boolean {
  if (state.iterations > 100000) return false // Evitar cuelgues
  state.iterations++

  if (r === size) return true // Solved
  
  let nextR = r
  let nextC = c + 1
  if (nextC === size) {
    nextR = r + 1
    nextC = 0
  }

  if (layout[r][c] !== 'playable') {
    return solveLayout(layout, grid, nextR, nextC, size, state)
  }

  const { horizontal, vertical } = getBlocksForCell(layout, grid, r, c)

  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
  
  for (const num of nums) {
    if (!horizontal.includes(num) && !vertical.includes(num)) {
      grid[r][c] = num
      if (solveLayout(layout, grid, nextR, nextC, size, state)) {
        return true
      }
      grid[r][c] = 0 // backtrack
    }
  }

  return false
}

export function generatePuzzle(difficulty: string): KakuroPuzzle {
  const size = getSizeForDifficulty(difficulty)
  
  let layout: string[][] = []
  let grid: number[][] = []
  let solved = false
  let attempts = 0
  
  // Generar un layout valido proceduralmente y resolverlo
  while (!solved && attempts < 20) {
    attempts++
    layout = generateProceduralLayout(size)
    grid = Array.from({ length: size }, () => Array(size).fill(0))
    solved = solveLayout(layout, grid, 0, 0, size, { iterations: 0 })
  }

  if (!solved) {
    console.error("No se pudo generar Kakuro procedural - Fallback");
    // Fallback de emergencia
    layout = Array.from({ length: size }, () => Array(size).fill('empty'))
    layout[1][1] = 'playable'; layout[1][2] = 'playable'
    grid = Array.from({ length: size }, () => Array(size).fill(0))
    grid[1][1] = 1; grid[1][2] = 2
  }

  // Convertir layout a celdas
  const cells: KakuroCell[][] = Array.from({ length: size }, (_, r) => 
    Array.from({ length: size }, (_, c) => ({
      id: `cell-${r}-${c}`,
      row: r,
      col: c,
      type: layout[r][c] as any,
    }))
  )

  // Calcular pistas
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (layout[r][c] === 'empty') {
        let hasRight = false
        let hasDown = false
        let rightSum = 0
        let downSum = 0

        // Check right
        if (c + 1 < size && layout[r][c + 1] === 'playable') {
          hasRight = true
          let currC = c + 1
          while (currC < size && layout[r][currC] === 'playable') {
            rightSum += grid[r][currC]
            currC++
          }
        }

        // Check down
        if (r + 1 < size && layout[r + 1][c] === 'playable') {
          hasDown = true
          let currR = r + 1
          while (currR < size && layout[currR][c] === 'playable') {
            downSum += grid[currR][c]
            currR++
          }
        }

        if (hasRight || hasDown) {
          cells[r][c].type = 'clue'
          cells[r][c].clue = {
            ...(hasRight ? { right: rightSum } : {}),
            ...(hasDown ? { down: downSum } : {})
          }
        }
      }
    }
  }

  return {
    id: `kakuro-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    gridSize: size,
    grid: cells,
    solution: grid
  }
}

