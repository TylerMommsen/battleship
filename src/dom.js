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
};

export default DomHandler;
