export default class Player {
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
