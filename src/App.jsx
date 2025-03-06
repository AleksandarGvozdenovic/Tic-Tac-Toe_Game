import { useState } from "react";
import GameBoard from "./components/GameBoard.jsx";  // Uvoz komponente za prikaz table
import Player from "./components/Player.jsx";      // Uvoz komponente za prikaz igrača
import Log from "./components/Log";                // Uvoz komponente za log koji prikazuje poteze
import GameOver from "./components/GameOver.jsx";  // Uvoz komponente koja prikazuje poruku o kraju igre (pobednik ili nerešeno)
import { WINNING_COMBINATIONS } from "./winning-combinations.js"; // Uvoz svih mogućih kombinacija za pobedu

// Definisanje početnih igrača za igru (Igrač 1 je 'X', Igrač 2 je 'O')
const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2'
};

// Inicijalizacija početne table sa praznim poljima (null)
const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

// Ova funkcija određuje koji je trenutni aktivni igrač na osnovu broja poteza
function deriveActivePlayer(gameTurns) {
  let currentPlayer = 'X'; // Podrazumevani je igrač 'X'
  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O'; // Ako su prvi potezi vezani za igrača 'X', sledeći je 'O'
  }
  return currentPlayer; // Vraća aktivnog igrača
}

// Ova funkcija generiše trenutnu tabelu igre na osnovu svih odigranih poteza
function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])]; // Kreira kopiju početne tabele
  for (const turn of gameTurns) {
    const { square, player } = turn; // Dobija informacije o potezu (koji igrač i koje polje)
    const { row, col } = square; // Dohvata red i kolonu sa kvadrata

    gameBoard[row][col] = player; // Postavlja simbol igrača na odgovarajuće polje
  }
  return gameBoard; // Vraća ažuriranu tabelu
}

// Ova funkcija proverava sve moguće kombinacije za pobedu i vraća pobednika
function deriveWinner(gameBoard, players) {
  let winner;
  for (const combination of WINNING_COMBINATIONS) { // Prolazi kroz sve moguće kombinacije
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];
    
    // Ako su sva tri polja ista i nisu prazna, imamo pobednika
    if (firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol) {
      winner = players[firstSquareSymbol]; // Dodeljuje pobedniku ime igrača
    }
  }
  return winner; // Vraća pobednika ili undefined ako nema pobednika
}

// Glavna komponenta koja predstavlja igru
function App() {

  const [players, setPlayers] = useState(PLAYERS); // Početni igrači
  const [gameTurns, setGameTurns] = useState([]); // Potezi igre

  const activePlayer = deriveActivePlayer(gameTurns); // Izračunava koji je igrač aktivan
  const gameBoard = deriveGameBoard(gameTurns); // Generiše tabelu igre na osnovu poteza
  const winner = deriveWinner(gameBoard, players); // Proverava da li ima pobednika
  const hasDrow = gameTurns.length === 9 && !winner; // Proverava da li je igra nerešena

  // Funkcija koja obrađuje selektovanje kvadrata na tabli
  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns(prevTurns => {
      const currentPlayer = deriveActivePlayer(prevTurns); // Određuje koji je igrač na potezi
      const updatedTurns = [{ square: { row: rowIndex, col: colIndex }, player: currentPlayer }, ...prevTurns]; // Dodaje novi potez u log
      return updatedTurns;
    });
  }

  // Funkcija koja restaruje igru (ponovo postavlja početno stanje)
  function handleRestart() {
    setGameTurns([]); // Resetuje listu poteza
  }

  // Funkcija koja omogućava promena imena igrača
  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName // Ažurira ime igrača koji je promenio ime
      };
    });
  }

  return (
    <main>
      <div id="game-container">

        <ol id="players" className="highlight-player">
          {/* Prikazivanje oba igrača */}
          <Player 
            initialName={PLAYERS.X} 
            symbol="X" 
            isActive={activePlayer === 'X'} 
            onChangeName={handlePlayerNameChange}
          />
          <Player 
            initialName={PLAYERS.O} 
            symbol="O" 
            isActive={activePlayer === 'O'} 
            onChangeName={handlePlayerNameChange}
          />
        </ol>

        {/* Ako je igra gotova, prikazuje ekran sa rezultatima */}
        {(winner || hasDrow) && <GameOver winner={winner} onRestart={handleRestart} />}
        
        {/* Prikazivanje table sa mogućnostima za selektovanje kvadrata */}
        <GameBoard 
          onSelectSquare={handleSelectSquare} 
          board={gameBoard} 
        />
      </div>

      {/* Prikazivanje loga svih poteza */}
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;

