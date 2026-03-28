const statusText = document.getElementById('statusText');
const resetButton = document.getElementById('resetButton');
const cells = Array.from(document.querySelectorAll('.cell'));

let currentPlayer = 'X';
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

function markCell(event) {
  const cell = event.target;
  const index = Number(cell.dataset.index);

  if (gameOver || boardState[index]) {
    return;
  }

  boardState[index] = currentPlayer;
  cell.textContent = currentPlayer;
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

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  setStatus(`Player ${currentPlayer}'s turn`);
}

function highlightWin(player) {
  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (
      boardState[a] === player &&
      boardState[b] === player &&
      boardState[c] === player
    ) {
      [a, b, c].forEach(i => cells[i].classList.add('winner'));
    }
  }
}

function resetGame() {
  currentPlayer = 'X';
  boardState = Array(9).fill('');
  gameOver = false;
  setStatus("Player X's turn");

  cells.forEach(cell => {
    cell.textContent = '';
    cell.disabled = false;
    cell.classList.remove('winner');
  });
}

cells.forEach(cell => cell.addEventListener('click', markCell));
resetButton.addEventListener('click', resetGame);
