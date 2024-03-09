class Cell {
    constructor(x, y, bomb, shown = false, flag = false, adjacentBombs = 0) {
      this.x = x
      this.y = y
      this.bomb = bomb
      this.shown = shown
      this.flag = flag
      this.adjacentBombs = adjacentBombs
    }
    // reveal method
    reveal() {
      this.shown = true;
    }
  
    //flag method
    toggleFlag() {
      this.flag = !this.flag
    }
    // put bomb method
    putBomb() {
      this.bomb = true
    }
  }