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


function displayBoards() {
    const leftBoard = document.querySelector('.left-board');
    const rightBoard = document.querySelector('.right-board');

    function createBoardSquare() {
        const square = document.createElement('div');
        square.classList.add('grid-square');
        square.classList.add('empty');
        return square;
    }

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            leftBoard.appendChild(createBoardSquare());
            rightBoard.appendChild(createBoardSquare());
        }
    }
}

function updateBoard(board, side, row, col) {
    let UIBoard = null;
    if (side === 'left') {
        UIBoard = document.querySelector('.left-board');
    } else if (side === 'right') {
        UIBoard = document.querySelector('.right-board');
    }

    function findSquare() {
        const index = row * 10 + col;
        return UIBoard.children[index];
    }

    if (board[row][col] instanceof _ship__WEBPACK_IMPORTED_MODULE_0__["default"]) {
        const square = findSquare();
        square.classList.remove('empty');
        square.classList.add('ship');
    }
    if (board[row][col] === 'missed') {
        const square = findSquare();
        square.classList.remove('empty');
        square.classList.add('missed');
    }
}

function handleClick(board) {
    const allSquares = document.querySelector('.left-board').childNodes;
    allSquares.forEach((square, index) => {
        square.addEventListener('click', () => {
            if (board.player.placedShipCount !== 5) {
                board.checkAdjacentSquares(index);
            }
        });
    });
}

const DomHandler = {
    displayBoards,
    updateBoard,
    handleClick,
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
    constructor(side, player) {
        this.board = Array.from({ length: 10 }, () => Array(10).fill(null)); // create 10x10 grid
        this.player = player;
        this.lost = false;
        this.side = side;
        _dom__WEBPACK_IMPORTED_MODULE_1__["default"].handleClick(this);
    }

    placeShip(length, rotation, row, col) {
        const ship = new _ship__WEBPACK_IMPORTED_MODULE_0__["default"](length);
        if (rotation === 'row') {
            for (let i = 0; i < length; i++) {
                this.board[row][col + i] = ship;
                _dom__WEBPACK_IMPORTED_MODULE_1__["default"].updateBoard(this.board, this.side, row, col + i);
            }
        }
        if (rotation === 'col') {
            for (let i = 0; i < length; i++) {
                this.board[row + i][col] = ship;
                _dom__WEBPACK_IMPORTED_MODULE_1__["default"].updateBoard(this.board, this.side, row + i, col);
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
            if (this.board[r] && this.board[r][c] instanceof _ship__WEBPACK_IMPORTED_MODULE_0__["default"]) {
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
        this.placedShips = false;
        this.placedShipCount = 0;
    }

    setShipCount() {
        this.placedShipCount += 1;
    }

    setPlacedShips() {
        this.placedShips = !this.placedShips;
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




function gameLoop() {
    const player = new _player__WEBPACK_IMPORTED_MODULE_1__["default"]();

    _dom__WEBPACK_IMPORTED_MODULE_2__["default"].displayBoards();
    const userBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]('left', player);
}

gameLoop();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUEwQjs7QUFFMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsUUFBUTtBQUM1Qix3QkFBd0IsUUFBUTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUNBQW1DLDZDQUFJO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLFVBQVUsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvREE7QUFDSzs7QUFFaEI7QUFDZjtBQUNBLGtDQUFrQyxZQUFZLCtCQUErQjtBQUM3RTtBQUNBO0FBQ0E7QUFDQSxRQUFRLDRDQUFVO0FBQ2xCOztBQUVBO0FBQ0EseUJBQXlCLDZDQUFJO0FBQzdCO0FBQ0EsNEJBQTRCLFlBQVk7QUFDeEM7QUFDQSxnQkFBZ0IsNENBQVU7QUFDMUI7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFlBQVk7QUFDeEM7QUFDQSxnQkFBZ0IsNENBQVU7QUFDMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3QkFBd0IsdUJBQXVCO0FBQy9DLDRCQUE0Qix1QkFBdUI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2REFBNkQsNkNBQUk7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOEJBQThCLGNBQWM7QUFDNUMsa0NBQWtDLHVCQUF1QjtBQUN6RDtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ25IZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNkZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztVQ2hCQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7QUNOb0M7QUFDTjtBQUNDOztBQUUvQjtBQUNBLHVCQUF1QiwrQ0FBTTs7QUFFN0IsSUFBSSw0Q0FBVTtBQUNkLDBCQUEwQixrREFBUztBQUNuQzs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXAnO1xuXG5mdW5jdGlvbiBkaXNwbGF5Qm9hcmRzKCkge1xuICAgIGNvbnN0IGxlZnRCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sZWZ0LWJvYXJkJyk7XG4gICAgY29uc3QgcmlnaHRCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yaWdodC1ib2FyZCcpO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlQm9hcmRTcXVhcmUoKSB7XG4gICAgICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnZ3JpZC1zcXVhcmUnKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2VtcHR5Jyk7XG4gICAgICAgIHJldHVybiBzcXVhcmU7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICAgICAgbGVmdEJvYXJkLmFwcGVuZENoaWxkKGNyZWF0ZUJvYXJkU3F1YXJlKCkpO1xuICAgICAgICAgICAgcmlnaHRCb2FyZC5hcHBlbmRDaGlsZChjcmVhdGVCb2FyZFNxdWFyZSgpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlQm9hcmQoYm9hcmQsIHNpZGUsIHJvdywgY29sKSB7XG4gICAgbGV0IFVJQm9hcmQgPSBudWxsO1xuICAgIGlmIChzaWRlID09PSAnbGVmdCcpIHtcbiAgICAgICAgVUlCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sZWZ0LWJvYXJkJyk7XG4gICAgfSBlbHNlIGlmIChzaWRlID09PSAncmlnaHQnKSB7XG4gICAgICAgIFVJQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmlnaHQtYm9hcmQnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kU3F1YXJlKCkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHJvdyAqIDEwICsgY29sO1xuICAgICAgICByZXR1cm4gVUlCb2FyZC5jaGlsZHJlbltpbmRleF07XG4gICAgfVxuXG4gICAgaWYgKGJvYXJkW3Jvd11bY29sXSBpbnN0YW5jZW9mIFNoaXApIHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZmluZFNxdWFyZSgpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnZW1wdHknKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgICB9XG4gICAgaWYgKGJvYXJkW3Jvd11bY29sXSA9PT0gJ21pc3NlZCcpIHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZmluZFNxdWFyZSgpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnZW1wdHknKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ21pc3NlZCcpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlQ2xpY2soYm9hcmQpIHtcbiAgICBjb25zdCBhbGxTcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxlZnQtYm9hcmQnKS5jaGlsZE5vZGVzO1xuICAgIGFsbFNxdWFyZXMuZm9yRWFjaCgoc3F1YXJlLCBpbmRleCkgPT4ge1xuICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoYm9hcmQucGxheWVyLnBsYWNlZFNoaXBDb3VudCAhPT0gNSkge1xuICAgICAgICAgICAgICAgIGJvYXJkLmNoZWNrQWRqYWNlbnRTcXVhcmVzKGluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmNvbnN0IERvbUhhbmRsZXIgPSB7XG4gICAgZGlzcGxheUJvYXJkcyxcbiAgICB1cGRhdGVCb2FyZCxcbiAgICBoYW5kbGVDbGljayxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERvbUhhbmRsZXI7XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXAnO1xuaW1wb3J0IERvbUhhbmRsZXIgZnJvbSAnLi9kb20nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQm9hcmQge1xuICAgIGNvbnN0cnVjdG9yKHNpZGUsIHBsYXllcikge1xuICAgICAgICB0aGlzLmJvYXJkID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKCkgPT4gQXJyYXkoMTApLmZpbGwobnVsbCkpOyAvLyBjcmVhdGUgMTB4MTAgZ3JpZFxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcbiAgICAgICAgdGhpcy5sb3N0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2lkZSA9IHNpZGU7XG4gICAgICAgIERvbUhhbmRsZXIuaGFuZGxlQ2xpY2sodGhpcyk7XG4gICAgfVxuXG4gICAgcGxhY2VTaGlwKGxlbmd0aCwgcm90YXRpb24sIHJvdywgY29sKSB7XG4gICAgICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChsZW5ndGgpO1xuICAgICAgICBpZiAocm90YXRpb24gPT09ICdyb3cnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtyb3ddW2NvbCArIGldID0gc2hpcDtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnVwZGF0ZUJvYXJkKHRoaXMuYm9hcmQsIHRoaXMuc2lkZSwgcm93LCBjb2wgKyBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocm90YXRpb24gPT09ICdjb2wnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtyb3cgKyBpXVtjb2xdID0gc2hpcDtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnVwZGF0ZUJvYXJkKHRoaXMuYm9hcmQsIHRoaXMuc2lkZSwgcm93ICsgaSwgY29sKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlY2VpdmVBdHRhY2socm93LCBjb2wpIHtcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuYm9hcmRbcm93XVtjb2xdO1xuICAgICAgICBpZiAocG9zID09PSBudWxsKSB7IC8vIGlmIGNvb3JkaW5hdGUgaXMgZW1wdHlcbiAgICAgICAgICAgIHBvcyA9ICdtaXNzZWQnO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcG9zaXRpb24gY29udGFpbnMgYSBzaGlwLCBkYW1hZ2Ugc2hpcFxuICAgICAgICBwb3MudGltZXNIaXQgKz0gMTtcbiAgICAgICAgY29uc3Qgc3VuayA9IHBvcy5pc1N1bmsoKTtcbiAgICAgICAgaWYgKHN1bmspIHRoaXMuaGFzQWxsU3VuaygpO1xuICAgIH1cblxuICAgIGhhc0FsbFN1bmsoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmJvYXJkLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbaV1bal0gIT09IG51bGwgJiYgdGhpcy5ib2FyZFtpXVtqXSAhPT0gJ21pc3NpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5ib2FyZFtpXVtqXS5oYXNTdW5rKSByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9zdCA9IHRydWU7IC8vIGlmIGFsbCBzaGlwcyBoYXZlIGJlZW4gc3VuaywgZ2FtZSBpcyBvdmVyXG4gICAgfVxuXG4gICAgYWRkU2hpcChyb3csIGNvbCwgc2hpcExlbmd0aCkge1xuICAgICAgICB0aGlzLnBsYWNlU2hpcChzaGlwTGVuZ3RoLCAncm93Jywgcm93LCBjb2wpO1xuICAgICAgICB0aGlzLnBsYXllci5zZXRTaGlwQ291bnQoKTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiBzcXVhcmVzIG5leHQgdG8gY2xpY2tlZCBwb3MgYXJlIG9jY3VwaWVkIGJlZm9yZSBwbGFjaW5nIHNoaXBcbiAgICBjaGVja0FkamFjZW50U3F1YXJlcyhpbmRleCkge1xuICAgICAgICBjb25zdCBjYWxjUm93ID0gKHgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJvdyA9IE1hdGguZmxvb3IoeCAvIDEwKTtcbiAgICAgICAgICAgIHJldHVybiByb3c7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNhbGNDb2wgPSAoeSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29sdW1uID0gKHkgJSAxMCkgLSAxO1xuICAgICAgICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCByb3cgPSBjYWxjUm93KGluZGV4KTtcbiAgICAgICAgY29uc3QgY29sID0gY2FsY0NvbChpbmRleCk7XG4gICAgICAgIGxldCBzaGlwTGVuZ3RoID0gMDtcbiAgICAgICAgc3dpdGNoICh0aGlzLnBsYXllci5wbGFjZWRTaGlwQ291bnQpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgc2hpcExlbmd0aCA9IDU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgc2hpcExlbmd0aCA9IDQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgc2hpcExlbmd0aCA9IDM7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgc2hpcExlbmd0aCA9IDM7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgc2hpcExlbmd0aCA9IDI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpc09jY3VwaWVkID0gKHIsIGMpID0+IHtcbiAgICAgICAgICAgIGlmIChjb2wgPT09IC0xKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW3JdICYmIHRoaXMuYm9hcmRbcl1bY10gaW5zdGFuY2VvZiBTaGlwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29sID4gY2FsY0NvbChpbmRleCArIHNoaXBMZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgICAgIGlmIChjYWxjQ29sKGluZGV4ICsgc2hpcExlbmd0aCAtIDEpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQ2hlY2sgYWxsIGFkamFjZW50IHNxdWFyZXMsIGluY2x1ZGluZyBkaWFnb25hbHNcbiAgICAgICAgZm9yIChsZXQgciA9IHJvdyAtIDE7IHIgPD0gcm93ICsgMTsgcisrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBjID0gY29sIC0gMTsgYyA8PSBjb2wgKyBzaGlwTGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNPY2N1cGllZChyLCBjKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIEFkamFjZW50IHNxdWFyZSBpcyBvY2N1cGllZCBvciBvdXQgb2YgYm91bmRzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkU2hpcChyb3csIGNvbCwgc2hpcExlbmd0aCk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50VHVybiA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBsYWNlZFNoaXBzID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGxhY2VkU2hpcENvdW50ID0gMDtcbiAgICB9XG5cbiAgICBzZXRTaGlwQ291bnQoKSB7XG4gICAgICAgIHRoaXMucGxhY2VkU2hpcENvdW50ICs9IDE7XG4gICAgfVxuXG4gICAgc2V0UGxhY2VkU2hpcHMoKSB7XG4gICAgICAgIHRoaXMucGxhY2VkU2hpcHMgPSAhdGhpcy5wbGFjZWRTaGlwcztcbiAgICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTaGlwIHtcbiAgICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgICAgIHRoaXMudGltZXNIaXQgPSAwO1xuICAgICAgICB0aGlzLmhhc1N1bmsgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBoaXQoKSB7XG4gICAgICAgIHRoaXMudGltZXNIaXQgKz0gMTtcbiAgICB9XG5cbiAgICBpc1N1bmsoKSB7XG4gICAgICAgIGlmICh0aGlzLnRpbWVzSGl0ID09PSB0aGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5oYXNTdW5rID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tICcuL2dhbWVib2FyZCc7XG5pbXBvcnQgUGxheWVyIGZyb20gJy4vcGxheWVyJztcbmltcG9ydCBEb21IYW5kbGVyIGZyb20gJy4vZG9tJztcblxuZnVuY3Rpb24gZ2FtZUxvb3AoKSB7XG4gICAgY29uc3QgcGxheWVyID0gbmV3IFBsYXllcigpO1xuXG4gICAgRG9tSGFuZGxlci5kaXNwbGF5Qm9hcmRzKCk7XG4gICAgY29uc3QgdXNlckJvYXJkID0gbmV3IEdhbWVCb2FyZCgnbGVmdCcsIHBsYXllcik7XG59XG5cbmdhbWVMb29wKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=