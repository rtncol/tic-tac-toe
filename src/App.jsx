import confetti from 'canvas-confetti'
import { useEffect, useState } from 'react'
import { Square } from './components/Square.jsx'
import { TURNS } from './constants.js'
import { checkWinnerFrom, checkEndGame } from './logic/boardlogic.js'
import { WinnerModal } from './components/WinnerModal.jsx'

function App () {
  // el componente App es el componente principal de nuestra aplicacion, es el que se renderiza en el index.html
  // hay que destacar que useState es un hook asincrono que devuelve una pareja de valores: el estado actual, y una funcion que lo actualiza
  const [board, setBoard] = useState(() => {
    // metemos el tablero dentro de la aplicacion, ya que cuando se haga un click necesitamos actualizar el tablero para volver a renderizarlo y que el usuario pueda ver si se puso o no una X/O
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null) // si no hay nada en el localStorage, devolvemos un array de 9 posiciones con null
  })
  const [turn, setTurn] = useState(() => {
    // creando un estado para saber de quien es el turno
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  }) // con el localStorage, guardamos tanto el tablero como el turno de nuestro juego, con esto podemos guardar la partida

  //     ||  <--- esto mira si turnFromStorage es falsy
  //     ?? <--- esto mira si turnFromStorage es null o undefined, en caso de ser asi, devuelve la expresion del lado derecho

  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  const updateBoard = (index) => {
    if (board[index] || winner) return // si la posicion ya tiene algo, no actualizarla

    // actualizar el tablero
    const newBoard = [...board] // reminder de tratar de no mutar los arrays, aca estamos haciendo una copia para no mutar el original
    newBoard[index] = turn
    setBoard(newBoard)

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X // cambiamos el turno
    setTurn(newTurn)

    // guardamos la partida
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)

    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false) // empate
    }
  }

  useEffect(() => {
    // el useEffect es un hook que se ejecuta cada vez que se renderiza el componente, si le pasamos un array vacio, solo se ejecuta una vez
    console.log('render')
  }, [winner]) // aca le decimos que se ejecute el codigo de arriba cada vez que cambie el valor de winner

  return (
    <main className='board'>
      <h1>Ta-te-ti</h1>
      <button onClick={resetGame}>Reiniciar</button>
      <section className='game'>
        {board.map((square, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {square}
            </Square>
          )
        })}
      </section>

      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>
      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  )
}

export default App
