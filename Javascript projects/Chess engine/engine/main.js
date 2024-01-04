const gameBoard = document.querySelector("#gameboard");
const player = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");
const undoButton = document.querySelector("#undo-button");
const positionInput = document.querySelector("#position-input");
const updateButton = document.querySelector("#update-button");
const engineCheckBox = document.querySelector("#engine-input");
engineCheckBox.checked = true;
let playAgainstEngine = engineCheckBox.checked;
let movingPieceImageElement;
let movingPieceStartElement;
let movingStartSquare;
let movingEndSquare;

const currentBoard = new board();
const gameEngine = new engine(currentBoard);
const currentHistoryTable = new historyTable();
const maxKillerMovePly = 32;
const killerMoves = [new Array(maxKillerMovePly), new Array(maxKillerMovePly)];
let repetitionTable = {};
repetitionTable[currentBoard.zobristHash] = 1;
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
                dragPiece(event);
            });
            square.addEventListener("dragover", (event) => {
                event.preventDefault();
            });
            square.addEventListener("drop", (event) => {
                event.stopPropagation();
                dropPiece(event);
            });
            gameBoard.append(square)
        });
    });
    undoButton.addEventListener("click", () => {
        repetitionTable[currentBoard.zobristHash] -= 1;
        let squaresToBeUpdated = currentBoard.undoMove();
        updateSquares(squaresToBeUpdated);
    });
    updateButton.addEventListener("click", () => {
        const fenString = positionInput.value;
        try {
            currentBoard.positionFromFen(fenString);
            gameEngine.transpositionTable.clearTable()
            repetitionTable = {}
            updateAllSquares()
        } catch (error) {
            console.log("Remember to input a valid fen string!")
        }
    });
    engineCheckBox.addEventListener("change", () => {
        playAgainstEngine = engineCheckBox.checked;
    });
};

function dragPiece(event) {
    movingPieceImageElement = event.target;
    movingPieceStartElement = event.target.parentNode;
    let parentID = movingPieceStartElement.id;
    movingStartSquare = [parentID % 8, Math.floor(parentID / 8)];
};

function dropPiece(event) {
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
    const movingPiece = Array.from(movingPieceImageElement.classList).reduce((accumulator, currentValue) => accumulator + currentValue, "");
    const takenPiece = targetIsImage ? Array.from(target.firstElementChild.classList).reduce((accumulator, currentValue) => accumulator + currentValue, "") : "--";
    let movingPieceIsPawn = movingPiece[1] == "P";
    let movingPieceIsKing = movingPiece[1] == "K";
    let isPromotion = false;
    let isCastling = false;
    let isAnPassant = false;
    let playerToMove = currentBoard.whiteToMove ? "w" : "b";
    let promotedPiece = null;
    if (movingPieceIsPawn) {
        isPromotion = parentID < 8 || parentID > 55;
        let whiteAnPassant = (movingStartSquare[1] == 3 && movingEndSquare[1] == 2 && Math.abs(movingEndSquare[0] - movingStartSquare[0]) == 1);
        let blackAnPassant = (movingStartSquare[1] == 4 && movingEndSquare[1] == 5 && Math.abs(movingEndSquare[0] - movingStartSquare[0]) == 1);
        isAnPassant = (whiteAnPassant || blackAnPassant) && !targetIsImage;
        if (isPromotion) {
             askForPawnPromotion(playerToMove).then((promotedPiece) => {
                let currentMove = new Move(movingStartSquare, movingEndSquare, movingPiece, takenPiece, isPromotion, isCastling, isAnPassant, promotedPiece);
                let [moveMade, squaresToBeUpdated] = currentBoard.makeMove(currentMove);
                if (moveMade) {
                    updateSquares(squaresToBeUpdated);
                    if (repetitionTable[currentBoard.zobristHash] != 0 && repetitionTable[currentBoard.zobristHash] != undefined) {
                        repetitionTable[currentBoard.zobristHash] += 1
                    } else {
                        repetitionTable[currentBoard.zobristHash] = 1
                    };
                    if (repetitionTable[currentBoard.zobristHash] >= 3) {
                        console.log("---------------DRAW---------------");
                    };
                    
                    if (playAgainstEngine) {
                        const engineMove = gameEngine.iterativeSearch();
                        const [engineMoveMade, engineSquaresToBeUpdated] = currentBoard.makeMove(engineMove);
                        if (engineMoveMade) {
                            updateSquares(engineSquaresToBeUpdated);
                            if (repetitionTable[currentBoard.zobristHash] != 0 && repetitionTable[currentBoard.zobristHash] != undefined) {
                                repetitionTable[currentBoard.zobristHash] += 1
                            } else {
                                repetitionTable[currentBoard.zobristHash] = 1
                            };
                            if (repetitionTable[currentBoard.zobristHash] >= 3) {
                                console.log("---------------DRAW---------------");
                            };
                        };
                    };
                };
             });
        };
    } else if (movingPieceIsKing) {
        isCastleStart = movingStartSquare[0] == 4 && (movingStartSquare[1] == 0 || movingStartSquare[1] == 7);
        isCastleEnd = (parentID == 2) || (parentID == 6) || (parentID == 58) || (parentID == 62);
        isCastling = isCastleStart && isCastleEnd;
    };
    if (!isPromotion) {
        let currentMove = new Move(movingStartSquare, movingEndSquare, movingPiece, takenPiece, isPromotion, isCastling, isAnPassant, promotedPiece);
        let [moveMade, squaresToBeUpdated] = currentBoard.makeMove(currentMove);
        if (moveMade) {
            window.setTimeout(updateSquares, 0, squaresToBeUpdated);
            if (repetitionTable[currentBoard.zobristHash] != 0 && repetitionTable[currentBoard.zobristHash] != undefined) {
                repetitionTable[currentBoard.zobristHash] += 1
            } else {
                repetitionTable[currentBoard.zobristHash] = 1
            };
            if (repetitionTable[currentBoard.zobristHash] >= 3) {
                console.log("---------------DRAW---------------");
            };
            
            if (playAgainstEngine) {
                const engineMove = gameEngine.iterativeSearch();
                const [engineMoveMade, engineSquaresToBeUpdated] = currentBoard.makeMove(engineMove);
                if (engineMoveMade) {
                    updateSquares(engineSquaresToBeUpdated);
                    if (repetitionTable[currentBoard.zobristHash] != 0 && repetitionTable[currentBoard.zobristHash] != undefined) {
                        repetitionTable[currentBoard.zobristHash] += 1
                    } else {
                        repetitionTable[currentBoard.zobristHash] = 1
                    };
                    if (repetitionTable[currentBoard.zobristHash] >= 3) {
                        console.log("---------------DRAW---------------");
                    };
                };
            };
        };
    };
};

function updateSquares(squaresToBeUpdated) {
    player.textContent = currentBoard.whiteToMove ? "white" : "black";
    squaresToBeUpdated.forEach((pos) => {
        let [i, j] = pos;
        let id = i + j * 8;
        let squareToBeUppdated = document.querySelector(`[id="${id}"]`)
        let piece = currentBoard.board[j][i]
        if (piece != "--") {
            squareToBeUppdated.innerHTML = pieceImages[piece];
        } else {
            squareToBeUppdated.innerHTML = "";
        };
    });
};

function updateAllSquares() {
    const squares = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const position = [i, j];
            squares.push(position);
        };
    };
    updateSquares(squares);
};

async function askForPawnPromotion(color) {
    return new Promise((resolve) => {
        const pieces = ["Q", "R", "B", "N"];
        const pawnPromotionDiv = document.createElement("div");
        pawnPromotionDiv.classList.add("pawn-promotion-container");
        gameBoard.appendChild(pawnPromotionDiv);
        pieces.forEach((piece) => {
            let drawnPiece = color + piece;
            pawnPromotionDiv.innerHTML = pawnPromotionDiv.innerHTML + pieceImages[drawnPiece];
        });
        for (let i = 0; i < pawnPromotionDiv.children.length; i++) {
            let piece = pawnPromotionDiv.children[i];
            piece.addEventListener("click", (event) => {
                event.stopPropagation();
                let pieceClasses = event.target.classList;
                let pieceString = "";
                for (let j = 0; j < pieceClasses.length; j++) {
                    pieceString = pieceString + pieceClasses[j];
                };
                pawnPromotionDiv.remove();
                resolve(pieceString);
            });
        };
    });
};

startGame();
