 // funcion para revisar todas las combinaciones ganadoras para ver si X u O gano
 import { WINNER_COMBOS } from "../constants.js"

 export const checkWinnerFrom = (boardToCheck) => {
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a]
      }
    }
    return null  // si no hay ganador devuelve null
  }


  export const checkEndGame = (newBoard) => {
    // revisa si hay un empate si no hay mas espacios vacios en el tablero
    return newBoard.every((square) => square !== null)
  }

  