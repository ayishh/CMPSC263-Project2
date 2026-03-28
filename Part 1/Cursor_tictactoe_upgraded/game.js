(function () {
  const HUMAN = "X";
  const AI = "O";

  const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const boardEl = document.getElementById("board");
  const statusEl = document.getElementById("status");
  const resetBtn = document.getElementById("reset");
  const cells = Array.from(boardEl.querySelectorAll(".cell"));

  let board = Array(9).fill("");
  let gameOver = false;
  let humanTurn = true;

  function getWinner(b) {
    for (const line of WIN_LINES) {
      const [a, c, d] = line;
      if (b[a] && b[a] === b[c] && b[a] === b[d]) {
        return { player: b[a], line };
      }
    }
    if (b.every((cell) => cell !== "")) {
      return { player: "draw", line: null };
    }
    return null;
  }

  function minimax(b, depth, isMaximizing) {
    const result = getWinner(b);
    if (result) {
      if (result.player === "draw") return 0;
      if (result.player === AI) return 10 - depth;
      return depth - 10;
    }

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (b[i] === "") {
          b[i] = AI;
          const score = minimax(b, depth + 1, false);
          b[i] = "";
          best = Math.max(best, score);
        }
      }
      return best;
    }

    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i] === "") {
        b[i] = HUMAN;
        const score = minimax(b, depth + 1, true);
        b[i] = "";
        best = Math.min(best, score);
      }
    }
    return best;
  }

  function bestAiMove() {
    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = AI;
        const score = minimax(board, 0, false);
        board[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  function render() {
    cells.forEach((cell, i) => {
      cell.textContent = board[i];
      cell.classList.remove("x", "o", "win");
      if (board[i] === HUMAN) cell.classList.add("x");
      if (board[i] === AI) cell.classList.add("o");
      cell.disabled = gameOver || !humanTurn || board[i] !== "";
    });

    const result = getWinner(board);
    if (result && result.line) {
      result.line.forEach((idx) => cells[idx].classList.add("win"));
    }
  }

  function setStatus(text, thinking) {
    statusEl.textContent = text;
    statusEl.classList.toggle("thinking", !!thinking);
  }

  function endGame(message) {
    gameOver = true;
    humanTurn = false;
    setStatus(message, false);
    render();
  }

  function aiTurn() {
    if (gameOver) return;
    setStatus("Computer is thinking…", true);
    humanTurn = false;
    render();

    window.setTimeout(() => {
      const move = bestAiMove();
      if (move >= 0) board[move] = AI;

      const result = getWinner(board);
      if (result) {
        if (result.player === "draw") {
          endGame("It's a draw.");
        } else {
          endGame("Computer wins.");
        }
        return;
      }

      humanTurn = true;
      setStatus("Your turn", false);
      render();
    }, 350);
  }

  function onCellClick(e) {
    const btn = e.target.closest(".cell");
    if (!btn || gameOver || !humanTurn) return;
    const i = parseInt(btn.dataset.index, 10);
    if (board[i] !== "") return;

    board[i] = HUMAN;
    const result = getWinner(board);
    if (result) {
      if (result.player === "draw") {
        endGame("It's a draw.");
      } else {
        endGame("You win!");
      }
      return;
    }

    aiTurn();
  }

  function reset() {
    board = Array(9).fill("");
    gameOver = false;
    humanTurn = true;
    setStatus("Your turn", false);
    render();
  }

  boardEl.addEventListener("click", onCellClick);
  resetBtn.addEventListener("click", reset);

  reset();
})();
