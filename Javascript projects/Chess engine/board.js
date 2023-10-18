class board {
    constructor() {
        this.board = [
            ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
            ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
            ["--", "--", "--", "--", "--", "--", "--", "--"],
            ["--", "--", "--", "--", "--", "--", "--", "--"],
            ["--", "--", "--", "--", "--", "--", "--", "--"],
            ["--", "--", "--", "--", "--", "--", "--", "--"],
            ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
            ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"]
        ]
        this.whiteToMove = true
        this.blackKingPosition = [4, 0];
        this.whiteKingPosition = [4, 7];
        this.whiteMaterial = 39.4
        this.blackMaterial = 39.4
        this.possibleMoves = this.getPossibleMoves()
        this.moveLog = []
        this.currentCheckingPieces = [] // element is in format [[locationOfChekingPiece, directionFromKing],
        // [locationOfChekingPiece, undefined (if knight is checking)]...]
        this.currentPinnedPieces = [] // element is in format [[locationOfPinnedPiece, directionFromKing],
        // [locationOfPinnedPiece, directionFromKing]...]
    };

    makeMove(move) {
        let currentMovePossible = false
        for (var i = 0; i < currentBoard.possibleMoves.length; i++) {
            let currentMove = currentBoard.possibleMoves[i];
            if (move.equals(currentMove)) {
                currentMovePossible = true;
                break;
            };
        };
        if (currentMovePossible) {
            this.whiteToMove = !this.whiteToMove;
            let [i, j] = move.startPos;
            let movingPiece = this.board[j][i];
            let [iNew, jNew] = move.endPos;
            if (movingPiece[1] == "K") {
                switch(movingPiece[0]) {
                    case "w":
                        this.whiteKingPosition = move.endPos;
                        break;
                    case "b":
                        this.blackKingPosition = move.endPos;
                        break;
                };
            };
            let oldPiece = this.board[jNew][iNew];
            this.moveLog.push([move, oldPiece]);
            let diffValue = pieceValues[oldPiece[1]];
            switch(oldPiece[0]) {
                case "w":
                    this.whiteMaterial -= diffValue;
                    break;
                case "b":
                    this.blackMaterial -= diffValue;
            };
            this.board[j][i] = "--";
            this.board[jNew][iNew] = movingPiece;
            this.possibleMoves = [];
            this.determineChecksAndPins()
            this.possibleMoves = this.getPossibleMoves();
            return true;
        };
        return false;
    };

    determineChecksAndPins() {
        let kingPosition = this.whiteToMove ? this.whiteKingPosition : this.blackKingPosition;
        let color = this.whiteToMove ? "w" : "b";
        let oppositeColor = this.whiteToMove ? "b" : "w";
        let directions = [[-1, 1], [1, 1], [-1, -1], [1, -1], [0, 1], [0, -1], [-1, 0], [1, 0]];
        let pinnedPieceLocations = [];
        let checks = [];
        directions.forEach((direction, j) => {
            var i = 1;
            let xDiff = direction[0];
            let yDiff = direction[1];
            let directionPinned = []
            while (0 <= kingPosition[0] + i * xDiff && kingPosition[0] + i * xDiff < 8 && 0 <= kingPosition[1] + i * yDiff && kingPosition[1] + i * yDiff < 8) {
                let currentPiece = this.board[kingPosition[1] + i * yDiff][kingPosition[0] + i * xDiff];
                if (currentPiece[0] == oppositeColor && directionPinned.length == 1) { // possible pin
                    if (j < 4 && (currentPiece[1] == "B" || currentPiece[1] == "Q")) { // found piece that pins other piece
                        pinnedPieceLocations.push(directionPinned[0]);
                        break;
                    } else if (4 <= j && (currentPiece[1] == "R" || currentPiece[1] == "Q")) { // found piece that pins other piece
                        pinnedPieceLocations.push(directionPinned[0]);
                        break;
                    };
                } else if (currentPiece[0] == color && directionPinned.length == 0) { // first own colored piece
                    directionPinned.push([[kingPosition[0] + i * xDiff, kingPosition[1] + i * yDiff], direction]);
                } else if (currentPiece[0] == oppositeColor && directionPinned.length == 0) { // direct check
                    if (j < 4 && (currentPiece[1] == "B" || currentPiece[1] == "Q")) {
                        checks.push([[kingPosition[0] + i * xDiff, kingPosition[1] + i * yDiff], direction]);
                        break;
                    } else if (4 <= j && (currentPiece[1] == "R" || currentPiece[1] == "Q")) {
                        checks.push([[kingPosition[0] + i * xDiff, kingPosition[1] + i * yDiff], direction]);
                        break;
                    };
                };
                i++;
            };
        });

        let knightMoves = [[-1, 2], [1, 2], [-1, -2], [1, -2], [-2, 1], [2, 1], [-2, -1], [2, -1]];
        knightMoves.forEach((moveDiff) => {
            if (0 <= kingPosition[0] + moveDiff[0] && kingPosition[0] + moveDiff[0] < 8 && 0 <= kingPosition[1] + moveDiff[1] && kingPosition[1] + moveDiff[1] < 8) {
                let currentPiece = this.board[kingPosition[1] + moveDiff[1]][kingPosition[0] + moveDiff[0]];
                if (currentPiece[0] == oppositeColor && currentPiece[1] == "N") {
                    checks.push([[kingPosition[0] + moveDiff[0], kingPosition[1] + moveDiff[1]], undefined]);
                };
            };
        });
        this.currentCheckingPieces = checks;
        this.currentPinnedPieces = pinnedPieceLocations;
    };

    undoMove() {
        if (this.moveLog.length > 0) {
            this.whiteToMove = !this.whiteToMove
            let [move, takenPiece] = this.moveLog.pop();
            this.board[move.startPos[1]][move.startPos[0]];
            this.board[move.endPos[1]][move.endPos[0]] = takenPiece;
            // need to update king positions, materials recalculate pins and checks
        };
    };

    getPossibleMoves() {
        // maybe add variables for all piece positions so that do not need to loop over whole board???
        let moves = [];
        let color = this.whiteToMove ? "w" : "b";
        let oppositeColor = this.whiteToMove ? "b" : "w";
        for (var j = 0; j < 8; j++) {
            for (var i = 0; i < 8; i++) {
                var currentPiece = this.board[j][i];
                if (currentPiece[0] == color) {
                    switch(currentPiece[1]) {
                        case "P":
                            let newPawnMoves = this.getPawnMoves([i, j], color);
                            moves = moves.concat(newPawnMoves);
                            break;
                        case "N":
                            let newKnightMoves = this.getKnightMoves([i, j], color);
                            moves = moves.concat(newKnightMoves);
                            break;
                        case "B":
                            let newBishopMoves = this.getBishopMoves([i, j], oppositeColor);
                            moves = moves.concat(newBishopMoves);
                            break;
                        case "R":
                            let newRookMoves = this.getRookMoves([i, j], oppositeColor);
                            moves = moves.concat(newRookMoves);
                            break;
                        case "Q":
                            let newQueenMoves = this.getQueenMoves([i, j], oppositeColor);
                            moves = moves.concat(newQueenMoves);
                            break;
                        case "K":
                            let newKingMoves = this.getKingMoves([i, j], color);
                            moves = moves.concat(newKingMoves);
                            break;
                    };
                };
            };
        };
        return moves
    };

    // returns possible pawn moves in a position
    // need to add promotion, en passant
    getPawnMoves(pieceLocation, color) {
        let [i, j] = pieceLocation;
        let moves = [];
        switch(color) {
            case "w":
                if (j - 1 >= 0 && this.board[j - 1][i] == "--") {
                    moves.push(new Move(pieceLocation, [i, j - 1], j - 1 == 0));
                    if (j == 6 && this.board[4][i] == "--") {
                        moves.push(new Move(pieceLocation, [i, j - 2]));
                    };
                };
                if (j - 1 >= 0 && i - 1 >= 0 && this.board[j - 1][i - 1][0] == "b") {
                    moves.push(new Move(pieceLocation, [i - 1, j - 1], j - 1 == 0));
                };
                if (j - 1 >= 0 && i + 1 < 8 && this.board[j - 1][i + 1][0] == "b") {
                    moves.push(new Move(pieceLocation, [i + 1, j - 1], j - 1 == 0));
                };
                break;
            case "b":
                if (j + 1 < 8 && this.board[j + 1][i] == "--") {
                    moves.push(new Move(pieceLocation, [i, j + 1], j + 1 == 7));
                    if (j == 1 && this.board[3][i] == "--") {
                        moves.push(new Move(pieceLocation, [i, j + 2]));
                    };
                };
                if (j + 1 < 8 && i - 1 >= 0 && this.board[j + 1][i - 1][0] == "w") {
                    moves.push(new Move(pieceLocation, [i - 1, j + 1], j + 1 == 7));
                };
                if (j + 1 < 8 && i + 1 < 8 && this.board[j + 1][i + 1][0] == "w") {
                    moves.push(new Move(pieceLocation, [i + 1, j + 1], j + 1 == 7));
                };
                break;
        };
        return moves;
    };

    getKnightMoves(pieceLocation, color) {
        let moveDifferences = [[-1, 2], [1, 2], [-1, -2], [1, -2], [-2, 1], [2, 1], [-2, -1], [2, -1]]
        let [i, j] = pieceLocation;
        let moves = [];
        moveDifferences.forEach((xyDiff) => {
            let xDiff = xyDiff[0]
            let yDiff = xyDiff[1]
            if (0 <= (i + xDiff) && (i + xDiff) < 8 && 0 <= (j + yDiff) && (j + yDiff) < 8 && this.board[j + yDiff][i + xDiff][0] != color) {
                moves.push(new Move(pieceLocation, [i + xDiff, j + yDiff]));
            };
        });
        return moves;
    };

    getBishopMoves(pieceLocation, oppositeColor) {
        let directions = [[-1, 1], [1, -1], [-1, -1], [1, 1]]
        let [i, j] = pieceLocation;
        let moves = [];
        directions.forEach(direction => {
            let n = 1;
            while (0 <= i + n * direction[0] && i + n * direction[0] < 8 && 0 <= j + n * direction[1] && j + n * direction[1] < 8) {
                let iNew = i + n * direction[0];
                let jNew = j + n * direction[1];
                let currentPiece = this.board[jNew][iNew];
                if (currentPiece == "--") {
                    moves.push(new Move(pieceLocation, [iNew, jNew]));
                    n++;
                    continue;
                } else if (currentPiece[0] == oppositeColor) {
                    moves.push(new Move(pieceLocation, [iNew, jNew]));
                    break;
                } else {
                    break;
                };
            };
        });
        return moves;
    };

    getRookMoves(pieceLocation, oppositeColor) {
        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
        let [i, j] = pieceLocation;
        let moves = [];
        directions.forEach(direction => {
            let n = 1;
            while (0 <= i + n * direction[0] && i + n * direction[0] < 8 && 0 <= j + n * direction[1] && j + n * direction[1] < 8) {
                let iNew = i + n * direction[0];
                let jNew = j + n * direction[1];
                let currentPiece = this.board[jNew][iNew];
                if (currentPiece == "--") {
                    moves.push(new Move(pieceLocation, [iNew, jNew]));
                    n++;
                    continue;
                } else if (currentPiece[0] == oppositeColor) {
                    moves.push(new Move(pieceLocation, [iNew, jNew]));
                    break;
                } else {
                    break;
                };
            };
        });
        return moves;
    };

    getQueenMoves(pieceLocation, oppositeColor) {
        let moves = [];
        moves = moves.concat(this.getBishopMoves(pieceLocation, oppositeColor));
        moves = moves.concat(this.getRookMoves(pieceLocation, oppositeColor));
        return moves;
    };

    // need to add castling and check detection
    getKingMoves(pieceLocation, color) {
        let directions = [[-1, 1], [1, 1], [-1, -1], [1, -1], [0, 1], [0, -1], [-1, 0], [1, 0]];
        let [i, j] = pieceLocation;
        let moves = [];
        directions.forEach(direction => {
            if (0 <= i + direction[0] && i + direction[0] < 8 && 0 <= j + direction[1] && j + direction[1] < 8) {
                let iNew = i + direction[0];
                let jNew = j + direction[1];
                let currentSquare = this.board[jNew][iNew];
                if (currentSquare[0] != color) {
                    moves.push(new Move(pieceLocation, [iNew, jNew]));
                };
            };
        });
        return moves;
    };
};

class Move {
    constructor(startPos, endPos, promotion = false, castleKing = false, enPassant = false) {
        this.startPos = startPos;
        this.endPos = endPos;
        this.promotion = promotion;
        this.castleKing = castleKing;
        this.enPassant = enPassant;
    };

    equals(move) {
        return (this.startPos[0] == move.startPos[0] && this.startPos[1] == move.startPos[1]) && (this.endPos[0] == move.endPos[0] && 
            this.endPos[1] == move.endPos[1]) && (this.promotion == move.promotion) && (this.castleKing == move.castleKing) && 
            (this.enPassant == move.enPassant);
    };
};