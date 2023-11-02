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
        if (currentDepth === 0) {
            return 1;
        };
        currentBoard.possibleMoves.forEach(move => {
            currentBoard.engineMakeMove(move);
            numberOfMoves += this.getNumberOfMoves(currentDepth - 1);
            currentBoard.engineUndoMove();
        });
        return numberOfMoves;
    };

    debugNumberOfMoves(depth) {
        let total = 0
        currentBoard.possibleMoves.forEach(move => {
            let moveString = boardPositions[move.startPos[0]] + (8 - move.startPos[1]) + boardPositions[move.endPos[0]] + (8 - move.endPos[1]);
            currentBoard.engineMakeMove(move);
            let moves = this.getNumberOfMoves(depth - 1);
            total += moves
            currentBoard.engineUndoMove();
            console.log([moveString, moves])
        });
        console.log(["Total", total])
    };
};
