class engine {
    constructor(board) {
        this.maxDepth = Number.MAX_SAFE_INTEGER;
        this.openingTheory = [];
        this.board = board;
        this.maxAllowedTime = 2000;

        this.searchStartTime;
        this.searchCancelled = false;
        this.bestMove;
        this.bestMoveEval;
        this.bestIterEvaluation = Number.MIN_SAFE_INTEGER;
        this.bestIterMove;
        this.foundCheckMate = false;
        this.moveOrdering = new moveOrderer();
        this.transpositionTable = new transpositionTable();
    };

    iterativeSearch() { // iterative search useless, since we do not start with the best move from previous iteration (apart from going as deep as possible, with timing the moves and getting a good result)
        this.searchStartTime = performance.now();
        this.searchCancelled = false;
        this.foundCheckMate = false;
        this.bestIterEvaluation = Number.MIN_SAFE_INTEGER;

        if (this.board.possibleMoves.length == 0) {
            return;
        };
        console.log("Search running")
        for (let searchDepth = 1; searchDepth <= this.maxDepth; searchDepth++) {
            console.log("Iteration: " + searchDepth)
            const perspective = this.board.whiteToMove ? 1 : -1;
            this.search(searchDepth, 0, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, perspective);
            if (this.searchCancelled) {
                console.log("search cancelled"); // need to make calculateAssumedMoveOrder to start with previous iterations best move
                //this.bestMove = this.bestIterMove;
                //this.bestMoveEval = this.bestIterEvaluation;
                console.log("Evaluation: " + perspective * this.bestMoveEval);
                console.log("Depth: " + searchDepth)
                console.log("Time taken: " + Math.round(performance.now() - this.searchStartTime))
                console.log("Positions in transposition table: " + this.transpositionTable.positionsInLookUp)
                return this.bestMove;
            } else {
                this.bestMove = this.bestIterMove;
                this.bestMoveEval = this.bestIterEvaluation;
                console.log(this.bestMove)
                if (this.bestMoveEval == Number.MAX_SAFE_INTEGER) {
                    console.log("Found checkmate")
                    return this.bestMove;
                }
            };
        };
    };

    search(currentDepth, depthFromRoot, alpha, beta, colorPerspective) { // in some positions searchOnlyCapturesAndChecks() takes too much time so there is not enough time to complete the search even on depth 1 and result is bad...
        this.searchCancelled = (performance.now() - this.searchStartTime) > this.maxAllowedTime;
        if (this.searchCancelled) {
            return;
        };
        
        const alphaOriginal = alpha;

        // look if position exists in the transposition table
        const position = this.transpositionTable.getEntryFromHash(this.board.zobristHash);
        if (position != undefined && position.zobristHash == this.board.zobristHash && currentDepth <= position.depth) {
            if (position.nodeType == 0) {
                if (depthFromRoot == 0) {
                    this.bestIterEvaluation = position.evaluation;
                    this.bestIterMove = position.bestMove;
                };
                return position.evaluation;
            } else if (position.nodeType == 1) {
                alpha = Math.max(alpha, position.evaluation);
            } else if (position.nodeType == 2) {
                beta = Math.min(beta, position.evaluation);
            };
        };
        if (alpha >= beta) { // if found a value for the position, return it
            if (depthFromRoot == 0) {
                this.bestIterEvaluation = position.evaluation;
                this.bestIterMove = position.bestMove;
            };
            return position.evaluation;
        };

        // if found a terminal node, return the corresponding evaluation
        if (this.board.possibleMoves.length === 0) {
            if (this.board.boardUtility.isCheckMate(this.board.possibleMoves, this.board.currentCheckingPieces)) {
                return Number.MIN_SAFE_INTEGER;
            };
            return 0; // stalemate
        };
        if (currentDepth === 0) {
            const evaluation = this.searchOnlyCapturesAndChecks(0, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, colorPerspective);
            return evaluation;
        };
        
        // search through all moves and select the best one
        const moves = this.moveOrdering.orderMoves(this.board.possibleMoves);
        let positionEvaluation = Number.MIN_SAFE_INTEGER;
        let positionBestMove = moves[0];
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            this.board.makeMove(move);
            // calculate check extension after making the wanted move.
            const checkExtension = this.board.inCheck() ? 1 : 0;
            if (this.board.inCheck()) {console.log("here")}
            const currentEvaluation = -this.search(currentDepth - 1 + checkExtension, depthFromRoot + 1, -beta, -alpha, -colorPerspective);
            this.board.undoMove();

            if (currentEvaluation > positionEvaluation) {
                positionEvaluation = currentEvaluation;
                positionBestMove = move;
            };

            if (this.searchCancelled) {
                if (depthFromRoot == 0) {
                    this.bestIterEvaluation = positionEvaluation;
                    this.bestIterMove = positionBestMove;
                };
                return positionEvaluation;
            };

            // alpha-beta-pruning:
            alpha = Math.max(alpha, positionEvaluation);
            if (alpha >= beta) {
                break;
            };
        };
        
        // store the evaluation of the position to the transposition table
        let nodeType;
        if (positionEvaluation <= alphaOriginal) { // upperbound node
            nodeType = 1
        } else if (positionEvaluation >= beta) { // lowerbound node
            nodeType = 2
        } else { // exact node
            nodeType = 0
        };
        this.transpositionTable.storeEvaluation(this.board.zobristHash, positionEvaluation, currentDepth, nodeType, positionBestMove);

        // remember the best moves if the position is the original one, else return the evaluation
        if (depthFromRoot == 0) {
            this.bestIterEvaluation = positionEvaluation;
            this.bestIterMove = positionBestMove;
        } else {
            return positionEvaluation;
        };
    };

    searchOnlyCapturesAndChecks(depthFromSearchEnd, alpha, beta, colorPerspective) { // does not search checks yet
        if (this.board.possibleMoves.length === 0) {
            if (this.board.boardUtility.isCheckMate(this.board.possibleMoves, this.board.currentCheckingPieces)) {
                return Number.MIN_SAFE_INTEGER;
            };
            return 0; // stalemate
        };

        const moves = this.moveOrdering.orderMoves(this.board.possibleMoves);
        let positionEvaluation = this.evaluatePosition(colorPerspective);
        let searchedPosition = false;
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            let currentEvaluation = Number.MIN_SAFE_INTEGER;
            if (move.isCapture() || move.promotion) { // continue search if move is piece capture or pawn promotion
                searchedPosition = true;
                this.board.makeMove(move);
                currentEvaluation = -this.searchOnlyCapturesAndChecks(depthFromSearchEnd + 1, -beta, -alpha, -colorPerspective);
                this.board.undoMove();

                if (this.searchCancelled) {
                    return;
                };
            };

            positionEvaluation = Math.max(positionEvaluation, currentEvaluation);
            
            // alpha-beta-pruning:
            alpha = Math.max(alpha, positionEvaluation);
            if (alpha >= beta) {
                break;
            };
        };

        if (!searchedPosition) {
            const evaluation = this.evaluatePosition(colorPerspective);
            return evaluation; 
        };
        return positionEvaluation;
    };

    evaluatePosition(colorPerspective) {
        let evaluation = 0;
        const endGameWeight = this.getEndGameWeight();

        // calculate material
        evaluation += 10 * (this.board.whiteMaterial - this.board.blackMaterial);

        // calculate piece placement factor
        evaluation += (1/4) * (1 - endGameWeight) * (this.board.whitePiecePositionBonus - this.board.blackPiecePositionBonus);

        // calculate king position in endgames
        evaluation += 2 * endGameWeight * this.getKingPositionEndGameFactor();

        return colorPerspective * evaluation;
    };

    getEndGameWeight() {
        const numberOfWhitePieces = this.board.whitePieces;
        const numberOfBlackPieces = this.board.blackPieces;
        const endGameStart = 5;
        const multiplier = 1 / endGameStart;
        if (this.board.whiteToMove) {
            return Math.sqrt(1 - Math.min(1, multiplier * numberOfBlackPieces))
        } else {
            return Math.sqrt(1 - Math.min(1, multiplier * numberOfWhitePieces))
        };
    };

    getKingPositionEndGameFactor() { // works, if engine playing as black, doesn't if engine playing as white
        const [iWhite, jWhite] = this.board.whiteKingPosition;
        const [iBlack, jBlack] = this.board.blackKingPosition;
        const kingL1DistFromEachOther = Math.abs(iWhite - iBlack) + Math.abs(jWhite - jBlack);
        const blackMinDistFromEdge = Math.min(Math.abs(iBlack), Math.abs(iBlack - 7), Math.abs(jBlack), Math.abs(jBlack - 7));
        const whiteMinDistFromEdge = Math.min(Math.abs(iWhite), Math.abs(iWhite - 7), Math.abs(jWhite), Math.abs(jWhite - 7));
        return blackMinDistFromEdge + whiteMinDistFromEdge + kingL1DistFromEachOther;
    };

    getNumberOfMoves(currentDepth) {
        let numberOfMoves = 0;
        if (currentDepth === 0) {
            return 1;
        };
        this.board.possibleMoves.forEach(move => {
            this.board.makeMove(move);
            numberOfMoves += this.getNumberOfMoves(currentDepth - 1);
            this.board.undoMove();
        });
        return numberOfMoves;
    };

    debugNumberOfMoves(depth) {
        let total = 0
        this.board.possibleMoves.forEach(move => {
            let moveString = boardPositions[move.startPos[0]] + (8 - move.startPos[1]) + boardPositions[move.endPos[0]] + (8 - move.endPos[1]);
            this.board.makeMove(move);
            let moves = this.getNumberOfMoves(depth - 1);
            total += moves
            this.board.undoMove();
            console.log([moveString, moves])
        });
        console.log(["Total", total])
    };

    unitTestMoves() {
        const startTime1 = performance.now();
        const test1 = this.getNumberOfMoves(5) == 4865609;
        const endTime1 = performance.now();
        const elapsedTime1 = endTime1 - startTime1;
        console.log("Initial position up to depth 5 is " + test1);
        console.log(`Code execution time: ${elapsedTime1} milliseconds`);
        
        currentBoard.positionFromFen("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -");
        const startTime2 = performance.now();
        const test2 = this.getNumberOfMoves(4) == 4085603;
        const endTime2 = performance.now();
        const elapsedTime2 = endTime2 - startTime2;
        console.log("Position 2 up to depth 4 is " + test2);
        console.log(`Code execution time: ${elapsedTime2} milliseconds`);

        currentBoard.positionFromFen("8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - -");
        const startTime3 = performance.now();
        const test3 = this.getNumberOfMoves(6) == 11030083;
        const endTime3 = performance.now();
        const elapsedTime3 = endTime3 - startTime3;
        console.log("Position 3 up to depth 6 is " + test3);
        console.log(`Code execution time: ${elapsedTime3} milliseconds`);

        currentBoard.positionFromFen("r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1");
        const startTime4 = performance.now();
        const test4 = this.getNumberOfMoves(5) == 15833292;
        const endTime4 = performance.now();
        const elapsedTime4 = endTime4 - startTime4;
        console.log("Position 4 up to depth 5 is " + test4);
        console.log(`Code execution time: ${elapsedTime4} milliseconds`);

        currentBoard.positionFromFen("rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8");
        const startTime5 = performance.now();
        const test5 = this.getNumberOfMoves(4) == 2103487;
        const endTime5 = performance.now();
        const elapsedTime5 = endTime5 - startTime5;
        console.log("Position 5 up to depth 4 is " + test5);
        console.log(`Code execution time: ${elapsedTime5} milliseconds`);

        currentBoard.positionFromFen("r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10");
        const startTime6 = performance.now();
        const test6 = this.getNumberOfMoves(4) == 3894594;
        const endTime6 = performance.now();
        const elapsedTime6 = endTime6 - startTime6;
        console.log("Position 6 up to depth 4 is " + test6);
        console.log(`Code execution time: ${elapsedTime6} milliseconds`);
        currentBoard.positionFromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    };
};

class moveOrderer {
    orderMoves(moves) {
        this.calculateAssumedMoveScores(moves);
        const sortedMoves = this.sort(moves);
        return sortedMoves;
    };

    calculateAssumedMoveScores(moves) {
        moves.forEach(move => {
            const movingPieceType = move.movingPiece[1];
            const takenPieceType = move.takenPiece[1];

            move.assumedMoveScore = 0;

            if (takenPieceType != "-") {
                move.assumedMoveScore += 1.5 * pieceValues[takenPieceType];
                move.assumedMoveScore -= pieceValues[movingPieceType];
            };

            if (move.promotion) {
                move.assumedMoveScore += pieceValues[move.promotedPiece[1]];
            };

            if (move.castleKing) {
                move.assumedMoveScore += 10
            };
        });
    };

    sort(moves) {
        const sortedMoves = moves.sort((moveA, moveB) => {
            return moveB.assumedMoveScore - moveA.assumedMoveScore;
        });
        return sortedMoves;
    };
};