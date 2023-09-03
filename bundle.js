/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dom.js":
/*!********************!*\
  !*** ./src/dom.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/ship.js");


function updateBoard(board, side, row, col, type) {
    let UIBoard = null;
    if (side === 'player') {
        UIBoard = document.querySelector('.player-board');
    } else if (side === 'enemy') {
        UIBoard = document.querySelector('.enemy-board');
    } else if (side === 'modal') {
        UIBoard = document.querySelector('.player-modal-board');
    }

    function findSquare() {
        const index = row * 10 + col;
        return UIBoard.children[index];
    }

    if (type === 'place-ship') {
        const square = findSquare();
        square.classList.remove('empty');
        square.classList.add('ship');
    } else if (type === 'missed') {
        const square = findSquare();
        square.classList.remove('empty');
        square.classList.add('missed');
    } else if (type === 'hit') {
        const square = findSquare();
        square.classList.remove('empty');
        square.classList.add('hit');
    }
}

function handleClick(board) {
    let allSquares = null;
    if (board.side === 'modal') {
        const playerModalBoard = document.querySelector('.player-modal-board');
        allSquares = playerModalBoard.querySelectorAll('.grid-square');
        allSquares.forEach((square, index) => {
            square.addEventListener('click', () => {
                if (board.player.placedShipCount !== 5) {
                    board.checkAdjacentSquares(index);
                }
            });
        });
    }
    if (board.side === 'enemy') {
        const enemyBoard = document.querySelector('.enemy-board');
        allSquares = enemyBoard.querySelectorAll('.grid-square');
        allSquares.forEach((square, index) => {
            square.addEventListener('click', () => {
                board.enemyBoard.attackShip(index);
            });
        });
    }
}

function rotateShipPlacement(board) {
    const boardObj = board;
    const btn = document.querySelector('.rotate');
    btn.addEventListener('click', () => {
        if (boardObj.currentRotation === 'row') {
            boardObj.currentRotation = 'col';
        } else if (boardObj.currentRotation === 'col') {
            boardObj.currentRotation = 'row';
        }
    });
}

// disable modal popup and display both boards
function startGame() {
    const playerModalBoard = document.querySelector('.player-modal-board');
    const allSquares = playerModalBoard.querySelectorAll('.grid-square');

    const playerBoard = document.querySelector('.player-board');
    const enemyBoard = document.querySelector('.enemy-board');

    function createBoardSquare() {
        const square = document.createElement('div');
        square.classList.add('grid-square');
        square.classList.add('empty');
        return square;
    }

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            enemyBoard.appendChild(createBoardSquare());
        }
    }

    allSquares.forEach((square) => {
        playerBoard.appendChild(square);
    });

    const placeShipModal = document.querySelector('.place-ship-modal');
    const darkOverlay = document.querySelector('.dark-overlay');
    placeShipModal.style.display = 'none';
    darkOverlay.style.display = 'none';
}

const DomHandler = {
    updateBoard,
    handleClick,
    rotateShipPlacement,
    startGame,
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DomHandler);


/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GameBoard)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/ship.js");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom */ "./src/dom.js");



class GameBoard {
    constructor(side, player, enemyBoard = null, playerBoard = null) {
        this.board = Array.from({ length: 10 }, () => Array(10).fill(null)); // create 10x10 grid
        this.player = player;
        this.side = side;
        this.enemyBoard = enemyBoard;
        this.playerBoard = playerBoard;
        this.currentRotation = 'row';
        if (side === 'modal' || side === 'player') {
            _dom__WEBPACK_IMPORTED_MODULE_1__["default"].handleClick(this);
        }
    }

    placeShip(length, rotation, row, col) {
        const ship = new _ship__WEBPACK_IMPORTED_MODULE_0__["default"](length);
        if (rotation === 'row') {
            for (let i = 0; i < length; i++) {
                this.board[row][col + i] = ship;
                if (this.side === 'modal') {
                    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].updateBoard(this.board, this.side, row, col + i, 'place-ship');
                }
            }
        }
        if (rotation === 'col') {
            for (let i = 0; i < length; i++) {
                this.board[row + i][col] = ship;
                if (this.side === 'modal') {
                    _dom__WEBPACK_IMPORTED_MODULE_1__["default"].updateBoard(this.board, this.side, row + i, col, 'place-ship');
                }
            }
        }
    }

    receiveAttack(row, col) {
        const pos = this.board[row][col];
        if (pos === null) { // if coordinate is empty
            this.board[row][col] = 'missed';
            _dom__WEBPACK_IMPORTED_MODULE_1__["default"].updateBoard(this.board, this.side, row, col, 'missed');
            return true;
        }

        // position contains a ship, damage ship
        if (pos === 'hit' || pos === 'missed') {
            return false;
        }
        pos.timesHit += 1;
        this.board[row][col] = 'hit';
        _dom__WEBPACK_IMPORTED_MODULE_1__["default"].updateBoard(this.board, this.side, row, col, 'hit');
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
            _dom__WEBPACK_IMPORTED_MODULE_1__["default"].startGame();
            this.playerBoard.board = this.board;
            _dom__WEBPACK_IMPORTED_MODULE_1__["default"].handleClick(this.enemyBoard);
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
            if (this.currentRotation === 'row' && this.board[r] && this.board[r][c] instanceof _ship__WEBPACK_IMPORTED_MODULE_0__["default"]) {
                return false;
            }
            if (this.currentRotation === 'col' && this.board[r] && this.board[r][c] instanceof _ship__WEBPACK_IMPORTED_MODULE_0__["default"]) {
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


/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Player)
/* harmony export */ });
class Player {
    constructor() {
        this.placedShipCount = 0;
        this.shipsSunk = 0;
        this.lost = false;
    }

    setShipCount() {
        this.placedShipCount += 1;
    }
}


/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Ship)
/* harmony export */ });
class Ship {
    constructor(length) {
        this.length = length;
        this.timesHit = 0;
        this.hasSunk = false;
    }

    hit() {
        this.timesHit += 1;
    }

    isSunk() {
        if (this.timesHit === this.length) {
            this.hasSunk = true;
        }
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dom */ "./src/dom.js");




const player = new _player__WEBPACK_IMPORTED_MODULE_1__["default"]();
const enemy = new _player__WEBPACK_IMPORTED_MODULE_1__["default"]();

const enemyBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]('enemy', enemy);
const playerBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]('player', player, enemyBoard);
enemyBoard.enemyBoard = playerBoard;

const playerModalBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]('modal', player, enemyBoard, playerBoard);
_dom__WEBPACK_IMPORTED_MODULE_2__["default"].rotateShipPlacement(playerModalBoard);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ1ZlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDaEJBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ05vQztBQUNOO0FBQ0M7O0FBRS9CLG1CQUFtQiwrQ0FBTTtBQUN6QixrQkFBa0IsK0NBQU07O0FBRXhCLHVCQUF1QixrREFBUztBQUNoQyx3QkFBd0Isa0RBQVM7QUFDakM7O0FBRUEsNkJBQTZCLGtEQUFTO0FBQ3RDLDRDQUFVIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb20uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcCc7XG5cbmZ1bmN0aW9uIHVwZGF0ZUJvYXJkKGJvYXJkLCBzaWRlLCByb3csIGNvbCwgdHlwZSkge1xuICAgIGxldCBVSUJvYXJkID0gbnVsbDtcbiAgICBpZiAoc2lkZSA9PT0gJ3BsYXllcicpIHtcbiAgICAgICAgVUlCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItYm9hcmQnKTtcbiAgICB9IGVsc2UgaWYgKHNpZGUgPT09ICdlbmVteScpIHtcbiAgICAgICAgVUlCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lbmVteS1ib2FyZCcpO1xuICAgIH0gZWxzZSBpZiAoc2lkZSA9PT0gJ21vZGFsJykge1xuICAgICAgICBVSUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1tb2RhbC1ib2FyZCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmRTcXVhcmUoKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gcm93ICogMTAgKyBjb2w7XG4gICAgICAgIHJldHVybiBVSUJvYXJkLmNoaWxkcmVuW2luZGV4XTtcbiAgICB9XG5cbiAgICBpZiAodHlwZSA9PT0gJ3BsYWNlLXNoaXAnKSB7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGZpbmRTcXVhcmUoKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ2VtcHR5Jyk7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnbWlzc2VkJykge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBmaW5kU3F1YXJlKCk7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdlbXB0eScpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnbWlzc2VkJyk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnaGl0Jykge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBmaW5kU3F1YXJlKCk7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdlbXB0eScpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVDbGljayhib2FyZCkge1xuICAgIGxldCBhbGxTcXVhcmVzID0gbnVsbDtcbiAgICBpZiAoYm9hcmQuc2lkZSA9PT0gJ21vZGFsJykge1xuICAgICAgICBjb25zdCBwbGF5ZXJNb2RhbEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1tb2RhbC1ib2FyZCcpO1xuICAgICAgICBhbGxTcXVhcmVzID0gcGxheWVyTW9kYWxCb2FyZC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JpZC1zcXVhcmUnKTtcbiAgICAgICAgYWxsU3F1YXJlcy5mb3JFYWNoKChzcXVhcmUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGJvYXJkLnBsYXllci5wbGFjZWRTaGlwQ291bnQgIT09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgYm9hcmQuY2hlY2tBZGphY2VudFNxdWFyZXMoaW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGJvYXJkLnNpZGUgPT09ICdlbmVteScpIHtcbiAgICAgICAgY29uc3QgZW5lbXlCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lbmVteS1ib2FyZCcpO1xuICAgICAgICBhbGxTcXVhcmVzID0gZW5lbXlCb2FyZC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JpZC1zcXVhcmUnKTtcbiAgICAgICAgYWxsU3F1YXJlcy5mb3JFYWNoKChzcXVhcmUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgYm9hcmQuZW5lbXlCb2FyZC5hdHRhY2tTaGlwKGluZGV4KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJvdGF0ZVNoaXBQbGFjZW1lbnQoYm9hcmQpIHtcbiAgICBjb25zdCBib2FyZE9iaiA9IGJvYXJkO1xuICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yb3RhdGUnKTtcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGlmIChib2FyZE9iai5jdXJyZW50Um90YXRpb24gPT09ICdyb3cnKSB7XG4gICAgICAgICAgICBib2FyZE9iai5jdXJyZW50Um90YXRpb24gPSAnY29sJztcbiAgICAgICAgfSBlbHNlIGlmIChib2FyZE9iai5jdXJyZW50Um90YXRpb24gPT09ICdjb2wnKSB7XG4gICAgICAgICAgICBib2FyZE9iai5jdXJyZW50Um90YXRpb24gPSAncm93JztcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vLyBkaXNhYmxlIG1vZGFsIHBvcHVwIGFuZCBkaXNwbGF5IGJvdGggYm9hcmRzXG5mdW5jdGlvbiBzdGFydEdhbWUoKSB7XG4gICAgY29uc3QgcGxheWVyTW9kYWxCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItbW9kYWwtYm9hcmQnKTtcbiAgICBjb25zdCBhbGxTcXVhcmVzID0gcGxheWVyTW9kYWxCb2FyZC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JpZC1zcXVhcmUnKTtcblxuICAgIGNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1ib2FyZCcpO1xuICAgIGNvbnN0IGVuZW15Qm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZW5lbXktYm9hcmQnKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUJvYXJkU3F1YXJlKCkge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2dyaWQtc3F1YXJlJyk7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKCdlbXB0eScpO1xuICAgICAgICByZXR1cm4gc3F1YXJlO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgIGVuZW15Qm9hcmQuYXBwZW5kQ2hpbGQoY3JlYXRlQm9hcmRTcXVhcmUoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbGxTcXVhcmVzLmZvckVhY2goKHNxdWFyZSkgPT4ge1xuICAgICAgICBwbGF5ZXJCb2FyZC5hcHBlbmRDaGlsZChzcXVhcmUpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgcGxhY2VTaGlwTW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Utc2hpcC1tb2RhbCcpO1xuICAgIGNvbnN0IGRhcmtPdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRhcmstb3ZlcmxheScpO1xuICAgIHBsYWNlU2hpcE1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgZGFya092ZXJsYXkuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbn1cblxuY29uc3QgRG9tSGFuZGxlciA9IHtcbiAgICB1cGRhdGVCb2FyZCxcbiAgICBoYW5kbGVDbGljayxcbiAgICByb3RhdGVTaGlwUGxhY2VtZW50LFxuICAgIHN0YXJ0R2FtZSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERvbUhhbmRsZXI7XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXAnO1xuaW1wb3J0IERvbUhhbmRsZXIgZnJvbSAnLi9kb20nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQm9hcmQge1xuICAgIGNvbnN0cnVjdG9yKHNpZGUsIHBsYXllciwgZW5lbXlCb2FyZCA9IG51bGwsIHBsYXllckJvYXJkID0gbnVsbCkge1xuICAgICAgICB0aGlzLmJvYXJkID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKCkgPT4gQXJyYXkoMTApLmZpbGwobnVsbCkpOyAvLyBjcmVhdGUgMTB4MTAgZ3JpZFxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcbiAgICAgICAgdGhpcy5zaWRlID0gc2lkZTtcbiAgICAgICAgdGhpcy5lbmVteUJvYXJkID0gZW5lbXlCb2FyZDtcbiAgICAgICAgdGhpcy5wbGF5ZXJCb2FyZCA9IHBsYXllckJvYXJkO1xuICAgICAgICB0aGlzLmN1cnJlbnRSb3RhdGlvbiA9ICdyb3cnO1xuICAgICAgICBpZiAoc2lkZSA9PT0gJ21vZGFsJyB8fCBzaWRlID09PSAncGxheWVyJykge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5oYW5kbGVDbGljayh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBsYWNlU2hpcChsZW5ndGgsIHJvdGF0aW9uLCByb3csIGNvbCkge1xuICAgICAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAobGVuZ3RoKTtcbiAgICAgICAgaWYgKHJvdGF0aW9uID09PSAncm93Jykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbcm93XVtjb2wgKyBpXSA9IHNoaXA7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2lkZSA9PT0gJ21vZGFsJykge1xuICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnVwZGF0ZUJvYXJkKHRoaXMuYm9hcmQsIHRoaXMuc2lkZSwgcm93LCBjb2wgKyBpLCAncGxhY2Utc2hpcCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocm90YXRpb24gPT09ICdjb2wnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtyb3cgKyBpXVtjb2xdID0gc2hpcDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zaWRlID09PSAnbW9kYWwnKSB7XG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIudXBkYXRlQm9hcmQodGhpcy5ib2FyZCwgdGhpcy5zaWRlLCByb3cgKyBpLCBjb2wsICdwbGFjZS1zaGlwJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVjZWl2ZUF0dGFjayhyb3csIGNvbCkge1xuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLmJvYXJkW3Jvd11bY29sXTtcbiAgICAgICAgaWYgKHBvcyA9PT0gbnVsbCkgeyAvLyBpZiBjb29yZGluYXRlIGlzIGVtcHR5XG4gICAgICAgICAgICB0aGlzLmJvYXJkW3Jvd11bY29sXSA9ICdtaXNzZWQnO1xuICAgICAgICAgICAgRG9tSGFuZGxlci51cGRhdGVCb2FyZCh0aGlzLmJvYXJkLCB0aGlzLnNpZGUsIHJvdywgY29sLCAnbWlzc2VkJyk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHBvc2l0aW9uIGNvbnRhaW5zIGEgc2hpcCwgZGFtYWdlIHNoaXBcbiAgICAgICAgaWYgKHBvcyA9PT0gJ2hpdCcgfHwgcG9zID09PSAnbWlzc2VkJykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHBvcy50aW1lc0hpdCArPSAxO1xuICAgICAgICB0aGlzLmJvYXJkW3Jvd11bY29sXSA9ICdoaXQnO1xuICAgICAgICBEb21IYW5kbGVyLnVwZGF0ZUJvYXJkKHRoaXMuYm9hcmQsIHRoaXMuc2lkZSwgcm93LCBjb2wsICdoaXQnKTtcbiAgICAgICAgY29uc3Qgc3VuayA9IHBvcy5pc1N1bmsoKTtcbiAgICAgICAgaWYgKHN1bmspIHtcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnNoaXBzU3VuayArPSAxO1xuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyLnNoaXBzU3VuayA9PT0gNSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLmxvc3QgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGF0dGFja1NoaXAoaW5kZXgpIHtcbiAgICAgICAgY29uc3QgY2FsY1JvdyA9ICh4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByb3cgPSBNYXRoLmZsb29yKHggLyAxMCk7XG4gICAgICAgICAgICByZXR1cm4gcm93O1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjYWxjQ29sID0gKHkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbiA9ICh5ICUgMTApO1xuICAgICAgICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCByb3cgPSBjYWxjUm93KGluZGV4KTtcbiAgICAgICAgY29uc3QgY29sID0gY2FsY0NvbChpbmRleCk7XG5cbiAgICAgICAgY29uc3QgYXR0YWNrID0gdGhpcy5lbmVteUJvYXJkLnJlY2VpdmVBdHRhY2socm93LCBjb2wpO1xuICAgICAgICBpZiAoYXR0YWNrKSB7XG4gICAgICAgICAgICAvLyByZWNlaXZlIGF0dGFjayBmcm9tIGFpXG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKTtcbiAgICAgICAgICAgICAgICBjb25zdCByb3cgPSBjYWxjUm93KGluZGV4KTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2wgPSBjYWxjQ29sKGluZGV4KTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ib2FyZFtyb3ddW2NvbF0gIT09ICdtaXNzZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVjZWl2ZUF0dGFjayhyb3csIGNvbCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZFNoaXAocm93LCBjb2wsIHNoaXBMZW5ndGgpIHtcbiAgICAgICAgdGhpcy5wbGFjZVNoaXAoc2hpcExlbmd0aCwgdGhpcy5jdXJyZW50Um90YXRpb24sIHJvdywgY29sKTtcbiAgICAgICAgdGhpcy5wbGF5ZXIuc2V0U2hpcENvdW50KCk7XG4gICAgICAgIGlmICh0aGlzLnBsYXllci5wbGFjZWRTaGlwQ291bnQgPT09IDUgJiYgdGhpcy5zaWRlID09PSAnbW9kYWwnKSB7XG4gICAgICAgICAgICBEb21IYW5kbGVyLnN0YXJ0R2FtZSgpO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJCb2FyZC5ib2FyZCA9IHRoaXMuYm9hcmQ7XG4gICAgICAgICAgICBEb21IYW5kbGVyLmhhbmRsZUNsaWNrKHRoaXMuZW5lbXlCb2FyZCk7XG4gICAgICAgICAgICBjb25zdCByb3RhdGlvbnMgPSBbJ3JvdycsICdjb2wnXTtcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLmVuZW15Qm9hcmQucGxheWVyLnBsYWNlZFNoaXBDb3VudCAhPT0gNSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW5lbXlCb2FyZC5jdXJyZW50Um90YXRpb24gPSByb3RhdGlvbnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMildO1xuICAgICAgICAgICAgICAgIHRoaXMuZW5lbXlCb2FyZC5jaGVja0FkamFjZW50U3F1YXJlcyhNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIHNxdWFyZXMgbmV4dCB0byBjbGlja2VkIHBvcyBhcmUgb2NjdXBpZWQgYmVmb3JlIHBsYWNpbmcgc2hpcFxuICAgIGNoZWNrQWRqYWNlbnRTcXVhcmVzKGluZGV4KSB7XG4gICAgICAgIGNvbnN0IGNhbGNSb3cgPSAoeCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gTWF0aC5mbG9vcih4IC8gMTApO1xuICAgICAgICAgICAgcmV0dXJuIHJvdztcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY2FsY0NvbCA9ICh5KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb2x1bW4gPSAoeSAlIDEwKTtcbiAgICAgICAgICAgIHJldHVybiBjb2x1bW47XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgcm93ID0gY2FsY1JvdyhpbmRleCk7XG4gICAgICAgIGNvbnN0IGNvbCA9IGNhbGNDb2woaW5kZXgpO1xuXG4gICAgICAgIGxldCBzaGlwTGVuZ3RoID0gMDtcbiAgICAgICAgc3dpdGNoICh0aGlzLnBsYXllci5wbGFjZWRTaGlwQ291bnQpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgc2hpcExlbmd0aCA9IDU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgc2hpcExlbmd0aCA9IDQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgc2hpcExlbmd0aCA9IDM7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgc2hpcExlbmd0aCA9IDM7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgc2hpcExlbmd0aCA9IDI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpc1ZhbGlkUGxhY2VtZW50ID0gKHIsIGMpID0+IHtcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHRoZXJlIGlzIGEgc2hpcCBhbHJlYWR5IGNsb3NlYnlcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRSb3RhdGlvbiA9PT0gJ3JvdycgJiYgdGhpcy5ib2FyZFtyXSAmJiB0aGlzLmJvYXJkW3JdW2NdIGluc3RhbmNlb2YgU2hpcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRSb3RhdGlvbiA9PT0gJ2NvbCcgJiYgdGhpcy5ib2FyZFtyXSAmJiB0aGlzLmJvYXJkW3JdW2NdIGluc3RhbmNlb2YgU2hpcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY2hlY2sgaWYgb3V0IG9mIGJvdW5kc1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFJvdGF0aW9uID09PSAncm93JyAmJiBjb2wgPiBjYWxjQ29sKGluZGV4ICsgc2hpcExlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFJvdGF0aW9uID09PSAnY29sJyAmJiBjYWxjUm93KGluZGV4ICsgKHNoaXBMZW5ndGggKiAxMCkgLSAxMCkgPiA5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBDaGVjayBhbGwgYWRqYWNlbnQgc3F1YXJlcywgaW5jbHVkaW5nIGRpYWdvbmFsc1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50Um90YXRpb24gPT09ICdyb3cnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCByID0gcm93IC0gMTsgciA8PSByb3cgKyAxOyByKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjID0gY29sIC0gMTsgYyA8PSBjb2wgKyBzaGlwTGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1ZhbGlkUGxhY2VtZW50KHIsIGMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIEFkamFjZW50IHNxdWFyZSBpcyBvY2N1cGllZCBvciBvdXQgb2YgYm91bmRzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50Um90YXRpb24gPT09ICdjb2wnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCByID0gcm93IC0gMTsgciA8PSByb3cgKyBzaGlwTGVuZ3RoOyByKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjID0gY29sIC0gMTsgYyA8PSBjb2wgKyAxOyBjKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1ZhbGlkUGxhY2VtZW50KHIsIGMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIEFkamFjZW50IHNxdWFyZSBpcyBvY2N1cGllZCBvciBvdXQgb2YgYm91bmRzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gcGFzc2VkIGNoZWNrcywgbm93IGFkZCBzaGlwXG4gICAgICAgIHRoaXMuYWRkU2hpcChyb3csIGNvbCwgc2hpcExlbmd0aCk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5wbGFjZWRTaGlwQ291bnQgPSAwO1xuICAgICAgICB0aGlzLnNoaXBzU3VuayA9IDA7XG4gICAgICAgIHRoaXMubG9zdCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHNldFNoaXBDb3VudCgpIHtcbiAgICAgICAgdGhpcy5wbGFjZWRTaGlwQ291bnQgKz0gMTtcbiAgICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTaGlwIHtcbiAgICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgICAgIHRoaXMudGltZXNIaXQgPSAwO1xuICAgICAgICB0aGlzLmhhc1N1bmsgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBoaXQoKSB7XG4gICAgICAgIHRoaXMudGltZXNIaXQgKz0gMTtcbiAgICB9XG5cbiAgICBpc1N1bmsoKSB7XG4gICAgICAgIGlmICh0aGlzLnRpbWVzSGl0ID09PSB0aGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5oYXNTdW5rID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tICcuL2dhbWVib2FyZCc7XG5pbXBvcnQgUGxheWVyIGZyb20gJy4vcGxheWVyJztcbmltcG9ydCBEb21IYW5kbGVyIGZyb20gJy4vZG9tJztcblxuY29uc3QgcGxheWVyID0gbmV3IFBsYXllcigpO1xuY29uc3QgZW5lbXkgPSBuZXcgUGxheWVyKCk7XG5cbmNvbnN0IGVuZW15Qm9hcmQgPSBuZXcgR2FtZUJvYXJkKCdlbmVteScsIGVuZW15KTtcbmNvbnN0IHBsYXllckJvYXJkID0gbmV3IEdhbWVCb2FyZCgncGxheWVyJywgcGxheWVyLCBlbmVteUJvYXJkKTtcbmVuZW15Qm9hcmQuZW5lbXlCb2FyZCA9IHBsYXllckJvYXJkO1xuXG5jb25zdCBwbGF5ZXJNb2RhbEJvYXJkID0gbmV3IEdhbWVCb2FyZCgnbW9kYWwnLCBwbGF5ZXIsIGVuZW15Qm9hcmQsIHBsYXllckJvYXJkKTtcbkRvbUhhbmRsZXIucm90YXRlU2hpcFBsYWNlbWVudChwbGF5ZXJNb2RhbEJvYXJkKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==