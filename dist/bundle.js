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
                if (board.player.lost === true || board.enemyBoard.player.lost === true) return;
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

function displayWinner(winner) {
    const winnerDisplay = document.querySelector('.winner-display');
    if (winner === 'player') {
        winnerDisplay.textContent = 'You won!';
    } else if (winner === 'enemy') {
        winnerDisplay.textContent = 'You lost!';
    }
}

const DomHandler = {
    updateBoard,
    handleClick,
    rotateShipPlacement,
    startGame,
    displayWinner,
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

    calcRow(x) {
        const row = Math.floor(x / 10);
        return row;
    }

    calcCol(x) {
        const column = (x % 10);
        return column;
    }

    receiveAttack(r, c) {
        let row = r;
        let col = c;
        let pos = this.board[row][col];
        if (pos === null) { // if coordinate is empty
            this.board[row][col] = 'missed';
            _dom__WEBPACK_IMPORTED_MODULE_1__["default"].updateBoard(this.board, this.side, row, col, 'missed');
            return true;
        }

        // position contains a ship, damage ship
        if (pos === 'hit' || pos === 'missed') {
            if (this.side === 'player') {
                while (true) {
                    const index = Math.floor(Math.random() * 100);
                    row = this.calcRow(index);
                    col = this.calcCol(index);
                    pos = this.board[row][col];
                    if (pos !== 'hit' && pos !== 'missed') {
                        if (pos === null) {
                            this.board[row][col] = 'missed';
                            _dom__WEBPACK_IMPORTED_MODULE_1__["default"].updateBoard(this.board, this.side, row, col, 'missed');
                            return true;
                        }
                        break;
                    }
                }
            } else {
                return false;
            }
        }
        pos.timesHit += 1;
        this.board[row][col] = 'hit';
        _dom__WEBPACK_IMPORTED_MODULE_1__["default"].updateBoard(this.board, this.side, row, col, 'hit');
        const sunk = pos.isSunk();
        if (sunk) {
            this.player.shipsSunk += 1;
            if (this.player.shipsSunk >= 5) {
                this.player.lost = true;
                _dom__WEBPACK_IMPORTED_MODULE_1__["default"].displayWinner(this.enemyBoard.side);
            }
        }
        return true;
    }

    attackShip(index) {
        let row = this.calcRow(index);
        let col = this.calcCol(index);

        const attack = this.enemyBoard.receiveAttack(row, col);
        if (attack) {
            // receive attack from ai
            while (true) {
                const index = Math.floor(Math.random() * 100);
                row = this.calcRow(index);
                col = this.calcCol(index);
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
        const row = this.calcRow(index);
        const col = this.calcCol(index);

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
            if (this.currentRotation === 'row' && col > this.calcCol(index + shipLength - 1)) {
                return false;
            }
            if (this.currentRotation === 'col' && this.calcRow(index + (shipLength * 10) - 10) > 9) {
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
        if (this.timesHit >= this.length) {
            this.hasSunk = true;
            return true;
        }
        return false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q2hDO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixrQ0FBa0MsdUJBQXVCO0FBQ3pELHNDQUFzQyxjQUFjO0FBQ3BEO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ2pNZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ1ZlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztVQ2xCQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7QUNOb0M7QUFDTjtBQUNDOztBQUUvQixtQkFBbUIsK0NBQU07QUFDekIsa0JBQWtCLCtDQUFNOztBQUV4Qix1QkFBdUIsa0RBQVM7QUFDaEMsd0JBQXdCLGtEQUFTO0FBQ2pDOztBQUVBLDZCQUE2QixrREFBUztBQUN0Qyw0Q0FBVSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXAnO1xuXG5mdW5jdGlvbiB1cGRhdGVCb2FyZChib2FyZCwgc2lkZSwgcm93LCBjb2wsIHR5cGUpIHtcbiAgICBsZXQgVUlCb2FyZCA9IG51bGw7XG4gICAgaWYgKHNpZGUgPT09ICdwbGF5ZXInKSB7XG4gICAgICAgIFVJQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLWJvYXJkJyk7XG4gICAgfSBlbHNlIGlmIChzaWRlID09PSAnZW5lbXknKSB7XG4gICAgICAgIFVJQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZW5lbXktYm9hcmQnKTtcbiAgICB9IGVsc2UgaWYgKHNpZGUgPT09ICdtb2RhbCcpIHtcbiAgICAgICAgVUlCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItbW9kYWwtYm9hcmQnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kU3F1YXJlKCkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHJvdyAqIDEwICsgY29sO1xuICAgICAgICByZXR1cm4gVUlCb2FyZC5jaGlsZHJlbltpbmRleF07XG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09ICdwbGFjZS1zaGlwJykge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBmaW5kU3F1YXJlKCk7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdlbXB0eScpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnc2hpcCcpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ21pc3NlZCcpIHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZmluZFNxdWFyZSgpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnZW1wdHknKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ21pc3NlZCcpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2hpdCcpIHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZmluZFNxdWFyZSgpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnZW1wdHknKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlQ2xpY2soYm9hcmQpIHtcbiAgICBsZXQgYWxsU3F1YXJlcyA9IG51bGw7XG5cbiAgICBpZiAoYm9hcmQuc2lkZSA9PT0gJ21vZGFsJykge1xuICAgICAgICBjb25zdCBwbGF5ZXJNb2RhbEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1tb2RhbC1ib2FyZCcpO1xuICAgICAgICBhbGxTcXVhcmVzID0gcGxheWVyTW9kYWxCb2FyZC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JpZC1zcXVhcmUnKTtcbiAgICAgICAgYWxsU3F1YXJlcy5mb3JFYWNoKChzcXVhcmUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGJvYXJkLnBsYXllci5wbGFjZWRTaGlwQ291bnQgIT09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgYm9hcmQuY2hlY2tBZGphY2VudFNxdWFyZXMoaW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGJvYXJkLnNpZGUgPT09ICdlbmVteScpIHtcbiAgICAgICAgY29uc3QgZW5lbXlCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lbmVteS1ib2FyZCcpO1xuICAgICAgICBhbGxTcXVhcmVzID0gZW5lbXlCb2FyZC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JpZC1zcXVhcmUnKTtcbiAgICAgICAgYWxsU3F1YXJlcy5mb3JFYWNoKChzcXVhcmUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGJvYXJkLnBsYXllci5sb3N0ID09PSB0cnVlIHx8IGJvYXJkLmVuZW15Qm9hcmQucGxheWVyLmxvc3QgPT09IHRydWUpIHJldHVybjtcbiAgICAgICAgICAgICAgICBib2FyZC5lbmVteUJvYXJkLmF0dGFja1NoaXAoaW5kZXgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcm90YXRlU2hpcFBsYWNlbWVudChib2FyZCkge1xuICAgIGNvbnN0IGJvYXJkT2JqID0gYm9hcmQ7XG4gICAgY29uc3QgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJvdGF0ZScpO1xuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgaWYgKGJvYXJkT2JqLmN1cnJlbnRSb3RhdGlvbiA9PT0gJ3JvdycpIHtcbiAgICAgICAgICAgIGJvYXJkT2JqLmN1cnJlbnRSb3RhdGlvbiA9ICdjb2wnO1xuICAgICAgICB9IGVsc2UgaWYgKGJvYXJkT2JqLmN1cnJlbnRSb3RhdGlvbiA9PT0gJ2NvbCcpIHtcbiAgICAgICAgICAgIGJvYXJkT2JqLmN1cnJlbnRSb3RhdGlvbiA9ICdyb3cnO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8vIGRpc2FibGUgbW9kYWwgcG9wdXAgYW5kIGRpc3BsYXkgYm90aCBib2FyZHNcbmZ1bmN0aW9uIHN0YXJ0R2FtZSgpIHtcbiAgICBjb25zdCBwbGF5ZXJNb2RhbEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1tb2RhbC1ib2FyZCcpO1xuICAgIGNvbnN0IGFsbFNxdWFyZXMgPSBwbGF5ZXJNb2RhbEJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncmlkLXNxdWFyZScpO1xuXG4gICAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLWJvYXJkJyk7XG4gICAgY29uc3QgZW5lbXlCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lbmVteS1ib2FyZCcpO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlQm9hcmRTcXVhcmUoKSB7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnZ3JpZC1zcXVhcmUnKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2VtcHR5Jyk7XG4gICAgICAgIHJldHVybiBzcXVhcmU7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICAgICAgZW5lbXlCb2FyZC5hcHBlbmRDaGlsZChjcmVhdGVCb2FyZFNxdWFyZSgpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFsbFNxdWFyZXMuZm9yRWFjaCgoc3F1YXJlKSA9PiB7XG4gICAgICAgIHBsYXllckJvYXJkLmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBwbGFjZVNoaXBNb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZS1zaGlwLW1vZGFsJyk7XG4gICAgY29uc3QgZGFya092ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGFyay1vdmVybGF5Jyk7XG4gICAgcGxhY2VTaGlwTW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBkYXJrT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xufVxuXG5mdW5jdGlvbiBkaXNwbGF5V2lubmVyKHdpbm5lcikge1xuICAgIGNvbnN0IHdpbm5lckRpc3BsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2lubmVyLWRpc3BsYXknKTtcbiAgICBpZiAod2lubmVyID09PSAncGxheWVyJykge1xuICAgICAgICB3aW5uZXJEaXNwbGF5LnRleHRDb250ZW50ID0gJ1lvdSB3b24hJztcbiAgICB9IGVsc2UgaWYgKHdpbm5lciA9PT0gJ2VuZW15Jykge1xuICAgICAgICB3aW5uZXJEaXNwbGF5LnRleHRDb250ZW50ID0gJ1lvdSBsb3N0ISc7XG4gICAgfVxufVxuXG5jb25zdCBEb21IYW5kbGVyID0ge1xuICAgIHVwZGF0ZUJvYXJkLFxuICAgIGhhbmRsZUNsaWNrLFxuICAgIHJvdGF0ZVNoaXBQbGFjZW1lbnQsXG4gICAgc3RhcnRHYW1lLFxuICAgIGRpc3BsYXlXaW5uZXIsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBEb21IYW5kbGVyO1xuIiwiaW1wb3J0IFNoaXAgZnJvbSAnLi9zaGlwJztcbmltcG9ydCBEb21IYW5kbGVyIGZyb20gJy4vZG9tJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUJvYXJkIHtcbiAgICBjb25zdHJ1Y3RvcihzaWRlLCBwbGF5ZXIsIGVuZW15Qm9hcmQgPSBudWxsLCBwbGF5ZXJCb2FyZCA9IG51bGwpIHtcbiAgICAgICAgdGhpcy5ib2FyZCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sICgpID0+IEFycmF5KDEwKS5maWxsKG51bGwpKTsgLy8gY3JlYXRlIDEweDEwIGdyaWRcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XG4gICAgICAgIHRoaXMuc2lkZSA9IHNpZGU7XG4gICAgICAgIHRoaXMuZW5lbXlCb2FyZCA9IGVuZW15Qm9hcmQ7XG4gICAgICAgIHRoaXMucGxheWVyQm9hcmQgPSBwbGF5ZXJCb2FyZDtcbiAgICAgICAgdGhpcy5jdXJyZW50Um90YXRpb24gPSAncm93JztcbiAgICAgICAgaWYgKHNpZGUgPT09ICdtb2RhbCcgfHwgc2lkZSA9PT0gJ3BsYXllcicpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuaGFuZGxlQ2xpY2sodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwbGFjZVNoaXAobGVuZ3RoLCByb3RhdGlvbiwgcm93LCBjb2wpIHtcbiAgICAgICAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwKGxlbmd0aCk7XG4gICAgICAgIGlmIChyb3RhdGlvbiA9PT0gJ3JvdycpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW3Jvd11bY29sICsgaV0gPSBzaGlwO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNpZGUgPT09ICdtb2RhbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgRG9tSGFuZGxlci51cGRhdGVCb2FyZCh0aGlzLmJvYXJkLCB0aGlzLnNpZGUsIHJvdywgY29sICsgaSwgJ3BsYWNlLXNoaXAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJvdGF0aW9uID09PSAnY29sJykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbcm93ICsgaV1bY29sXSA9IHNoaXA7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2lkZSA9PT0gJ21vZGFsJykge1xuICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnVwZGF0ZUJvYXJkKHRoaXMuYm9hcmQsIHRoaXMuc2lkZSwgcm93ICsgaSwgY29sLCAncGxhY2Utc2hpcCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNhbGNSb3coeCkge1xuICAgICAgICBjb25zdCByb3cgPSBNYXRoLmZsb29yKHggLyAxMCk7XG4gICAgICAgIHJldHVybiByb3c7XG4gICAgfVxuXG4gICAgY2FsY0NvbCh4KSB7XG4gICAgICAgIGNvbnN0IGNvbHVtbiA9ICh4ICUgMTApO1xuICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgIH1cblxuICAgIHJlY2VpdmVBdHRhY2sociwgYykge1xuICAgICAgICBsZXQgcm93ID0gcjtcbiAgICAgICAgbGV0IGNvbCA9IGM7XG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmJvYXJkW3Jvd11bY29sXTtcbiAgICAgICAgaWYgKHBvcyA9PT0gbnVsbCkgeyAvLyBpZiBjb29yZGluYXRlIGlzIGVtcHR5XG4gICAgICAgICAgICB0aGlzLmJvYXJkW3Jvd11bY29sXSA9ICdtaXNzZWQnO1xuICAgICAgICAgICAgRG9tSGFuZGxlci51cGRhdGVCb2FyZCh0aGlzLmJvYXJkLCB0aGlzLnNpZGUsIHJvdywgY29sLCAnbWlzc2VkJyk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHBvc2l0aW9uIGNvbnRhaW5zIGEgc2hpcCwgZGFtYWdlIHNoaXBcbiAgICAgICAgaWYgKHBvcyA9PT0gJ2hpdCcgfHwgcG9zID09PSAnbWlzc2VkJykge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2lkZSA9PT0gJ3BsYXllcicpIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCk7XG4gICAgICAgICAgICAgICAgICAgIHJvdyA9IHRoaXMuY2FsY1JvdyhpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbCA9IHRoaXMuY2FsY0NvbChpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IHRoaXMuYm9hcmRbcm93XVtjb2xdO1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9zICE9PSAnaGl0JyAmJiBwb3MgIT09ICdtaXNzZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocG9zID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtyb3ddW2NvbF0gPSAnbWlzc2VkJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnVwZGF0ZUJvYXJkKHRoaXMuYm9hcmQsIHRoaXMuc2lkZSwgcm93LCBjb2wsICdtaXNzZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcG9zLnRpbWVzSGl0ICs9IDE7XG4gICAgICAgIHRoaXMuYm9hcmRbcm93XVtjb2xdID0gJ2hpdCc7XG4gICAgICAgIERvbUhhbmRsZXIudXBkYXRlQm9hcmQodGhpcy5ib2FyZCwgdGhpcy5zaWRlLCByb3csIGNvbCwgJ2hpdCcpO1xuICAgICAgICBjb25zdCBzdW5rID0gcG9zLmlzU3VuaygpO1xuICAgICAgICBpZiAoc3Vuaykge1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuc2hpcHNTdW5rICs9IDE7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXIuc2hpcHNTdW5rID49IDUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5sb3N0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmRpc3BsYXlXaW5uZXIodGhpcy5lbmVteUJvYXJkLnNpZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGF0dGFja1NoaXAoaW5kZXgpIHtcbiAgICAgICAgbGV0IHJvdyA9IHRoaXMuY2FsY1JvdyhpbmRleCk7XG4gICAgICAgIGxldCBjb2wgPSB0aGlzLmNhbGNDb2woaW5kZXgpO1xuXG4gICAgICAgIGNvbnN0IGF0dGFjayA9IHRoaXMuZW5lbXlCb2FyZC5yZWNlaXZlQXR0YWNrKHJvdywgY29sKTtcbiAgICAgICAgaWYgKGF0dGFjaykge1xuICAgICAgICAgICAgLy8gcmVjZWl2ZSBhdHRhY2sgZnJvbSBhaVxuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCk7XG4gICAgICAgICAgICAgICAgcm93ID0gdGhpcy5jYWxjUm93KGluZGV4KTtcbiAgICAgICAgICAgICAgICBjb2wgPSB0aGlzLmNhbGNDb2woaW5kZXgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3Jvd11bY29sXSAhPT0gJ21pc3NlZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWNlaXZlQXR0YWNrKHJvdywgY29sKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkU2hpcChyb3csIGNvbCwgc2hpcExlbmd0aCkge1xuICAgICAgICB0aGlzLnBsYWNlU2hpcChzaGlwTGVuZ3RoLCB0aGlzLmN1cnJlbnRSb3RhdGlvbiwgcm93LCBjb2wpO1xuICAgICAgICB0aGlzLnBsYXllci5zZXRTaGlwQ291bnQoKTtcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLnBsYWNlZFNoaXBDb3VudCA9PT0gNSAmJiB0aGlzLnNpZGUgPT09ICdtb2RhbCcpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuc3RhcnRHYW1lKCk7XG4gICAgICAgICAgICB0aGlzLnBsYXllckJvYXJkLmJvYXJkID0gdGhpcy5ib2FyZDtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuaGFuZGxlQ2xpY2sodGhpcy5lbmVteUJvYXJkKTtcbiAgICAgICAgICAgIGNvbnN0IHJvdGF0aW9ucyA9IFsncm93JywgJ2NvbCddO1xuICAgICAgICAgICAgd2hpbGUgKHRoaXMuZW5lbXlCb2FyZC5wbGF5ZXIucGxhY2VkU2hpcENvdW50ICE9PSA1KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmVteUJvYXJkLmN1cnJlbnRSb3RhdGlvbiA9IHJvdGF0aW9uc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKV07XG4gICAgICAgICAgICAgICAgdGhpcy5lbmVteUJvYXJkLmNoZWNrQWRqYWNlbnRTcXVhcmVzKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaWYgc3F1YXJlcyBuZXh0IHRvIGNsaWNrZWQgcG9zIGFyZSBvY2N1cGllZCBiZWZvcmUgcGxhY2luZyBzaGlwXG4gICAgY2hlY2tBZGphY2VudFNxdWFyZXMoaW5kZXgpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5jYWxjUm93KGluZGV4KTtcbiAgICAgICAgY29uc3QgY29sID0gdGhpcy5jYWxjQ29sKGluZGV4KTtcblxuICAgICAgICBsZXQgc2hpcExlbmd0aCA9IDA7XG4gICAgICAgIHN3aXRjaCAodGhpcy5wbGF5ZXIucGxhY2VkU2hpcENvdW50KSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSA1O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSA0O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSAzO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSAzO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSAyO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBzaGlwTGVuZ3RoID0gMDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNWYWxpZFBsYWNlbWVudCA9IChyLCBjKSA9PiB7XG4gICAgICAgICAgICAvLyBjaGVjayBpZiB0aGVyZSBpcyBhIHNoaXAgYWxyZWFkeSBjbG9zZWJ5XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Um90YXRpb24gPT09ICdyb3cnICYmIHRoaXMuYm9hcmRbcl0gJiYgdGhpcy5ib2FyZFtyXVtjXSBpbnN0YW5jZW9mIFNoaXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Um90YXRpb24gPT09ICdjb2wnICYmIHRoaXMuYm9hcmRbcl0gJiYgdGhpcy5ib2FyZFtyXVtjXSBpbnN0YW5jZW9mIFNoaXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIG91dCBvZiBib3VuZHNcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRSb3RhdGlvbiA9PT0gJ3JvdycgJiYgY29sID4gdGhpcy5jYWxjQ29sKGluZGV4ICsgc2hpcExlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFJvdGF0aW9uID09PSAnY29sJyAmJiB0aGlzLmNhbGNSb3coaW5kZXggKyAoc2hpcExlbmd0aCAqIDEwKSAtIDEwKSA+IDkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIENoZWNrIGFsbCBhZGphY2VudCBzcXVhcmVzLCBpbmNsdWRpbmcgZGlhZ29uYWxzXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRSb3RhdGlvbiA9PT0gJ3JvdycpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSByb3cgLSAxOyByIDw9IHJvdyArIDE7IHIrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGMgPSBjb2wgLSAxOyBjIDw9IGNvbCArIHNoaXBMZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzVmFsaWRQbGFjZW1lbnQociwgYykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsgLy8gQWRqYWNlbnQgc3F1YXJlIGlzIG9jY3VwaWVkIG9yIG91dCBvZiBib3VuZHNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRSb3RhdGlvbiA9PT0gJ2NvbCcpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSByb3cgLSAxOyByIDw9IHJvdyArIHNoaXBMZW5ndGg7IHIrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGMgPSBjb2wgLSAxOyBjIDw9IGNvbCArIDE7IGMrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzVmFsaWRQbGFjZW1lbnQociwgYykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsgLy8gQWRqYWNlbnQgc3F1YXJlIGlzIG9jY3VwaWVkIG9yIG91dCBvZiBib3VuZHNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBwYXNzZWQgY2hlY2tzLCBub3cgYWRkIHNoaXBcbiAgICAgICAgdGhpcy5hZGRTaGlwKHJvdywgY29sLCBzaGlwTGVuZ3RoKTtcbiAgICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnBsYWNlZFNoaXBDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuc2hpcHNTdW5rID0gMDtcbiAgICAgICAgdGhpcy5sb3N0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgc2V0U2hpcENvdW50KCkge1xuICAgICAgICB0aGlzLnBsYWNlZFNoaXBDb3VudCArPSAxO1xuICAgIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXAge1xuICAgIGNvbnN0cnVjdG9yKGxlbmd0aCkge1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICAgICAgdGhpcy50aW1lc0hpdCA9IDA7XG4gICAgICAgIHRoaXMuaGFzU3VuayA9IGZhbHNlO1xuICAgIH1cblxuICAgIGhpdCgpIHtcbiAgICAgICAgdGhpcy50aW1lc0hpdCArPSAxO1xuICAgIH1cblxuICAgIGlzU3VuaygpIHtcbiAgICAgICAgaWYgKHRoaXMudGltZXNIaXQgPj0gdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuaGFzU3VuayA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gJy4vZ2FtZWJvYXJkJztcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9wbGF5ZXInO1xuaW1wb3J0IERvbUhhbmRsZXIgZnJvbSAnLi9kb20nO1xuXG5jb25zdCBwbGF5ZXIgPSBuZXcgUGxheWVyKCk7XG5jb25zdCBlbmVteSA9IG5ldyBQbGF5ZXIoKTtcblxuY29uc3QgZW5lbXlCb2FyZCA9IG5ldyBHYW1lQm9hcmQoJ2VuZW15JywgZW5lbXkpO1xuY29uc3QgcGxheWVyQm9hcmQgPSBuZXcgR2FtZUJvYXJkKCdwbGF5ZXInLCBwbGF5ZXIsIGVuZW15Qm9hcmQpO1xuZW5lbXlCb2FyZC5lbmVteUJvYXJkID0gcGxheWVyQm9hcmQ7XG5cbmNvbnN0IHBsYXllck1vZGFsQm9hcmQgPSBuZXcgR2FtZUJvYXJkKCdtb2RhbCcsIHBsYXllciwgZW5lbXlCb2FyZCwgcGxheWVyQm9hcmQpO1xuRG9tSGFuZGxlci5yb3RhdGVTaGlwUGxhY2VtZW50KHBsYXllck1vZGFsQm9hcmQpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9