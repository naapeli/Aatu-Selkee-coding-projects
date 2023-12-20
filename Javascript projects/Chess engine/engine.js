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

    iterativeSearch() {
        this.searchStartTime = performance.now();
        this.searchCancelled = false;
        this.foundCheckMate = false;
        this.bestIterEvaluation = Number.MIN_SAFE_INTEGER;

        if (this.board.possibleMoves.length == 0) {
            return;
        };
        console.log("Search running")
        let alpha = Number.MIN_SAFE_INTEGER;
        let beta = Number.MAX_SAFE_INTEGER;
        let score;
        const perspective = this.board.whiteToMove ? 1 : -1;
        for (let searchDepth = 1; searchDepth <= this.maxDepth; searchDepth++) {
            console.log("Iteration: " + searchDepth)
            for (let i = 0; i < aspirationWindows.length; i++) {
                if (score != undefined) {
                    const window = aspirationWindows[i];
                    alpha = score - window;
                    beta = score + window;
                };
                score = this.search(searchDepth, 0, alpha, beta, perspective);
                if (this.searchCancelled) { // if search cancelled
                    console.log("search cancelled");
                    if (alpha < score && score < beta) {
                        this.bestMove = this.bestIterMove;
                        this.bestMoveEval = this.bestIterEvaluation;
                        console.log("Evaluation of the last iteration used")
                    };
                    console.log(this.bestMove);
                    console.log("Evaluation: " + perspective * this.bestMoveEval / 1000);
                    console.log("Depth: " + searchDepth);
                    console.log("Time taken: " + Math.round(performance.now() - this.searchStartTime));
                    console.log("Positions in transposition table: " + this.transpositionTable.positionsInLookUp / parseInt(this.transpositionTable.size) * 100 + " %");
                    return this.bestMove;
                } else if (alpha < score && score < beta) { // if score was inside alpha and beta
                    this.bestMove = this.bestIterMove;
                    this.bestMoveEval = this.bestIterEvaluation;
                    console.log(this.bestMove, this.bestMoveEval)
                    if (this.bestMoveEval == Number.MAX_SAFE_INTEGER) {
                        console.log("Found own checkmate");
                        return this.bestMove;
                    } else if (this.bestMoveEval == Number.MIN_SAFE_INTEGER) {
                        console.log("Found opponent checkmate");
                        return this.bestMove;
                    };
                    console.log("here", i)
                    break;
                };
                // if we failed to find the score inside alpha and beta continue to the next aspiration window,
                // else continue to the next iteration
                console.log("Aspiration window failed!")
            };
        };
    };

    search(currentDepth, depthFromRoot, alpha, beta, colorPerspective) {
        this.searchCancelled = (performance.now() - this.searchStartTime) > this.maxAllowedTime;
        if (this.searchCancelled) {
            return;
        };
        
        const alphaOriginal = alpha;

        // look if current position is a threefold repetition
        if (repetitionTable[currentBoard.zobristHash] >= 3) {
            if (depthFromRoot == 0) {
                this.bestIterEvaluation = 0;
            };
            return 0;
        };

        // look if position exists in the transposition table
        const position = this.transpositionTable.getEntryFromHash(this.board.zobristHash);
        if (position != undefined && position.zobristHash == this.board.zobristHash && Math.max(currentDepth, 0) <= position.depth) {
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
        if (alpha >= beta) { // if found a value for the position from transposition table, return it
            return position.evaluation;
        };

        // if found a terminal node, return the corresponding evaluation
        if (this.board.possibleMoves.length === 0) {
            if (this.board.boardUtility.isCheckMate(this.board.possibleMoves, this.board.currentCheckingPieces)) {
                return Number.MIN_SAFE_INTEGER; // checkmate
            };
            return 0; // stalemate
        };
        if (currentDepth <= 0) {
            const evaluation = this.quiescenceSearch(0, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, colorPerspective);
            return evaluation;
        };
        
        // search through all moves and select the best one
        const previousBestMove = (position != undefined && position.zobristHash == this.board.zobristHash) ? position.bestMove : undefined;
        const moves = this.moveOrdering.orderMoves(this.board.possibleMoves, previousBestMove);
        let positionEvaluation = Number.MIN_SAFE_INTEGER;
        let positionBestMove = moves[0];
        for (let i = 0; i < moves.length; i++) {
            let threefoldRepetition = false;
            const move = moves[i];
            this.board.makeMove(move);

            // update the amount of times a position has been seen in the search
            if (repetitionTable[currentBoard.zobristHash] != 0 && repetitionTable[currentBoard.zobristHash] != undefined) {
                repetitionTable[currentBoard.zobristHash] += 1
                // if threefold repetition found, stop searching this position update it's value to 0
                if (repetitionTable[currentBoard.zobristHash] >= 3) {
                    threefoldRepetition = true;
                };
            } else {
                repetitionTable[currentBoard.zobristHash] = 1
            };
            
            // starts from 0 because of the threefold repetition
            let currentEvaluation = 0;
            let extension = 0;
            let reduction = 0;
            if (!threefoldRepetition) { // a bug somewhere, where bot takes a draw in a winning position (might remove this part because no effect???)
                // calculate search extension and reduction after making the wanted move.
                extension = this.getSearchExtension(move);
                reduction = this.getSearchReduction(extension, move, i, currentDepth);
                // do the search
                currentEvaluation = -this.search(currentDepth - 1 + extension - reduction, depthFromRoot + 1, -beta, -alpha, -colorPerspective);
            };

            // if we reduced depth, but still got a better evaluation, need to do a full depth search
            if (reduction > 0 && currentEvaluation >= alpha) {
                currentEvaluation = -this.search(currentDepth - 1 + extension, depthFromRoot + 1, -beta, -alpha, -colorPerspective);
            };
            
            // update the amount of times a position has been seen in the search
            repetitionTable[currentBoard.zobristHash] -= 1;
            
            this.board.undoMove();

            if (this.searchCancelled) {
                // if played the first move from previous iteration or more, store the best move even if the search cancelled,
                // not to waste the calculation time of the last iteration
                if (depthFromRoot == 0 && i > 0) {
                    this.bestIterEvaluation = positionEvaluation;
                    this.bestIterMove = positionBestMove;
                    return positionEvaluation;
                };
                return;
            };

            if (currentEvaluation > positionEvaluation) {
                positionEvaluation = currentEvaluation;
                positionBestMove = move;
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

        // remember the best moves if the position is the original one, then return the evaluation
        if (depthFromRoot == 0) {
            this.bestIterEvaluation = positionEvaluation;
            this.bestIterMove = positionBestMove;
        };
        return positionEvaluation;
    };

    quiescenceSearch(depthFromSearchEnd, alpha, beta, colorPerspective) {
        if (this.board.possibleMoves.length === 0) {
            if (this.board.boardUtility.isCheckMate(this.board.possibleMoves, this.board.currentCheckingPieces)) {
                return Number.MIN_SAFE_INTEGER;
            };
            return 0; // stalemate
        };

        // check if evaluation of this position causes beta cutoff
        let stand_pat = this.evaluatePosition(colorPerspective);
        if (stand_pat >= beta) {
            return beta;
        };

        // delta pruning
        const BIG_DELTA = 1025; // queen value
        if ( stand_pat < alpha - BIG_DELTA ) {
            return alpha;
        };


        if (alpha < stand_pat) {
            alpha = stand_pat;
        };

        const moves = this.moveOrdering.orderMoves(this.board.possibleMoves);
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            if (move.isCapture()) { // continue search if move is piece capture
                this.board.makeMove(move);
                const score = -this.quiescenceSearch(depthFromSearchEnd + 1, -beta, -alpha, -colorPerspective);
                this.board.undoMove();

                if (this.searchCancelled) {
                    return;
                };

                // alpha-beta pruning
                if (score >= beta) {
                    return beta;
                };
                if (score > alpha) {
                    alpha = score;
                };
            };
        };

        return alpha;
    };

    // determines if a position is good for white (positive) or black (negative) and returns evaluation always as a positive value
    evaluatePosition(colorPerspective) {
        let evaluation = 0;
        const endGameWeight = this.getEndGameWeight();

        // calculate material
        evaluation += 10 * (this.board.whiteMaterial - this.board.blackMaterial);

        // calculate piece placement factor
        evaluation += (1/4) * (1 - endGameWeight) * (this.board.whitePiecePositionBonus - this.board.blackPiecePositionBonus);
        evaluation += (1/4) * (endGameWeight) * (this.board.whitePiecePositionBonusEg - this.board.blackPiecePositionBonusEg);

        // calculate king position bonuses in winning endgames
        evaluation += endGameWeight * (this.getKingPositionEndGameFactor("w") - this.getKingPositionEndGameFactor("b"));

        return colorPerspective * evaluation;
    };

    getEndGameWeight() {
        const numberOfWhitePieces = this.board.whitePieces;
        const numberOfBlackPieces = this.board.blackPieces;
        const endGameStart = 4;
        const multiplier = 1 / endGameStart;
        if (this.board.whiteToMove) {
            return Math.sqrt(1 - Math.min(1, multiplier * numberOfBlackPieces))
        } else {
            return Math.sqrt(1 - Math.min(1, multiplier * numberOfWhitePieces))
        };
    };

    getKingPositionEndGameFactor(color) {
        const myMaterial = color == "w" ? this.board.whiteMaterial : this.board.blackMaterial;
        const opponentMaterial = color == "b" ? this.board.whiteMaterial : this.board.blackMaterial;
        if (myMaterial >= opponentMaterial + 2) {
            const [iFriendly, jFriendly] = color == "w" ? this.board.whiteKingPosition : this.board.blackKingPosition;
            const [iEnemy, jEnemy] = color == "b" ? this.board.whiteKingPosition : this.board.blackKingPosition;
            const enemyDistFromCenter = Math.abs(iEnemy - 3.5) + Math.abs(jEnemy - 3.5);
            const L1DistBetweenKings = Math.abs(iEnemy - iFriendly) + Math.abs(jEnemy - jFriendly);
            return 5 * enemyDistFromCenter - 10 * L1DistBetweenKings;
        };
        return 0;
    };

    getSearchExtension(move) {
        let extension = 0
        if (this.board.inCheck()) { // check extension
            extension = 1;
        } else if (move.movingPiece[1] == "P" && (move.endPos[1] == 1 || move.endPos[1] == 6)) { // seventh rank pawn promotion extension
            extension = 1;
        };
        return extension;
    };

    getSearchReduction(extension, move, i, currentDepth) {
        let reduction = 0;
        // apply reduction, when move is not capture, doesn't cause check, is not promotion, depth is at least 3
        // and it is not assumed to be in top 3 moves
        if (i < 4 || currentDepth < 3) {
            return reduction;
        };
        if (!move.isCapture() && !move.promotion) {
            reduction = 1;
        } else if (extension == 0) {
            reduction = 1;
        };
        return reduction;
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
    orderMoves(moves, previousBestMove) {
        this.calculateAssumedMoveScores(moves, previousBestMove);
        const sortedMoves = this.sort(moves);
        return sortedMoves;
    };

    calculateAssumedMoveScores(moves, previousBestMove) {
        moves.forEach(move => {
            const movingPieceType = move.movingPiece[1];
            const takenPieceType = move.takenPiece[1];

            move.assumedMoveScore = 0;

            if (previousBestMove != undefined && move.equals(previousBestMove)) {
                move.assumedMoveScore += 999999
            };

            if (takenPieceType != "-") {
                move.assumedMoveScore += 2 * pieceValues[takenPieceType];
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