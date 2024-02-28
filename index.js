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
  window.onload = function() {
    const tablero = new Tablero(5, 5, 5);
    tablero.dibujarTablero();
  }