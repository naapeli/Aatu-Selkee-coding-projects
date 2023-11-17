let randomState = 1804289383;

function getRandom32BitInt() {
    let number = randomState;
    number = number ^ (number << 13);
    number = number ^ (number >> 17);
    number = number ^ (number << 5);
    randomState = number;
    return number;
};

function getRandom64BitInt() {
    const lower32 = BigInt(getRandom32BitInt());
    const upper32 = BigInt(getRandom32BitInt());
    return upper32 * (2n ** 32n) + lower32;
};

const randomPieceKeys = new Array(12).fill().map(() => new Array(64).fill(getRandom64BitInt()));
const randomEnPassantKeys = new Array(64).fill(getRandom64BitInt());
const randomCastlingKeys = new Array(16).fill(getRandom64BitInt());
const randomSideKey = getRandom64BitInt();

const pieceToIndex = {
    "wK": 0,
    "wQ": 1,
    "wR": 2,
    "wB": 3,
    "wN": 4,
    "wP": 5,
    "bK": 6,
    "bQ": 7,
    "bR": 8,
    "bB": 9,
    "bN": 10,
    "bP": 11
};