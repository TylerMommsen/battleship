export default class Player {
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
