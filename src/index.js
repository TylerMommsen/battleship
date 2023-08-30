import GameBoard from './gameboard';
import Player from './player';
import DomHandler from './dom';

function gameLoop() {
    const leftBoard = new GameBoard();
    const rightBoard = new GameBoard();
    const player1 = new Player();
    const player2 = new Player();

    DomHandler.displayBoards();
}

gameLoop();
