(function () {
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

  let board = Array(9).fill(null);
  let current = "X";
  let gameOver = false;

  function updateStatus() {
    statusEl.classList.remove("x-turn", "o-turn", "winner");
    if (gameOver) {
      const winner = getWinner();
      if (winner) {
        statusEl.textContent = `Player ${winner} wins!`;
        statusEl.classList.add("winner");
      } else {
        statusEl.textContent = "It's a draw.";
        statusEl.classList.add("winner");
      }
      return;
    }
    statusEl.textContent = `Player ${current}'s turn`;
    statusEl.classList.add(current === "X" ? "x-turn" : "o-turn");
  }

  function getWinner() {
    for (const [a, b, c] of WIN_LINES) {
      const line = [board[a], board[b], board[c]];
      if (line[0] && line[0] === line[1] && line[1] === line[2]) {
        return line[0];
      }
    }
    return null;
  }

  function winningLineIndices() {
    for (const [a, b, c] of WIN_LINES) {
      const line = [board[a], board[b], board[c]];
      if (line[0] && line[0] === line[1] && line[1] === line[2]) {
        return [a, b, c];
      }
    }
    return null;
  }

  function render() {
    const winIdx = gameOver ? winningLineIndices() : null;
    const winSet = winIdx ? new Set(winIdx) : null;

    cells.forEach((cell, i) => {
      const val = board[i];
      cell.textContent = val ?? "";
      cell.classList.remove("x", "o", "win");
      if (val) {
        cell.classList.add(val.toLowerCase());
      }
      if (winSet && winSet.has(i)) {
        cell.classList.add("win");
      }
      cell.disabled = gameOver || val !== null;
      const n = i + 1;
      cell.setAttribute(
        "aria-label",
        val ? `Cell ${n}, ${val}` : `Cell ${n} empty`
      );
    });

    updateStatus();
  }

  function handleCellClick(e) {
    const btn = e.target.closest(".cell");
    if (!btn || gameOver) return;
    const i = Number(btn.dataset.index);
    if (board[i] !== null) return;

    board[i] = current;
    const winner = getWinner();
    const full = board.every((c) => c !== null);

    if (winner || full) {
      gameOver = true;
    } else {
      current = current === "X" ? "O" : "X";
    }
    render();
  }

  function reset() {
    board = Array(9).fill(null);
    current = "X";
    gameOver = false;
    render();
  }

  boardEl.addEventListener("click", handleCellClick);
  resetBtn.addEventListener("click", reset);

  render();
})();
