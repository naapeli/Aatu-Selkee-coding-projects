const hFileMask = 0x0101010101010101n;
const cutMask = 0xFFFFFFFFFFFFFFFFn;

const whitePassedPawnMask = new Array(64);
const blackPassedPawnMask = new Array(64);

const doubledPawnMask = new Array(64);
const isolatedPawnMask = new Array(8);

function initBitboards() {
    for (let index = 0; index < 64; index++) {
        const [i, j] = [index % 8, Math.floor(index / 8)];
        const fileMask = (hFileMask << BigInt(i)) & cutMask;
        doubledPawnMask[index] = fileMask & (cutMask ^ (BigInt(1) << BigInt(index)));
        const rightMask = (hFileMask << BigInt(Math.min(i + 1, 7))) & cutMask;
        const leftmask = (hFileMask << BigInt(Math.max(i - 1, 0))) & cutMask;
        if (i == 0) {
            isolatedPawnMask[i] = rightMask;
        } else if (i == 7) {
            isolatedPawnMask[i] = leftmask;
        } else {
            isolatedPawnMask[i] = rightMask | leftmask;
        };
        const tripleFileMask = fileMask | rightMask | leftmask;
        const whiteFrontMask = (0xFFFFFFFFFFFFFFFFn >> BigInt(8 * (8 - j))) & cutMask;
        const blackFrontMask = (0xFFFFFFFFFFFFFFFFn << BigInt(8 * (j + 1))) & cutMask;
        whitePassedPawnMask[index] = whiteFrontMask & tripleFileMask;
        blackPassedPawnMask[index] = blackFrontMask & tripleFileMask;
    };
};

initBitboards();
