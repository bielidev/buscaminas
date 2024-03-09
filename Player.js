class Player {
    constructor({name, surname, birthdate, nick, email, score = 0}) {
        this.name = name
        this.surname = surname
        this.birthdate = birthdate
        this.nick = nick
        this.email = email
        this.score = score
    }

    save() {
        localStorage.setItem('minesweeper-player', JSON.stringify(this))
    }

    print() {
        const playerDiv = document.getElementById("player")
        playerDiv.innerHTML = ''
        const h1 = document.createElement("h1")
        h1.textContent = `¡Bienvenido ${this.name} ${this.surname}!`
        playerDiv.appendChild(h1)
        const h2 = document.createElement("h2")
        h2.textContent = `Tu puntuación anterior es de: ${this.score || 0} puntos`
        playerDiv.appendChild(h2)
    }

    static get() {
        const player = localStorage.getItem('minesweeper-player') ? 
        new Player(JSON.parse(localStorage.getItem('minesweeper-player'))) :
        null

        return player
    }

    static remove() {
        localStorage.removeItem('minesweeper-player')
    }
}