const form = document.getElementById("userForm")
let currentPlayer = Player.get()
let currentBoard = Board.get()

function initGame(e) {
  e.preventDefault()
  
  var formData = new FormData(form);

  Player.remove()
  Board.remove()

  const player = {}
  const board = {}


  formData.forEach(function(value, key) {
    if (!isNaN(value)) {
      value = parseInt(value)
    }
    if (key.startsWith("player")) {
      player[key.replace("player-", "")] = value
    } else {
      board[key.replace("board-", "")] = value
    }
  });


  currentPlayer = new Player(player)
  currentPlayer.save()
  currentBoard = new Board(board)
  currentBoard.save()
}


function printPlayer() {
  const playerDiv = document.getElementById("player")
  const h1 = document.createElement("h1")
  h1.textContent = `¡Bienvenido ${currentPlayer.name} ${currentPlayer.surname}!`
  playerDiv.appendChild(h1)
  const h2 = document.createElement("h2")
  h2.textContent = `Tu puntuación anterior es de: ${currentPlayer.score || 0} puntos`
  playerDiv.appendChild(h2)
}

function checkPlayerAndWelcome() {
  if (currentPlayer && currentBoard) {
    form.remove()

    printPlayer()

    return
  }

  form.addEventListener("submit", initGame)
}

checkPlayerAndWelcome()


class Casilla {
    constructor(fila, columna) {
      this.fila = fila;
      this.columna = columna;
      this.esBomba = false;
      this.numero = 0;
    }

    plantarBomba() {
      this.esBomba = true;
    }

    incrementarNumero() {
      if (!this.esBomba) {
        this.numero++;
      }
    }
  }

  class Tablero {
    constructor(filas, columnas, numBombas) {
      this.filas = filas;
      this.columnas = columnas;
      this.numBombas = numBombas;
      this.tablero = [];
      this.shown = []
      this.generarTablero();
    }

    generarTablero() {
      for (let i = 0; i < this.filas; i++) {
        this.tablero[i] = [];
        for (let j = 0; j < this.columnas; j++) {
          this.tablero[i][j] = new Casilla(i, j);
        }
      }

      this.plantarBombas();
      this.calcularNumeros();
    }

    plantarBombas() {
      let bombasPlantadas = 0;
      while (bombasPlantadas < this.numBombas) {
        const fila = Math.floor(Math.random() * this.filas);
        const columna = Math.floor(Math.random() * this.columnas);
        if (!this.tablero[fila][columna].esBomba) {
          this.tablero[fila][columna].plantarBomba();
          bombasPlantadas++;
        }
      }
    }

    calcularNumeros() {
      for (let i = 0; i < this.filas; i++) {
        for (let j = 0; j < this.columnas; j++) {
          const casilla = this.tablero[i][j];
          if (!casilla.esBomba) {
            for (let x = -1; x <= 1; x++) {
              for (let y = -1; y <= 1; y++) {
                const filaVecina = i + x;
                const columnaVecina = j + y;
                if (
                  filaVecina >= 0 &&
                  filaVecina < this.filas &&
                  columnaVecina >= 0 &&
                  columnaVecina < this.columnas &&
                  this.tablero[filaVecina][columnaVecina].esBomba
                ) {
                  casilla.incrementarNumero();
                }
              }
            }
          }
        }
      }
    }

    dibujarTablero() {
      const tableroEl = document.getElementById('tablero');
      tableroEl.innerHTML = '';

      for (let i = 0; i < this.filas; i++) {
        const filaEl = document.createElement('div');
        filaEl.classList.add('fila');

        for (let j = 0; j < this.columnas; j++) {
          const casilla = this.tablero[i][j];
          const casillaEl = document.createElement('div');
          casillaEl.classList.add('casilla');
          const mustShow = this.shown.find((item) => item[0] == i && item[1] == j)
          if (mustShow) {
            casillaEl.textContent = casilla.esBomba ? 'X' : casilla.numero || '';
            if (casillaEl.textContent == '') {
                casillaEl.style.background = "#cecece"
            }
          } else {
            casillaEl.textContent = '';
          }
          filaEl.appendChild(casillaEl);

          casillaEl.addEventListener("click", () => {
            tableroEl.innerHTML = ""
            this.shown.push([i,j])
            this.dibujarTablero()
          })
        }

        tableroEl.appendChild(filaEl);
      }
    }
  }
  // window.onload = function() {
  //   const tablero = new Tablero(5, 5, 5);
  //   tablero.dibujarTablero();
  // }