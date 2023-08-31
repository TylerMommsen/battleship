import Ship from './ship';

function displayBoards() {
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
            leftBoard.appendChild(createBoardSquare());
            rightBoard.appendChild(createBoardSquare());
        }
    }
}

function updateBoard(board, side, row, col) {
    let UIBoard = null;
    if (side === 'left') {
        UIBoard = document.querySelector('.left-board');
    } else if (side === 'right') {
        UIBoard = document.querySelector('.right-board');
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

function createShips(player) {
    const playerObj = player;
    function addShip(square, index) {
        function calcRow(x) {
            const row = Math.floor(x / 10);
            return row;
        }
        function calcCol(y) {
            const column = (y % 10) - 1;
            return column;
        }

        if (player.placedShipCount === 5) {
            playerObj.placedShips = true;
            return;
        }

        const row = calcRow(index);
        const col = calcCol(index);

        if (playerObj.placedShipCount === 0) {
            player.board.placeShip(5, 'row', row, col);
        }
    }

    if (!playerObj.placedShips) {
        const allSquares = document.querySelector('.left-board').childNodes;
        allSquares.forEach((square, index) => {
            square.addEventListener('click', () => {
                addShip(square, index);
            });
        });
    }
}

const DomHandler = {
    displayBoards,
    createShips,
    updateBoard,
};

export default DomHandler;
