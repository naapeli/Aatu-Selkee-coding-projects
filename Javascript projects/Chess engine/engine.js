class engine {
    constructor() {
        this.depth = 4;
        this.openingTheory = [];
    };

    searchPositions(depth) {

    };

    evaluatePosition() {

    };

    getNumberOfMoves(currentDepth) {
        let numberOfMoves = 0;
        if (currentDepth > 0) {
            currentBoard.possibleMoves.forEach(move => {
                currentBoard.engineMakeMove(move);
                numberOfMoves += this.getNumberOfMoves(currentDepth - 1);
                currentBoard.engineUndoMove();
            });
        } else {
            return 1
        };
        return numberOfMoves
    };
};
