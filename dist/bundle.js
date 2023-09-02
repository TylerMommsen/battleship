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

// disable modal popup and display both boards
function startGame() {
    const modalBoard = document.querySelector('.modal-board');
    const allSquares = modalBoard.querySelectorAll('.grid-square');

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
            rightBoard.appendChild(createBoardSquare());
        }
    }

    allSquares.forEach((square) => {
        leftBoard.appendChild(square);
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
        if (this.player.placedShipCount === 5) {
            _dom__WEBPACK_IMPORTED_MODULE_1__["default"].startGame();
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
    _dom__WEBPACK_IMPORTED_MODULE_2__["default"].rotateShipPlacement(modalBoard);
}

gameLoop();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ05vQztBQUNOO0FBQ0M7O0FBRS9CO0FBQ0EsdUJBQXVCLCtDQUFNOztBQUU3QjtBQUNBLDJCQUEyQixrREFBUztBQUNwQyxJQUFJLDRDQUFVO0FBQ2Q7O0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2RvbS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNoaXAgZnJvbSAnLi9zaGlwJztcblxuZnVuY3Rpb24gdXBkYXRlQm9hcmQoYm9hcmQsIHNpZGUsIHJvdywgY29sKSB7XG4gICAgbGV0IFVJQm9hcmQgPSBudWxsO1xuICAgIGlmIChzaWRlID09PSAnbGVmdCcpIHtcbiAgICAgICAgVUlCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sZWZ0LWJvYXJkJyk7XG4gICAgfSBlbHNlIGlmIChzaWRlID09PSAncmlnaHQnKSB7XG4gICAgICAgIFVJQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmlnaHQtYm9hcmQnKTtcbiAgICB9IGVsc2UgaWYgKHNpZGUgPT09ICdtb2RhbCcpIHtcbiAgICAgICAgVUlCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1ib2FyZCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmRTcXVhcmUoKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gcm93ICogMTAgKyBjb2w7XG4gICAgICAgIHJldHVybiBVSUJvYXJkLmNoaWxkcmVuW2luZGV4XTtcbiAgICB9XG5cbiAgICBpZiAoYm9hcmRbcm93XVtjb2xdIGluc3RhbmNlb2YgU2hpcCkge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBmaW5kU3F1YXJlKCk7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdlbXB0eScpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnc2hpcCcpO1xuICAgIH1cbiAgICBpZiAoYm9hcmRbcm93XVtjb2xdID09PSAnbWlzc2VkJykge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBmaW5kU3F1YXJlKCk7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdlbXB0eScpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnbWlzc2VkJyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVDbGljayhib2FyZCkge1xuICAgIGxldCBhbGxTcXVhcmVzID0gbnVsbDtcbiAgICBpZiAoYm9hcmQuc2lkZSA9PT0gJ21vZGFsJykge1xuICAgICAgICBjb25zdCBtb2RhbEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLWJvYXJkJyk7XG4gICAgICAgIGFsbFNxdWFyZXMgPSBtb2RhbEJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncmlkLXNxdWFyZScpO1xuICAgIH1cbiAgICBhbGxTcXVhcmVzLmZvckVhY2goKHNxdWFyZSwgaW5kZXgpID0+IHtcbiAgICAgICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGJvYXJkLnBsYXllci5wbGFjZWRTaGlwQ291bnQgIT09IDUpIHtcbiAgICAgICAgICAgICAgICBib2FyZC5jaGVja0FkamFjZW50U3F1YXJlcyhpbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiByb3RhdGVTaGlwUGxhY2VtZW50KGJvYXJkKSB7XG4gICAgY29uc3QgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJvdGF0ZScpO1xuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgaWYgKGJvYXJkLmN1cnJlbnRQbGFjZW1lbnRSb3RhdGlvbiA9PT0gJ3JvdycpIHtcbiAgICAgICAgICAgIGJvYXJkLmN1cnJlbnRQbGFjZW1lbnRSb3RhdGlvbiA9ICdjb2wnO1xuICAgICAgICB9IGVsc2UgaWYgKGJvYXJkLmN1cnJlbnRQbGFjZW1lbnRSb3RhdGlvbiA9PT0gJ2NvbCcpIHtcbiAgICAgICAgICAgIGJvYXJkLmN1cnJlbnRQbGFjZW1lbnRSb3RhdGlvbiA9ICdyb3cnO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8vIGRpc2FibGUgbW9kYWwgcG9wdXAgYW5kIGRpc3BsYXkgYm90aCBib2FyZHNcbmZ1bmN0aW9uIHN0YXJ0R2FtZSgpIHtcbiAgICBjb25zdCBtb2RhbEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLWJvYXJkJyk7XG4gICAgY29uc3QgYWxsU3F1YXJlcyA9IG1vZGFsQm9hcmQucXVlcnlTZWxlY3RvckFsbCgnLmdyaWQtc3F1YXJlJyk7XG5cbiAgICBjb25zdCBsZWZ0Qm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGVmdC1ib2FyZCcpO1xuICAgIGNvbnN0IHJpZ2h0Qm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmlnaHQtYm9hcmQnKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUJvYXJkU3F1YXJlKCkge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2dyaWQtc3F1YXJlJyk7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKCdlbXB0eScpO1xuICAgICAgICByZXR1cm4gc3F1YXJlO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgIHJpZ2h0Qm9hcmQuYXBwZW5kQ2hpbGQoY3JlYXRlQm9hcmRTcXVhcmUoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbGxTcXVhcmVzLmZvckVhY2goKHNxdWFyZSkgPT4ge1xuICAgICAgICBsZWZ0Qm9hcmQuYXBwZW5kQ2hpbGQoc3F1YXJlKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHBsYWNlU2hpcE1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlLXNoaXAtbW9kYWwnKTtcbiAgICBjb25zdCBkYXJrT3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kYXJrLW92ZXJsYXknKTtcbiAgICBwbGFjZVNoaXBNb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIGRhcmtPdmVybGF5LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG59XG5cbmNvbnN0IERvbUhhbmRsZXIgPSB7XG4gICAgdXBkYXRlQm9hcmQsXG4gICAgaGFuZGxlQ2xpY2ssXG4gICAgcm90YXRlU2hpcFBsYWNlbWVudCxcbiAgICBzdGFydEdhbWUsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBEb21IYW5kbGVyO1xuIiwiaW1wb3J0IFNoaXAgZnJvbSAnLi9zaGlwJztcbmltcG9ydCBEb21IYW5kbGVyIGZyb20gJy4vZG9tJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUJvYXJkIHtcbiAgICBjb25zdHJ1Y3RvcihzaWRlLCBwbGF5ZXIpIHtcbiAgICAgICAgdGhpcy5ib2FyZCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sICgpID0+IEFycmF5KDEwKS5maWxsKG51bGwpKTsgLy8gY3JlYXRlIDEweDEwIGdyaWRcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XG4gICAgICAgIHRoaXMubG9zdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNpZGUgPSBzaWRlOyAvLyB5b3VyIGJvYXJkIG9yIGVuZW15IGJvYXJkICgnbGVmdCcgb3IgJ3JpZ2h0JyBvciAnbW9kYWwnKVxuICAgICAgICB0aGlzLmN1cnJlbnRQbGFjZW1lbnRSb3RhdGlvbiA9ICdyb3cnO1xuICAgICAgICBEb21IYW5kbGVyLmhhbmRsZUNsaWNrKHRoaXMpO1xuICAgIH1cblxuICAgIHBsYWNlU2hpcChsZW5ndGgsIHJvdGF0aW9uLCByb3csIGNvbCkge1xuICAgICAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAobGVuZ3RoKTtcbiAgICAgICAgaWYgKHJvdGF0aW9uID09PSAncm93Jykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbcm93XVtjb2wgKyBpXSA9IHNoaXA7XG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci51cGRhdGVCb2FyZCh0aGlzLmJvYXJkLCB0aGlzLnNpZGUsIHJvdywgY29sICsgaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJvdGF0aW9uID09PSAnY29sJykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbcm93ICsgaV1bY29sXSA9IHNoaXA7XG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci51cGRhdGVCb2FyZCh0aGlzLmJvYXJkLCB0aGlzLnNpZGUsIHJvdyArIGksIGNvbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWNlaXZlQXR0YWNrKHJvdywgY29sKSB7XG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmJvYXJkW3Jvd11bY29sXTtcbiAgICAgICAgaWYgKHBvcyA9PT0gbnVsbCkgeyAvLyBpZiBjb29yZGluYXRlIGlzIGVtcHR5XG4gICAgICAgICAgICBwb3MgPSAnbWlzc2VkJztcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHBvc2l0aW9uIGNvbnRhaW5zIGEgc2hpcCwgZGFtYWdlIHNoaXBcbiAgICAgICAgcG9zLnRpbWVzSGl0ICs9IDE7XG4gICAgICAgIGNvbnN0IHN1bmsgPSBwb3MuaXNTdW5rKCk7XG4gICAgICAgIGlmIChzdW5rKSB0aGlzLmhhc0FsbFN1bmsoKTtcbiAgICB9XG5cbiAgICBoYXNBbGxTdW5rKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5ib2FyZC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvYXJkW2ldW2pdICE9PSBudWxsICYmIHRoaXMuYm9hcmRbaV1bal0gIT09ICdtaXNzaW5nJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYm9hcmRbaV1bal0uaGFzU3VuaykgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvc3QgPSB0cnVlOyAvLyBpZiBhbGwgc2hpcHMgaGF2ZSBiZWVuIHN1bmssIGdhbWUgaXMgb3ZlclxuICAgIH1cblxuICAgIGFkZFNoaXAocm93LCBjb2wsIHNoaXBMZW5ndGgpIHtcbiAgICAgICAgdGhpcy5wbGFjZVNoaXAoc2hpcExlbmd0aCwgdGhpcy5jdXJyZW50UGxhY2VtZW50Um90YXRpb24sIHJvdywgY29sKTtcbiAgICAgICAgdGhpcy5wbGF5ZXIuc2V0U2hpcENvdW50KCk7XG4gICAgICAgIGlmICh0aGlzLnBsYXllci5wbGFjZWRTaGlwQ291bnQgPT09IDUpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuc3RhcnRHYW1lKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiBzcXVhcmVzIG5leHQgdG8gY2xpY2tlZCBwb3MgYXJlIG9jY3VwaWVkIGJlZm9yZSBwbGFjaW5nIHNoaXBcbiAgICBjaGVja0FkamFjZW50U3F1YXJlcyhpbmRleCkge1xuICAgICAgICBjb25zdCBjYWxjUm93ID0gKHgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJvdyA9IE1hdGguZmxvb3IoeCAvIDEwKTtcbiAgICAgICAgICAgIHJldHVybiByb3c7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNhbGNDb2wgPSAoeSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29sdW1uID0gKHkgJSAxMCk7XG4gICAgICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHJvdyA9IGNhbGNSb3coaW5kZXgpO1xuICAgICAgICBjb25zdCBjb2wgPSBjYWxjQ29sKGluZGV4KTtcblxuICAgICAgICBsZXQgc2hpcExlbmd0aCA9IDA7XG4gICAgICAgIHN3aXRjaCAodGhpcy5wbGF5ZXIucGxhY2VkU2hpcENvdW50KSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSA1O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSA0O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSAzO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSAzO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHNoaXBMZW5ndGggPSAyO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBzaGlwTGVuZ3RoID0gMDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNWYWxpZFBsYWNlbWVudCA9IChyLCBjKSA9PiB7XG4gICAgICAgICAgICAvLyBjaGVjayBpZiB0aGVyZSBpcyBhIHNoaXAgYWxyZWFkeSBjbG9zZWJ5XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGxhY2VtZW50Um90YXRpb24gPT09ICdyb3cnICYmIHRoaXMuYm9hcmRbcl0gJiYgdGhpcy5ib2FyZFtyXVtjXSBpbnN0YW5jZW9mIFNoaXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGxhY2VtZW50Um90YXRpb24gPT09ICdjb2wnICYmIHRoaXMuYm9hcmRbcl0gJiYgdGhpcy5ib2FyZFtyXVtjXSBpbnN0YW5jZW9mIFNoaXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIG91dCBvZiBib3VuZHNcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQbGFjZW1lbnRSb3RhdGlvbiA9PT0gJ3JvdycgJiYgY29sID4gY2FsY0NvbChpbmRleCArIHNoaXBMZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQbGFjZW1lbnRSb3RhdGlvbiA9PT0gJ2NvbCcgJiYgY2FsY1JvdyhpbmRleCArIChzaGlwTGVuZ3RoICogMTApIC0gMTApID4gOSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQ2hlY2sgYWxsIGFkamFjZW50IHNxdWFyZXMsIGluY2x1ZGluZyBkaWFnb25hbHNcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBsYWNlbWVudFJvdGF0aW9uID09PSAncm93Jykge1xuICAgICAgICAgICAgZm9yIChsZXQgciA9IHJvdyAtIDE7IHIgPD0gcm93ICsgMTsgcisrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYyA9IGNvbCAtIDE7IGMgPD0gY29sICsgc2hpcExlbmd0aDsgYysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZFBsYWNlbWVudChyLCBjKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBBZGphY2VudCBzcXVhcmUgaXMgb2NjdXBpZWQgb3Igb3V0IG9mIGJvdW5kc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFBsYWNlbWVudFJvdGF0aW9uID09PSAnY29sJykge1xuICAgICAgICAgICAgZm9yIChsZXQgciA9IHJvdyAtIDE7IHIgPD0gcm93ICsgc2hpcExlbmd0aDsgcisrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYyA9IGNvbCAtIDE7IGMgPD0gY29sICsgMTsgYysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZFBsYWNlbWVudChyLCBjKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBBZGphY2VudCBzcXVhcmUgaXMgb2NjdXBpZWQgb3Igb3V0IG9mIGJvdW5kc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHBhc3NlZCBjaGVja3MsIG5vdyBhZGQgc2hpcFxuICAgICAgICB0aGlzLmFkZFNoaXAocm93LCBjb2wsIHNoaXBMZW5ndGgpO1xuICAgIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFR1cm4gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wbGFjZWRTaGlwQ291bnQgPSAwO1xuICAgIH1cblxuICAgIHNldFNoaXBDb3VudCgpIHtcbiAgICAgICAgdGhpcy5wbGFjZWRTaGlwQ291bnQgKz0gMTtcbiAgICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTaGlwIHtcbiAgICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgICAgIHRoaXMudGltZXNIaXQgPSAwO1xuICAgICAgICB0aGlzLmhhc1N1bmsgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBoaXQoKSB7XG4gICAgICAgIHRoaXMudGltZXNIaXQgKz0gMTtcbiAgICB9XG5cbiAgICBpc1N1bmsoKSB7XG4gICAgICAgIGlmICh0aGlzLnRpbWVzSGl0ID09PSB0aGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5oYXNTdW5rID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tICcuL2dhbWVib2FyZCc7XG5pbXBvcnQgUGxheWVyIGZyb20gJy4vcGxheWVyJztcbmltcG9ydCBEb21IYW5kbGVyIGZyb20gJy4vZG9tJztcblxuZnVuY3Rpb24gZ2FtZUxvb3AoKSB7XG4gICAgY29uc3QgcGxheWVyID0gbmV3IFBsYXllcigpO1xuXG4gICAgLy8gY29uc3QgdXNlckJvYXJkID0gbmV3IEdhbWVCb2FyZCgnbGVmdCcsIHBsYXllcik7XG4gICAgY29uc3QgbW9kYWxCb2FyZCA9IG5ldyBHYW1lQm9hcmQoJ21vZGFsJywgcGxheWVyKTtcbiAgICBEb21IYW5kbGVyLnJvdGF0ZVNoaXBQbGFjZW1lbnQobW9kYWxCb2FyZCk7XG59XG5cbmdhbWVMb29wKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=