const OpeningBooks = require('./node_modules/chess-tools/opening-books/index.js');
const fs = require('fs');
const OpeningBook = OpeningBooks.Polyglot;
const book = new OpeningBook();
/*
try {
    const data = fs.readFileSync('./book moves/baron30.bin', 'utf8');
    console.log("success");
    
} catch (err) {
    console.error('Error:', err);
};*/




function getBookMove(fen) {
    return [1000, true]
};

module.exports = {"getBookMove": getBookMove}
