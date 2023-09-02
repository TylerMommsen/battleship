import Ship from './ship';

function updateBoard(board, side, row, col) {
    let UIBoard = null;
    if (side === 'left') {
        UIBoard = document.querySelector('.left-board');
    } else if (side === 'right') {
        UIBoard = document.querySelector('.right-board');
    } else if (side === 'modal') {
        UIBoard = document.querySelector('.modal-board');
    }

    function findSquare() {
        const index = row * 10 + col;
        return UIBoard.children[index];
    }

    if (board[row][col] instanceof Ship) {
        const square = findSquare();
        square.classList.remove('empty');
        square.classList.add('ship');
    }
    if (board[row][col] === 'missed') {
        const square = findSquare();
        square.classList.remove('empty');
        square.classList.add('missed');
    }
}

function handleClick(board) {
    let allSquares = null;
    if (board.side === 'modal') {
        const modalBoard = document.querySelector('.modal-board');
        allSquares = modalBoard.querySelectorAll('.grid-square');
    }
    allSquares.forEach((square, index) => {
        square.addEventListener('click', () => {
            if (board.player.placedShipCount !== 5) {
                board.checkAdjacentSquares(index);
            }
        });
    });
}

function rotateShipPlacement(board) {
    const btn = document.querySelector('.rotate');
    btn.addEventListener('click', () => {
        if (board.currentPlacementRotation === 'row') {
            board.currentPlacementRotation = 'col';
        } else if (board.currentPlacementRotation === 'col') {
            board.currentPlacementRotation = 'row';
        }
    });
}

// disable modal popup and display both boards
function startGame() {
    const modalBoard = document.querySelector('.modal-board');
    const allSquares = modalBoard.querySelectorAll('.grid-square');

    const leftBoard = document.querySelector('.left-board');
    const rightBoard = document.querySelector('.right-board');

    function createBoardSquare() {
        const square = document.createElement('div');
        square.classList.add('grid-square');
        square.classList.add('empty');
        return square;
    }

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            rightBoard.appendChild(createBoardSquare());
        }
    }

    allSquares.forEach((square) => {
        leftBoard.appendChild(square);
    });

    const placeShipModal = document.querySelector('.place-ship-modal');
    const darkOverlay = document.querySelector('.dark-overlay');
    placeShipModal.style.display = 'none';
    darkOverlay.style.display = 'none';
}

const DomHandler = {
    updateBoard,
    handleClick,
    rotateShipPlacement,
    startGame,
};

export default DomHandler;
