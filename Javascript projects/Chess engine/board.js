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
        this.whiteMaterial = 39.4;
        this.blackMaterial = 39.4;
        this.whiteCanCastle = [true, true]; // long, short
        this.blackCanCastle = [true, true]; // long, short
        this.currentCheckingPieces = []; // element is in format [[locationOfChekingPiece, directionFromKing, blockLocations],
        // [locationOfChekingPiece, undefined (if knight is checking)]...]
        this.currentPinnedPieces = []; // element is in format [[locationOfPinnedPiece, directionFromKing],
        // [locationOfPinnedPiece, directionFromKing]...]
        this.enPassant = [];
        this.possibleMoves = this.getPossibleMoves();
        this.moveLog = []; // [[move, takenPiece, whiteCanCastle, blackCanCastle, enPassant], ...]
    };

    copyBoard() {
        let newBoard = new board()
        this.board.forEach((row, j) => {
            row.forEach((piece, i) => {
                newBoard.board[j][i] = piece;
            });
        });
        newBoard.whiteToMove = this.whiteToMove;
        newBoard.blackKingPosition = this.blackKingPosition;
        newBoard.whiteKingPosition = this.whiteKingPosition;
        newBoard.whiteMaterial = this.whiteMaterial;
        newBoard.blackMaterial = this.blackMaterial;
        newBoard.possibleMoves = this.possibleMoves;
        newBoard.moveLog = this.moveLog;
        newBoard.enPassant = this.enPassant;
        newBoard.currentCheckingPieces = this.currentCheckingPieces;
        newBoard.currentPinnedPieces = this.currentPinnedPieces;
        return newBoard;
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
            let squaresToBeUpdated = [];
            let [i, j] = move.startPos;
            let movingPiece = this.board[j][i];
            let [iNew, jNew] = move.endPos;
            let oldPiece = this.board[jNew][iNew];
            this.moveLog.push([move, oldPiece, this.whiteCanCastle, this.blackCanCastle, this.enPassant]);
            if (movingPiece[1] == "K") {
                switch(movingPiece[0]) {
                    case "w":
                        this.whiteKingPosition = move.endPos;
                        this.whiteCanCastle = [false, false]
                        break;
                    case "b":
                        this.blackKingPosition = move.endPos;
                        this.blackCanCastle = [false, false]
                        break;
                };
            };
            if (movingPiece[1] == "P" && Math.abs(jNew - j) == 2) {
                this.enPassant = move.endPos;
            } else {
                this.enPassant = [];
            };
            let diffValue = pieceValues[oldPiece[1]];
            switch(oldPiece[0]) {
                case "w":
                    this.whiteMaterial -= diffValue;
                    break;
                case "b":
                    this.blackMaterial -= diffValue;
                    break;
            };
            if (move.castleKing) {
                this.board[j][i] = "--";
                this.board[jNew][iNew] = movingPiece;
                if (iNew > i) {
                    this.board[jNew][iNew - 1] = this.board[jNew][iNew + 1];
                    this.board[jNew][iNew + 1] = "--";
                    squaresToBeUpdated.push([iNew - 1, jNew], [iNew + 1, jNew]);
                } else {
                    this.board[jNew][iNew + 1] = this.board[jNew][iNew - 2];
                    this.board[jNew][iNew - 2] = "--";
                    squaresToBeUpdated.push([iNew - 2, jNew], [iNew + 1, jNew]);
                };
            } else if (move.promotion) {
                // ask for the promoted piece
                this.board[j][i] = "--";
                this.board[jNew][iNew] = movingPiece;/*Piece that the user decides to promote to*/
            } else if (move.enPassant) {
                this.board[j][i] = "--";
                this.board[jNew][iNew] = movingPiece;
                switch(movingPiece[0]) {
                    case "w":
                        this.board[jNew + 1][iNew] = "--";
                        this.whiteMaterial -= 1;
                        squaresToBeUpdated.push([iNew, jNew + 1]);
                        break;
                    case "b":
                        this.board[jNew - 1][iNew] = "--";
                        this.blackMaterial -= 1;
                        squaresToBeUpdated.push([iNew, jNew - 1]);
                        break;
                };
            } else {
                this.board[j][i] = "--";
                this.board[jNew][iNew] = movingPiece;
                if (movingPiece[1] == "R") {
                    switch(movingPiece[0]) {
                        case "w":
                            this.whiteCanCastle = [this.whiteCanCastle[0] && this.board[7][0] == "wR", this.whiteCanCastle[1] && this.board[7][7] == "wR"];
                            break;
                        case "b":
                            this.blackCanCastle = [this.blackCanCastle[0] && this.board[0][0] == "bR", this.blackCanCastle[1] && this.board[0][7] == "bR"];
                            break;
                    };
                };
            };
            squaresToBeUpdated.push([i, j], [iNew, jNew]);
            this.possibleMoves = [];
            this.determineChecksAndPins();
            this.possibleMoves = this.getPossibleMoves();
            return [true, squaresToBeUpdated];
        };
        return [false];
    };

    undoMove() {
        if (this.moveLog.length > 0) {
            this.whiteToMove = !this.whiteToMove
            let squaresToBeUpdated = [];
            let [move, oldPiece, whiteCanCastle, blackCanCastle, possibleEnPassant] = this.moveLog.pop();
            this.board[move.startPos[1]][move.startPos[0]] = this.board[move.endPos[1]][move.endPos[0]];
            this.board[move.endPos[1]][move.endPos[0]] = oldPiece;
            this.whiteCanCastle = whiteCanCastle;
            this.blackCanCastle = blackCanCastle;
            this.enPassant = possibleEnPassant;
            squaresToBeUpdated.push(move.startPos, move.endPos)
            let iNew = move.endPos[0];
            let jNew = move.endPos[1];

            if (move.castleKing) {
                if (move.endPos[0] > move.startPos[0]) {
                    this.board[jNew][iNew + 1] = this.board[jNew][iNew - 1];
                    this.board[jNew][iNew - 1] = "--";
                    squaresToBeUpdated.push([iNew + 1, jNew], [iNew - 1, jNew]);
                } else {
                    this.board[jNew][iNew - 2] = this.board[jNew][iNew + 1];
                    this.board[jNew][iNew + 1] = "--";
                    squaresToBeUpdated.push([iNew - 2, jNew], [iNew + 1, jNew]);
                };
            } else if (move.enPassant) {
                switch(this.board[move.startPos[1]][move.startPos[0]]) {
                    case "wP":
                        this.board[jNew + 1][iNew] = "bP"
                        squaresToBeUpdated.push([iNew, jNew + 1]);
                        break;
                    case "bP":
                        this.board[jNew - 1][iNew] = "wP"
                        squaresToBeUpdated.push([iNew, jNew - 1]);
                        break;
                };
            };

            if (this.board[move.startPos[1]][move.startPos[0]][1] == "K") {
                switch(this.board[move.startPos[1]][move.startPos[0]][0]) {
                    case "w":
                        this.whiteKingPosition = move.startPos;
                        break;
                    case "b":
                        this.blackKingPosition = move.startPos;
                        break;
                };
            };
            if (oldPiece != "--") {
                let diffValue = pieceValues[oldPiece[1]];
                switch(oldPiece[0]) {
                    case "w":
                        this.whiteMaterial += diffValue;
                        break;
                    case "b":
                        this.blackMaterial += diffValue;
                        break;
                };
            };

            updateSquares(squaresToBeUpdated)
            this.determineChecksAndPins()
            this.possibleMoves = this.getPossibleMoves();
        };
    };

    determineChecksAndPins() {
        let kingPosition = this.whiteToMove ? this.whiteKingPosition : this.blackKingPosition;
        let color = this.whiteToMove ? "w" : "b";
        let oppositeColor = this.whiteToMove ? "b" : "w";
        let directions = [[-1, 1], [1, 1], [-1, -1], [1, -1], [0, 1], [0, -1], [-1, 0], [1, 0]];
        let pinnedPieceLocations = [];
        let checks = [];
        directions.forEach((direction, j) => {
            let checkBlockPositions = [];
            let i = 1;
            let xDiff = direction[0];
            let yDiff = direction[1];
            let directionPinned = []
            while (this.positionOnBoard(kingPosition[0] + i * xDiff, kingPosition[1] + i * yDiff)) {
                checkBlockPositions.push([kingPosition[0] + i * xDiff, kingPosition[1] + i * yDiff])
                let currentPiece = this.board[kingPosition[1] + i * yDiff][kingPosition[0] + i * xDiff];
                if (currentPiece == "--") {
                    i++;
                    continue;
                } else if (currentPiece[0] == oppositeColor && directionPinned.length == 1) {
                    if (j < 4 && (currentPiece[1] == "B" || currentPiece[1] == "Q")) {
                        pinnedPieceLocations.push(directionPinned[0]);
                        break;
                    } else if (4 <= j && (currentPiece[1] == "R" || currentPiece[1] == "Q")) {
                        pinnedPieceLocations.push(directionPinned[0]);
                        break;
                    } else {
                        break;
                    };
                } else if (currentPiece[0] == color && directionPinned.length == 0) {
                    directionPinned.push([[kingPosition[0] + i * xDiff, kingPosition[1] + i * yDiff], direction]);
                    i++;
                    continue;
                } else if (currentPiece[0] == oppositeColor && directionPinned.length == 0) {
                    if (j < 4 && (currentPiece[1] == "B" || currentPiece[1] == "Q")) {
                        checks.push([[kingPosition[0] + i * xDiff, kingPosition[1] + i * yDiff], direction, checkBlockPositions]);
                        break;
                    } else if (4 <= j && (currentPiece[1] == "R" || currentPiece[1] == "Q")) {
                        checks.push([[kingPosition[0] + i * xDiff, kingPosition[1] + i * yDiff], direction, checkBlockPositions]);
                        break;
                    } else {
                        break;
                    };
                } else {
                    break;
                };
            };
        });

        let knightMoves = [[-1, 2], [1, 2], [-1, -2], [1, -2], [-2, 1], [2, 1], [-2, -1], [2, -1]];
        knightMoves.forEach((moveDiff) => {
            if (this.positionOnBoard(kingPosition[0] + moveDiff[0], kingPosition[1] + moveDiff[1])) {
                let currentPiece = this.board[kingPosition[1] + moveDiff[1]][kingPosition[0] + moveDiff[0]];
                if (currentPiece[0] == oppositeColor && currentPiece[1] == "N") {
                    checks.push([[kingPosition[0] + moveDiff[0], kingPosition[1] + moveDiff[1]], undefined]);
                };
            };
        });

        let i = kingPosition[0]
        let j = kingPosition[1]
        if (oppositeColor == "w") {
            if (this.positionOnBoard(i - 1, j + 1) && this.board[j + 1][i - 1] == "wP") {
                checks.push([[i - 1, j + 1], [-1, 1]]);
            } else if (this.positionOnBoard(i + 1, j + 1) && this.board[j + 1][i + 1] == "wP") {
                checks.push([[i + 1, j + 1], [1, 1]]);
            };
        } else {
            if (this.positionOnBoard(i - 1, j - 1) && this.board[j - 1][i - 1] == "bP") {
                checks.push([[i - 1, j - 1], [-1, -1]]);
            } else if (this.positionOnBoard(i + 1, j - 1) && this.board[j - 1][i + 1] == "bP") {
                checks.push([i + 1, j - 1], [1, -1]);
            };
        };
        this.currentCheckingPieces = checks;
        this.currentPinnedPieces = pinnedPieceLocations;
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
                            let newPawnMoves = this.getPawnMoves([i, j], color, oppositeColor);
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

    getPawnMoves(pieceLocation, color, oppositeColor) {
        let [i, j] = pieceLocation;
        let moves = [];
        let [inPinnedPieces, direction] = this.pieceInPinnedPieces(i, j);
        let advancePossible = !inPinnedPieces || (direction[0] == 0 && (direction[1] == -1 || direction[1] == 1));
        let rightTakePossible = !inPinnedPieces || (direction[0] == -1 && direction[1] == -1) || (direction[0] == 1 && direction[1] == 1);
        let leftTakePossible = !inPinnedPieces || (direction[0] == 1 && direction[1] == -1) || (direction[0] == -1 && direction[1] == 1);
        let notDoubleCheck = this.currentCheckingPieces.length < 2;
        let noCheck = this.currentCheckingPieces.length == 0;
        let blockLocations;
        let checkLocation;
        let directionFromKing;
        if (!noCheck) {
            [checkLocation, directionFromKing, blockLocations] = this.currentCheckingPieces[0];
        }
        if (notDoubleCheck) {
            switch(color) {
                case "w":
                    if (j - 1 >= 0 && this.board[j - 1][i] == "--" && advancePossible) {
                        if (noCheck || this.locationInBlocks([i, j - 1], blockLocations)) {
                            moves.push(new Move(pieceLocation, [i, j - 1], j - 1 == 0));
                        };
                        if (j == 6 && this.board[4][i] == "--" && (noCheck || this.locationInBlocks([i, j - 2], blockLocations))) {
                            moves.push(new Move(pieceLocation, [i, j - 2]));
                        };
                    };
                    if (j - 1 >= 0 && i - 1 >= 0 && this.board[j - 1][i - 1][0] == "b" && rightTakePossible && noCheck) {
                        moves.push(new Move(pieceLocation, [i - 1, j - 1], j - 1 == 0));
                    };
                    if (j - 1 >= 0 && i + 1 < 8 && this.board[j - 1][i + 1][0] == "b" && leftTakePossible && noCheck) {
                        moves.push(new Move(pieceLocation, [i + 1, j - 1], j - 1 == 0));
                    };
                    if (this.enPassant.length > 0 && j == 3 && noCheck) {
                        if (this.enPassant[1] == 3 && this.enPassant[0] == i - 1 && 0 <= i - 1 && this.enPassantPin([i, j], [i - 1, j], color, oppositeColor, this.whiteKingPosition) && rightTakePossible) {
                            moves.push(new Move(pieceLocation, [i - 1, j - 1], false, false, true));
                        };
                        if (this.enPassant[1] == 3 && this.enPassant[0] == i + 1 && i + 1 < 8 && this.enPassantPin([i, j], [i + 1, j], color, oppositeColor, this.whiteKingPosition) && leftTakePossible) {
                            moves.push(new Move(pieceLocation, [i + 1, j - 1], false, false, true));
                        };
                    };
                    break;
                case "b":
                    if (j + 1 < 8 && this.board[j + 1][i] == "--" && advancePossible) {
                        if (noCheck || this.locationInBlocks([i, j + 1], blockLocations)) {
                            moves.push(new Move(pieceLocation, [i, j + 1], j + 1 == 7));
                        };
                        if (j == 1 && this.board[3][i] == "--" && (noCheck || this.locationInBlocks([i, j + 2], blockLocations))) {
                            moves.push(new Move(pieceLocation, [i, j + 2]));
                        };
                    };
                    if (j + 1 < 8 && i - 1 >= 0 && this.board[j + 1][i - 1][0] == "w" && leftTakePossible && noCheck) {
                        moves.push(new Move(pieceLocation, [i - 1, j + 1], j + 1 == 7));
                    };
                    if (j + 1 < 8 && i + 1 < 8 && this.board[j + 1][i + 1][0] == "w" && rightTakePossible && noCheck) {
                        moves.push(new Move(pieceLocation, [i + 1, j + 1], j + 1 == 7));
                    };
                    if (this.enPassant.length > 0 && j == 4 && noCheck) {
                        if (this.enPassant[1] == 4 && this.enPassant[0] == i - 1 && 0 <= i - 1 && this.enPassantPin([i, j], [i - 1, j], color, oppositeColor, this.blackKingPosition) && leftTakePossible) {
                            moves.push(new Move(pieceLocation, [i - 1, j + 1], false, false, true));
                        };
                        if (this.enPassant[1] == 4 && this.enPassant[0] == i + 1 && i + 1 < 8 && this.enPassantPin([i, j], [i + 1, j], color, oppositeColor, this.blackKingPosition) && rightTakePossible) {
                            moves.push(new Move(pieceLocation, [i + 1, j + 1], false, false, true));
                        };
                    };
                    break;
            };
        };
        return moves;
    };

    getKnightMoves(pieceLocation, color) {
        let moveDifferences = [[-1, 2], [1, 2], [-1, -2], [1, -2], [-2, 1], [2, 1], [-2, -1], [2, -1]];
        let [i, j] = pieceLocation;
        let moves = [];
        let [inPinnedPieces, _] = this.pieceInPinnedPieces(i, j);
        if (!inPinnedPieces) {
            moveDifferences.forEach((xyDiff) => {
                let iNew = i + xyDiff[0]
                let jNew = j + xyDiff[1]
                if (this.positionOnBoard(iNew, jNew) && this.board[jNew][iNew][0] != color) {
                    moves.push(new Move(pieceLocation, [iNew, jNew]));
                };
            });
        };
        return moves;
    };

    getBishopMoves(pieceLocation, oppositeColor) {
        let directions = [[-1, 1], [1, -1], [-1, -1], [1, 1]]
        let [i, j] = pieceLocation;
        let moves = [];
        let [inPinnedPieces, pinDirection] = this.pieceInPinnedPieces(i, j);
        directions.forEach(direction => {
            let n = 1;
            let directionPossible = !inPinnedPieces || (pinDirection[0] == direction[0] && pinDirection[1] == direction[1]) || (-pinDirection[0] == direction[0] && -pinDirection[1] == direction[1]);
            if (directionPossible) {
                while (this.positionOnBoard(i + n * direction[0], j + n * direction[1])) {
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
            };
        });
        return moves;
    };

    getRookMoves(pieceLocation, oppositeColor) {
        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
        let [i, j] = pieceLocation;
        let moves = [];
        let [inPinnedPieces, pinDirection] = this.pieceInPinnedPieces(i, j);
        directions.forEach(direction => {
            let n = 1;
            let directionPossible = !inPinnedPieces || (pinDirection[0] == direction[0] && pinDirection[1] == direction[1]) || (-pinDirection[0] == direction[0] && -pinDirection[1] == direction[1]);
            if (directionPossible) {
                while (this.positionOnBoard(i + n * direction[0], j + n * direction[1])) {
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

    getKingMoves(pieceLocation, color) {
        let directions = [[-1, 1], [1, 1], [-1, -1], [1, -1], [0, 1], [0, -1], [-1, 0], [1, 0]];
        let [i, j] = pieceLocation;
        let moves = [];
        let oppositeColor = color == "w" ? "b" : "w";
        directions.forEach(direction => {
            if (this.positionOnBoard(i + direction[0], j + direction[1])) {
                let iNew = i + direction[0];
                let jNew = j + direction[1];
                let currentSquare = this.board[jNew][iNew];
                if (currentSquare[0] != color && !this.opponentAttackSquare([iNew, jNew], oppositeColor)) {
                    moves.push(new Move(pieceLocation, [iNew, jNew]));
                };
            };
        });
        switch(color) {
            case "w":
                if (this.whiteCanCastle[0] && this.board[7][0] == "wR" && this.board[7][1] == "--" && this.board[7][2] == "--" && this.board[7][3] == "--") {
                    if (!this.opponentAttackSquare([2, 7], oppositeColor) && !this.opponentAttackSquare([3, 7], oppositeColor) && this.currentCheckingPieces.length == 0) {
                        moves.push(new Move(pieceLocation, [2, 7], false, true)); // white castle long
                    };
                };
                if (this.whiteCanCastle[1] && this.board[7][7] == "wR" && this.board[7][5] == "--" && this.board[7][6] == "--") {
                    if (!this.opponentAttackSquare([5, 7], oppositeColor) && !this.opponentAttackSquare([6, 7], oppositeColor) && this.currentCheckingPieces.length == 0) {
                        moves.push(new Move(pieceLocation, [6, 7], false, true)) // white castle short
                    };
                };
                break;
            case "b":
                if (this.blackCanCastle[0] && this.board[0][0] == "bR" && this.board[0][1] == "--" && this.board[0][2] == "--" && this.board[0][3] == "--") {
                    if (!this.opponentAttackSquare([2, 0], oppositeColor) && !this.opponentAttackSquare([3, 0], oppositeColor) && this.currentCheckingPieces.length == 0) {
                        moves.push(new Move(pieceLocation, [2, 0], false, true)); // black castle long
                    };
                };
                if (this.blackCanCastle[1] && this.board[0][7] == "bR" && this.board[0][5] == "--" && this.board[0][6] == "--") {
                    if (!this.opponentAttackSquare([5, 0], oppositeColor) && !this.opponentAttackSquare([6, 0], oppositeColor) && this.currentCheckingPieces.length == 0) {
                        moves.push(new Move(pieceLocation, [6, 0], false, true)) // black castle short
                    };
                };
                break;
        };
        return moves;
    };

    opponentAttackSquare(position, oppositeColor) {
        let [i, j] = position;
        let directions = [[-1, 1], [1, 1], [-1, -1], [1, -1], [0, 1], [0, -1], [-1, 0], [1, 0]];
        for (var index = 0; index < directions.length; index++) {
            let direction = directions[index];
            let n = 1;
            while (this.positionOnBoard(i + n * direction[0], j + n * direction[1])) {
                let iNew = i + n * direction[0];
                let jNew = j + n * direction[1];
                let currentPiece = this.board[jNew][iNew];
                if (currentPiece[0] == oppositeColor && ((index < 4 && (currentPiece[1] == "B" || currentPiece[1] == "Q")) || 
                (index >= 4 && (currentPiece[1] == "R" || currentPiece[1] == "Q")) || 
                (n == 1 && currentPiece[1] == "K"))) {
                    return true;
                } else if (currentPiece != "--") {
                    break;
                };
                n++;
            };
        };
        let moveDifferences = [[-1, 2], [1, 2], [-1, -2], [1, -2], [-2, 1], [2, 1], [-2, -1], [2, -1]];
        for (var index = 0; index < moveDifferences.length; index++) {
            let xyDiff = moveDifferences[index];
            let iNew = i + xyDiff[0];
            let jNew = j + xyDiff[1];
            if (this.positionOnBoard(iNew, jNew)) {
                let currentPiece = this.board[jNew][iNew];
                if (currentPiece[0] == oppositeColor && currentPiece[1] == "N") {
                    return true;
                };
            };
        };
        if (oppositeColor == "w") {
            if ((this.positionOnBoard(i - 1, j + 1) && this.board[j + 1][i - 1][1] == "P" && this.board[j + 1][i - 1][0] == oppositeColor) || 
            (this.positionOnBoard(i + 1, j + 1) && this.board[j + 1][i + 1][1] == "P" && this.board[j + 1][i + 1][0] == oppositeColor)) {
                return true;
            };
        } else {
            if ((this.positionOnBoard(i - 1, j - 1) && this.board[j - 1][i - 1][1] == "P" && this.board[j - 1][i - 1][0] == oppositeColor) || 
            (this.positionOnBoard(i + 1, j - 1) && this.board[j - 1][i + 1][1] == "P" && this.board[j - 1][i + 1][0] == oppositeColor)) {
                return true;
            };
        };
        return false;
    };

    // returns false if en passant is not possible due to pinned king, else returns true
    enPassantPin(pawnPosition, takenPosition, color, oppositeColor, ownKingPosition) {
        if (pawnPosition[1] != ownKingPosition[1]) {
            return true
        } else {
            let direction = pawnPosition[0] < ownKingPosition[0] ? [-1, 0] : [1, 0];
            console.log(direction)
            let n = 1;
            while (this.positionOnBoard(ownKingPosition[0] + n * direction[0], ownKingPosition[1] + n * direction[1])) {
                let iNew = ownKingPosition[0] + n * direction[0];
                let jNew = ownKingPosition[1] + n * direction[1];
                console.log([iNew, jNew])
                if ((iNew == pawnPosition[0] && jNew == pawnPosition[1]) || (iNew == takenPosition[0] && jNew == takenPosition[1])) {
                    n++;
                    continue;
                } else {
                    if (this.board[jNew][iNew][0] == color) {
                        return true;
                    } else if (this.board[jNew][iNew][0] == oppositeColor && (this.board[jNew][iNew][1] == "Q" || this.board[jNew][iNew][1] == "R")) {
                        return false;
                    };
                    n++;
                };
            };
            return true;
        };
    };

    positionOnBoard(i, j) {
        return (0 <= i && i < 8 && 0 <= j && j < 8)
    };

    pieceInPinnedPieces(i, j) {
        for (let index = 0; index < this.currentPinnedPieces.length; index++) {
            let [location, direction] = this.currentPinnedPieces[index];
            if (location[0] == i && location[1] == j) {
                return [true, direction];
            };
        };
        return [false, []];
    };

    locationInBlocks(location, blocks) {
        for (let index = 0; index < blocks.length; index++) {
            let possibleBlock = blocks[index];
            if (location[0] == possibleBlock[0] && location[1] == possibleBlock[1]) {
                return true;
            };
        };
        return false;
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