// no point to this file yet
const ChessTools = require('./node_modules/chess-tools');
const OpeningBook = ChessTools.OpeningBooks.CTG;
const fs = require('fs');
const book = new OpeningBook();

const dataStream = fs.createReadStream('Javascript projects/Chess engine/openingBook/H12Book.ctg', {encoding: 'hex'});

book.load_book(dataStream);
dataStream.on('end', () => {
    console.log("here")
    // This event is emitted when there is no more data to read
    console.log('Finished reading the file');
    console.log(book)
});
dataStream.on('error', (err) => {
    // This event is emitted if there's an error reading the file
    console.error('Error reading the file:', err);
});
/*
book.on("loaded", ()=> {
    let entries = book.find("rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 1");
});*/


function getBookMove(fen) {
    return [1000, true]
};

module.exports = {"getBookMove": getBookMove}
