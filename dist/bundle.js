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
    } else if (side === 'modal') {
        UIBoard = document.querySelector('.modal-board');
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
    let allSquares = null;
    if (board.side === 'modal') {
        const modalBoard = document.querySelector('.modal-board');
        allSquares = modalBoard.querySelectorAll('.grid-square');
    }
    allSquares.forEach((square, index) => {
        square.addEventListener('click', () => {
            if (board.player.placedShipCount !== 5) {
                board.checkAdjacentSquares(index);
            }
        });
    });
}

function rotateShipPlacement(board) {
    const btn = document.querySelector('.rotate');
    btn.addEventListener('click', () => {
        if (board.currentPlacementRotation === 'row') {
            board.currentPlacementRotation = 'col';
        } else if (board.currentPlacementRotation === 'col') {
            board.currentPlacementRotation = 'row';
        }
    });
}

const DomHandler = {
    displayBoards,
    updateBoard,
    handleClick,
    rotateShipPlacement,
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
        this.side = side; // your board or enemy board ('left' or 'right' or 'modal')
        this.currentPlacementRotation = 'row';
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
        this.placeShip(shipLength, this.currentPlacementRotation, row, col);
        this.player.setShipCount();
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
            if (this.currentPlacementRotation === 'row' && this.board[r] && this.board[r][c] instanceof _ship__WEBPACK_IMPORTED_MODULE_0__["default"]) {
                return false;
            }
            if (this.currentPlacementRotation === 'col' && this.board[r] && this.board[r][c] instanceof _ship__WEBPACK_IMPORTED_MODULE_0__["default"]) {
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




function gameLoop() {
    const player = new _player__WEBPACK_IMPORTED_MODULE_1__["default"]();

    // const userBoard = new GameBoard('left', player);
    const modalBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]('modal', player);
    // DomHandler.displayBoards();
    _dom__WEBPACK_IMPORTED_MODULE_2__["default"].rotateShipPlacement(modalBoard);
}

gameLoop();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7QUNOb0M7QUFDTjtBQUNDOztBQUUvQjtBQUNBLHVCQUF1QiwrQ0FBTTs7QUFFN0I7QUFDQSwyQkFBMkIsa0RBQVM7QUFDcEM7QUFDQSxJQUFJLDRDQUFVO0FBQ2Q7O0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNoaXAgZnJvbSAnLi9zaGlwJztcblxuZnVuY3Rpb24gZGlzcGxheUJvYXJkcygpIHtcbiAgICBjb25zdCBsZWZ0Qm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGVmdC1ib2FyZCcpO1xuICAgIGNvbnN0IHJpZ2h0Qm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmlnaHQtYm9hcmQnKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUJvYXJkU3F1YXJlKCkge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2dyaWQtc3F1YXJlJyk7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKCdlbXB0eScpO1xuICAgICAgICByZXR1cm4gc3F1YXJlO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgIGxlZnRCb2FyZC5hcHBlbmRDaGlsZChjcmVhdGVCb2FyZFNxdWFyZSgpKTtcbiAgICAgICAgICAgIHJpZ2h0Qm9hcmQuYXBwZW5kQ2hpbGQoY3JlYXRlQm9hcmRTcXVhcmUoKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUJvYXJkKGJvYXJkLCBzaWRlLCByb3csIGNvbCkge1xuICAgIGxldCBVSUJvYXJkID0gbnVsbDtcbiAgICBpZiAoc2lkZSA9PT0gJ2xlZnQnKSB7XG4gICAgICAgIFVJQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGVmdC1ib2FyZCcpO1xuICAgIH0gZWxzZSBpZiAoc2lkZSA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICBVSUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJpZ2h0LWJvYXJkJyk7XG4gICAgfSBlbHNlIGlmIChzaWRlID09PSAnbW9kYWwnKSB7XG4gICAgICAgIFVJQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtYm9hcmQnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kU3F1YXJlKCkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHJvdyAqIDEwICsgY29sO1xuICAgICAgICByZXR1cm4gVUlCb2FyZC5jaGlsZHJlbltpbmRleF07XG4gICAgfVxuXG4gICAgaWYgKGJvYXJkW3Jvd11bY29sXSBpbnN0YW5jZW9mIFNoaXApIHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZmluZFNxdWFyZSgpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnZW1wdHknKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgICB9XG4gICAgaWYgKGJvYXJkW3Jvd11bY29sXSA9PT0gJ21pc3NlZCcpIHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZmluZFNxdWFyZSgpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnZW1wdHknKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ21pc3NlZCcpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlQ2xpY2soYm9hcmQpIHtcbiAgICBsZXQgYWxsU3F1YXJlcyA9IG51bGw7XG4gICAgaWYgKGJvYXJkLnNpZGUgPT09ICdtb2RhbCcpIHtcbiAgICAgICAgY29uc3QgbW9kYWxCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1ib2FyZCcpO1xuICAgICAgICBhbGxTcXVhcmVzID0gbW9kYWxCb2FyZC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JpZC1zcXVhcmUnKTtcbiAgICB9XG4gICAgYWxsU3F1YXJlcy5mb3JFYWNoKChzcXVhcmUsIGluZGV4KSA9PiB7XG4gICAgICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGlmIChib2FyZC5wbGF5ZXIucGxhY2VkU2hpcENvdW50ICE9PSA1KSB7XG4gICAgICAgICAgICAgICAgYm9hcmQuY2hlY2tBZGphY2VudFNxdWFyZXMoaW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gcm90YXRlU2hpcFBsYWNlbWVudChib2FyZCkge1xuICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yb3RhdGUnKTtcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGlmIChib2FyZC5jdXJyZW50UGxhY2VtZW50Um90YXRpb24gPT09ICdyb3cnKSB7XG4gICAgICAgICAgICBib2FyZC5jdXJyZW50UGxhY2VtZW50Um90YXRpb24gPSAnY29sJztcbiAgICAgICAgfSBlbHNlIGlmIChib2FyZC5jdXJyZW50UGxhY2VtZW50Um90YXRpb24gPT09ICdjb2wnKSB7XG4gICAgICAgICAgICBib2FyZC5jdXJyZW50UGxhY2VtZW50Um90YXRpb24gPSAncm93JztcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5jb25zdCBEb21IYW5kbGVyID0ge1xuICAgIGRpc3BsYXlCb2FyZHMsXG4gICAgdXBkYXRlQm9hcmQsXG4gICAgaGFuZGxlQ2xpY2ssXG4gICAgcm90YXRlU2hpcFBsYWNlbWVudCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERvbUhhbmRsZXI7XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXAnO1xuaW1wb3J0IERvbUhhbmRsZXIgZnJvbSAnLi9kb20nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQm9hcmQge1xuICAgIGNvbnN0cnVjdG9yKHNpZGUsIHBsYXllcikge1xuICAgICAgICB0aGlzLmJvYXJkID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKCkgPT4gQXJyYXkoMTApLmZpbGwobnVsbCkpOyAvLyBjcmVhdGUgMTB4MTAgZ3JpZFxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcbiAgICAgICAgdGhpcy5sb3N0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2lkZSA9IHNpZGU7IC8vIHlvdXIgYm9hcmQgb3IgZW5lbXkgYm9hcmQgKCdsZWZ0JyBvciAncmlnaHQnIG9yICdtb2RhbCcpXG4gICAgICAgIHRoaXMuY3VycmVudFBsYWNlbWVudFJvdGF0aW9uID0gJ3Jvdyc7XG4gICAgICAgIERvbUhhbmRsZXIuaGFuZGxlQ2xpY2sodGhpcyk7XG4gICAgfVxuXG4gICAgcGxhY2VTaGlwKGxlbmd0aCwgcm90YXRpb24sIHJvdywgY29sKSB7XG4gICAgICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChsZW5ndGgpO1xuICAgICAgICBpZiAocm90YXRpb24gPT09ICdyb3cnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtyb3ddW2NvbCArIGldID0gc2hpcDtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnVwZGF0ZUJvYXJkKHRoaXMuYm9hcmQsIHRoaXMuc2lkZSwgcm93LCBjb2wgKyBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocm90YXRpb24gPT09ICdjb2wnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtyb3cgKyBpXVtjb2xdID0gc2hpcDtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnVwZGF0ZUJvYXJkKHRoaXMuYm9hcmQsIHRoaXMuc2lkZSwgcm93ICsgaSwgY29sKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlY2VpdmVBdHRhY2socm93LCBjb2wpIHtcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuYm9hcmRbcm93XVtjb2xdO1xuICAgICAgICBpZiAocG9zID09PSBudWxsKSB7IC8vIGlmIGNvb3JkaW5hdGUgaXMgZW1wdHlcbiAgICAgICAgICAgIHBvcyA9ICdtaXNzZWQnO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcG9zaXRpb24gY29udGFpbnMgYSBzaGlwLCBkYW1hZ2Ugc2hpcFxuICAgICAgICBwb3MudGltZXNIaXQgKz0gMTtcbiAgICAgICAgY29uc3Qgc3VuayA9IHBvcy5pc1N1bmsoKTtcbiAgICAgICAgaWYgKHN1bmspIHRoaXMuaGFzQWxsU3VuaygpO1xuICAgIH1cblxuICAgIGhhc0FsbFN1bmsoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmJvYXJkLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbaV1bal0gIT09IG51bGwgJiYgdGhpcy5ib2FyZFtpXVtqXSAhPT0gJ21pc3NpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5ib2FyZFtpXVtqXS5oYXNTdW5rKSByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9zdCA9IHRydWU7IC8vIGlmIGFsbCBzaGlwcyBoYXZlIGJlZW4gc3VuaywgZ2FtZSBpcyBvdmVyXG4gICAgfVxuXG4gICAgYWRkU2hpcChyb3csIGNvbCwgc2hpcExlbmd0aCkge1xuICAgICAgICB0aGlzLnBsYWNlU2hpcChzaGlwTGVuZ3RoLCB0aGlzLmN1cnJlbnRQbGFjZW1lbnRSb3RhdGlvbiwgcm93LCBjb2wpO1xuICAgICAgICB0aGlzLnBsYXllci5zZXRTaGlwQ291bnQoKTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiBzcXVhcmVzIG5leHQgdG8gY2xpY2tlZCBwb3MgYXJlIG9jY3VwaWVkIGJlZm9yZSBwbGFjaW5nIHNoaXBcbiAgICBjaGVja0FkamFjZW50U3F1YXJlcyhpbmRleCkge1xuICAgICAgICBjb25zdCBjYWxjUm93ID0gKHgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJvdyA9IE1hdGguZmxvb3IoeCAvIDEwKTtcbiAgICAgICAgICAgIHJldHVybiByb3c7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNhbGNDb2wgPSAoeSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29sdW1uID0gKHkgJSAxMCk7XG4gICAgICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHJvdyA9IGNhbGNSb3coaW5kZXgpO1xuICAgICAgICBjb25zdCBjb2wgPSBjYWxjQ29sKGluZGV4KTtcblxuICAgICAgICBsZXQgc2hpcExlbmd0aCA9IDA7XG4gICAgICAgIHN3aXRjaCAodGhpcy5wbGF5ZXIucGxhY2VkU2hpcENvdW50KSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSA1O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSA0O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSAzO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSAzO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSAyO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBzaGlwTGVuZ3RoID0gMDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNWYWxpZFBsYWNlbWVudCA9IChyLCBjKSA9PiB7XG4gICAgICAgICAgICAvLyBjaGVjayBpZiB0aGVyZSBpcyBhIHNoaXAgYWxyZWFkeSBjbG9zZWJ5XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGxhY2VtZW50Um90YXRpb24gPT09ICdyb3cnICYmIHRoaXMuYm9hcmRbcl0gJiYgdGhpcy5ib2FyZFtyXVtjXSBpbnN0YW5jZW9mIFNoaXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGxhY2VtZW50Um90YXRpb24gPT09ICdjb2wnICYmIHRoaXMuYm9hcmRbcl0gJiYgdGhpcy5ib2FyZFtyXVtjXSBpbnN0YW5jZW9mIFNoaXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIG91dCBvZiBib3VuZHNcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQbGFjZW1lbnRSb3RhdGlvbiA9PT0gJ3JvdycgJiYgY29sID4gY2FsY0NvbChpbmRleCArIHNoaXBMZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQbGFjZW1lbnRSb3RhdGlvbiA9PT0gJ2NvbCcgJiYgY2FsY1JvdyhpbmRleCArIChzaGlwTGVuZ3RoICogMTApIC0gMTApID4gOSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQ2hlY2sgYWxsIGFkamFjZW50IHNxdWFyZXMsIGluY2x1ZGluZyBkaWFnb25hbHNcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBsYWNlbWVudFJvdGF0aW9uID09PSAncm93Jykge1xuICAgICAgICAgICAgZm9yIChsZXQgciA9IHJvdyAtIDE7IHIgPD0gcm93ICsgMTsgcisrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYyA9IGNvbCAtIDE7IGMgPD0gY29sICsgc2hpcExlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZFBsYWNlbWVudChyLCBjKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBBZGphY2VudCBzcXVhcmUgaXMgb2NjdXBpZWQgb3Igb3V0IG9mIGJvdW5kc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFBsYWNlbWVudFJvdGF0aW9uID09PSAnY29sJykge1xuICAgICAgICAgICAgZm9yIChsZXQgciA9IHJvdyAtIDE7IHIgPD0gcm93ICsgc2hpcExlbmd0aDsgcisrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYyA9IGNvbCAtIDE7IGMgPD0gY29sICsgMTsgYysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZFBsYWNlbWVudChyLCBjKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBBZGphY2VudCBzcXVhcmUgaXMgb2NjdXBpZWQgb3Igb3V0IG9mIGJvdW5kc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHBhc3NlZCBjaGVja3MsIG5vdyBhZGQgc2hpcFxuICAgICAgICB0aGlzLmFkZFNoaXAocm93LCBjb2wsIHNoaXBMZW5ndGgpO1xuICAgIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFR1cm4gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wbGFjZWRTaGlwQ291bnQgPSAwO1xuICAgIH1cblxuICAgIHNldFNoaXBDb3VudCgpIHtcbiAgICAgICAgdGhpcy5wbGFjZWRTaGlwQ291bnQgKz0gMTtcbiAgICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTaGlwIHtcbiAgICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgICAgIHRoaXMudGltZXNIaXQgPSAwO1xuICAgICAgICB0aGlzLmhhc1N1bmsgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBoaXQoKSB7XG4gICAgICAgIHRoaXMudGltZXNIaXQgKz0gMTtcbiAgICB9XG5cbiAgICBpc1N1bmsoKSB7XG4gICAgICAgIGlmICh0aGlzLnRpbWVzSGl0ID09PSB0aGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5oYXNTdW5rID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tICcuL2dhbWVib2FyZCc7XG5pbXBvcnQgUGxheWVyIGZyb20gJy4vcGxheWVyJztcbmltcG9ydCBEb21IYW5kbGVyIGZyb20gJy4vZG9tJztcblxuZnVuY3Rpb24gZ2FtZUxvb3AoKSB7XG4gICAgY29uc3QgcGxheWVyID0gbmV3IFBsYXllcigpO1xuXG4gICAgLy8gY29uc3QgdXNlckJvYXJkID0gbmV3IEdhbWVCb2FyZCgnbGVmdCcsIHBsYXllcik7XG4gICAgY29uc3QgbW9kYWxCb2FyZCA9IG5ldyBHYW1lQm9hcmQoJ21vZGFsJywgcGxheWVyKTtcbiAgICAvLyBEb21IYW5kbGVyLmRpc3BsYXlCb2FyZHMoKTtcbiAgICBEb21IYW5kbGVyLnJvdGF0ZVNoaXBQbGFjZW1lbnQobW9kYWxCb2FyZCk7XG59XG5cbmdhbWVMb29wKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=