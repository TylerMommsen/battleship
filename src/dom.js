import Ship from './ship';

const DomHandler = {
    displayBoards: () => {
        const leftBoard = document.querySelector('.left-board');
        const rightBoard = document.querySelector('.right-board');

        function createBoardSquare() {
            const square = document.createElement('div');
            square.classList.add('grid-square');
            return square;
        }

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                leftBoard.appendChild(createBoardSquare());
                rightBoard.appendChild(createBoardSquare());
            }
        }
    },
    updateBoard: (board, side, row, col) => {
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
            square.style.backgroundColor = 'green';
        }
        if (board[row][col] === 'missed') {
            const square = findSquare();
            square.style.backgroundColor = 'red';
        }
    },
};

export default DomHandler;
