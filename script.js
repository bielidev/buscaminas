const form = document.getElementById("userForm")
let currentPlayer = Player.get()
let currentBoard = Board.get()

function applyDateValidator() {
  let today = new Date();
  let eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  let dd = String(eighteenYearsAgo.getDate()).padStart(2, '0');
  let mm = String(eighteenYearsAgo.getMonth() + 1).padStart(2, '0');
  let yyyy = eighteenYearsAgo.getFullYear();

  eighteenYearsAgo = yyyy + '-' + mm + '-' + dd;

  document.getElementById("birthdate").max = eighteenYearsAgo;
}

applyDateValidator()

function configureGame(e) {
  e.preventDefault()

  Player.remove()
  Board.remove()

  const player = {
    name: document.getElementById("name").value, 
    surname: document.getElementById("surname").value,
    birthdate: document.getElementById("birthdate").value,
    nick: document.getElementById("nick").value,
    email: document.getElementById("email").value,
  }
  const board = {
    rows: parseInt(document.getElementById("rows").value),
    cols: parseInt(document.getElementById("cols").value),
    bombs: parseInt(document.getElementById("bombs").value)
  }

  currentPlayer = new Player(player)
  currentPlayer.save()
  currentBoard = new Board(board)
  currentBoard.save()

  checkPlayerAndWelcome()
}

function checkPlayerAndWelcome() {
  if (currentPlayer && currentBoard) {
    form.remove()

    currentPlayer.print()

    currentBoard.generate()
    currentBoard.putAdjacentBombs()
    currentBoard.print()
  } else {
    form.addEventListener("submit", configureGame)
  }
}

checkPlayerAndWelcome()

// listen for game over event from board
document.addEventListener('gameover', function(event) {
  const score = event.detail.score;
  currentPlayer.score = score
  currentPlayer.save()
  currentPlayer.print()
})