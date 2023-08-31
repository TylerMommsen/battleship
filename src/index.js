import GameBoard from './gameboard';
import Player from './player';
import DomHandler from './dom';

function gameLoop() {
    const userBoard = new GameBoard('left');
    const computerBoard = new GameBoard('right');
    const player = new Player(userBoard);
    const computer = new Player(computerBoard);

    DomHandler.displayBoards();
    DomHandler.createShips(player);
}

gameLoop();
