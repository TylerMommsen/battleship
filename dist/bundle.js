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

function createShips(player) {
    const playerObj = player;
    function addShip(square, index) {
        function calcRow(x) {
            const row = Math.floor(x / 10);
            return row;
        }
        function calcCol(y) {
            const column = (y % 10) - 1;
            return column;
        }

        if (player.placedShipCount === 5) {
            playerObj.placedShips = true;
            return;
        }

        const row = calcRow(index);
        const col = calcCol(index);

        if (playerObj.placedShipCount === 0) {
            player.board.placeShip(5, 'row', row, col);
        }
    }

    if (!playerObj.placedShips) {
        const allSquares = document.querySelector('.left-board').childNodes;
        allSquares.forEach((square, index) => {
            square.addEventListener('click', () => {
                addShip(square, index);
            });
        });
    }
}

const DomHandler = {
    displayBoards,
    createShips,
    updateBoard,
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
    constructor(side) {
        this.board = Array.from({ length: 10 }, () => Array(10).fill(null)); // create 10x10 grid
        this.lost = false;
        this.side = side;
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
    constructor(board) {
        this.currentTurn = false;
        this.placedShips = false;
        this.placedShipCount = 0;
        this.board = board;
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
    const userBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]('left');
    const computerBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]('right');
    const player = new _player__WEBPACK_IMPORTED_MODULE_1__["default"](userBoard);
    const computer = new _player__WEBPACK_IMPORTED_MODULE_1__["default"](computerBoard);

    _dom__WEBPACK_IMPORTED_MODULE_2__["default"].displayBoards();
    _dom__WEBPACK_IMPORTED_MODULE_2__["default"].createShips(player);
}

gameLoop();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUEwQjs7QUFFMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsUUFBUTtBQUM1Qix3QkFBd0IsUUFBUTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUNBQW1DLDZDQUFJO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsVUFBVSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZGQTtBQUNLOztBQUVoQjtBQUNmO0FBQ0Esa0NBQWtDLFlBQVksK0JBQStCO0FBQzdFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF5Qiw2Q0FBSTtBQUM3QjtBQUNBLDRCQUE0QixZQUFZO0FBQ3hDO0FBQ0EsZ0JBQWdCLDRDQUFVO0FBQzFCO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixZQUFZO0FBQ3hDO0FBQ0EsZ0JBQWdCLDRDQUFVO0FBQzFCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQyw0QkFBNEIsdUJBQXVCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDakRlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ1BlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDaEJBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ05vQztBQUNOO0FBQ0M7O0FBRS9CO0FBQ0EsMEJBQTBCLGtEQUFTO0FBQ25DLDhCQUE4QixrREFBUztBQUN2Qyx1QkFBdUIsK0NBQU07QUFDN0IseUJBQXlCLCtDQUFNOztBQUUvQixJQUFJLDRDQUFVO0FBQ2QsSUFBSSw0Q0FBVTtBQUNkOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9kb20uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcCc7XG5cbmZ1bmN0aW9uIGRpc3BsYXlCb2FyZHMoKSB7XG4gICAgY29uc3QgbGVmdEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxlZnQtYm9hcmQnKTtcbiAgICBjb25zdCByaWdodEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJpZ2h0LWJvYXJkJyk7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVCb2FyZFNxdWFyZSgpIHtcbiAgICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKCdncmlkLXNxdWFyZScpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnZW1wdHknKTtcbiAgICAgICAgcmV0dXJuIHNxdWFyZTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgICAgICBsZWZ0Qm9hcmQuYXBwZW5kQ2hpbGQoY3JlYXRlQm9hcmRTcXVhcmUoKSk7XG4gICAgICAgICAgICByaWdodEJvYXJkLmFwcGVuZENoaWxkKGNyZWF0ZUJvYXJkU3F1YXJlKCkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVCb2FyZChib2FyZCwgc2lkZSwgcm93LCBjb2wpIHtcbiAgICBsZXQgVUlCb2FyZCA9IG51bGw7XG4gICAgaWYgKHNpZGUgPT09ICdsZWZ0Jykge1xuICAgICAgICBVSUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxlZnQtYm9hcmQnKTtcbiAgICB9IGVsc2UgaWYgKHNpZGUgPT09ICdyaWdodCcpIHtcbiAgICAgICAgVUlCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yaWdodC1ib2FyZCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmRTcXVhcmUoKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gcm93ICogMTAgKyBjb2w7XG4gICAgICAgIHJldHVybiBVSUJvYXJkLmNoaWxkcmVuW2luZGV4XTtcbiAgICB9XG5cbiAgICBpZiAoYm9hcmRbcm93XVtjb2xdIGluc3RhbmNlb2YgU2hpcCkge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBmaW5kU3F1YXJlKCk7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdlbXB0eScpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnc2hpcCcpO1xuICAgIH1cbiAgICBpZiAoYm9hcmRbcm93XVtjb2xdID09PSAnbWlzc2VkJykge1xuICAgICAgICBjb25zdCBzcXVhcmUgPSBmaW5kU3F1YXJlKCk7XG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdlbXB0eScpO1xuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnbWlzc2VkJyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTaGlwcyhwbGF5ZXIpIHtcbiAgICBjb25zdCBwbGF5ZXJPYmogPSBwbGF5ZXI7XG4gICAgZnVuY3Rpb24gYWRkU2hpcChzcXVhcmUsIGluZGV4KSB7XG4gICAgICAgIGZ1bmN0aW9uIGNhbGNSb3coeCkge1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gTWF0aC5mbG9vcih4IC8gMTApO1xuICAgICAgICAgICAgcmV0dXJuIHJvdztcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjYWxjQ29sKHkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbiA9ICh5ICUgMTApIC0gMTtcbiAgICAgICAgICAgIHJldHVybiBjb2x1bW47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGxheWVyLnBsYWNlZFNoaXBDb3VudCA9PT0gNSkge1xuICAgICAgICAgICAgcGxheWVyT2JqLnBsYWNlZFNoaXBzID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJvdyA9IGNhbGNSb3coaW5kZXgpO1xuICAgICAgICBjb25zdCBjb2wgPSBjYWxjQ29sKGluZGV4KTtcblxuICAgICAgICBpZiAocGxheWVyT2JqLnBsYWNlZFNoaXBDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgcGxheWVyLmJvYXJkLnBsYWNlU2hpcCg1LCAncm93Jywgcm93LCBjb2wpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFwbGF5ZXJPYmoucGxhY2VkU2hpcHMpIHtcbiAgICAgICAgY29uc3QgYWxsU3F1YXJlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sZWZ0LWJvYXJkJykuY2hpbGROb2RlcztcbiAgICAgICAgYWxsU3F1YXJlcy5mb3JFYWNoKChzcXVhcmUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBzcXVhcmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgYWRkU2hpcChzcXVhcmUsIGluZGV4KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmNvbnN0IERvbUhhbmRsZXIgPSB7XG4gICAgZGlzcGxheUJvYXJkcyxcbiAgICBjcmVhdGVTaGlwcyxcbiAgICB1cGRhdGVCb2FyZCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERvbUhhbmRsZXI7XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXAnO1xuaW1wb3J0IERvbUhhbmRsZXIgZnJvbSAnLi9kb20nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQm9hcmQge1xuICAgIGNvbnN0cnVjdG9yKHNpZGUpIHtcbiAgICAgICAgdGhpcy5ib2FyZCA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sICgpID0+IEFycmF5KDEwKS5maWxsKG51bGwpKTsgLy8gY3JlYXRlIDEweDEwIGdyaWRcbiAgICAgICAgdGhpcy5sb3N0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2lkZSA9IHNpZGU7XG4gICAgfVxuXG4gICAgcGxhY2VTaGlwKGxlbmd0aCwgcm90YXRpb24sIHJvdywgY29sKSB7XG4gICAgICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChsZW5ndGgpO1xuICAgICAgICBpZiAocm90YXRpb24gPT09ICdyb3cnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtyb3ddW2NvbCArIGldID0gc2hpcDtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnVwZGF0ZUJvYXJkKHRoaXMuYm9hcmQsIHRoaXMuc2lkZSwgcm93LCBjb2wgKyBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocm90YXRpb24gPT09ICdjb2wnKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtyb3cgKyBpXVtjb2xdID0gc2hpcDtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnVwZGF0ZUJvYXJkKHRoaXMuYm9hcmQsIHRoaXMuc2lkZSwgcm93ICsgaSwgY29sKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlY2VpdmVBdHRhY2socm93LCBjb2wpIHtcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuYm9hcmRbcm93XVtjb2xdO1xuICAgICAgICBpZiAocG9zID09PSBudWxsKSB7IC8vIGlmIGNvb3JkaW5hdGUgaXMgZW1wdHlcbiAgICAgICAgICAgIHBvcyA9ICdtaXNzZWQnO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcG9zaXRpb24gY29udGFpbnMgYSBzaGlwLCBkYW1hZ2Ugc2hpcFxuICAgICAgICBwb3MudGltZXNIaXQgKz0gMTtcbiAgICAgICAgY29uc3Qgc3VuayA9IHBvcy5pc1N1bmsoKTtcbiAgICAgICAgaWYgKHN1bmspIHRoaXMuaGFzQWxsU3VuaygpO1xuICAgIH1cblxuICAgIGhhc0FsbFN1bmsoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmJvYXJkLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbaV1bal0gIT09IG51bGwgJiYgdGhpcy5ib2FyZFtpXVtqXSAhPT0gJ21pc3NpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5ib2FyZFtpXVtqXS5oYXNTdW5rKSByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9zdCA9IHRydWU7IC8vIGlmIGFsbCBzaGlwcyBoYXZlIGJlZW4gc3VuaywgZ2FtZSBpcyBvdmVyXG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcbiAgICBjb25zdHJ1Y3Rvcihib2FyZCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRUdXJuID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGxhY2VkU2hpcHMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wbGFjZWRTaGlwQ291bnQgPSAwO1xuICAgICAgICB0aGlzLmJvYXJkID0gYm9hcmQ7XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hpcCB7XG4gICAgY29uc3RydWN0b3IobGVuZ3RoKSB7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgICAgICB0aGlzLnRpbWVzSGl0ID0gMDtcbiAgICAgICAgdGhpcy5oYXNTdW5rID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaGl0KCkge1xuICAgICAgICB0aGlzLnRpbWVzSGl0ICs9IDE7XG4gICAgfVxuXG4gICAgaXNTdW5rKCkge1xuICAgICAgICBpZiAodGhpcy50aW1lc0hpdCA9PT0gdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuaGFzU3VuayA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBHYW1lQm9hcmQgZnJvbSAnLi9nYW1lYm9hcmQnO1xuaW1wb3J0IFBsYXllciBmcm9tICcuL3BsYXllcic7XG5pbXBvcnQgRG9tSGFuZGxlciBmcm9tICcuL2RvbSc7XG5cbmZ1bmN0aW9uIGdhbWVMb29wKCkge1xuICAgIGNvbnN0IHVzZXJCb2FyZCA9IG5ldyBHYW1lQm9hcmQoJ2xlZnQnKTtcbiAgICBjb25zdCBjb21wdXRlckJvYXJkID0gbmV3IEdhbWVCb2FyZCgncmlnaHQnKTtcbiAgICBjb25zdCBwbGF5ZXIgPSBuZXcgUGxheWVyKHVzZXJCb2FyZCk7XG4gICAgY29uc3QgY29tcHV0ZXIgPSBuZXcgUGxheWVyKGNvbXB1dGVyQm9hcmQpO1xuXG4gICAgRG9tSGFuZGxlci5kaXNwbGF5Qm9hcmRzKCk7XG4gICAgRG9tSGFuZGxlci5jcmVhdGVTaGlwcyhwbGF5ZXIpO1xufVxuXG5nYW1lTG9vcCgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9