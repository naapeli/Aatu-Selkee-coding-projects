

const gameBoard = document.querySelector("#gameboard")
const player = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")
let movingPieceImageElement;
let movingPieceStartElement;
let movingStartSquare;
let movingEndSquare;

const currentBoard = new board()
function updateGame() {
    currentBoard.board.forEach((row, i) => {
        row.forEach((piece, j) => {
            const square = document.createElement("div")
            square.classList.add("square")
            square.id = 8 * i + j
            switch((i + j) % 2) {
                case 0:
                    square.classList.add("white");
                    break;
                case 1:
                    square.classList.add("black");
                    break;
            }
            if (piece != "--") {
                let pieceImage = pieceImages[piece]
                square.innerHTML = pieceImage
            };
            
            square.addEventListener("dragstart", (event) => {
                movingPieceImageElement = event.target;
                movingPieceStartElement = event.target.parentNode;
                let parentID = movingPieceStartElement.id
                movingStartSquare = [parentID % 8, Math.floor(parentID / 8)]
            });
            square.addEventListener("dragover", (event) => {
                event.preventDefault()
            });
            square.addEventListener("drop", (event) => {
                let target;
                let targetIsImage = false
                if (event.target.tagName == "IMG") {
                    target = event.target.parentNode
                    targetIsImage = true
                } else {
                    target = event.target
                };
                let parentID = target.id
                movingEndSquare = [parentID % 8, Math.floor(parentID / 8)]
                console.log(movingStartSquare, movingEndSquare, target)
                let currentMove = new Move(movingStartSquare, movingEndSquare)
                let moveMade = currentBoard.makeMove(currentMove)
                if (moveMade) {
                    if (targetIsImage) {
                        target.removeChild(target.firstChild)
                    };
                    target.appendChild(movingPieceImageElement)
                    player.textContent = currentBoard.whiteToMove ? "white" : "black";
                };
            });
            gameBoard.append(square)
        });
    });
    player.textContent = currentBoard.whiteToMove ? "white" : "black";
}

updateGame();
