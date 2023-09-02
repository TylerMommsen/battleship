import GameBoard from './gameboard';
import Player from './player';
import DomHandler from './dom';

function gameLoop() {
    const player = new Player();

    // const userBoard = new GameBoard('left', player);
    const modalBoard = new GameBoard('modal', player);
    // DomHandler.displayBoards();
    DomHandler.rotateShipPlacement(modalBoard);
}

gameLoop();
