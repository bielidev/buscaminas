const colors = {
    1: "blue",
    2: "green",
    3: "red",
    4: "darkblue",
    5: "brown",
    6: "cyan",
    7: "black",
    8: "grey",
}

class Board {
    constructor({rows, cols, bombs}) {
        this.rows = rows
        this.cols = cols
        this.bombs = bombs
    }

    save() {
        localStorage.setItem('minesweeper-board', JSON.stringify(this))
    }

    // generate board method
    generate() {
        const { rows, cols, bombs } = this
        const board = new Array(rows).fill(null).map(() => new Array(cols).fill(null))
        let bombsPlanted = 0

        while (bombsPlanted < bombs) {
            const row = Math.floor(Math.random() * rows)
            const col = Math.floor(Math.random() * cols)

            if (!board[row][col]) {
                board[row][col] = new Cell(row, col)
                board[row][col].putBomb()
                bombsPlanted++
            }
        }

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (!board[row][col]) {
                    board[row][col] = new Cell(row, col)
                }
            }
        }

        this.matrix = board
    }

    // put adjacent bombs method
    putAdjacentBombs() {
        const { rows, cols } = this

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (this.matrix[row][col].bomb) {
                    continue
                }

                let adjacentBombs = 0

                for (let i = row - 1; i <= row + 1; i++) {
                    for (let j = col - 1; j <= col + 1; j++) {
                        if (i >= 0 && i < rows && j >= 0 && j < cols) {
                            if (this.matrix[i][j].bomb) {
                                adjacentBombs++
                            }
                        }
                    }
                }

                this.matrix[row][col].adjacentBombs = adjacentBombs
            }
        }
    }

    // reveal cell method
    revealCell(row, col) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return
        }

        const cell = this.matrix[row][col]

        if (cell.shown) {
            return
        }

        cell.reveal()

        if (cell.bomb) {
            this.gameOver()
            return
        }

        if (cell.adjacentBombs === 0) {
            this.revealCell(row - 1, col - 1)
            this.revealCell(row - 1, col)
            this.revealCell(row - 1, col + 1)
            this.revealCell(row, col - 1)
            this.revealCell(row, col + 1)
            this.revealCell(row + 1, col - 1)
            this.revealCell(row + 1, col)
            this.revealCell(row + 1, col + 1)
        }
    }

    // flag cell method
    flagCell(row, col) {
        const cell = this.matrix[row][col]
        if (cell.shown) {
            return
        }
        cell.toggleFlag()
    }

    // print board method
    print() {
        const boardDiv = document.getElementById('board')
        boardDiv.innerHTML = ''

        for (let row = 0; row < this.rows; row++) {
            const rowDiv = document.createElement('div')
            rowDiv.classList.add('row')

            for (let col = 0; col < this.cols; col++) {
                const cell = this.matrix[row][col]
                const cellDiv = document.createElement('div')

                const colorStyle = cell.adjacentBombs ? `color: ${colors[cell.adjacentBombs]}` : ''

                cellDiv.classList = ['cell']
                cellDiv.style = colorStyle

                if (cell.flag) {
                    cellDiv.classList.add('flag');
                }

                if (cell.shown) {
                    cellDiv.textContent = cell.bomb ? '' : cell.adjacentBombs || ''
                    
                    if (!cell.bomb) {
                        cellDiv.classList.add('revealed');
                    }

                    if (cell.bomb) {
                        cellDiv.classList.add('bomb');
                    }
                }

                if (!this.isGameOver) {
                    cellDiv.addEventListener('click', () => {
                        this.revealCell(row, col)
                        this.save()
                        this.print()
                    })
    
                    cellDiv.addEventListener('contextmenu', (e) => {
                        e.preventDefault()
                        this.flagCell(row, col)
                        this.save()
                        this.print()
                    })
                }

                rowDiv.appendChild(cellDiv)
            }

            boardDiv.appendChild(rowDiv)
        }
    }

    // reveal all not bombs cells
    revealAll() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (!this.matrix[row][col].bomb) {
                    this.matrix[row][col].reveal()
                }
            }
        }
        this.print()
    }

    calculateScore() {
        let score = 0
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.matrix[row][col].shown && !this.isGameOver) {
                    score++
                }
            }
        }
        return score
    }

    gameOver() {
        const score = this.calculateScore()
        this.isGameOver = true
        const boardDiv = document.getElementById('board')
        boardDiv.addEventListener('click', function(event) {
            event.preventDefault()
            event.stopPropagation()
        })
        // remove all flags
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.matrix[row][col].flag = false
            }
        }
        this.revealAll()
        // emit event to inform of game over
        const event = new CustomEvent('gameover', { detail: { score: score } })
        document.dispatchEvent(event)
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