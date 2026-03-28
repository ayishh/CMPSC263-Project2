const statusText = document.getElementById('statusText');
const resetButton = document.getElementById('resetButton');
const cells = Array.from(document.querySelectorAll('.cell'));

const player = 'X';
const computer = 'O';
let currentPlayer = player;
let boardState = Array(9).fill('');
let gameOver = false;

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function setStatus(message) {
  statusText.textContent = message;
}

function checkForWinner() {
  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ) {
      return boardState[a];
    }
  }
  return boardState.every(cell => cell) ? 'draw' : null;
}

function getBestMove() {
  const openCells = boardState
    .map((value, index) => (value === '' ? index : null))
    .filter(index => index !== null);

  function findWinningMove(symbol) {
    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      const values = [boardState[a], boardState[b], boardState[c]];
      const emptyCount = values.filter(value => value === '').length;
      const symbolCount = values.filter(value => value === symbol).length;
      if (emptyCount === 1 && symbolCount === 2) {
        return combo.find(index => boardState[index] === '');
      }
    }
    return null;
  }

  const winMove = findWinningMove(computer);
  if (winMove !== null) return winMove;

  const blockMove = findWinningMove(player);
  if (blockMove !== null) return blockMove;

  if (boardState[4] === '') return 4;

  const corners = [0, 2, 6, 8].filter(index => boardState[index] === '');
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

  return openCells[Math.floor(Math.random() * openCells.length)];
}

function makeComputerMove() {
  if (gameOver) return;

  setStatus('Computer is thinking...');
  const move = getBestMove();

  setTimeout(() => {
    if (move === undefined || gameOver) return;

    boardState[move] = computer;
    const cell = cells[move];
    cell.textContent = computer;
    cell.disabled = true;

    const result = checkForWinner();
    if (result) {
      gameOver = true;
      if (result === 'draw') {
        setStatus('Game over: draw!');
      } else {
        setStatus(`Player ${result} wins!`);
        highlightWin(result);
      }
      return;
    }

    currentPlayer = player;
    setStatus(`Player ${currentPlayer}'s turn`);
  }, 350);
}

function markCell(event) {
  const cell = event.target;
  const index = Number(cell.dataset.index);

  if (gameOver || boardState[index] || currentPlayer !== player) {
    return;
  }

  boardState[index] = player;
  cell.textContent = player;
  cell.disabled = true;

  const result = checkForWinner();
  if (result) {
    gameOver = true;
    if (result === 'draw') {
      setStatus('Game over: draw!');
    } else {
      setStatus(`Player ${result} wins!`);
      highlightWin(result);
    }
    return;
  }

  currentPlayer = computer;
  makeComputerMove();
}

function highlightWin(playerSymbol) {
  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (
      boardState[a] === playerSymbol &&
      boardState[b] === playerSymbol &&
      boardState[c] === playerSymbol
    ) {
      [a, b, c].forEach(i => cells[i].classList.add('winner'));
    }
  }
}

function resetGame() {
  currentPlayer = player;
  boardState = Array(9).fill('');
  gameOver = false;
  setStatus(`Player ${player}'s turn`);

  cells.forEach(cell => {
    cell.textContent = '';
    cell.disabled = false;
    cell.classList.remove('winner');
  });
}

cells.forEach(cell => cell.addEventListener('click', markCell));
resetButton.addEventListener('click', resetGame);
