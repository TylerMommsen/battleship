export default class Player {
    constructor() {
        this.placedShipCount = 0;
        this.shipsSunk = 0;
        this.lost = false;
    }

    setShipCount() {
        this.placedShipCount += 1;
    }
}
