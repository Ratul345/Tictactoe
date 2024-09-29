const cells = document.querySelectorAll('.cell');
const messageDisplay = document.getElementById('message');
const restartButton = document.getElementById('restart');
const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');
const playerXInput = document.getElementById('playerX');
const playerOInput = document.getElementById('playerO');
const startGameButton = document.getElementById('start-game');
const scoreboard = document.getElementById('scoreboard');
const gameBoard = document.getElementById('game-board');
const gameModeSelect = document.getElementById('game-mode');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = false;
let scoreX = 0;
let scoreO = 0;
let playerXName = '';
let playerOName = '';

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

startGameButton.addEventListener('click', () => {
    playerXName = playerXInput.value || 'Player X';
    playerOName = playerOInput.value || 'Player O';

    scoreboard.style.display = 'block';
    gameBoard.style.display = 'grid';
    restartButton.style.display = 'inline-block';

    messageDisplay.innerText = `${playerXName}'s turn`;
    isGameActive = true;
    currentPlayer = 'X';
    resetGame();
});

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (board[index] !== '' || !isGameActive) {
        return; // Exit if cell is already occupied or game is inactive
    }

    board[index] = currentPlayer; // Player's move
    cell.innerText = currentPlayer; // Display player's move

    if (checkWinner()) {
        return; // If there’s a winner, exit
    }

    // Switch to AI's turn if the game mode is "Player vs AI"
    if (isGameActive && gameModeSelect.value === 'player-vs-ai') {
        currentPlayer = 'O'; // AI plays as 'O'
        aiMove(); // AI makes a move
    }
}

function aiMove() {
    const bestMove = findBestMove();
    board[bestMove] = 'O'; // AI plays as 'O'
    cells[bestMove].innerText = 'O';
    checkWinner(); // Check if AI won
}

function findBestMove() {
    let bestValue = -Infinity;
    let bestMove;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O'; // AI's move
            const moveValue = minimax(board, 0, false); // Evaluate move
            board[i] = ''; // Undo move

            if (moveValue > bestValue) {
                bestMove = i;
                bestValue = moveValue;
            }
        }
    }

    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    const scores = {
        X: -10,
        O: 10,
        draw: 0
    };

    const winner = checkWinnerSimple(board);
    if (winner) {
        return scores[winner];
    }

    if (isMaximizing) {
        let bestValue = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O'; // AI's move
                bestValue = Math.max(bestValue, minimax(board, depth + 1, false));
                board[i] = ''; // Undo move
            }
        }
        return bestValue;
    } else {
        let bestValue = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X'; // Player's move
                bestValue = Math.min(bestValue, minimax(board, depth + 1, true));
                board[i] = ''; // Undo move
            }
        }
        return bestValue;
    }
}

function checkWinnerSimple(board) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Return the winner ('X' or 'O')
        }
    }

    if (!board.includes('')) {
        return 'draw'; // Return if it's a draw
    }

    return null; // No winner yet
}

function checkWinner() {
    const winner = checkWinnerSimple(board);
    if (winner) {
        if (winner === 'X') {
            messageDisplay.innerText = `${playerXName} wins!`;
            updateScore();
        } else if (winner === 'O') {
            messageDisplay.innerText = `${playerOName} wins!`;
            updateScore();
        } else {
            messageDisplay.innerText = "It's a draw!";
        }
        highlightWinningCells();
        isGameActive = false; // End the game
        return true; // Return true to indicate a win or draw
    }

    // No winner, return false
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch players
    messageDisplay.innerText = `${currentPlayer === 'X' ? playerXName : playerOName}'s turn`;
    return false; // No winner or draw
}

function updateScore() {
    if (currentPlayer === 'X') {
        scoreX++;
        scoreXDisplay.innerText = scoreX;
    } else {
        scoreO++;
        scoreODisplay.innerText = scoreO;
    }
}

function highlightWinningCells() {
    // In this simple version, we won't highlight winning cells for the AI
    // You can implement a similar logic as the original highlightWinningCells function if needed
}

startGameButton.addEventListener('click', () => {
    playerXName = playerXInput.value || 'Player X';
    playerOName = playerOInput.value || 'Player O';

    scoreboard.style.display = 'block';
    gameBoard.style.display = 'grid';
    restartButton.style.display = 'inline-block';

    currentPlayer = 'X'; // Start the game with Player X
    messageDisplay.innerText = `${playerXName}'s turn`;
    isGameActive = true;
    resetGame();
});

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true; // Set game to active
    currentPlayer = 'X'; // Set current player to 'X'
    cells.forEach(cell => {
        cell.innerText = ''; // Clear each cell
        cell.classList.remove('winner'); // Remove winner class
    });
    messageDisplay.innerText = `${playerXName}'s turn`; // Update message to show it's Player X's turn
}

restartButton.addEventListener('click', resetGame);

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});
