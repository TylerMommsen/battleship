import Ship from './ship';
import DomHandler from './dom';

export default class GameBoard {
    constructor(side, player) {
        this.board = Array.from({ length: 10 }, () => Array(10).fill(null)); // create 10x10 grid
        this.player = player;
        this.lost = false;
        this.side = side; // your board or enemy board ('left' or 'right' or 'modal')
        this.currentPlacementRotation = 'row';
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
        this.placeShip(shipLength, this.currentPlacementRotation, row, col);
        this.player.setShipCount();
        if (this.player.placedShipCount === 5) {
            DomHandler.startGame();
        }
    }

    // check if squares next to clicked pos are occupied before placing ship
    checkAdjacentSquares(index) {
        const calcRow = (x) => {
            const row = Math.floor(x / 10);
            return row;
        };
        const calcCol = (y) => {
            const column = (y % 10);
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

        const isValidPlacement = (r, c) => {
            // check if there is a ship already closeby
            if (this.currentPlacementRotation === 'row' && this.board[r] && this.board[r][c] instanceof Ship) {
                return false;
            }
            if (this.currentPlacementRotation === 'col' && this.board[r] && this.board[r][c] instanceof Ship) {
                return false;
            }

            // check if out of bounds
            if (this.currentPlacementRotation === 'row' && col > calcCol(index + shipLength - 1)) {
                return false;
            }
            if (this.currentPlacementRotation === 'col' && calcRow(index + (shipLength * 10) - 10) > 9) {
                return false;
            }

            return true;
        };

        // Check all adjacent squares, including diagonals
        if (this.currentPlacementRotation === 'row') {
            for (let r = row - 1; r <= row + 1; r++) {
                for (let c = col - 1; c <= col + shipLength; c++) {
                    if (!isValidPlacement(r, c)) {
                        return; // Adjacent square is occupied or out of bounds
                    }
                }
            }
        } else if (this.currentPlacementRotation === 'col') {
            for (let r = row - 1; r <= row + shipLength; r++) {
                for (let c = col - 1; c <= col + 1; c++) {
                    if (!isValidPlacement(r, c)) {
                        return; // Adjacent square is occupied or out of bounds
                    }
                }
            }
        }
        // passed checks, now add ship
        this.addShip(row, col, shipLength);
    }
}
