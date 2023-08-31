export default class Player {
    constructor(board) {
        this.currentTurn = false;
        this.placedShips = false;
        this.placedShipCount = 0;
        this.board = board;
    }
}
