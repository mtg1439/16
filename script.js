const gameBoard = document.getElementById('game-board');
const beginButton = document.getElementById('begin-button');
const levelDisplay = document.getElementById('level-display');
const clickDisplay = document.getElementById('click-display');
const instructionsDiv = document.getElementById('instructions');

let currentLevel = 1;
let board = Array(16).fill(0); // 0 for white, 1 for black
let mysterySquares = []; // Stores objects like { clickIndex: N, effectIndex: M } for each level
const MAX_LEVELS = 10;
const MAX_CLICKS = 100;
let clickCount = 0;

// Function to get row and column from index
function getCoords(index) {
    const row = Math.floor(index / 4);
    const col = index % 4;
    return { row, col };
}

// Function to get index from row and column
function getIndex(row, col) {
    return row * 4 + col;
}

// Calculate mirror opposite index
function getMirrorOpposite(index) {
    const { row, col } = getCoords(index);
    const mirrorRow = 3 - row; // 3 because 0-indexed 4x4 grid
    const mirrorCol = 3 - col;
    return getIndex(mirrorRow, mirrorCol);
}

// Toggle color of a square
function toggleColor(index) {
    const square = gameBoard.children[index];
    if (square) {
        square.classList.toggle('black');
        board[index] = 1 - board[index]; // Toggle 0 to 1, 1 to 0
    }
}

// Generate a unique mystery square for the current level
function generateMysterySquare() {
    let clickIndex, effectIndex;
    do {
        clickIndex = Math.floor(Math.random() * 16);
        effectIndex = Math.floor(Math.random() * 16);
        // Ensure effectIndex is not the clicked square or its mirror opposite
    } while (effectIndex === clickIndex || effectIndex === getMirrorOpposite(clickIndex));
    return { clickIndex, effectIndex };
}

// Initialize game board for a new level
function initializeLevel() {
    gameBoard.innerHTML = ''; // Clear existing board
    board.fill(0); // Reset board state to all white
    clickCount = 0; // Reset click count for new level
    levelDisplay.textContent = `Level: ${currentLevel}`;
    clickDisplay.textContent = `Clicks: ${clickCount}`;

    for (let i = 0; i < 16; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.dataset.index = i; // Store index in dataset
        square.addEventListener('click', handleSquareClick);
        gameBoard.appendChild(square);
    }

    // Add a new mystery square for each new level
    if (currentLevel > mysterySquares.length) {
        mysterySquares.push(generateMysterySquare());
    }

    // Hide instructions and show game board
    instructionsDiv.style.display = 'none';
    gameBoard.style.display = 'grid';
    beginButton.style.display = 'none';
}

// Handle square click event
function handleSquareClick(event) {
    const clickedIndex = parseInt(event.target.dataset.index);

    clickCount++; // Increment click count
    clickDisplay.textContent = `Clicks: ${clickCount}`;

    if (clickCount >= MAX_CLICKS) {
        alert('Game Over! You reached 100 clicks.');
        resetGame();
        return;
    }

    toggleColor(clickedIndex);
    toggleColor(getMirrorOpposite(clickedIndex));

    // Apply mystery square effects from all previous and current levels
    mysterySquares.forEach(mystery => {
        if (mystery.clickIndex === clickedIndex) {
            toggleColor(mystery.effectIndex);
        }
    });

    checkWinCondition();
}

// Check if all squares are black
function checkWinCondition() {
    const allBlack = board.every(squareState => squareState === 1);
    if (allBlack) {
        setTimeout(() => {
            if (currentLevel < MAX_LEVELS) {
                currentLevel++;
                alert(`Level ${currentLevel - 1} complete! Moving to Level ${currentLevel}.`);
                initializeLevel();
            } else {
                alert('Congratulations! You completed all levels!');
                resetGame();
            }
        }, 300);
    }
}

// Reset game to initial state
function resetGame() {
    currentLevel = 1;
    clickCount = 0; // Reset click count
    board.fill(0);
    mysterySquares = [];
    levelDisplay.textContent = `Level: ${currentLevel}`;
    clickDisplay.textContent = `Clicks: ${clickCount}`;
    gameBoard.innerHTML = '';
    instructionsDiv.style.display = 'block';
    gameBoard.style.display = 'none';
    beginButton.style.display = 'block';
}

// Event listener for the Begin button
beginButton.addEventListener('click', () => {
    currentLevel = 1; // Ensure level starts at 1
    clickCount = 0; // Reset click count
    mysterySquares = []; // Clear mystery squares from previous plays
    initializeLevel();
});
