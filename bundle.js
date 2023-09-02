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
        console.log('worked');
        const enemyBoard = document.querySelector('.enemy-board');
        allSquares = enemyBoard.querySelectorAll('.grid-square');
        allSquares.forEach((square, index) => {
            square.addEventListener('click', () => {
                console.log('clicked');
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
    constructor(side, player, enemyBoard = null) {
        this.board = Array.from({ length: 10 }, () => Array(10).fill(null)); // create 10x10 grid
        this.player = player;
        this.side = side;
        this.enemyBoard = enemyBoard;
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
                _dom__WEBPACK_IMPORTED_MODULE_1__["default"].updateBoard(this.board, this.side, row, col + i, 'place-ship');
            }
        }
        if (rotation === 'col') {
            for (let i = 0; i < length; i++) {
                this.board[row + i][col] = ship;
                _dom__WEBPACK_IMPORTED_MODULE_1__["default"].updateBoard(this.board, this.side, row + i, col, 'place-ship');
            }
        }
    }

    receiveAttack(row, col) {
        const pos = this.board[row][col];
        if (pos === null) { // if coordinate is empty
            _dom__WEBPACK_IMPORTED_MODULE_1__["default"].updateBoard(this.board, 'enemy', row, col, 'missed');
            return;
        }

        // position contains a ship, damage ship
        pos.timesHit += 1;
        _dom__WEBPACK_IMPORTED_MODULE_1__["default"].updateBoard(this.board, 'enemy', row, col, 'hit');
        const sunk = pos.isSunk();
        if (sunk) {
            this.player.shipsSunk += 1;
            if (this.player.shipsSunk === 5) {
                this.player.lost = true;
            }
        }
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

        this.enemyBoard.receiveAttack(row, col);
    }

    addShip(row, col, shipLength) {
        this.placeShip(shipLength, this.currentRotation, row, col);
        this.player.setShipCount();
        if (this.player.placedShipCount === 5 && this.side === 'modal') {
            _dom__WEBPACK_IMPORTED_MODULE_1__["default"].startGame();
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
        this.currentTurn = false;
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

const playerModalBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]('modal', player, enemyBoard);
_dom__WEBPACK_IMPORTED_MODULE_2__["default"].rotateShipPlacement(playerModalBoard);

player.currentTurn = true;
function gameLoop() {

    requestAnimationFrame(gameLoop);
}

// requestAnimationFrame(gameLoop);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDaEJBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ05vQztBQUNOO0FBQ0M7O0FBRS9CLG1CQUFtQiwrQ0FBTTtBQUN6QixrQkFBa0IsK0NBQU07O0FBRXhCLHVCQUF1QixrREFBUztBQUNoQyx3QkFBd0Isa0RBQVM7QUFDakM7O0FBRUEsNkJBQTZCLGtEQUFTO0FBQ3RDLDRDQUFVOztBQUVWO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXAnO1xuXG5mdW5jdGlvbiB1cGRhdGVCb2FyZChib2FyZCwgc2lkZSwgcm93LCBjb2wsIHR5cGUpIHtcbiAgICBsZXQgVUlCb2FyZCA9IG51bGw7XG4gICAgaWYgKHNpZGUgPT09ICdwbGF5ZXInKSB7XG4gICAgICAgIFVJQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLWJvYXJkJyk7XG4gICAgfSBlbHNlIGlmIChzaWRlID09PSAnZW5lbXknKSB7XG4gICAgICAgIFVJQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZW5lbXktYm9hcmQnKTtcbiAgICB9IGVsc2UgaWYgKHNpZGUgPT09ICdtb2RhbCcpIHtcbiAgICAgICAgVUlCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItbW9kYWwtYm9hcmQnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kU3F1YXJlKCkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHJvdyAqIDEwICsgY29sO1xuICAgICAgICByZXR1cm4gVUlCb2FyZC5jaGlsZHJlbltpbmRleF07XG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09ICdwbGFjZS1zaGlwJykge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBmaW5kU3F1YXJlKCk7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdlbXB0eScpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnc2hpcCcpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ21pc3NlZCcpIHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZmluZFNxdWFyZSgpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnZW1wdHknKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ21pc3NlZCcpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2hpdCcpIHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZmluZFNxdWFyZSgpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnZW1wdHknKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlQ2xpY2soYm9hcmQpIHtcbiAgICBsZXQgYWxsU3F1YXJlcyA9IG51bGw7XG4gICAgaWYgKGJvYXJkLnNpZGUgPT09ICdtb2RhbCcpIHtcbiAgICAgICAgY29uc3QgcGxheWVyTW9kYWxCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItbW9kYWwtYm9hcmQnKTtcbiAgICAgICAgYWxsU3F1YXJlcyA9IHBsYXllck1vZGFsQm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLmdyaWQtc3F1YXJlJyk7XG4gICAgICAgIGFsbFNxdWFyZXMuZm9yRWFjaCgoc3F1YXJlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChib2FyZC5wbGF5ZXIucGxhY2VkU2hpcENvdW50ICE9PSA1KSB7XG4gICAgICAgICAgICAgICAgICAgIGJvYXJkLmNoZWNrQWRqYWNlbnRTcXVhcmVzKGluZGV4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChib2FyZC5zaWRlID09PSAnZW5lbXknKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd3b3JrZWQnKTtcbiAgICAgICAgY29uc3QgZW5lbXlCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lbmVteS1ib2FyZCcpO1xuICAgICAgICBhbGxTcXVhcmVzID0gZW5lbXlCb2FyZC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JpZC1zcXVhcmUnKTtcbiAgICAgICAgYWxsU3F1YXJlcy5mb3JFYWNoKChzcXVhcmUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsaWNrZWQnKTtcbiAgICAgICAgICAgICAgICBib2FyZC5lbmVteUJvYXJkLmF0dGFja1NoaXAoaW5kZXgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcm90YXRlU2hpcFBsYWNlbWVudChib2FyZCkge1xuICAgIGNvbnN0IGJvYXJkT2JqID0gYm9hcmQ7XG4gICAgY29uc3QgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJvdGF0ZScpO1xuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgaWYgKGJvYXJkT2JqLmN1cnJlbnRSb3RhdGlvbiA9PT0gJ3JvdycpIHtcbiAgICAgICAgICAgIGJvYXJkT2JqLmN1cnJlbnRSb3RhdGlvbiA9ICdjb2wnO1xuICAgICAgICB9IGVsc2UgaWYgKGJvYXJkT2JqLmN1cnJlbnRSb3RhdGlvbiA9PT0gJ2NvbCcpIHtcbiAgICAgICAgICAgIGJvYXJkT2JqLmN1cnJlbnRSb3RhdGlvbiA9ICdyb3cnO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8vIGRpc2FibGUgbW9kYWwgcG9wdXAgYW5kIGRpc3BsYXkgYm90aCBib2FyZHNcbmZ1bmN0aW9uIHN0YXJ0R2FtZSgpIHtcbiAgICBjb25zdCBwbGF5ZXJNb2RhbEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1tb2RhbC1ib2FyZCcpO1xuICAgIGNvbnN0IGFsbFNxdWFyZXMgPSBwbGF5ZXJNb2RhbEJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncmlkLXNxdWFyZScpO1xuXG4gICAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLWJvYXJkJyk7XG4gICAgY29uc3QgZW5lbXlCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lbmVteS1ib2FyZCcpO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlQm9hcmRTcXVhcmUoKSB7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnZ3JpZC1zcXVhcmUnKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2VtcHR5Jyk7XG4gICAgICAgIHJldHVybiBzcXVhcmU7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICAgICAgZW5lbXlCb2FyZC5hcHBlbmRDaGlsZChjcmVhdGVCb2FyZFNxdWFyZSgpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFsbFNxdWFyZXMuZm9yRWFjaCgoc3F1YXJlKSA9PiB7XG4gICAgICAgIHBsYXllckJvYXJkLmFwcGVuZENoaWxkKHNxdWFyZSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBwbGFjZVNoaXBNb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZS1zaGlwLW1vZGFsJyk7XG4gICAgY29uc3QgZGFya092ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGFyay1vdmVybGF5Jyk7XG4gICAgcGxhY2VTaGlwTW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBkYXJrT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xufVxuXG5jb25zdCBEb21IYW5kbGVyID0ge1xuICAgIHVwZGF0ZUJvYXJkLFxuICAgIGhhbmRsZUNsaWNrLFxuICAgIHJvdGF0ZVNoaXBQbGFjZW1lbnQsXG4gICAgc3RhcnRHYW1lLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRG9tSGFuZGxlcjtcbiIsImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcCc7XG5pbXBvcnQgRG9tSGFuZGxlciBmcm9tICcuL2RvbSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVCb2FyZCB7XG4gICAgY29uc3RydWN0b3Ioc2lkZSwgcGxheWVyLCBlbmVteUJvYXJkID0gbnVsbCkge1xuICAgICAgICB0aGlzLmJvYXJkID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKCkgPT4gQXJyYXkoMTApLmZpbGwobnVsbCkpOyAvLyBjcmVhdGUgMTB4MTAgZ3JpZFxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcbiAgICAgICAgdGhpcy5zaWRlID0gc2lkZTtcbiAgICAgICAgdGhpcy5lbmVteUJvYXJkID0gZW5lbXlCb2FyZDtcbiAgICAgICAgdGhpcy5jdXJyZW50Um90YXRpb24gPSAncm93JztcbiAgICAgICAgaWYgKHNpZGUgPT09ICdtb2RhbCcgfHwgc2lkZSA9PT0gJ3BsYXllcicpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuaGFuZGxlQ2xpY2sodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwbGFjZVNoaXAobGVuZ3RoLCByb3RhdGlvbiwgcm93LCBjb2wpIHtcbiAgICAgICAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwKGxlbmd0aCk7XG4gICAgICAgIGlmIChyb3RhdGlvbiA9PT0gJ3JvdycpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW3Jvd11bY29sICsgaV0gPSBzaGlwO1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIudXBkYXRlQm9hcmQodGhpcy5ib2FyZCwgdGhpcy5zaWRlLCByb3csIGNvbCArIGksICdwbGFjZS1zaGlwJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJvdGF0aW9uID09PSAnY29sJykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbcm93ICsgaV1bY29sXSA9IHNoaXA7XG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci51cGRhdGVCb2FyZCh0aGlzLmJvYXJkLCB0aGlzLnNpZGUsIHJvdyArIGksIGNvbCwgJ3BsYWNlLXNoaXAnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlY2VpdmVBdHRhY2socm93LCBjb2wpIHtcbiAgICAgICAgY29uc3QgcG9zID0gdGhpcy5ib2FyZFtyb3ddW2NvbF07XG4gICAgICAgIGlmIChwb3MgPT09IG51bGwpIHsgLy8gaWYgY29vcmRpbmF0ZSBpcyBlbXB0eVxuICAgICAgICAgICAgRG9tSGFuZGxlci51cGRhdGVCb2FyZCh0aGlzLmJvYXJkLCAnZW5lbXknLCByb3csIGNvbCwgJ21pc3NlZCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcG9zaXRpb24gY29udGFpbnMgYSBzaGlwLCBkYW1hZ2Ugc2hpcFxuICAgICAgICBwb3MudGltZXNIaXQgKz0gMTtcbiAgICAgICAgRG9tSGFuZGxlci51cGRhdGVCb2FyZCh0aGlzLmJvYXJkLCAnZW5lbXknLCByb3csIGNvbCwgJ2hpdCcpO1xuICAgICAgICBjb25zdCBzdW5rID0gcG9zLmlzU3VuaygpO1xuICAgICAgICBpZiAoc3Vuaykge1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuc2hpcHNTdW5rICs9IDE7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXIuc2hpcHNTdW5rID09PSA1KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIubG9zdCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhdHRhY2tTaGlwKGluZGV4KSB7XG4gICAgICAgIGNvbnN0IGNhbGNSb3cgPSAoeCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gTWF0aC5mbG9vcih4IC8gMTApO1xuICAgICAgICAgICAgcmV0dXJuIHJvdztcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY2FsY0NvbCA9ICh5KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb2x1bW4gPSAoeSAlIDEwKTtcbiAgICAgICAgICAgIHJldHVybiBjb2x1bW47XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgcm93ID0gY2FsY1JvdyhpbmRleCk7XG4gICAgICAgIGNvbnN0IGNvbCA9IGNhbGNDb2woaW5kZXgpO1xuXG4gICAgICAgIHRoaXMuZW5lbXlCb2FyZC5yZWNlaXZlQXR0YWNrKHJvdywgY29sKTtcbiAgICB9XG5cbiAgICBhZGRTaGlwKHJvdywgY29sLCBzaGlwTGVuZ3RoKSB7XG4gICAgICAgIHRoaXMucGxhY2VTaGlwKHNoaXBMZW5ndGgsIHRoaXMuY3VycmVudFJvdGF0aW9uLCByb3csIGNvbCk7XG4gICAgICAgIHRoaXMucGxheWVyLnNldFNoaXBDb3VudCgpO1xuICAgICAgICBpZiAodGhpcy5wbGF5ZXIucGxhY2VkU2hpcENvdW50ID09PSA1ICYmIHRoaXMuc2lkZSA9PT0gJ21vZGFsJykge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5zdGFydEdhbWUoKTtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuaGFuZGxlQ2xpY2sodGhpcy5lbmVteUJvYXJkKTtcbiAgICAgICAgICAgIGNvbnN0IHJvdGF0aW9ucyA9IFsncm93JywgJ2NvbCddO1xuICAgICAgICAgICAgd2hpbGUgKHRoaXMuZW5lbXlCb2FyZC5wbGF5ZXIucGxhY2VkU2hpcENvdW50ICE9PSA1KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmVteUJvYXJkLmN1cnJlbnRSb3RhdGlvbiA9IHJvdGF0aW9uc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKV07XG4gICAgICAgICAgICAgICAgdGhpcy5lbmVteUJvYXJkLmNoZWNrQWRqYWNlbnRTcXVhcmVzKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaWYgc3F1YXJlcyBuZXh0IHRvIGNsaWNrZWQgcG9zIGFyZSBvY2N1cGllZCBiZWZvcmUgcGxhY2luZyBzaGlwXG4gICAgY2hlY2tBZGphY2VudFNxdWFyZXMoaW5kZXgpIHtcbiAgICAgICAgY29uc3QgY2FsY1JvdyA9ICh4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByb3cgPSBNYXRoLmZsb29yKHggLyAxMCk7XG4gICAgICAgICAgICByZXR1cm4gcm93O1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjYWxjQ29sID0gKHkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbiA9ICh5ICUgMTApO1xuICAgICAgICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCByb3cgPSBjYWxjUm93KGluZGV4KTtcbiAgICAgICAgY29uc3QgY29sID0gY2FsY0NvbChpbmRleCk7XG5cbiAgICAgICAgbGV0IHNoaXBMZW5ndGggPSAwO1xuICAgICAgICBzd2l0Y2ggKHRoaXMucGxheWVyLnBsYWNlZFNoaXBDb3VudCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICBzaGlwTGVuZ3RoID0gNTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBzaGlwTGVuZ3RoID0gNDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBzaGlwTGVuZ3RoID0gMztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBzaGlwTGVuZ3RoID0gMztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICBzaGlwTGVuZ3RoID0gMjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgc2hpcExlbmd0aCA9IDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlzVmFsaWRQbGFjZW1lbnQgPSAociwgYykgPT4ge1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgdGhlcmUgaXMgYSBzaGlwIGFscmVhZHkgY2xvc2VieVxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFJvdGF0aW9uID09PSAncm93JyAmJiB0aGlzLmJvYXJkW3JdICYmIHRoaXMuYm9hcmRbcl1bY10gaW5zdGFuY2VvZiBTaGlwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFJvdGF0aW9uID09PSAnY29sJyAmJiB0aGlzLmJvYXJkW3JdICYmIHRoaXMuYm9hcmRbcl1bY10gaW5zdGFuY2VvZiBTaGlwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjaGVjayBpZiBvdXQgb2YgYm91bmRzXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Um90YXRpb24gPT09ICdyb3cnICYmIGNvbCA+IGNhbGNDb2woaW5kZXggKyBzaGlwTGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Um90YXRpb24gPT09ICdjb2wnICYmIGNhbGNSb3coaW5kZXggKyAoc2hpcExlbmd0aCAqIDEwKSAtIDEwKSA+IDkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIENoZWNrIGFsbCBhZGphY2VudCBzcXVhcmVzLCBpbmNsdWRpbmcgZGlhZ29uYWxzXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRSb3RhdGlvbiA9PT0gJ3JvdycpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSByb3cgLSAxOyByIDw9IHJvdyArIDE7IHIrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGMgPSBjb2wgLSAxOyBjIDw9IGNvbCArIHNoaXBMZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzVmFsaWRQbGFjZW1lbnQociwgYykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsgLy8gQWRqYWNlbnQgc3F1YXJlIGlzIG9jY3VwaWVkIG9yIG91dCBvZiBib3VuZHNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRSb3RhdGlvbiA9PT0gJ2NvbCcpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSByb3cgLSAxOyByIDw9IHJvdyArIHNoaXBMZW5ndGg7IHIrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGMgPSBjb2wgLSAxOyBjIDw9IGNvbCArIDE7IGMrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzVmFsaWRQbGFjZW1lbnQociwgYykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsgLy8gQWRqYWNlbnQgc3F1YXJlIGlzIG9jY3VwaWVkIG9yIG91dCBvZiBib3VuZHNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBwYXNzZWQgY2hlY2tzLCBub3cgYWRkIHNoaXBcbiAgICAgICAgdGhpcy5hZGRTaGlwKHJvdywgY29sLCBzaGlwTGVuZ3RoKTtcbiAgICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRUdXJuID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGxhY2VkU2hpcENvdW50ID0gMDtcbiAgICAgICAgdGhpcy5zaGlwc1N1bmsgPSAwO1xuICAgICAgICB0aGlzLmxvc3QgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBzZXRTaGlwQ291bnQoKSB7XG4gICAgICAgIHRoaXMucGxhY2VkU2hpcENvdW50ICs9IDE7XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hpcCB7XG4gICAgY29uc3RydWN0b3IobGVuZ3RoKSB7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgICAgICB0aGlzLnRpbWVzSGl0ID0gMDtcbiAgICAgICAgdGhpcy5oYXNTdW5rID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaGl0KCkge1xuICAgICAgICB0aGlzLnRpbWVzSGl0ICs9IDE7XG4gICAgfVxuXG4gICAgaXNTdW5rKCkge1xuICAgICAgICBpZiAodGhpcy50aW1lc0hpdCA9PT0gdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuaGFzU3VuayA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBHYW1lQm9hcmQgZnJvbSAnLi9nYW1lYm9hcmQnO1xuaW1wb3J0IFBsYXllciBmcm9tICcuL3BsYXllcic7XG5pbXBvcnQgRG9tSGFuZGxlciBmcm9tICcuL2RvbSc7XG5cbmNvbnN0IHBsYXllciA9IG5ldyBQbGF5ZXIoKTtcbmNvbnN0IGVuZW15ID0gbmV3IFBsYXllcigpO1xuXG5jb25zdCBlbmVteUJvYXJkID0gbmV3IEdhbWVCb2FyZCgnZW5lbXknLCBlbmVteSk7XG5jb25zdCBwbGF5ZXJCb2FyZCA9IG5ldyBHYW1lQm9hcmQoJ3BsYXllcicsIHBsYXllciwgZW5lbXlCb2FyZCk7XG5lbmVteUJvYXJkLmVuZW15Qm9hcmQgPSBwbGF5ZXJCb2FyZDtcblxuY29uc3QgcGxheWVyTW9kYWxCb2FyZCA9IG5ldyBHYW1lQm9hcmQoJ21vZGFsJywgcGxheWVyLCBlbmVteUJvYXJkKTtcbkRvbUhhbmRsZXIucm90YXRlU2hpcFBsYWNlbWVudChwbGF5ZXJNb2RhbEJvYXJkKTtcblxucGxheWVyLmN1cnJlbnRUdXJuID0gdHJ1ZTtcbmZ1bmN0aW9uIGdhbWVMb29wKCkge1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVMb29wKTtcbn1cblxuLy8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVMb29wKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==