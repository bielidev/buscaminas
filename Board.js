class Board {
    constructor({rows, cols, bombs}) {
        this.rows = rows
        this.cols = cols
        this.bombs = bombs
    }

    save() {
        localStorage.setItem('minesweeper-board', JSON.stringify(this))
    }

    static get() {
        const board = localStorage.getItem('minesweeper-board') ? 
        new Board(JSON.parse(localStorage.getItem('minesweeper-board'))) :
        null

        return board
    }

    static remove() {
        localStorage.removeItem('minesweeper-board')
    }
}