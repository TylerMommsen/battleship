import GameBoard from './gameboard';
import Player from './player';
import DomHandler from './dom';

function gameLoop() {
    const leftBoard = new GameBoard('left');
    const rightBoard = new GameBoard('right');
    const player1 = new Player();
    const player2 = new Player();

    DomHandler.displayBoards();
    leftBoard.placeShip(5, 'row', 3, 2);
}

gameLoop();
