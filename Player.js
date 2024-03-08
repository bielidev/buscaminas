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