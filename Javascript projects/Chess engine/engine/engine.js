class engine {
    constructor(board) {
        this.maxDepth = Number.MAX_SAFE_INTEGER;
        this.openingTheory = [];
        this.board = board;
        this.maxAllowedTime = 2000;

        this.searchStartTime;
        this.searchCancelled = false;
        this.aspirationWindowFailed = false;
        this.bestMove;
        this.bestMoveEval;
        this.bestIterEvaluation = Number.MIN_SAFE_INTEGER;
        this.bestIterMove;
        this.moveOrdering = new moveOrderer();
        this.transpositionTable = new transpositionTable();
        this.R = 2; // null move pruning depth reduction constant
        this.materialMultiplier = 10;
        this.allowNullMovePruning = true;
        this.EXACT_NODE = 0;
        this.UPPERBOUND_NODE = 1;
        this.LOWERBOUND_NODE = 2;
        this.CHECKMATE = 10000000;
        this.ALPABETA = 100000000;
    };

    // return the best move from current position from the opening book or iterative search (unfinished)
    getBestMove() {
        /*
        if (this.board.moveLog.length < 14) {
            const result = await fetch(BASE_URL + "move",
            {
                method: "GET"
            });
            if (result.ok) {
                const data = await result.json();
                const move = data.move;
                console.log(move)
                return 
            }
            return
        };*/

        // if position not in the opening book, return the move from iterative search
        return new Promise((resolve, reject) => {
            const bestMove = this.iterativeSearch()
            resolve(bestMove);
        });
    };

    iterativeSearch() {
        this.searchStartTime = performance.now();
        this.searchCancelled = false;
        this.bestIterEvaluation = Number.MIN_SAFE_INTEGER;
        let alpha = -this.ALPABETA;
        let beta = this.ALPABETA;
        let score;

        // clear historytable from previous search
        currentHistoryTable.clear();

        if (this.board.possibleMoves.length == 0) {
            return;
        };
        console.log("Search running");
        const perspective = this.board.whiteToMove ? 1 : -1;
        for (let searchDepth = 1; searchDepth <= this.maxDepth; searchDepth++) {
            console.log("Iteration: " + searchDepth);
            for (let i = 0; i < aspirationWindows.length; i++) {
                if (score != undefined) {
                    const window = aspirationWindows[i];
                    alpha = score - window;
                    beta = score + window;
                };
                // search the current position not allowing null-move-pruning at the first node
                score = this.search(searchDepth, 0, alpha, beta, perspective, false);
                if (this.searchCancelled) { // if search cancelled, store bestIterMove as bestMove if evaluation is inside alpha and beta
                    if (!this.aspirationWindowFailed && alpha < score && score < beta) {
                        this.bestMove = this.bestIterMove;
                        this.bestMoveEval = this.bestIterEvaluation;
                        console.log("Evaluation of last iteration used")
                    };
                    console.log(this.bestMove, this.bestMoveEval);
                    console.log("Evaluation: " + perspective * this.bestMoveEval / 1000);
                    console.log("Depth: " + searchDepth);
                    console.log("Time taken: " + Math.round(performance.now() - this.searchStartTime));
                    console.log("Positions in transposition table: " + this.transpositionTable.positionsInLookUp / parseInt(this.transpositionTable.size) * 100 + " %");
                    return this.bestMove;
                } else if (alpha < score && score < beta) { // if score was inside alpha and beta
                    this.bestMove = this.bestIterMove;
                    this.bestMoveEval = this.bestIterEvaluation;
                    this.aspirationWindowFailed = false;
                    console.log(this.bestMove, this.bestMoveEval);
                    if (this.bestMoveEval >= this.CHECKMATE - 20) {
                        console.log("Found engine checkmate in " + (-this.bestMoveEval + this.CHECKMATE) + " ply");
                        console.log(this.bestMoveEval)
                        return this.bestMove;
                    } else if (this.bestMoveEval <= -this.CHECKMATE + 20) {
                        console.log("Found player checkmate in " + (this.bestMoveEval + this.CHECKMATE) + " ply");
                        console.log(this.bestMoveEval)
                        return this.bestMove;
                    };
                    break;
                };
                // if we failed to find the score inside alpha and beta continue to the next aspiration window,
                // else continue to the next iteration
                console.log("Aspiration window failed!");
                this.aspirationWindowFailed = true;
            };
        };
    };

    search(currentDepth, depthFromRoot, alpha, beta, colorPerspective, allowNullMovePruning) {
        this.searchCancelled = (performance.now() - this.searchStartTime) > this.maxAllowedTime;
        if (this.searchCancelled) {
            return;
        };
        
        // look if position exists in the transposition table
        const position = this.transpositionTable.getEntryFromHash(this.board.zobristHash);
        if (position != undefined && position.zobristHash == this.board.zobristHash && Math.max(currentDepth, 0) <= position.depth) {
            if (position.nodeType == this.EXACT_NODE) {
                if (depthFromRoot == 0) {
                    this.bestIterEvaluation = position.evaluation;
                    this.bestIterMove = position.bestMove;
                };
                return position.evaluation;
            } else if (position.nodeType == this.LOWERBOUND_NODE) {
                alpha = Math.max(alpha, position.evaluation);
            } else if (position.nodeType == this.UPPERBOUND_NODE) {
                beta = Math.min(beta, position.evaluation);
            };
        };
        // if found a value for the position from transposition table, return it
        if (alpha >= beta) {
            return position.evaluation;
        };

        // if found a terminal node, return the corresponding evaluation
        if (this.board.possibleMoves.length === 0) {
            if (this.board.boardUtility.isCheckMate(this.board.possibleMoves, this.board.currentCheckingPieces)) {
                return -this.CHECKMATE + depthFromRoot; // checkmate
            };
            return 0; // stalemate
        };
        if (currentDepth <= 0) {
            // if end of depth, search captures to the end to reduce the horizon effect 
            const evaluation = this.quiescenceSearch(depthFromRoot, alpha, beta, colorPerspective);
            return evaluation;
        };

        // null-move pruning (give opponent extra move and search resulting position with reduced depth)
        const movingPiecesRemaining = colorPerspective == 1 ? this.board.whitePieces : this.board.blackPieces;
        if (allowNullMovePruning && currentDepth >= 3 && !this.board.inCheck() && movingPiecesRemaining > 1) {
            this.board.makeNullMove();
            const val = -this.search(currentDepth - 1 - this.R, depthFromRoot + 1, -beta, -beta + 1, -colorPerspective, false);
            this.board.undoNullMove();
            if (val >= beta) {
                return beta;
            };
        };
        
        // search through all moves and select the best one
        const previousBestMove = (position != undefined && position.zobristHash == this.board.zobristHash) ? position.bestMove : undefined;
        const moves = this.moveOrdering.orderMoves(this.board.possibleMoves, previousBestMove, depthFromRoot);
        let positionBestMove = moves[0];
        let PVNodeFound = false;
        let nodeType = this.UPPERBOUND_NODE;
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            this.board.makeMove(move);

            // update the amount of times a position has been seen in the search
            // set the value of the position to zero if we repeat even once
            let threefoldRepetition = false;
            if (repetitionTable[this.board.zobristHash] != 0 && repetitionTable[this.board.zobristHash] != undefined) {
                repetitionTable[this.board.zobristHash] += 1
                // if threefold repetition found, stop searching this position update it's value to 0
                if (repetitionTable[this.board.zobristHash] >= 2) {
                    threefoldRepetition = true;
                };
            } else {
                repetitionTable[this.board.zobristHash] = 1
            };
            
            // starts from 0 because of the threefold repetition
            let currentEvaluation = 0;
            let extension = 0;
            let reduction = 0;
            if (!threefoldRepetition) {
                // calculate search extension before PV logic
                extension = this.getSearchExtension(move);
                // principal variations search
                if (!PVNodeFound) { // do a full search for the first move (previous best move)
                    currentEvaluation = -this.search(currentDepth - 1 + extension, depthFromRoot + 1, -beta, -alpha, -colorPerspective, this.allowNullMovePruning);
                } else {
                    // calculate late move reduction after making the wanted move.
                    reduction = this.getSearchReduction(extension, move, i, currentDepth);

                    // Do the principal variation search with reduced depth for other moves to try to prove that all other moves than
                    // i == 0 are bad. If this hypothesis turns out to be wrong, we need to spend more time to search the same nodes again
                    // with searching the same position without late move reduction and a full window.
                    if (reduction > 0) {
                        currentEvaluation = -this.search(currentDepth - 1 + extension - reduction, depthFromRoot + 1, -(alpha + 1), -alpha, -colorPerspective, this.allowNullMovePruning);
                    } else { // if we do not apply reduction to this move, make sure to do a full search
                        currentEvaluation = alpha + 1;
                    };
                    
                    // if we got a better evaluation, need to do a full depth search
                    if (currentEvaluation > alpha) {
                        // do still the principal variation search (null window)
                        currentEvaluation = -this.search(currentDepth - 1 + extension, depthFromRoot + 1, -(alpha + 1), -alpha, -colorPerspective, this.allowNullMovePruning);
                        // if PV search fails to prove the position is bad, do the full search
                        if ((currentEvaluation > alpha) && (currentEvaluation < beta)) {
                            currentEvaluation = -this.search(currentDepth - 1 + extension, depthFromRoot + 1, -beta, -alpha, -colorPerspective, this.allowNullMovePruning);
                        };
                    };
                };
            };
            
            // update the amount of times a position has been seen in the search
            repetitionTable[this.board.zobristHash] -= 1;
            
            this.board.undoMove();

            if (this.searchCancelled) {
                // if played the first move from previous iteration or more, store the best move even if the search cancelled,
                // not to waste the calculation time of the last iteration
                if (depthFromRoot == 0) {
                    return this.bestIterEvaluation;
                };
                return;
            };

            // alpha-beta pruning
            if (currentEvaluation >= beta) {
                // store best move as lower bound (since exiting search early), (don't store checkmate scores for finding mate plies)
                if (beta >= -this.CHECKMATE + 21 && beta <= this.CHECKMATE - 21) {
                    this.transpositionTable.storeEvaluation(this.board.zobristHash, beta, currentDepth, this.LOWERBOUND_NODE, move);
                };

                // update killer moves
                this.storeKillerMoves(positionBestMove, depthFromRoot);
                
                if (depthFromRoot == 0) {
                    this.bestIterMove = positionBestMove;
                    this.bestIterEvaluation = beta;
                    return this.bestIterEvaluation;
                };
                return beta;
            };
            if (currentEvaluation > alpha) {
                alpha = currentEvaluation;
                positionBestMove = move;
                PVNodeFound = true;
                nodeType = this.EXACT_NODE;
            };
        };

        // store the best move into the history table (to help with move ordering)
        currentHistoryTable.add(positionBestMove, currentDepth * currentDepth);
        
        // store the evaluation of the position to the transposition table (don't store checkmate scores for finding mate plies)
        if (alpha >= -this.CHECKMATE + 21 && alpha <= this.CHECKMATE - 21) {
            this.transpositionTable.storeEvaluation(this.board.zobristHash, alpha, currentDepth, nodeType, positionBestMove);
        };

        // remember the best moves if the position is the original one, then return the evaluation
        if (depthFromRoot == 0) {
            this.bestIterMove = positionBestMove;
            this.bestIterEvaluation = alpha;
        };
        return alpha;
    };

    quiescenceSearch(depthFromRoot, alpha, beta, colorPerspective) {
        
        // check if evaluation of this position causes beta cutoff
        let stand_pat = this.evaluatePosition(colorPerspective);
        
        if (stand_pat >= beta) {
            return beta;
        };
        
        // delta pruning
        const BIG_DELTA = this.materialMultiplier * (1107); // this.materialMultiplier * (queen + pawn value)
        if ( stand_pat < alpha - BIG_DELTA ) {
            return alpha;
        };


        if (alpha < stand_pat) {
            alpha = stand_pat;
        };
        const moves = this.moveOrdering.orderMoves(this.board.possibleMoves, undefined, depthFromRoot);
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            if (move.isCapture()) { // continue search if move is piece capture
                this.board.makeMove(move);
                const score = -this.quiescenceSearch(depthFromRoot + 1, -beta, -alpha, -colorPerspective);
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

    // determines if a position is good for white (positive) or black (negative) and returns the evaluation
    // so that larger value is always good for current player given by colorPerspective
    evaluatePosition(colorPerspective) {
        let evaluation = 0;
        const endGameWeight = this.getEndGameWeight();

        // calculate material
        evaluation += this.materialMultiplier * (this.board.whiteMaterial - this.board.blackMaterial);

        // calculate piece placement factor
        evaluation += (1/4) * (1 - endGameWeight) * (this.board.whitePiecePositionBonus - this.board.blackPiecePositionBonus);
        evaluation += (1/4) * (endGameWeight) * (this.board.whitePiecePositionBonusEg - this.board.blackPiecePositionBonusEg);

        // calculate king mobility factor in middlegames to encourage castling
        evaluation += 100 * (1 - endGameWeight) * (this.getKingSafetyFactor("w") - this.getKingSafetyFactor("b"));

        // calculate pawnshield to discourage pushing pawns in front of the king too far
        evaluation += 200 * (1 - endGameWeight) * (this.getKingPawnShieldFactor("w") - this.getKingPawnShieldFactor("b"));

        // calculate a penalty for king being far away from safe positions to encourage castling
        evaluation += 100 * (1 - Math.sqrt(endGameWeight)) * (this.getNotCastlingPenalty("b") - this.getNotCastlingPenalty("w"));

        evaluation += 25 * (1 - endGameWeight) * this.getCenterPawnBonus();

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

    getKingSafetyFactor(owncolor) {
        const oppositeColor = owncolor == "w" ? "b" : "w";
        const ownKingLocation = owncolor == "w" ? this.board.whiteKingPosition : this.board.blackKingPosition;
        const kingQueenMoves = this.board.getQueenMoves(ownKingLocation, oppositeColor);
        const ownKingMobilityFactor = Math.min(1 / kingQueenMoves.length, 1);
        return ownKingMobilityFactor;
    };

    getKingPawnShieldFactor(owncolor) { // maybe differentiate between rows?
        const ownKingLocation = owncolor == "w" ? this.board.whiteKingPosition : this.board.blackKingPosition;
        const positionKernel = owncolor == "w" ? [[-2, -1], [-2, 0], [-2, 1], [-1, -1], [-1, 0], [-1, 1]] : [[2, -1], [2, 0], [2, 1], [1, -1], [1, 0], [1, 1]];
        let ownPawnShieldCount = 0;
        positionKernel.forEach(position => {
            const [j, i] = position;
            const possiblePawnPosition = [ownKingLocation[0] + i, ownKingLocation[1] + j];
            if (this.board.boardUtility.positionOnBoard(possiblePawnPosition[1], possiblePawnPosition[0])) {
                const possiblePawn = this.board.board[possiblePawnPosition[0]][possiblePawnPosition[1]];
                if (possiblePawn[1] == "P" && possiblePawn[0] == owncolor) {
                    ownPawnShieldCount++;
                };
            };
        });
        return Math.sqrt(ownPawnShieldCount / 3);
    };

    getNotCastlingPenalty(owncolor) {
        const ownKingLocation = owncolor == "w" ? this.board.whiteKingPosition : this.board.blackKingPosition;
        const targetKingLocations = owncolor == "w" ? [[1, 7], [6, 7]] : [[1, 0], [6, 0]];
        const minL1NormFromTargets = Math.min(Math.abs(ownKingLocation[0] - targetKingLocations[0][0]) + Math.abs(ownKingLocation[1] - targetKingLocations[0][1]),
                                     Math.abs(ownKingLocation[0] - targetKingLocations[1][0]) + Math.abs(ownKingLocation[1] - targetKingLocations[1][1]));
        return Math.sqrt(minL1NormFromTargets);
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

    getCenterPawnBonus() {
        const centerSquares = [[2, 3], [3, 3], [4, 3], [5, 3], [2, 4], [3, 4], [4, 4], [5, 4]];
        let bonus = 0;
        for (let index = 0; index < centerSquares.length; index++) {
            const [i, j] = centerSquares[index];
            const piece = this.board.board[j][i];
            if (piece == "wP") {
                bonus++;
            } else if (piece == "bP") {
                bonus--;
            };
        };
        return bonus;
    };

    getSearchExtension(move) {
        let extension = 0
        if (this.board.inCheck()) { // check extension
            extension = 1;
        } else if (move.movingPiece[1] == "P" && (move.endPos[1] == 1 || move.endPos[1] == 6)) { // seventh rank pawn promotion extension
            extension = 1;
        } else if (this.board.possibleMoves.length == 1) { // one reply extension
            extension = 1;
        }
        return extension;
    };

    getSearchReduction(extension, move, i, currentDepth) {
        let reduction = 0;
        // apply reduction, when move is not capture, doesn't cause check, is not promotion, depth is at least 3
        // and it is not assumed to be in top 3 moves
        if (i < 4 || currentDepth < 3) {
            return reduction;
        };
        if (!this.board.inCheck() && !move.isCapture() && !move.promotion && extension == 0) {
            reduction = 1;
        };
        return reduction;
    };

    storeKillerMoves(move, depthFromRoot) {
        if (!move.isCapture()) {
            if (depthFromRoot < maxKillerMovePly) {
                killerMoves[1][depthFromRoot] = killerMoves[0][depthFromRoot];
                killerMoves[0][depthFromRoot] = move;
            };
        };
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
        
        this.board.positionFromFen("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -");
        const startTime2 = performance.now();
        const test2 = this.getNumberOfMoves(4) == 4085603;
        const endTime2 = performance.now();
        const elapsedTime2 = endTime2 - startTime2;
        console.log("Position 2 up to depth 4 is " + test2);
        console.log(`Code execution time: ${elapsedTime2} milliseconds`);

        this.board.positionFromFen("8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - -");
        const startTime3 = performance.now();
        const test3 = this.getNumberOfMoves(6) == 11030083;
        const endTime3 = performance.now();
        const elapsedTime3 = endTime3 - startTime3;
        console.log("Position 3 up to depth 6 is " + test3);
        console.log(`Code execution time: ${elapsedTime3} milliseconds`);

        this.board.positionFromFen("r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1");
        const startTime4 = performance.now();
        const test4 = this.getNumberOfMoves(5) == 15833292;
        const endTime4 = performance.now();
        const elapsedTime4 = endTime4 - startTime4;
        console.log("Position 4 up to depth 5 is " + test4);
        console.log(`Code execution time: ${elapsedTime4} milliseconds`);

        this.board.positionFromFen("rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8");
        const startTime5 = performance.now();
        const test5 = this.getNumberOfMoves(4) == 2103487;
        const endTime5 = performance.now();
        const elapsedTime5 = endTime5 - startTime5;
        console.log("Position 5 up to depth 4 is " + test5);
        console.log(`Code execution time: ${elapsedTime5} milliseconds`);

        this.board.positionFromFen("r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10");
        const startTime6 = performance.now();
        const test6 = this.getNumberOfMoves(4) == 3894594;
        const endTime6 = performance.now();
        const elapsedTime6 = endTime6 - startTime6;
        console.log("Position 6 up to depth 4 is " + test6);
        console.log(`Code execution time: ${elapsedTime6} milliseconds`);
        this.board.positionFromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    };
};

class moveOrderer {
    orderMoves(moves, previousBestMove, depthFromRoot) {
        this.calculateAssumedMoveScores(moves, previousBestMove, depthFromRoot);
        const sortedMoves = this.sort(moves);
        return sortedMoves;
    };

    calculateAssumedMoveScores(moves, previousBestMove, depthFromRoot) {
        moves.forEach(move => {
            const movingPieceType = move.movingPiece[1];
            const takenPieceType = move.takenPiece[1];

            move.assumedMoveScore = 0;

            if (previousBestMove != undefined && move.equals(previousBestMove)) {
                move.assumedMoveScore += 1000000000;
            }; 

            if (takenPieceType != "-") {
                move.assumedMoveScore += 10000000 * (2 * pieceValues[takenPieceType] - pieceValues[movingPieceType]);
            };

            if (!move.isCapture()) {
                if (killerMoves[0][depthFromRoot] != undefined && move.equals(killerMoves[0][depthFromRoot])) {
                    move.assumedMoveScore += 1000001;
                } else if (killerMoves[1][depthFromRoot] != undefined && move.equals(killerMoves[1][depthFromRoot])) {
                    move.assumedMoveScore += 1000000;
                };
            };

            if (move.promotion) {
                move.assumedMoveScore += 100000 * pieceValues[move.promotedPiece[1]];
            };

            // order rest of the quiet moves based on the history of other positions
            move.assumedMoveScore += 100 * currentHistoryTable.get(move);

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