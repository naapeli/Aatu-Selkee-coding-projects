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
        ];
        this.boardUtility = new boardUtils();
        this.whiteToMove = true
        this.blackKingPosition = [4, 0];
        this.whiteKingPosition = [4, 7];
        this.whiteMaterial = this.boardUtility.countMaterial(this.board)[0];
        this.blackMaterial = this.boardUtility.countMaterial(this.board)[1];
        this.whitePiecePositionBonus = this.boardUtility.countPiecePositionBonus(this.board)[0];
        this.blackPiecePositionBonus = this.boardUtility.countPiecePositionBonus(this.board)[1];
        this.whitePiecePositionBonusEg = this.boardUtility.countPiecePositionBonus(this.board)[2];
        this.blackPiecePositionBonusEg = this.boardUtility.countPiecePositionBonus(this.board)[3];
        this.whitePieces = 7;
        this.blackPieces = 7;
        this.whiteCanCastle = [true, true]; // long, short
        this.blackCanCastle = [true, true]; // long, short
        this.currentCheckingPieces = []; // element is in format [Set(possibleBlocks), ...]
        this.currentPinnedPieces = new Map(); // element is in format {location => directionIndex, ...}
        this.enPassant = [];
        this.possibleMoves = this.getPossibleMoves();
        this.moveLog = []; // [[move, whiteCanCastle, blackCanCastle, enPassant], ...]
        this.zobristHash = this.boardUtility.generateZobristHash(this.board, this.enPassant, this.whiteCanCastle, this.blackCanCastle, this.whiteToMove);
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
            this.zobristHash = this.boardUtility.updateZobristHashCastlingRights(this.zobristHash, this.whiteCanCastle, this.blackCanCastle);
            this.zobristHash = this.boardUtility.updateZobristHashEnPassant(this.zobristHash, this.enPassant);
            this.whiteToMove = !this.whiteToMove;
            let squaresToBeUpdated = [];
            let [i, j] = move.startPos;
            let movingPiece = move.movingPiece;
            let [iNew, jNew] = move.endPos;
            this.moveLog.push([move, this.whiteCanCastle, this.blackCanCastle, this.enPassant]);
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
                this.board[j][i] = "--";
                this.board[jNew][iNew] = move.promotedPiece;
            } else if (move.enPassant) {
                this.board[j][i] = "--";
                this.board[jNew][iNew] = movingPiece;
                switch(movingPiece[0]) {
                    case "w":
                        this.board[jNew + 1][iNew] = "--";
                        squaresToBeUpdated.push([iNew, jNew + 1]);
                        break;
                    case "b":
                        this.board[jNew - 1][iNew] = "--";
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

            if (pieces.has(move.takenPiece[1])) {
                switch(move.takenPiece[0]) {
                    case "w":
                        this.whitePieces--;
                        break;
                    case "b":
                        this.blackPieces--;
                        break;
                };
            };

            let [whiteMaterialDiff, blackMaterialDiff, whitePiecePositionBonusDiff, blackPiecePositionBonusDiff, whitePiecePositionBonusDiffEg, blackPiecePositionBonusDiffEg] = this.boardUtility.getMaterialDiffs(move);
            this.whiteMaterial += whiteMaterialDiff;
            this.blackMaterial += blackMaterialDiff;
            this.whitePiecePositionBonus += whitePiecePositionBonusDiff;
            this.blackPiecePositionBonus += blackPiecePositionBonusDiff;
            this.whitePiecePositionBonusEg += whitePiecePositionBonusDiffEg;
            this.blackPiecePositionBonusEg += blackPiecePositionBonusDiffEg;
            squaresToBeUpdated.push([i, j], [iNew, jNew]);
            this.possibleMoves = [];
            this.determineChecksAndPins();
            this.possibleMoves = this.getPossibleMoves();

            this.zobristHash = this.boardUtility.updateZobristHashCastlingRights(this.zobristHash, this.whiteCanCastle, this.blackCanCastle);
            this.zobristHash = this.boardUtility.updateZobristHashEnPassant(this.zobristHash, this.enPassant);
            this.zobristHash = this.boardUtility.updateZobristHash(this.zobristHash, move, !this.whiteToMove, this.enPassant);
            return [true, squaresToBeUpdated];
        };
        return [false];
    };

    undoMove() {
        if (this.moveLog.length > 0) {
            this.zobristHash = this.boardUtility.updateZobristHashCastlingRights(this.zobristHash, this.whiteCanCastle, this.blackCanCastle);
            this.zobristHash = this.boardUtility.updateZobristHashEnPassant(this.zobristHash, this.enPassant);
            this.whiteToMove = !this.whiteToMove
            let squaresToBeUpdated = [];
            let [move, whiteCanCastle, blackCanCastle, possibleEnPassant] = this.moveLog.pop();
            this.board[move.startPos[1]][move.startPos[0]] = move.movingPiece;
            this.board[move.endPos[1]][move.endPos[0]] = move.takenPiece;
            this.whiteCanCastle = whiteCanCastle;
            this.blackCanCastle = blackCanCastle;
            this.enPassant = possibleEnPassant;
            squaresToBeUpdated.push(move.startPos, move.endPos);
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
                switch(move.movingPiece) {
                    case "wP":
                        this.board[jNew + 1][iNew] = "bP";
                        squaresToBeUpdated.push([iNew, jNew + 1]);
                        break;
                    case "bP":
                        this.board[jNew - 1][iNew] = "wP";
                        squaresToBeUpdated.push([iNew, jNew - 1]);
                        break;
                };
            } else if (move.promotion) {
                if (this.whiteToMove) {
                    this.board[move.startPos[1]][move.startPos[0]] = "wP";
                } else {
                    this.board[move.startPos[1]][move.startPos[0]] = "bP";
                };
            };

            if (move.movingPiece[1] == "K") {
                switch(move.movingPiece[0]) {
                    case "w":
                        this.whiteKingPosition = move.startPos;
                        break;
                    case "b":
                        this.blackKingPosition = move.startPos;
                        break;
                };
            };

            if (pieces.has(move.takenPiece[1])) {
                switch(move.takenPiece[0]) {
                    case "w":
                        this.whitePieces++;
                        break;
                    case "b":
                        this.blackPieces++;
                        break;
                };
            };

            let [whiteMaterialDiff, blackMaterialDiff, whitePiecePositionBonusDiff, blackPiecePositionBonusDiff, whitePiecePositionBonusDiffEg, blackPiecePositionBonusDiffEg] = this.boardUtility.getMaterialDiffs(move, true);
            this.whiteMaterial += whiteMaterialDiff;
            this.blackMaterial += blackMaterialDiff;
            this.whitePiecePositionBonus += whitePiecePositionBonusDiff;
            this.blackPiecePositionBonus += blackPiecePositionBonusDiff;
            this.whitePiecePositionBonusEg += whitePiecePositionBonusDiffEg;
            this.blackPiecePositionBonusEg += blackPiecePositionBonusDiffEg;
            this.determineChecksAndPins();
            this.possibleMoves = this.getPossibleMoves();
            this.zobristHash = this.boardUtility.updateZobristHashCastlingRights(this.zobristHash, this.whiteCanCastle, this.blackCanCastle);
            this.zobristHash = this.boardUtility.updateZobristHashEnPassant(this.zobristHash, this.enPassant);
            this.zobristHash = this.boardUtility.updateZobristHash(this.zobristHash, move, this.whiteToMove, this.enPassant);
            return squaresToBeUpdated
        };
        return [];
    };

    determineChecksAndPins() {
        let kingPosition = this.whiteToMove ? this.whiteKingPosition : this.blackKingPosition;
        let color = this.whiteToMove ? "w" : "b";
        let oppositeColor = this.whiteToMove ? "b" : "w";
        let directions = [[-1, 1], [1, 1], [-1, -1], [1, -1], [0, 1], [0, -1], [-1, 0], [1, 0]];
        let pinnedPieceLocations = new Map();
        let checks = [];
        directions.forEach((direction, j) => {
            let checkBlockPositions = new Set();
            let i = 1;
            let xDiff = direction[0];
            let yDiff = direction[1];
            let directionPinned = []
            while (this.boardUtility.positionOnBoard(kingPosition[0] + i * xDiff, kingPosition[1] + i * yDiff)) {
                checkBlockPositions.add(10 * (kingPosition[0] + i * xDiff) + kingPosition[1] + i * yDiff)
                let currentPiece = this.board[kingPosition[1] + i * yDiff][kingPosition[0] + i * xDiff];
                if (currentPiece == "--") {
                    i++;
                    continue;
                } else if (currentPiece[0] == oppositeColor && directionPinned.length == 1) {
                    if (j < 4 && (currentPiece[1] == "B" || currentPiece[1] == "Q")) {
                        let [position, directionIndex] = directionPinned[0];
                        pinnedPieceLocations.set(10 * position[0] + position[1], directionIndex);
                        break;
                    } else if (4 <= j && (currentPiece[1] == "R" || currentPiece[1] == "Q")) {
                        let [position, directionIndex] = directionPinned[0];
                        pinnedPieceLocations.set(10 * position[0] + position[1], directionIndex);
                        break;
                    } else {
                        break;
                    };
                } else if (currentPiece[0] == color && directionPinned.length == 0) {
                    directionPinned.push([[kingPosition[0] + i * xDiff, kingPosition[1] + i * yDiff], j]);
                    i++;
                    continue;
                } else if (currentPiece[0] == oppositeColor && directionPinned.length == 0) {
                    if (j < 4 && (currentPiece[1] == "B" || currentPiece[1] == "Q")) {
                        checks.push(checkBlockPositions);
                        break;
                    } else if (4 <= j && (currentPiece[1] == "R" || currentPiece[1] == "Q")) {
                        checks.push(checkBlockPositions);
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
            if (this.boardUtility.positionOnBoard(kingPosition[0] + moveDiff[0], kingPosition[1] + moveDiff[1])) {
                let currentPiece = this.board[kingPosition[1] + moveDiff[1]][kingPosition[0] + moveDiff[0]];
                if (currentPiece[0] == oppositeColor && currentPiece[1] == "N") {
                    checks.push(new Set([10 * (kingPosition[0] + moveDiff[0]) + kingPosition[1] + moveDiff[1]]));
                };
            };
        });

        let i = kingPosition[0]
        let j = kingPosition[1]
        if (oppositeColor == "w") {
            if (this.boardUtility.positionOnBoard(i - 1, j + 1) && this.board[j + 1][i - 1] == "wP") {
                checks.push(new Set([10 * (i - 1) + j + 1]));
            } else if (this.boardUtility.positionOnBoard(i + 1, j + 1) && this.board[j + 1][i + 1] == "wP") {
                checks.push(new Set([10 * (i + 1) + j + 1]));
            };
        } else {
            if (this.boardUtility.positionOnBoard(i - 1, j - 1) && this.board[j - 1][i - 1] == "bP") {
                checks.push(new Set([10 * (i - 1) + j - 1]));
            } else if (this.boardUtility.positionOnBoard(i + 1, j - 1) && this.board[j - 1][i + 1] == "bP") {
                checks.push(new Set([10 * (i + 1) + j - 1]));
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
        let [inPinnedPieces, direction] = this.boardUtility.pieceInPinnedPieces(i, j, this.currentPinnedPieces);
        let advancePossible = !inPinnedPieces || (direction[0] == 0 && (direction[1] == -1 || direction[1] == 1));
        let rightTakePossible = !inPinnedPieces || (direction[0] == -1 && direction[1] == -1) || (direction[0] == 1 && direction[1] == 1);
        let leftTakePossible = !inPinnedPieces || (direction[0] == 1 && direction[1] == -1) || (direction[0] == -1 && direction[1] == 1);
        let notDoubleCheck = this.currentCheckingPieces.length < 2;
        let noCheck = this.currentCheckingPieces.length == 0;
        let blockLocations;
        if (!noCheck) {
            blockLocations = this.currentCheckingPieces[0];
        };
        if (notDoubleCheck) {
            switch(color) {
                case "w":
                    if (j - 1 >= 0 && this.board[j - 1][i] == "--" && advancePossible) {
                        if (noCheck || blockLocations.has(10 * i + j - 1)) {
                            if (j - 1 != 0) {
                                moves.push(new Move(pieceLocation, [i, j - 1], "wP", "--"));
                            } else {
                                const possiblePromotions = ["wN", "wB", "wR", "wQ"];
                                possiblePromotions.forEach((piece) => {
                                    moves.push(new Move(pieceLocation, [i, j - 1], "wP", "--", true, false, false, piece));
                                });
                            };
                        };
                        if (j == 6 && this.board[4][i] == "--" && (noCheck || blockLocations.has(10 * i + j - 2))) {
                            moves.push(new Move(pieceLocation, [i, j - 2], "wP", "--"));
                        };
                    };
                    if (j - 1 >= 0 && i - 1 >= 0 && this.board[j - 1][i - 1][0] == "b" && rightTakePossible && (noCheck || blockLocations.has(10 * (i - 1) + j - 1))) {
                        if (j - 1 != 0) {
                            moves.push(new Move(pieceLocation, [i - 1, j - 1], "wP", this.board[j - 1][i - 1]));
                        } else {
                            const possiblePromotions = ["wN", "wB", "wR", "wQ"];
                            possiblePromotions.forEach((piece) => {
                                moves.push(new Move(pieceLocation, [i - 1, j - 1], "wP", this.board[j - 1][i - 1], true, false, false, piece));
                            });
                        };
                    };
                    if (j - 1 >= 0 && i + 1 < 8 && this.board[j - 1][i + 1][0] == "b" && leftTakePossible && (noCheck || blockLocations.has(10 * (i + 1) + j - 1))) {
                        if (j - 1 != 0) {
                            moves.push(new Move(pieceLocation, [i + 1, j - 1], "wP", this.board[j - 1][i + 1]));
                        } else {
                            const possiblePromotions = ["wN", "wB", "wR", "wQ"];
                            possiblePromotions.forEach((piece) => {
                                moves.push(new Move(pieceLocation, [i + 1, j - 1], "wP", this.board[j - 1][i + 1], true, false, false, piece));
                            });
                        };
                    };
                    if (this.enPassant.length > 0 && j == 3) {
                        if (this.enPassant[1] == 3 && this.enPassant[0] == i - 1 && 0 <= i - 1 && this.boardUtility.enPassantPin([i, j], [i - 1, j], color, oppositeColor, this.whiteKingPosition, this.board) && rightTakePossible && (noCheck || blockLocations.has(10 * (i - 1) + j))) {
                            moves.push(new Move(pieceLocation, [i - 1, j - 1], "wP", "--", false, false, true));
                        };
                        if (this.enPassant[1] == 3 && this.enPassant[0] == i + 1 && i + 1 < 8 && this.boardUtility.enPassantPin([i, j], [i + 1, j], color, oppositeColor, this.whiteKingPosition, this.board) && leftTakePossible && (noCheck || blockLocations.has(10 * (i + 1) + j))) {
                            moves.push(new Move(pieceLocation, [i + 1, j - 1], "wP", "--", false, false, true));
                        };
                    };
                    break;
                case "b":
                    if (j + 1 < 8 && this.board[j + 1][i] == "--" && advancePossible) {
                        if (noCheck || blockLocations.has(10 * i + j + 1)) {
                            if (j + 1 != 7) {
                                moves.push(new Move(pieceLocation, [i, j + 1], "bP", "--"));
                            } else {
                                const possiblePromotions = ["bN", "bB", "bR", "bQ"];
                                possiblePromotions.forEach((piece) => {
                                    moves.push(new Move(pieceLocation, [i, j + 1], "bP", "--", true, false, false, piece));
                                });
                            };
                        };
                        if (j == 1 && this.board[3][i] == "--" && (noCheck || blockLocations.has(10 * i + j + 2))) {
                            moves.push(new Move(pieceLocation, [i, j + 2], "bP", "--"));
                        };
                    };
                    if (j + 1 < 8 && i - 1 >= 0 && this.board[j + 1][i - 1][0] == "w" && leftTakePossible && (noCheck || blockLocations.has(10 * (i - 1) + j + 1))) {
                        if (j + 1 != 7) {
                            moves.push(new Move(pieceLocation, [i - 1, j + 1], "bP", this.board[j + 1][i - 1]));
                        } else {
                            const possiblePromotions = ["bN", "bB", "bR", "bQ"];
                            possiblePromotions.forEach((piece) => {
                                moves.push(new Move(pieceLocation, [i - 1, j + 1], "bP", this.board[j + 1][i - 1], true, false, false, piece));
                            });
                        };
                    };
                    if (j + 1 < 8 && i + 1 < 8 && this.board[j + 1][i + 1][0] == "w" && rightTakePossible && (noCheck || blockLocations.has(10 * (i + 1) + j + 1))) {
                        if (j + 1 != 7) {
                            moves.push(new Move(pieceLocation, [i + 1, j + 1], "bP", this.board[j + 1][i + 1]));
                        } else {
                            const possiblePromotions = ["bN", "bB", "bR", "bQ"];
                            possiblePromotions.forEach((piece) => {
                                moves.push(new Move(pieceLocation, [i + 1, j + 1], "bP", this.board[j + 1][i + 1], true, false, false, piece));
                            });
                        };
                    };
                    if (this.enPassant.length > 0 && j == 4) {
                        if (this.enPassant[1] == 4 && this.enPassant[0] == i - 1 && 0 <= i - 1 && this.boardUtility.enPassantPin([i, j], [i - 1, j], color, oppositeColor, this.blackKingPosition, this.board) && leftTakePossible && (noCheck || blockLocations.has(10 * (i - 1) + j))) {
                            moves.push(new Move(pieceLocation, [i - 1, j + 1], "bP", "--", false, false, true));
                        };
                        if (this.enPassant[1] == 4 && this.enPassant[0] == i + 1 && i + 1 < 8 && this.boardUtility.enPassantPin([i, j], [i + 1, j], color, oppositeColor, this.blackKingPosition, this.board) && rightTakePossible && (noCheck || blockLocations.has(10 * (i + 1) + j))) {
                            moves.push(new Move(pieceLocation, [i + 1, j + 1], "bP", "--", false, false, true));
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
        let [inPinnedPieces, _] = this.boardUtility.pieceInPinnedPieces(i, j, this.currentPinnedPieces);
        let notDoubleCheck = this.currentCheckingPieces.length < 2;
        let noCheck = this.currentCheckingPieces.length == 0;
        let blockLocations;
        const movingPiece = this.board[j][i];
        if (!noCheck) {
            blockLocations = this.currentCheckingPieces[0];
        };
        if (notDoubleCheck) {
            if (!inPinnedPieces) {
                moveDifferences.forEach((xyDiff) => {
                    let iNew = i + xyDiff[0]
                    let jNew = j + xyDiff[1]
                    if (this.boardUtility.positionOnBoard(iNew, jNew) && this.board[jNew][iNew][0] != color && (noCheck || blockLocations.has(10 * iNew + jNew))) {
                        moves.push(new Move(pieceLocation, [iNew, jNew], movingPiece, this.board[jNew][iNew]));
                    };
                });
            };
        };
        return moves;
    };

    getBishopMoves(pieceLocation, oppositeColor) {
        let directions = [[-1, 1], [1, -1], [-1, -1], [1, 1]]
        let [i, j] = pieceLocation;
        let moves = [];
        let [inPinnedPieces, pinDirection] = this.boardUtility.pieceInPinnedPieces(i, j, this.currentPinnedPieces);
        let notDoubleCheck = this.currentCheckingPieces.length < 2;
        let noCheck = this.currentCheckingPieces.length == 0;
        let blockLocations;
        const movingPiece = this.board[j][i];
        if (!noCheck) {
            blockLocations = this.currentCheckingPieces[0];
        };
        if (notDoubleCheck) {
            directions.forEach(direction => {
                let n = 1;
                let directionPossible = !inPinnedPieces || (pinDirection[0] == direction[0] && pinDirection[1] == direction[1]) || (-pinDirection[0] == direction[0] && -pinDirection[1] == direction[1]);
                if (directionPossible) {
                    while (this.boardUtility.positionOnBoard(i + n * direction[0], j + n * direction[1])) {
                        let iNew = i + n * direction[0];
                        let jNew = j + n * direction[1];
                        let currentPiece = this.board[jNew][iNew];
                        if (currentPiece == "--") {
                            if (noCheck || blockLocations.has(10 * iNew + jNew)) {
                                moves.push(new Move(pieceLocation, [iNew, jNew], movingPiece, currentPiece));
                            };
                            n++;
                            continue;
                        } else if (currentPiece[0] == oppositeColor && (noCheck || blockLocations.has(10 * iNew + jNew))) {
                            moves.push(new Move(pieceLocation, [iNew, jNew], movingPiece, currentPiece));
                            break;
                        } else {
                            break;
                        };
                    };
                };
            });
        };
        return moves;
    };

    getRookMoves(pieceLocation, oppositeColor) {
        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
        let [i, j] = pieceLocation;
        let moves = [];
        let [inPinnedPieces, pinDirection] = this.boardUtility.pieceInPinnedPieces(i, j, this.currentPinnedPieces);
        let notDoubleCheck = this.currentCheckingPieces.length < 2;
        let noCheck = this.currentCheckingPieces.length == 0;
        let blockLocations;
        const movingPiece = this.board[j][i];
        if (!noCheck) {
            blockLocations = this.currentCheckingPieces[0];
        };
        if (notDoubleCheck) {
            directions.forEach(direction => {
                let n = 1;
                let directionPossible = !inPinnedPieces || (pinDirection[0] == direction[0] && pinDirection[1] == direction[1]) || (-pinDirection[0] == direction[0] && -pinDirection[1] == direction[1]);
                if (directionPossible) {
                    while (this.boardUtility.positionOnBoard(i + n * direction[0], j + n * direction[1])) {
                        let iNew = i + n * direction[0];
                        let jNew = j + n * direction[1];
                        let currentPiece = this.board[jNew][iNew];
                        if (currentPiece == "--") {
                            if (noCheck || blockLocations.has(10 * iNew + jNew)) {
                                moves.push(new Move(pieceLocation, [iNew, jNew], movingPiece, currentPiece));
                            };
                            n++;
                            continue;
                        } else if (currentPiece[0] == oppositeColor && (noCheck || blockLocations.has(10 * iNew + jNew))) {
                            moves.push(new Move(pieceLocation, [iNew, jNew], movingPiece, currentPiece));
                            break;
                        } else {
                            break;
                        };
                    };
                };
            });
        };
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
        const movingPiece = this.board[j][i];
        directions.forEach(direction => {
            if (this.boardUtility.positionOnBoard(i + direction[0], j + direction[1])) {
                let iNew = i + direction[0];
                let jNew = j + direction[1];
                let currentSquare = this.board[jNew][iNew];
                let checkPin = false;
                for (let index = 0; index < this.currentCheckingPieces.length; index++) {
                    let blockLocation = this.currentCheckingPieces[index];
                    let checkPinForward = blockLocation.has(10 * iNew + jNew) && blockLocation.size > 1;
                    let checkPinBackward = blockLocation.has(10 * (i - direction[0]) + j - direction[1]) && this.board[j - direction[1]][i - direction[0]][1] != "P";
                    checkPin = checkPinForward || checkPinBackward;
                    if (checkPin) {
                        break;
                    };
                };
                if (currentSquare[0] != color && !this.boardUtility.opponentAttackSquare([iNew, jNew], oppositeColor, this.board) && !checkPin) {
                    moves.push(new Move(pieceLocation, [iNew, jNew], movingPiece, this.board[jNew][iNew]));
                };
            };
        });
        switch(color) {
            case "w":
                if (this.whiteCanCastle[0] && this.board[7][0] == "wR" && this.board[7][1] == "--" && this.board[7][2] == "--" && this.board[7][3] == "--") {
                    if (!this.boardUtility.opponentAttackSquare([2, 7], oppositeColor, this.board) && !this.boardUtility.opponentAttackSquare([3, 7], oppositeColor, this.board) && this.currentCheckingPieces.length == 0) {
                        moves.push(new Move(pieceLocation, [2, 7], movingPiece, "--", false, true)); // white castle long
                    };
                };
                if (this.whiteCanCastle[1] && this.board[7][7] == "wR" && this.board[7][5] == "--" && this.board[7][6] == "--") {
                    if (!this.boardUtility.opponentAttackSquare([5, 7], oppositeColor, this.board) && !this.boardUtility.opponentAttackSquare([6, 7], oppositeColor, this.board) && this.currentCheckingPieces.length == 0) {
                        moves.push(new Move(pieceLocation, [6, 7], movingPiece, "--", false, true)) // white castle short
                    };
                };
                break;
            case "b":
                if (this.blackCanCastle[0] && this.board[0][0] == "bR" && this.board[0][1] == "--" && this.board[0][2] == "--" && this.board[0][3] == "--") {
                    if (!this.boardUtility.opponentAttackSquare([2, 0], oppositeColor, this.board) && !this.boardUtility.opponentAttackSquare([3, 0], oppositeColor, this.board) && this.currentCheckingPieces.length == 0) {
                        moves.push(new Move(pieceLocation, [2, 0], movingPiece, "--", false, true)); // black castle long
                    };
                };
                if (this.blackCanCastle[1] && this.board[0][7] == "bR" && this.board[0][5] == "--" && this.board[0][6] == "--") {
                    if (!this.boardUtility.opponentAttackSquare([5, 0], oppositeColor, this.board) && !this.boardUtility.opponentAttackSquare([6, 0], oppositeColor, this.board) && this.currentCheckingPieces.length == 0) {
                        moves.push(new Move(pieceLocation, [6, 0], movingPiece, "--", false, true)) // black castle short
                    };
                };
                break;
        };
        return moves;
    };

    positionFromFen(fenString) {
        const [board, playerToMove, castling, enPassant, halfMoveClock, fullMoveClock] = fenString.split(" ");
        const rows = board.split("/");
        for (let row = 0; row < 8; row++) {
            const currentRow = rows[row];
            let column = 0;
            let j = 0;
            while (j < currentRow.length) {
                const char = currentRow[j];
                if (!isNaN(char)) {
                    const emptySquares = parseInt(char);
                    for (let i = column; i < column + emptySquares; i++) {
                        this.board[row][i] = "--";
                    };
                    column += emptySquares;
                } else {
                    if (char === char.toLowerCase()) { // black
                        if (char.toUpperCase() == "K") {
                            this.blackKingPosition = [column, row];
                        };
                        this.board[row][column] = "b" + char.toUpperCase();
                    } else { // white
                        if (char.toUpperCase() == "K") {
                            this.whiteKingPosition = [column, row];
                        };
                        this.board[row][column] = "w" + char.toUpperCase();
                    };
                    column++;
                };
                j++;
            };
        };

        this.whiteToMove = playerToMove === "w";

        this.blackCanCastle = [false, false];
        this.whiteCanCastle = [false, false];
        for (let i = 0; i < castling.length; i++) {
            const char = castling[i];
            switch(char) {
                case "K":
                    this.whiteCanCastle[1] = true;
                    break;
                case "Q":
                    this.whiteCanCastle[0] = true;
                    break;
                case "k":
                    this.blackCanCastle[1] = true;
                    break;
                case "q":
                    this.blackCanCastle[0] = true;
                    break;
            };
        };
        
        if (enPassant !== "-") {
            const column = numberPositions[enPassant[0]];
            const row = parseInt(enPassant[1]);
            this.enPassant = [column, row];
        };

        const [whiteMaterial, blackMaterial] = this.boardUtility.countMaterial(this.board);
        this.whiteMaterial = whiteMaterial;
        this.blackMaterial = blackMaterial;
        const [whitePiecePositionBonus, blackPiecePositionBonus, whitePiecePositionBonusEg, blackPiecePositionBonusEg] = this.boardUtility.countPiecePositionBonus(this.board);
        this.whitePiecePositionBonus = whitePiecePositionBonus;
        this.blackPiecePositionBonus = blackPiecePositionBonus;
        this.whitePiecePositionBonusEg = whitePiecePositionBonusEg;
        this.blackPiecePositionBonusEg = blackPiecePositionBonusEg;
        const [whitePieces, blackPieces] = this.boardUtility.countPieces(this.board, pieces);
        this.whitePieces = whitePieces;
        this.blackPieces = blackPieces;
        this.determineChecksAndPins();
        this.possibleMoves = this.getPossibleMoves();
        this.zobristHash = this.boardUtility.generateZobristHash(this.board, this.enPassant, this.whiteCanCastle, this.blackCanCastle, this.whiteToMove);
    };

    inCheck() {
        return this.currentCheckingPieces.length > 0;
    };

    makeNullMove() {
        // update zobrist hash
        this.zobristHash = this.zobristHash ^ randomSideKey;
        this.zobristHash = this.boardUtility.updateZobristHashEnPassant(this.zobristHash, this.enPassant);
        

        // update moving player
        this.whiteToMove = !this.whiteToMove;

        // get new moves for the other player
        this.determineChecksAndPins();
        this.possibleMoves = this.getPossibleMoves();

        // put the null move into the movelog to get en passant back after undoing the move
        this.moveLog.push([new Move([0, 0], [0, 0], "wP", "--"), this.whiteCanCastle, this.blackCanCastle, this.enPassant]);

        this.enPassant = [];
        // update zobrist hash again to get correct en passant
        this.zobristHash = this.boardUtility.updateZobristHashEnPassant(this.zobristHash, this.enPassant);
    };

    undoNullMove() {
        // update zobrist hash back
        this.zobristHash = this.zobristHash ^ randomSideKey;
        this.zobristHash = this.boardUtility.updateZobristHashEnPassant(this.zobristHash, this.enPassant);

        // get old en passant back
        const [move, whiteCanCastle, blackCanCastle, possibleEnPassant] = this.moveLog.pop();
        this.enPassant = possibleEnPassant;

        // update corrent zobrist hash
        this.zobristHash = this.boardUtility.updateZobristHashEnPassant(this.zobristHash, this.enPassant);

        // update moving player back
        this.whiteToMove = !this.whiteToMove;

        // get new moves for the other player
        this.determineChecksAndPins();
        this.possibleMoves = this.getPossibleMoves();
    };
};

class boardUtils {
    positionOnBoard(i, j) {
        return (0 <= i && i < 8 && 0 <= j && j < 8)
    };

    isCheckMate(possibleMoves, currentCheckingPieces) {
        return (possibleMoves.length == 0 && currentCheckingPieces.length > 0)
    };

    pieceInPinnedPieces(i, j, currentPinnedPieces) {
        let positionHash = 10 * i + j;
        let directions = [[-1, 1], [1, 1], [-1, -1], [1, -1], [0, 1], [0, -1], [-1, 0], [1, 0]];
        return [currentPinnedPieces.get(positionHash) != undefined, directions[currentPinnedPieces.get(positionHash)]];
    };

    // returns false if en passant is not possible due to pinned king, else returns true
    enPassantPin(pawnPosition, takenPosition, color, oppositeColor, ownKingPosition, board) {
        if (pawnPosition[1] != ownKingPosition[1]) {
            return true
        } else {
            let direction = pawnPosition[0] < ownKingPosition[0] ? [-1, 0] : [1, 0];
            let n = 1;
            while (this.positionOnBoard(ownKingPosition[0] + n * direction[0], ownKingPosition[1] + n * direction[1])) {
                let iNew = ownKingPosition[0] + n * direction[0];
                let jNew = ownKingPosition[1] + n * direction[1];
                if ((iNew == pawnPosition[0] && jNew == pawnPosition[1]) || (iNew == takenPosition[0] && jNew == takenPosition[1])) {
                    n++;
                    continue;
                } else {
                    if (board[jNew][iNew][0] == color) {
                        return true;
                    } else if (board[jNew][iNew][0] == oppositeColor && (board[jNew][iNew][1] == "Q" || board[jNew][iNew][1] == "R")) {
                        return false;
                    } else if (board[jNew][iNew][0] == oppositeColor) {
                        return true;
                    };
                    n++;
                };
            };
            return true;
        };
    };

    opponentAttackSquare(position, oppositeColor, board) {
        let [i, j] = position;
        let directions = [[-1, 1], [1, 1], [-1, -1], [1, -1], [0, 1], [0, -1], [-1, 0], [1, 0]];
        for (var index = 0; index < directions.length; index++) {
            let direction = directions[index];
            let n = 1;
            while (this.positionOnBoard(i + n * direction[0], j + n * direction[1])) {
                let iNew = i + n * direction[0];
                let jNew = j + n * direction[1];
                let currentPiece = board[jNew][iNew];
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
                let currentPiece = board[jNew][iNew];
                if (currentPiece[0] == oppositeColor && currentPiece[1] == "N") {
                    return true;
                };
            };
        };
        if (oppositeColor == "w") {
            if ((this.positionOnBoard(i - 1, j + 1) && board[j + 1][i - 1][1] == "P" && board[j + 1][i - 1][0] == oppositeColor) || 
            (this.positionOnBoard(i + 1, j + 1) && board[j + 1][i + 1][1] == "P" && board[j + 1][i + 1][0] == oppositeColor)) {
                return true;
            };
        } else {
            if ((this.positionOnBoard(i - 1, j - 1) && board[j - 1][i - 1][1] == "P" && board[j - 1][i - 1][0] == oppositeColor) || 
            (this.positionOnBoard(i + 1, j - 1) && board[j - 1][i + 1][1] == "P" && board[j - 1][i + 1][0] == oppositeColor)) {
                return true;
            };
        };
        return false;
    };

    countMaterial(board) {
        let blackMaterial = 0
        let whiteMaterial = 0
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[j][i][0] == "w") {
                    whiteMaterial += pieceValues[board[j][i][1]];
                } else if (board[j][i][0] == "b") {
                    blackMaterial += pieceValues[board[j][i][1]];
                };
            };
        };
        return [whiteMaterial, blackMaterial]
    };

    countPiecePositionBonus(board) {
        let blackPieceBonus = 0
        let whitePieceBonus = 0
        let blackPieceBonusEg = 0
        let whitePieceBonusEg = 0
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[j][i][0] == "w") {
                    whitePieceBonus += startPieceSquareValues[board[j][i][1]][j][i];
                    whitePieceBonusEg += endPieceSquareValues[board[j][i][1]][j][i];
                } else if (board[j][i][0] == "b") {
                    blackPieceBonus += startPieceSquareValues[board[j][i][1]][7 - j][i];
                    blackPieceBonusEg += endPieceSquareValues[board[j][i][1]][7 - j][i];
                };
            };
        };
        return [whitePieceBonus, blackPieceBonus, whitePieceBonusEg, blackPieceBonusEg]
    };

    countPieces(board, pieces) {
        let whitePieces = 0;
        let blackPieces = 0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[j][i][0] == "w") {
                    if (pieces.has(board[j][i][1])) {
                        whitePieces++;
                    };
                } else if (board[j][i][0] == "b") {
                    if (pieces.has(board[j][i][1])) {
                        blackPieces++;
                    };
                };
            };
        };
        return [whitePieces, blackPieces];
    };

    updateZobristHashCastlingRights(zobristHash, whiteCanCastle, blackCanCastle) {
        const castleIndex = whiteCanCastle[0] * 8 + whiteCanCastle[1] * 4 + blackCanCastle[0] * 2 + blackCanCastle[1];
        const randomCastleKey = randomCastlingKeys[castleIndex];
        return zobristHash ^ randomCastleKey;
    };

    updateZobristHashEnPassant(zobristHash, enPassant) {
        if (enPassant.length == 0) {
            return zobristHash;
        };

        const enPassantSquareIndex = this.squareToIndex(enPassant);
        const enPassantRandomKey = randomEnPassantKeys[enPassantSquareIndex];
        zobristHash = zobristHash ^ enPassantRandomKey;
        return zobristHash;
    };

    updateZobristHash(zobristHash, move, whiteMove, enPassant) {
        // update side
        zobristHash = zobristHash ^ randomSideKey;

        // update start and end squares
        const startPosIndex = this.squareToIndex(move.startPos);
        const endPosIndex = this.squareToIndex(move.endPos);
        const movingPieceIndex = pieceToIndex[move.movingPiece];
        const takenPieceIndex = move.takenPiece == "--" ? -1 : pieceToIndex[move.takenPiece];
        const startPosRandomKey = randomPieceKeys[movingPieceIndex][startPosIndex];
        const endPosRandomKey = randomPieceKeys[movingPieceIndex][endPosIndex];
        const takenPieceRandomKey = takenPieceIndex == -1 ? 0n : randomPieceKeys[takenPieceIndex][endPosIndex];
        zobristHash = zobristHash ^ startPosRandomKey;
        zobristHash = zobristHash ^ endPosRandomKey;
        zobristHash = zobristHash ^ takenPieceRandomKey;
        if (move.enPassant) { // if move is en passant, update taken piece
            if (whiteMove) {
                const takenPieceIndex = 11;
                const takenPosIndex = this.squareToIndex([move.endPos[0], move.endPos[1] + 1]);
                const takenPieceRandomKey = randomPieceKeys[takenPieceIndex][takenPosIndex];
                zobristHash = zobristHash ^ takenPieceRandomKey;
            } else {
                const takenPieceIndex = 5;
                const takenPosIndex = this.squareToIndex([move.endPos[0], move.endPos[1] - 1]);
                const takenPieceRandomKey = randomPieceKeys[takenPieceIndex][takenPosIndex];
                zobristHash = zobristHash ^ takenPieceRandomKey;
            };
        };

        if (move.castleKing) { // if move was castling, update rook position
            let startPosRandomKey;
            let endPosRandomKey;
            if (whiteMove) {
                let rookStartPosIndex;
                let rookEndPosIndex;
                if (move.endPos[0] - move.startPos[0] > 0) { // castle short
                    rookStartPosIndex = 63;
                    rookEndPosIndex = 61;
                } else { // castle long
                    rookStartPosIndex = 56;
                    rookEndPosIndex = 59;
                };
                const whiteRookPieceIndex = 2;
                startPosRandomKey = randomPieceKeys[whiteRookPieceIndex][rookStartPosIndex];
                endPosRandomKey = randomPieceKeys[whiteRookPieceIndex][rookEndPosIndex];
            } else {
                let rookStartPosIndex;
                let rookEndPosIndex;
                if (move.endPos[0] - move.startPos[0] > 0) { // castle short
                    rookStartPosIndex = 7;
                    rookEndPosIndex = 5;
                } else { // castle long
                    rookStartPosIndex = 0;
                    rookEndPosIndex = 3;
                };
                const blackRookPieceIndex = 8;
                startPosRandomKey = randomPieceKeys[blackRookPieceIndex][rookStartPosIndex];
                endPosRandomKey = randomPieceKeys[blackRookPieceIndex][rookEndPosIndex];
            };
            zobristHash = zobristHash ^ startPosRandomKey;
            zobristHash = zobristHash ^ endPosRandomKey;
        };

        return zobristHash;
    };

    getMaterialDiffs(move, undo = false) {
        if (!undo) {
            let whiteMaterialDiff = 0;
            let blackMaterialDiff = 0;
            let whitePiecePositionBonusDiff = 0;
            let blackPiecePositionBonusDiff = 0;
            let whitePiecePositionBonusDiffEg = 0;
            let blackPiecePositionBonusDiffEg = 0;
            const playerDiff = move.movingPiece[0] == "w" ? 1 : -1;
            let [i, j] = playerDiff == 1 ? move.startPos : [7 - move.startPos[0], 7 - move.startPos[1]];
            let [iNew, jNew] = playerDiff == 1 ? move.endPos : [7 - move.endPos[0], 7 - move.endPos[1]];



            // update taken piece materials and piece position bonuses
            if (move.takenPiece[0] != "--" || move.enPassant) {
                const materialDiffValue = move.enPassant ? 1 : pieceValues[move.takenPiece[1]];
                const piecePositionBonusDiff = move.enPassant ? startPieceSquareValues[move.takenPiece[1]][jNew + playerDiff][iNew] : startPieceSquareValues[move.takenPiece[1]][jNew][iNew];
                const piecePositionBonusDiffEg = move.enPassant ? endPieceSquareValues[move.takenPiece[1]][jNew + playerDiff][iNew] : endPieceSquareValues[move.takenPiece[1]][jNew][iNew];
                switch(move.movingPiece[0]) {
                    case "b":
                        whiteMaterialDiff -= materialDiffValue;
                        whitePiecePositionBonusDiff -= piecePositionBonusDiff;
                        whitePiecePositionBonusDiffEg -= piecePositionBonusDiffEg;
                        break;
                    case "w":
                        blackMaterialDiff -= materialDiffValue;
                        blackPiecePositionBonusDiff -= piecePositionBonusDiff;
                        blackPiecePositionBonusDiffEg -= piecePositionBonusDiffEg;
                        break;
                };
            };

            // update moving piece position bonuses and materials if promotion
            const oldPromotionMaterialDiffValue = move.promotion ? pieceValues[move.movingPiece[1]] : 0;
            const newPromotionMaterialDiffValue = move.promotion ? pieceValues[move.promotedPiece[1]] : 0;
            const promotionMaterialDiffValue = newPromotionMaterialDiffValue - oldPromotionMaterialDiffValue;
            const oldPiecePositioningBonus = startPieceSquareValues[move.movingPiece[1]][j][i];
            const newPiecePositioningBonus = move.promotion ? startPieceSquareValues[move.promotedPiece[1]][jNew][iNew] : startPieceSquareValues[move.movingPiece[1]][jNew][iNew];
            const piecePositioningBonusDiff = newPiecePositioningBonus - oldPiecePositioningBonus;
            const oldPiecePositioningBonusEg = endPieceSquareValues[move.movingPiece[1]][j][i];
            const newPiecePositioningBonusEg = move.promotion ? endPieceSquareValues[move.promotedPiece[1]][jNew][iNew] : endPieceSquareValues[move.movingPiece[1]][jNew][iNew];
            const piecePositioningBonusDiffEg = newPiecePositioningBonusEg - oldPiecePositioningBonusEg;
            switch(move.movingPiece[0]) {
                case "w":
                    whiteMaterialDiff += promotionMaterialDiffValue;
                    whitePiecePositionBonusDiff += piecePositioningBonusDiff;
                    whitePiecePositionBonusDiffEg += piecePositioningBonusDiffEg;
                    break;
                case "b":
                    blackMaterialDiff += promotionMaterialDiffValue;
                    blackPiecePositionBonusDiff += piecePositioningBonusDiff;
                    blackPiecePositionBonusDiffEg += piecePositioningBonusDiffEg;
                    break;
            };

            if (move.castleKing) { 
                // if long castle, rook positioning value changes
                const newRookBonus = move.endPos[0] < move.startPos[0] ? startPieceSquareValues["R"][7][3] : startPieceSquareValues["R"][7][5];
                const oldRookBonus = move.endPos[0] < move.startPos[0] ? startPieceSquareValues["R"][7][0] : startPieceSquareValues["R"][7][7];
                const newRookBonusEg = move.endPos[0] < move.startPos[0] ? endPieceSquareValues["R"][7][3] : endPieceSquareValues["R"][7][5];
                const oldRookBonusEg = move.endPos[0] < move.startPos[0] ? endPieceSquareValues["R"][7][0] : endPieceSquareValues["R"][7][7];
                const rookBonusDiff = newRookBonus - oldRookBonus;
                const rookBonusDiffEg = newRookBonusEg - oldRookBonusEg;
                switch(move.movingPiece[0]) {
                    case "w":
                        whitePiecePositionBonusDiff += rookBonusDiff;
                        whitePiecePositionBonusDiffEg += rookBonusDiffEg;
                        break;
                    case "b":
                        blackPiecePositionBonusDiff += rookBonusDiff;
                        blackPiecePositionBonusDiffEg += rookBonusDiffEg;
                        break;
                };
            };

            return [whiteMaterialDiff, blackMaterialDiff, whitePiecePositionBonusDiff, blackPiecePositionBonusDiff, whitePiecePositionBonusDiffEg, blackPiecePositionBonusDiffEg];
        } else {
            let whiteMaterialDiff = 0;
            let blackMaterialDiff = 0;
            let whitePiecePositionBonusDiff = 0;
            let blackPiecePositionBonusDiff = 0;
            let whitePiecePositionBonusDiffEg = 0;
            let blackPiecePositionBonusDiffEg = 0;
            const playerDiff = move.movingPiece[0] == "w" ? 1 : -1;
            let [i, j] = playerDiff == 1 ? move.startPos : [7 - move.startPos[0], 7 - move.startPos[1]];
            let [iNew, jNew] = playerDiff == 1 ? move.endPos : [7 - move.endPos[0], 7 - move.endPos[1]];

            // update taken piece materials and piece position bonuses
            if (move.takenPiece[0] != "--" || move.enPassant) {
                const materialDiffValue = move.enPassant ? 1 : pieceValues[move.takenPiece[1]];
                const piecePositionBonusDiff = move.enPassant ? startPieceSquareValues[move.takenPiece[1]][jNew + playerDiff][iNew] : startPieceSquareValues[move.takenPiece[1]][jNew][iNew];
                const piecePositionBonusDiffEg = move.enPassant ? endPieceSquareValues[move.takenPiece[1]][jNew + playerDiff][iNew] : endPieceSquareValues[move.takenPiece[1]][jNew][iNew];
                switch(move.movingPiece[0]) {
                    case "b":
                        whiteMaterialDiff += materialDiffValue;
                        whitePiecePositionBonusDiff += piecePositionBonusDiff;
                        whitePiecePositionBonusDiffEg += piecePositionBonusDiffEg;
                        break;
                    case "w":
                        blackMaterialDiff += materialDiffValue;
                        blackPiecePositionBonusDiff += piecePositionBonusDiff;
                        blackPiecePositionBonusDiffEg += piecePositionBonusDiffEg;
                        break;
                };
            };
            // update moving piece position bonuses and materials if promotion
            const oldPromotionMaterialDiffValue = move.promotion ? pieceValues[move.movingPiece[1]] : 0;
            const newPromotionMaterialDiffValue = move.promotion ? pieceValues[move.promotedPiece[1]] : 0;
            const promotionMaterialDiffValue = newPromotionMaterialDiffValue - oldPromotionMaterialDiffValue;
            const oldPiecePositioningBonus = startPieceSquareValues[move.movingPiece[1]][j][i];
            const newPiecePositioningBonus = move.promotion ? startPieceSquareValues[move.promotedPiece[1]][jNew][iNew] : startPieceSquareValues[move.movingPiece[1]][jNew][iNew];
            const piecePositioningBonusDiff = newPiecePositioningBonus - oldPiecePositioningBonus;
            const oldPiecePositioningBonusEg = endPieceSquareValues[move.movingPiece[1]][j][i];
            const newPiecePositioningBonusEg = move.promotion ? endPieceSquareValues[move.promotedPiece[1]][jNew][iNew] : endPieceSquareValues[move.movingPiece[1]][jNew][iNew];
            const piecePositioningBonusDiffEg = newPiecePositioningBonusEg - oldPiecePositioningBonusEg;
            switch(move.movingPiece[0]) {
                case "w":
                    whiteMaterialDiff -= promotionMaterialDiffValue;
                    whitePiecePositionBonusDiff -= piecePositioningBonusDiff;
                    whitePiecePositionBonusDiffEg -= piecePositioningBonusDiffEg;
                    break;
                case "b":
                    blackMaterialDiff -= promotionMaterialDiffValue;
                    blackPiecePositionBonusDiff -= piecePositioningBonusDiff;
                    blackPiecePositionBonusDiffEg -= piecePositioningBonusDiffEg;
                    break;
            };

            if (move.castleKing) {
                // if long castle, rook positioning value changes
                const newRookBonus = move.endPos[0] < move.startPos[0] ? startPieceSquareValues["R"][7][3] : startPieceSquareValues["R"][7][5];
                const oldRookBonus = move.endPos[0] < move.startPos[0] ? startPieceSquareValues["R"][7][0] : startPieceSquareValues["R"][7][7];
                const newRookBonusEg = move.endPos[0] < move.startPos[0] ? endPieceSquareValues["R"][7][3] : endPieceSquareValues["R"][7][5];
                const oldRookBonusEg = move.endPos[0] < move.startPos[0] ? endPieceSquareValues["R"][7][0] : endPieceSquareValues["R"][7][7];
                const rookBonusDiff = newRookBonus - oldRookBonus;
                const rookBonusDiffEg = newRookBonusEg - oldRookBonusEg;
                switch(move.movingPiece[0]) {
                    case "w":
                        whitePiecePositionBonusDiff -= rookBonusDiff;
                        whitePiecePositionBonusDiffEg -= rookBonusDiffEg;
                        break;
                    case "b":
                        blackPiecePositionBonusDiff -= rookBonusDiff;
                        blackPiecePositionBonusDiffEg -= rookBonusDiffEg;
                        break;
                };
            };

            return [whiteMaterialDiff, blackMaterialDiff, whitePiecePositionBonusDiff, blackPiecePositionBonusDiff, whitePiecePositionBonusDiffEg, blackPiecePositionBonusDiffEg];
        };
    };

    squareToIndex(square) {
        return square[0] + 8 * square[1];
    };

    generateZobristHash(board, enPassant, whiteCanCastle, blackCanCastle, whiteToMove) {
        let hash = 0n;
        for (let j = 0; j < 8; j++) {
            for (let i = 0; i < 8; i++) {
                const piece = board[j][i];
                if (piece != "--") {
                    const pieceIndex = pieceToIndex[piece];
                    const squareIndex = this.squareToIndex([i, j]);
                    const randomPieceKey = randomPieceKeys[pieceIndex][squareIndex];
                    hash = hash ^ randomPieceKey;
                };
            };
        };

        if (enPassant.length != 0) {
            const enPassantSquareIndex = this.squareToIndex(enPassant);
            const randomEnPassantKey = randomEnPassantKeys[enPassantSquareIndex];
            hash = hash ^ randomEnPassantKey;
        };

        const castleIndex = whiteCanCastle[0] * 8 + whiteCanCastle[1] * 4 + blackCanCastle[0] * 2 + blackCanCastle[1];
        const randomCastleKey = randomCastlingKeys[castleIndex];
        hash = hash ^ randomCastleKey;

        if (!whiteToMove) {
            hash = hash ^ randomSideKey;
        };

        return hash;
    };
};

class Move {
    constructor(startPos, endPos, movingPiece, takenPiece, promotion = false, castleKing = false, enPassant = false, promotedPiece = null) {
        this.startPos = startPos;
        this.endPos = endPos;
        this.promotion = promotion;
        this.promotedPiece = promotedPiece
        this.castleKing = castleKing;
        this.enPassant = enPassant;
        this.takenPiece = takenPiece
        this.movingPiece = movingPiece
        this.assumedMoveScore = 0;
    };

    equals(move) {
        return (this.startPos[0] == move.startPos[0] && this.startPos[1] == move.startPos[1]) && (this.endPos[0] == move.endPos[0] && 
            this.endPos[1] == move.endPos[1]) && (this.promotion == move.promotion) && (this.castleKing == move.castleKing) && 
            (this.enPassant == move.enPassant) && (this.promotedPiece == move.promotedPiece);
    };

    isCapture() {
        return this.takenPiece != "--" || this.enPassant;
    };

    isPieceCapture() {
        return pieces.has(this.takenPiece[1]);
    };
};