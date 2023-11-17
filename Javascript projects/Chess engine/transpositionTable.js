class transpositionTable {
    constructor(board, sizeInMB) {
        this.board = board;
        this.size = this.getSizeOfArray(sizeInMB);
        this.positionLookUp = new Array(this.size);
        this.searchFailed = Number.MIN_SAFE_INTEGER;
    };

    getSizeOfArray() { // for now use 4 000 000 positions
        return 4000000;
    };

    getIndex(zobristHash) {
        return zobristHash % this.size;
    };

    clearTable() {
        this.positionLookUp = new Array(this.size);
    };

    getEvaluationFromHash(zobristHash, alpha, beta, depth) {
        const index = this.getIndex(zobristHash);
        const entry = this.positionLookUp[index];
        if (entry != undefined && zobristHash == entry.zobristHash && depth <= entry.depth) { // if found a previously saved entry that is lower depth than current depth
            if (entry.nodeType == 0) {
                return entry.evaluation;   
            } else if (entry.nodeType == 1 && entry.evaluation <= alpha) {
                return alpha;
            } else if (entry.nodeType == 2 && entry.evaluation >= beta) {
                return beta;
            };
            this.rememberBestMove(); // unfinished...
            
        // if hash not saved previously to table or did not return evaluation
        return this.searchFailed;
        };
    };

    getBestMoveFromHash(zobristHash) {
        const index = this.getIndex(zobristHash);
        const entry = this.positionLookUp[index];
        if (entry != undefined) {
            return [true, entry.bestMove];
        } else {
            return [false];
        };
    };

    storeEvaluation(zobristHash, evaluation, depthFromPosition, nodeType, bestMove) { // unfinished ???
        const index = this.getIndex(zobristHash);
        const overWritten = this.positionLookUp[index] != undefined;
        console.log(overWritten) // remove when ready
        this.positionLookUp[index] = new Entry(zobristHash, evaluation, depthFromPosition, nodeType, bestMove);
    };
};

class Entry {
    constructor(zobristHash, evaluation, depthFromPosition, nodeType, bestMove) {
        this.zobristHash = zobristHash;
        this.evaluation = evaluation;
        this.depth = depthFromPosition;
        this.nodeType = nodeType; // 0 if evaluation is exact, 1 if alpha, 2 if beta
        this.bestMove = bestMove;
    };
};