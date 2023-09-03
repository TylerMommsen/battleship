import Ship from './ship';
import DomHandler from './dom';

export default class GameBoard {
    constructor(side, player, enemyBoard = null, playerBoard = null) {
        this.board = Array.from({ length: 10 }, () => Array(10).fill(null)); // create 10x10 grid
        this.player = player;
        this.side = side;
        this.enemyBoard = enemyBoard;
        this.playerBoard = playerBoard;
        this.currentRotation = 'row';
        if (side === 'modal' || side === 'player') {
            DomHandler.handleClick(this);
        }
    }

    placeShip(length, rotation, row, col) {
        const ship = new Ship(length);
        if (rotation === 'row') {
            for (let i = 0; i < length; i++) {
                this.board[row][col + i] = ship;
                if (this.side === 'modal') {
                    DomHandler.updateBoard(this.board, this.side, row, col + i, 'place-ship');
                }
            }
        }
        if (rotation === 'col') {
            for (let i = 0; i < length; i++) {
                this.board[row + i][col] = ship;
                if (this.side === 'modal') {
                    DomHandler.updateBoard(this.board, this.side, row + i, col, 'place-ship');
                }
            }
        }
    }

    receiveAttack(row, col) {
        const pos = this.board[row][col];
        if (pos === null) { // if coordinate is empty
            this.board[row][col] = 'missed';
            DomHandler.updateBoard(this.board, this.side, row, col, 'missed');
            return true;
        }

        // position contains a ship, damage ship
        if (pos === 'hit' || pos === 'missed') {
            return false;
        }
        pos.timesHit += 1;
        this.board[row][col] = 'hit';
        DomHandler.updateBoard(this.board, this.side, row, col, 'hit');
        const sunk = pos.isSunk();
        if (sunk) {
            this.player.shipsSunk += 1;
            if (this.player.shipsSunk === 5) {
                this.player.lost = true;
            }
        }
        return true;
    }

    attackShip(index) {
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

        const attack = this.enemyBoard.receiveAttack(row, col);
        if (attack) {
            // receive attack from ai
            while (true) {
                const index = Math.floor(Math.random() * 100);
                const row = calcRow(index);
                const col = calcCol(index);
                if (this.board[row][col] !== 'missed') {
                    this.receiveAttack(row, col);
                    break;
                }
            }
        }
    }

    addShip(row, col, shipLength) {
        this.placeShip(shipLength, this.currentRotation, row, col);
        this.player.setShipCount();
        if (this.player.placedShipCount === 5 && this.side === 'modal') {
            DomHandler.startGame();
            this.playerBoard.board = this.board;
            DomHandler.handleClick(this.enemyBoard);
            const rotations = ['row', 'col'];
            while (this.enemyBoard.player.placedShipCount !== 5) {
                this.enemyBoard.currentRotation = rotations[Math.floor(Math.random() * 2)];
                this.enemyBoard.checkAdjacentSquares(Math.floor(Math.random() * 100));
            }
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
            if (this.currentRotation === 'row' && this.board[r] && this.board[r][c] instanceof Ship) {
                return false;
            }
            if (this.currentRotation === 'col' && this.board[r] && this.board[r][c] instanceof Ship) {
                return false;
            }

            // check if out of bounds
            if (this.currentRotation === 'row' && col > calcCol(index + shipLength - 1)) {
                return false;
            }
            if (this.currentRotation === 'col' && calcRow(index + (shipLength * 10) - 10) > 9) {
                return false;
            }

            return true;
        };

        // Check all adjacent squares, including diagonals
        if (this.currentRotation === 'row') {
            for (let r = row - 1; r <= row + 1; r++) {
                for (let c = col - 1; c <= col + shipLength; c++) {
                    if (!isValidPlacement(r, c)) {
                        return; // Adjacent square is occupied or out of bounds
                    }
                }
            }
        } else if (this.currentRotation === 'col') {
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
