function updateBoard(side, row, col, type) {
    let UIBoard = null;
    if (side === 'player') {
        UIBoard = document.querySelector('.player-board');
    } else if (side === 'enemy') {
        UIBoard = document.querySelector('.enemy-board');
    } else if (side === 'modal') {
        UIBoard = document.querySelector('.player-modal-board');
    }

    function findSquare() {
        const index = row * 10 + col;
        return UIBoard.children[index];
    }

    if (type === 'place-ship') {
        const square = findSquare();
        square.classList.remove('empty');
        square.classList.add('ship');
    } else if (type === 'missed') {
        const square = findSquare();
        square.classList.remove('empty');
        square.classList.add('missed');
    } else if (type === 'hit') {
        const square = findSquare();
        square.classList.remove('empty');
        square.classList.add('hit');
    }
}

function handleClick(board) {
    let allSquares = null;

    function createEventListeners(squaresList, side) {
        squaresList.forEach((square, index) => {
            square.addEventListener('click', () => {
                if (side === 'modal') {
                    if (board.player.placedShipCount !== 5) {
                        board.checkAdjacentSquares(index);
                    }
                } else if (side === 'enemy') {
                    if (board.player.lost === true || board.enemyBoard.player.lost === true) return;
                    board.enemyBoard.attackShip(index);
                }
            });
        });
    }

    if (board.side === 'modal') {
        const playerModalBoard = document.querySelector('.player-modal-board');
        allSquares = playerModalBoard.querySelectorAll('.grid-square');
        createEventListeners(allSquares, board.side);
    }

    if (board.side === 'enemy') {
        const enemyBoard = document.querySelector('.enemy-board');
        allSquares = enemyBoard.querySelectorAll('.grid-square');
        createEventListeners(allSquares, board.side);
    }
}

function rotateShipPlacement(board) {
    const boardObj = board;
    const btn = document.querySelector('.rotate');
    btn.addEventListener('click', () => {
        if (boardObj.currentRotation === 'row') {
            boardObj.currentRotation = 'col';
        } else if (boardObj.currentRotation === 'col') {
            boardObj.currentRotation = 'row';
        }
    });
}

// disable modal popup and display both boards
function startGame() {
    const playerModalBoard = document.querySelector('.player-modal-board');
    const allSquares = playerModalBoard.querySelectorAll('.grid-square');

    const playerBoard = document.querySelector('.player-board');
    const enemyBoard = document.querySelector('.enemy-board');

    function createBoardSquare() {
        const square = document.createElement('div');
        square.classList.add('grid-square');
        square.classList.add('empty');
        return square;
    }

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            enemyBoard.appendChild(createBoardSquare());
        }
    }

    allSquares.forEach((square) => {
        playerBoard.appendChild(square);
    });

    const placeShipModal = document.querySelector('.place-ship-modal');
    const darkOverlay = document.querySelector('.dark-overlay');
    placeShipModal.style.display = 'none';
    darkOverlay.style.display = 'none';
}

function displayWinner(winner) {
    const winnerDisplay = document.querySelector('.winner-display');
    if (winner === 'player') {
        winnerDisplay.textContent = 'You won!';
    } else if (winner === 'enemy') {
        winnerDisplay.textContent = 'You lost!';
    }
}

const DomHandler = {
    updateBoard,
    handleClick,
    rotateShipPlacement,
    startGame,
    displayWinner,
};

export default DomHandler;
