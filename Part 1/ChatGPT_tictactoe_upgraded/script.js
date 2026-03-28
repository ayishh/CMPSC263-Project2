const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = true;

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

cells.forEach(cell => cell.addEventListener("click", cellClick));

function cellClick() {
  const index = this.dataset.index;

  if (board[index] !== "" || !running) return;

  makeMove(index, "X"); // player move

  if (running) {
    setTimeout(aiMove, 300); // slight delay for realism
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  checkWinner();
}

function checkWinner() {
  let won = false;

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      won = true;
      break;
    }
  }

  if (won) {
    statusText.textContent = `Player ${currentPlayer} Wins!`;
    running = false;
  } else if (!board.includes("")) {
    statusText.textContent = "It's a Draw!";
    running = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function aiMove() {
  let bestMove = minimax(board, "O").index;
  makeMove(bestMove, "O");
}

function minimax(newBoard, player) {
  let emptySpots = newBoard
    .map((val, i) => val === "" ? i : null)
    .filter(v => v !== null);

  if (checkWin(newBoard, "X")) return { score: -10 };
  if (checkWin(newBoard, "O")) return { score: 10 };
  if (emptySpots.length === 0) return { score: 0 };

  let moves = [];

  for (let i of emptySpots) {
    let move = {};
    move.index = i;
    newBoard[i] = player;

    if (player === "O") {
      let result = minimax(newBoard, "X");
      move.score = result.score;
    } else {
      let result = minimax(newBoard, "O");
      move.score = result.score;
    }

    newBoard[i] = "";
    moves.push(move);
  }

  let bestMove;

  if (player === "O") {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function checkWin(board, player) {
  return winPatterns.some(pattern => {
    return pattern.every(index => board[index] === player);
  });
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  running = true;
  statusText.textContent = "Player X's Turn";

  cells.forEach(cell => cell.textContent = "");
}