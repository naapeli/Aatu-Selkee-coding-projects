class engine {
    constructor(board) {
        this.maxDepth = 5;
        this.openingTheory = [];
        this.board = board;
        this.moveOrdering = new moveOrderer();
    };

    iterativeSearch(allowedTime) {
        this.moveOrdering.calculateAssumedMoveScores(this.board.possibleMoves)
        const moves = this.moveOrdering.sort(this.board.possibleMoves);
        let bestMove = moves[0];
        let bestEvaluation = Number.NEGATIVE_INFINITY;
        let notCancelled = true;
        const startTime = performance.now();
        for (let i = 0; i <= this.maxDepth; i++) {
            let bestIterEvaluation = Number.NEGATIVE_INFINITY;
            let bestIterMove = moves[0];
            moves.forEach(move => {
                if (notCancelled) {
                    this.board.makeMove(move);
                    const currentEvaluation = -this.search(i, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
                    this.board.undoMove();
                    if (currentEvaluation > bestIterEvaluation) {
                        bestIterMove = move;
                        bestIterEvaluation = currentEvaluation;
                        move.assumedMoveScore = currentEvaluation;
                    };
                    const currentTime = performance.now();
                    const takenTimeSoFar = currentTime - startTime;
                    notCancelled = takenTimeSoFar < allowedTime;
                };
            });
            if (bestIterEvaluation > bestEvaluation) {
                bestEvaluation = bestIterEvaluation;
                bestMove = bestIterMove;
            };
            // sort moves w.r.t previously calculated movescores
            this.moveOrdering.insertionSort(moves);
        };
        return bestMove;
    };

    search(currentDepth, alpha, beta) {
        if (this.board.possibleMoves.length === 0) {
            if (this.board.boardUtility.isCheckMate(this.board.possibleMoves, this.board.currentCheckingPieces)) {
                return Number.NEGATIVE_INFINITY;
            };
            return 0; // stalemate
        };
        if (currentDepth === 0) {
            return this.evaluatePosition() // in the future, start a new search that looks only at captures and promotions (and checks) until there are none remaining.
        };

        this.moveOrdering.calculateAssumedMoveScores(this.board.possibleMoves)
        const moves = this.moveOrdering.sort(this.board.possibleMoves);
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            this.board.makeMove(move);
            const currentEvaluation = -this.search(currentDepth - 1, -beta, -alpha);
            this.board.undoMove();
            
            // alpha-beta-pruning:
            if (currentEvaluation >= beta) {
                return beta;
            };
            alpha = Math.max(alpha, currentEvaluation)
        };
        return alpha;
    };

    evaluatePosition() {
        const perspective = this.board.whiteToMove ? 1 : -1;
        const evaluation = this.board.whiteMaterial - this.board.blackMaterial;
        return perspective * evaluation;
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
    calculateAssumedMoveScores(moves) {
        moves.forEach(move => {
            const movingPieceType = move.movingPiece[1];
            const takenPieceType = move.takenPiece[1];

            if (takenPieceType != "-") {
                move.assumedMoveScore += 10 * pieceValues[takenPieceType] - pieceValues[movingPieceType];
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

    // best sorting algorithm for almost sorted array
    insertionSort(moves) {
        for (let i = 1; i < moves.length; i++) {
            const key = moves[i];
            let j = i - 1;
            while (j >= 0 && moves[j].assumedMoveScore > key.assumedMoveScore) {
                moves[j + 1] = moves[j];
                moves[j] = key;
                j--;
            };
        };
        return moves;
    };
};