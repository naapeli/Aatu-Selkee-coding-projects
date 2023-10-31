class engine {
    constructor() {
        this.depth = 4;
    };

    getNumberOfMoves(currentDepth) {
        let numberOfMoves = 0;
        if (currentDepth < this.depth) {
            currentBoard.possibleMoves.forEach(move => {
                currentBoard.engineMakeMove(move);
                numberOfMoves += this.getNumberOfMoves(currentDepth + 1);
                currentBoard.engineUndoMove();
            });
        } else {
            return 1
        };
        return numberOfMoves
    };
};
