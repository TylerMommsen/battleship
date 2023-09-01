import GameBoard from './gameboard';
import Player from './player';
import DomHandler from './dom';

function gameLoop() {
    const player = new Player();

    DomHandler.displayBoards();
    const userBoard = new GameBoard('left', player);
}

gameLoop();
