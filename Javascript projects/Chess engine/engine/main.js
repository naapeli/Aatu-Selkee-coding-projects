const gameBoard = document.querySelector("#gameboard");
const player = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");
const undoButton = document.querySelector("#undo-button");
const positionInput = document.querySelector("#position-input");
const updateButton = document.querySelector("#update-button");
const engineCheckBox = document.querySelector("#engine-input");
const engineThinkTimeSlider = document.querySelector("#think-time-slider");
const engineThinkTime = document.querySelector("#think-time");
const moveLog = document.querySelector("#move-log-content");
let fullMoveLogString = "";
let moveLogArray = [];
const currentFen = document.querySelector("#current-fen");
engineCheckBox.checked = true;
let playAgainstEngine = engineCheckBox.checked;
let movingPieceImageElement;
let movingStartSquare;
let movingEndSquare;

const currentBoard = new board();
currentFen.textContent = currentBoard.getFen();
const gameEngine = new engine(currentBoard);
const currentHistoryTable = new historyTable();
const maxKillerMovePly = 64;
const killerMoves = [new Array(maxKillerMovePly), new Array(maxKillerMovePly)];
let repetitionTable = {};
repetitionTable[currentBoard.zobristHash] = 1;
const moveAudio = new Audio("./sounds/move-self.mp3");
const captureAudio = new Audio("./sounds/capture.mp3");
const checkAudio = new Audio("./sounds/move-check.mp3");
const promotionAudio = new Audio("./sounds/promote.mp3");
let lastMoveHighlight = [];
let selectedSquare = [];
let possibleMoveSquareHighlight = [];
const openingBook = JSON.parse(JSON.stringify(book));

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
            square.addEventListener("click", (event) => {
                event.stopPropagation();
                clickPiece(event);
            });
            gameBoard.append(square);
        });
    });
    undoButton.addEventListener("click", () => {
        repetitionTable[currentBoard.zobristHash] -= 1;
        let squaresToBeUpdated = currentBoard.undoMove();
        gameEngine.transpositionTable.clearTable();
        if (squaresToBeUpdated.length == 0) {
            console.log("No moves in the movelog!")
        } else {
            removeMoveFromMoveLog();
            removeTargetHighlights();
            currentFen.textContent = currentBoard.getFen();
        };
        updateSquares(squaresToBeUpdated, []);
    });
    updateButton.addEventListener("click", () => {
        const fenString = positionInput.value;
        try {
            currentBoard.positionFromFen(fenString);
            currentFen.textContent = currentBoard.getFen();
            gameEngine.transpositionTable.clearTable();
            repetitionTable = {};
            moveLogArray = [];
            updateAllSquares();
        } catch (error) {
            console.log("Remember to input a valid fen string!");
        };
    });
    engineCheckBox.addEventListener("change", () => {
        playAgainstEngine = engineCheckBox.checked;
    });
    engineThinkTimeSlider.oninput = function() {
        engineThinkTime.innerHTML = engineThinkTimeSlider.value;
        gameEngine.maxAllowedTime = parseInt(engineThinkTimeSlider.value);
    };
};

function dragPiece(event) {
    movingPieceImageElement = event.target;
    const movingPieceStartElement = event.target.parentNode;
    let parentID = movingPieceStartElement.id;
    movingStartSquare = [parentID % 8, Math.floor(parentID / 8)];
    const moves = currentBoard.getPossibleMovesSquare(movingStartSquare);
    selectedSquare = movingStartSquare;

    removeTargetHighlights();
    addTargetHighlight(moves);
};

async function dropPiece(event) {
    let target;
    let targetIsImage = false;
    if (event.target.tagName == "IMG") {
        target = event.target.parentNode;
        targetIsImage = true;
    } else if (event.target.classList.contains("possible-target") || event.target.classList.contains("possible-capture")) {
        target = event.target.parentNode;
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
        isPromotion = ((parentID < 8 && movingPiece[0] == "w") || (parentID > 55 && movingPiece[0] == "b")) &&
                      (Math.abs(movingEndSquare[0] - movingStartSquare[0]) == 1 || Math.abs(movingEndSquare[0] - movingStartSquare[0]) == 0);
        let whiteAnPassant = (movingStartSquare[1] == 3 && movingEndSquare[1] == 2 && Math.abs(movingEndSquare[0] - movingStartSquare[0]) == 1);
        let blackAnPassant = (movingStartSquare[1] == 4 && movingEndSquare[1] == 5 && Math.abs(movingEndSquare[0] - movingStartSquare[0]) == 1);
        isAnPassant = (whiteAnPassant || blackAnPassant) && !targetIsImage;
        if (isPromotion) {
            const promotedPiece = await askForPawnPromotion(playerToMove);
            let currentMove = new Move(movingStartSquare, movingEndSquare, movingPiece, takenPiece, isPromotion, isCastling, isAnPassant, promotedPiece);
            const playerMoveMade = makeMove(currentMove);

            if (playerMoveMade) {
                removeTargetHighlights();
                addMoveToMoveLog(currentMove);
            };
                
            if (playAgainstEngine && playerMoveMade) {
                window.setTimeout(() => {
                    const engineMove = gameEngine.getBestMove();
                    const engineMoveMade = makeMove(engineMove);
                    if (engineMoveMade) {
                        addMoveToMoveLog(engineMove);
                    };
                }, 1);
            };
        };
    } else if (movingPieceIsKing) {
        isCastleStart = movingStartSquare[0] == 4 && (movingStartSquare[1] == 0 || movingStartSquare[1] == 7);
        isCastleEnd = (parentID == 2) || (parentID == 6) || (parentID == 58) || (parentID == 62);
        isCastling = isCastleStart && isCastleEnd;
    };
    if (!isPromotion) {
        let currentMove = new Move(movingStartSquare, movingEndSquare, movingPiece, takenPiece, isPromotion, isCastling, isAnPassant, promotedPiece);
        const playerMoveMade = makeMove(currentMove);

        if (playerMoveMade) {
            removeTargetHighlights();
            addMoveToMoveLog(currentMove);
        };
            
        if (playAgainstEngine && playerMoveMade) {
            window.setTimeout(() => {
                const engineMove = gameEngine.getBestMove();
                const engineMoveMade = makeMove(engineMove);
                if (engineMoveMade) {
                    addMoveToMoveLog(engineMove);
                };
            }, 1);
        };
    };
};

async function clickPiece(event) {
    let target;
    let targetIsImage = false;
    if (event.target.tagName == "IMG") {
        target = event.target.parentNode;
        targetIsImage = true;
    } else if (event.target.classList.contains("possible-target") || event.target.classList.contains("possible-capture")) {
        target = event.target.parentNode;
    } else {
        target = event.target;
    };
    let parentID = target.id;
    const newSelectedSquare = [parentID % 8, Math.floor(parentID / 8)];
    if (selectedSquare.length == 0) {
        if (currentBoard.board[newSelectedSquare[1]][newSelectedSquare[0]] == "--") {
            return;
        };
        selectedSquare = newSelectedSquare;
        const moves = currentBoard.getPossibleMovesSquare(newSelectedSquare);
        removeTargetHighlights();
        addTargetHighlight(moves);
    } else if (squaresEqual(selectedSquare, newSelectedSquare)) {
        selectedSquare = [];
        removeTargetHighlights();
    } else {
        const movingStartSquare = selectedSquare;
        const movingStartSquareID = movingStartSquare[1] * 8 + movingStartSquare[0];
        const movingEndSquare = newSelectedSquare;
        const movingPieceImageElement = document.getElementById(movingStartSquareID).firstChild;
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
            isPromotion = ((parentID < 8 && movingPiece[0] == "w") || (parentID > 55 && movingPiece[0] == "b")) &&
                          (Math.abs(movingEndSquare[0] - movingStartSquare[0]) == 1 || Math.abs(movingEndSquare[0] - movingStartSquare[0]) == 0);
            let whiteAnPassant = (movingStartSquare[1] == 3 && movingEndSquare[1] == 2 && Math.abs(movingEndSquare[0] - movingStartSquare[0]) == 1);
            let blackAnPassant = (movingStartSquare[1] == 4 && movingEndSquare[1] == 5 && Math.abs(movingEndSquare[0] - movingStartSquare[0]) == 1);
            isAnPassant = (whiteAnPassant || blackAnPassant) && !targetIsImage;
            if (isPromotion) {
                const promotedPiece = await askForPawnPromotion(playerToMove);
                let currentMove = new Move(movingStartSquare, movingEndSquare, movingPiece, takenPiece, isPromotion, isCastling, isAnPassant, promotedPiece);
                const playerMoveMade = makeMove(currentMove);
                if (playerMoveMade) {
                    selectedSquare = [];
                    removeTargetHighlights();
                    addMoveToMoveLog(currentMove);
                } else {
                    const moves = currentBoard.getPossibleMovesSquare(newSelectedSquare);
                    if (moves.length > 0) {
                        selectedSquare = newSelectedSquare;
                        removeTargetHighlights();
                        addTargetHighlight(moves);
                    } else {
                        selectedSquare = [];
                        removeTargetHighlights();
                    };
                };
                    
                if (playAgainstEngine && playerMoveMade) {
                    window.setTimeout(() => {
                        const engineMove = gameEngine.getBestMove();
                        const engineMoveMade = makeMove(engineMove);
                        if (engineMoveMade) {
                            addMoveToMoveLog(engineMove);
                        };
                    }, 1);
                };
            };
        } else if (movingPieceIsKing) {
            isCastleStart = movingStartSquare[0] == 4 && (movingStartSquare[1] == 0 || movingStartSquare[1] == 7);
            isCastleEnd = (parentID == 2) || (parentID == 6) || (parentID == 58) || (parentID == 62);
            isCastling = isCastleStart && isCastleEnd;
        };
        if (!isPromotion) {
            let currentMove = new Move(movingStartSquare, movingEndSquare, movingPiece, takenPiece, isPromotion, isCastling, isAnPassant, promotedPiece);
            const playerMoveMade = makeMove(currentMove);
            if (playerMoveMade) {
                selectedSquare = [];
                removeTargetHighlights();
                addMoveToMoveLog(currentMove);
            } else {
                const moves = currentBoard.getPossibleMovesSquare(newSelectedSquare);
                if (moves.length > 0) {
                    selectedSquare = newSelectedSquare;
                    removeTargetHighlights();
                    addTargetHighlight(moves);
                } else {
                    selectedSquare = [];
                    removeTargetHighlights();
                };
            };
                
            if (playAgainstEngine && playerMoveMade) {
                window.setTimeout(() => {
                    const engineMove = gameEngine.getBestMove();
                    const engineMoveMade = makeMove(engineMove);
                    if (engineMoveMade) {
                        addMoveToMoveLog(engineMove);
                    };
                }, 1);
            };
        };
    };
};

function squaresEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    };

    return arr1[0] == arr2[0] && arr1[1] == arr2[1];
};

function makeMove(move) {
    const [moveMade, squaresToBeUpdated] = currentBoard.makeMove(move);
    if (moveMade) {
        playSound(move.isCapture(), currentBoard.inCheck(), move.promotion);
        newHighlight = [move.startPos, move.endPos];
        updateSquares(squaresToBeUpdated, newHighlight);
        currentFen.textContent = currentBoard.getFen();

        if (repetitionTable[currentBoard.zobristHash] != 0 && repetitionTable[currentBoard.zobristHash] != undefined) {
            repetitionTable[currentBoard.zobristHash] += 1
        } else {
            repetitionTable[currentBoard.zobristHash] = 1
        };
        if (repetitionTable[currentBoard.zobristHash] >= 3) {
            console.log("---------------DRAW---------------");
        } else if (currentBoard.boardUtility.isCheckMate(currentBoard.possibleMoves, currentBoard.currentCheckingPieces)) {
            const winner = currentBoard.whiteToMove ? "BLACK WINS" : "WHITE WINS";
            console.log("---------------" + winner + "---------------");
        };
    };
    return moveMade;
};

function removeTargetHighlights() {
    possibleMoveSquareHighlight.forEach(element => {
        const [targetSquare, highLight] = element;
        for (let i = 0; i < targetSquare.children.length; i++) {
            if (targetSquare.children[i] == highLight) {
                targetSquare.removeChild(targetSquare.children[i]);
                break;
            };
        }
    });
    possibleMoveSquareHighlight = [];
};

function addTargetHighlight(moves) {
    moves.forEach(move => {
        if (!move.promotion || move.promotedPiece[1] == "Q") {
            const endPos = move.endPos;
            const endID = endPos[1] * 8 + endPos[0];
            const possibleMoveSquare = document.getElementById(endID);
            const highLight = document.createElement("div");
            if (move.isCapture()) {
                highLight.classList.add("possible-capture");
            } else {
                highLight.classList.add("possible-target");
            };
            possibleMoveSquare.append(highLight);
            possibleMoveSquareHighlight.push([possibleMoveSquare, highLight]);
        };
        
    });
};

function addMoveToMoveLog(playedMove) {
    const prefix = !currentBoard.whiteToMove ? Math.ceil(currentBoard.ply / 2) + ". ": "";
    const newMoveText = prefix + playedMove.convertToString();
    fullMoveLogString = fullMoveLogString + " " + newMoveText;
    moveLog.textContent = getMoveLogEnd();
    moveLogArray.push(playedMove.convertToString());
};

function removeMoveFromMoveLog() {
    const plyDigits = Math.ceil(currentBoard.ply / 2).toString().length;
    const removeLength = !currentBoard.whiteToMove ? 5 : 7 + plyDigits;
    fullMoveLogString = fullMoveLogString.substring(0, fullMoveLogString.length - removeLength);
    moveLog.textContent = getMoveLogEnd();
    moveLogArray.pop();
};

function getMoveLogEnd() {
    const moveLogArray = fullMoveLogString.split(" ");
    let result = "";
    let i = moveLogArray.length - 1
    while (i >= 2 && i >= moveLogArray.length - 90) {
        result = moveLogArray[i] + " " + result;
        result = moveLogArray[i - 1] + " " + result;
        result = moveLogArray[i - 2] + " " + result;
        i -= 3;
    };
    if (i % 3 == 2 && i > 0) {
        result = moveLogArray[i] + " " + result;
        result = moveLogArray[i - 1] + " " + result;
    };
    return result
};

function playSound(isCapture, isCheck, isPromotion) {
    if (isCheck) {
        checkAudio.currentTime = 0;
        checkAudio.play();
    } else if (isPromotion) {
        promotionAudio.currentTime = 0;
        promotionAudio.play();
    } else if (isCapture) {
        captureAudio.currentTime = 0;
        captureAudio.play();
    } else {
        moveAudio.currentTime = 0;
        moveAudio.play();
    };
};

function updateSquares(squaresToBeUpdated, newHighlight) {
    player.textContent = currentBoard.whiteToMove ? "white" : "black";
    squaresToBeUpdated.forEach((pos) => {
        let [i, j] = pos;
        let id = i + j * 8;
        let squareToBeUppdated = document.querySelector(`[id="${id}"]`);
        let piece = currentBoard.board[j][i];
        if (piece != "--") {
            squareToBeUppdated.innerHTML = pieceImages[piece];
        } else {
            squareToBeUppdated.innerHTML = "";
        };
    });
    // update old highlight
    lastMoveHighlight.forEach((pos) => {
        let [i, j] = pos;
        let id = i + j * 8;
        let squareToBeUppdated = document.querySelector(`[id="${id}"]`);
        squareToBeUppdated.classList.remove("highLight");
    });
    // update new highlight
    newHighlight.forEach((pos) => {
        let [i, j] = pos;
        let id = i + j * 8;
        let squareToBeUppdated = document.querySelector(`[id="${id}"]`);
        squareToBeUppdated.classList.add("highLight");
    });
    lastMoveHighlight = newHighlight;
};

function updateAllSquares() {
    const squares = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const position = [i, j];
            squares.push(position);
        };
    };
    updateSquares(squares, []);
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
