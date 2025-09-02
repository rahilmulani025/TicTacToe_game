const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("resetBtn");
const modeToggle = document.getElementById("modeToggle");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameIsActive = true;
let scores = { X: 0, O: 0 };
let vsAI = false;

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function highlightWinner(pattern) {
  pattern.forEach(i => cells[i].classList.add("win"));
}

function checkWin() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      highlightWinner(pattern);
      return true;
    }
  }
  return false;
}

function checkDraw() {
  return board.every(cell => cell !== "");
}

function handleMove(index, cell) {
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("placed");
}

function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `It's ${currentPlayer}'s turn`;
}

function endGame(message) {
  gameIsActive = false;
  statusText.textContent = message;
  cells.forEach(cell => cell.removeEventListener("click", onCellClick));
}

function checkResult() {
  if (checkWin()) {
    scores[currentPlayer]++;
    updateScoreboard();
    endGame(`🎉 Player ${currentPlayer} wins!`);
  } else if (checkDraw()) {
    endGame("😮 It's a draw!");
  } else {
    switchPlayer();
    if (vsAI && currentPlayer === "O") aiMove();
  }
}

function aiMove() {
  if (!gameIsActive) return;
  let emptyCells = board.map((v, i) => (v === "" ? i : null)).filter(i => i !== null);
  let choice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const cell = cells[choice];
  handleMove(choice, cell);
  checkResult();
}

function onCellClick(event) {
  const cell = event.target;
  const index = +cell.dataset.index;
  if (!gameIsActive || board[index]) return;

  handleMove(index, cell);
  checkResult();
}

function updateScoreboard() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
}

function resetGame() {
  board.fill("");
  currentPlayer = "X";
  gameIsActive = true;
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("win", "placed");
    cell.addEventListener("click", onCellClick);
  });
  statusText.textContent = `It's ${currentPlayer}'s turn`;
}

function toggleMode() {
  vsAI = !vsAI;
  modeToggle.textContent = vsAI ? "Switch to 2 Player" : "Switch to Vs AI";
  resetGame();
}

function startGame() {
  cells.forEach(cell => cell.addEventListener("click", onCellClick));
  resetButton.addEventListener("click", resetGame);
  modeToggle.addEventListener("click", toggleMode);
  updateScoreboard();
  statusText.textContent = `It's ${currentPlayer}'s turn`;
}

startGame();
