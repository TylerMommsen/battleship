export default class Player {
    constructor() {
        this.currentTurn = false;
        this.placedShipCount = 0;
    }

    setShipCount() {
        this.placedShipCount += 1;
    }
}
