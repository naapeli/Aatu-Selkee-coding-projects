

const gameBoard = document.querySelector("#gameboard")
const player = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")
const undoButton = document.querySelector("#undo-button")
let movingPieceImageElement;
let movingPieceStartElement;
let movingStartSquare;
let movingEndSquare;

const currentBoard = new board();
function startGame() {
    currentBoard.board.forEach((row, j) => {
        row.forEach((piece, i) => {
            const square = document.createElement("div");
            square.classList.add("square");
            square.id = 8 * j + i;
            switch((i + j) % 2) {
                case 0:
                    square.classList.add("white");
                    break;
                case 1:
                    square.classList.add("black");
                    break;
            }
            if (piece != "--") {
                let pieceImage = pieceImages[piece];
                square.innerHTML = pieceImage;
            };
            
            square.addEventListener("dragstart", (event) => {
                movingPieceImageElement = event.target;
                movingPieceStartElement = event.target.parentNode;
                let parentID = movingPieceStartElement.id;
                movingStartSquare = [parentID % 8, Math.floor(parentID / 8)];
            });
            square.addEventListener("dragover", (event) => {
                event.preventDefault();
            });
            square.addEventListener("drop", (event) => {
                event.stopPropagation();
                let target;
                let targetIsImage = false;
                if (event.target.tagName == "IMG") {
                    target = event.target.parentNode;
                    targetIsImage = true;
                } else {
                    target = event.target;
                };
                let parentID = target.id;
                movingEndSquare = [parentID % 8, Math.floor(parentID / 8)];
                console.log(movingStartSquare, movingEndSquare, target);
                let movingPieceIsPawn = movingPieceImageElement.classList.contains("P");
                let movingPieceIsKing = movingPieceImageElement.classList.contains("K");
                let isPromotion = false;
                let isCastling = false;
                if (movingPieceIsPawn) {
                    isPromotion = parentID < 8 || parentID > 55;
                };
                if (movingPieceIsKing) {
                    isCastleStart = movingStartSquare[0] == 4 && (movingStartSquare[1] == 0 || movingStartSquare[1] == 7)
                    isCastleEnd = (parentID == 2) || (parentID == 6) || (parentID == 58) || (parentID == 62)
                    isCastling = isCastleStart && isCastleEnd
                };
                let currentMove = new Move(movingStartSquare, movingEndSquare, isPromotion, isCastling)
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
    undoButton.addEventListener("click", () => {
        currentBoard.undoMove()
    });
};

function updateBoard(startId, endId, oldPiece) {
    let startSquare = document.querySelector(`[id="${startId}"]`)
    let endSquare = document.querySelector(`[id="${endId}"]`)

    startSquare.appendChild(endSquare.firstChild)
    if (oldPiece != "--") {
        endSquare.innerHTML = pieceImages[oldPiece]
    };
    player.textContent = currentBoard.whiteToMove ? "white" : "black";
};

startGame();
