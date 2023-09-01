import Ship from './ship';
import DomHandler from './dom';

export default class GameBoard {
    constructor(side, player) {
        this.board = Array.from({ length: 10 }, () => Array(10).fill(null)); // create 10x10 grid
        this.player = player;
        this.lost = false;
        this.side = side;
        DomHandler.handleClick(this);
    }

    placeShip(length, rotation, row, col) {
        const ship = new Ship(length);
        if (rotation === 'row') {
            for (let i = 0; i < length; i++) {
                this.board[row][col + i] = ship;
                DomHandler.updateBoard(this.board, this.side, row, col + i);
            }
        }
        if (rotation === 'col') {
            for (let i = 0; i < length; i++) {
                this.board[row + i][col] = ship;
                DomHandler.updateBoard(this.board, this.side, row + i, col);
            }
        }
    }

    receiveAttack(row, col) {
        let pos = this.board[row][col];
        if (pos === null) { // if coordinate is empty
            pos = 'missed';
            return;
        }

        // position contains a ship, damage ship
        pos.timesHit += 1;
        const sunk = pos.isSunk();
        if (sunk) this.hasAllSunk();
    }

    hasAllSunk() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                if (this.board[i][j] !== null && this.board[i][j] !== 'missing') {
                    if (!this.board[i][j].hasSunk) return;
                }
            }
        }
        this.lost = true; // if all ships have been sunk, game is over
    }

    addShip(row, col, shipLength) {
        this.placeShip(shipLength, 'row', row, col);
        this.player.setShipCount();
    }

    // check if squares next to clicked pos are occupied before placing ship
    checkAdjacentSquares(index) {
        const calcRow = (x) => {
            const row = Math.floor(x / 10);
            return row;
        };
        const calcCol = (y) => {
            const column = (y % 10) - 1;
            return column;
        };

        const row = calcRow(index);
        const col = calcCol(index);
        let shipLength = 0;
        switch (this.player.placedShipCount) {
        case 0:
            shipLength = 5;
            break;
        case 1:
            shipLength = 4;
            break;
        case 2:
            shipLength = 3;
            break;
        case 3:
            shipLength = 3;
            break;
        case 4:
            shipLength = 2;
            break;
        default:
            shipLength = 0;
            break;
        }

        const isOccupied = (r, c) => {
            if (col === -1) return true;
            if (this.board[r] && this.board[r][c] instanceof Ship) {
                return true;
            }
            if (col > calcCol(index + shipLength - 1)) {
                if (calcCol(index + shipLength - 1) !== -1) {
                    return true;
                }
            }
            return false;
        };

        // Check all adjacent squares, including diagonals
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + shipLength; c++) {
                if (isOccupied(r, c)) {
                    return; // Adjacent square is occupied or out of bounds
                }
            }
        }
        this.addShip(row, col, shipLength);
    }
}
