import GameBoard from './gameboard';
import Player from './player';
import DomHandler from './dom';

const player = new Player();
const enemy = new Player();

const enemyBoard = new GameBoard('enemy', enemy);
const playerBoard = new GameBoard('player', player, enemyBoard);
enemyBoard.enemyBoard = playerBoard;

const playerModalBoard = new GameBoard('modal', player, enemyBoard);
DomHandler.rotateShipPlacement(playerModalBoard);

player.currentTurn = true;
function gameLoop() {

    requestAnimationFrame(gameLoop);
}

// requestAnimationFrame(gameLoop);
