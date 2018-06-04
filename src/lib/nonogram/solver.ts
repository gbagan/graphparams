import {CellType, Nonogram} from "./types";

export function solve(nonogram: Nonogram) {
    let current = nonogram;
    while (true) {
        const newn = solveIteration(current);
        if (newn === current) {
            break;
        } else {
            current = newn;
        }
    }
    return current;
}

function getLine(nonogram: Nonogram, i: number): ReadonlyArray<CellType> {
    const l: CellType[] = [];
    for (let j = 0; j < nonogram.width; j++) {
        l.push(nonogram.cells[i * nonogram.width + j]);
    }
    return l;
}

function getColumn(nonogram: Nonogram, j: number): ReadonlyArray<CellType> {
    const l: CellType[] = [];
    for (let i = 0; i < nonogram.height; i++) {
        l.push(nonogram.cells[i * nonogram.width + j]);
    }
    return l;
}

function putLine(cells: CellType[], height: number, width: number, i: number, line: ReadonlyArray<CellType>) {
    for (let j = 0; j < width; j++) {
        cells[i * width + j] = line[j];
    }
}

function putColumn(cells: CellType[], height: number, width: number, j: number, line: ReadonlyArray<CellType>) {
    for (let i = 0; i < height; i++) {
        cells[i * width + j] = line[i];
    }
}

function solveIteration(nonogram: Nonogram): Nonogram {
    const { columns, height, rows, width } = nonogram;
    const cells = nonogram.cells.slice();
    let change = false;
    for (let i = 0; i < height; i++) {
        const line = getLine(nonogram, i);
        const newLine = fillLine(line, rows[i]);
        if (newLine !== line) {
            putLine(cells, height, width, i, newLine);
            change = true;
        }
    }
    const nonogram2: Nonogram = {...nonogram, cells};

    for (let i = 0; i < width; i++) {
        const line = getColumn(nonogram2, i);
        const newLine = fillLine(line, columns[i]);
        if (newLine !== line) {
            putColumn(cells, height, width, i, newLine);
            change = true;
        }
    }
    return change ? nonogram2 : nonogram;
}

function possibleMatches(line: CellType[], pattern: ReadonlyArray<number>) {
    const nonWhiteBlockSize: number[] = new Array(line.length);
    let size = 0;
    for (let i = line.length - 1; i >= 0; i--) {
        nonWhiteBlockSize[i] = size = (line[i] === CellType.White ? 0 : ++size);
    }

    const match: boolean[][] = Array(pattern.length);
    for (let i = 0; i < match.length; i++) {
        match[i] = new Array(line.length);
        match[i].fill(false);
    }
    for (let i = 0; i < line.length; i++) {
        match[0][i] = nonWhiteBlockSize[i] >= pattern[0];
        if (line[i] === CellType.Black) {
            break;
        }
    }

    for (let ii = 1; ii < pattern.length; ii++) {
        let nonBlackSegment = false;
        for (let i = 0; i < line.length; i++) {
            if (nonBlackSegment && nonWhiteBlockSize[i] >= pattern[ii]) {
                match[ii][i] = true;
            }
            if (line[i] === CellType.Black) {
                nonBlackSegment = false;
            } else if (i >= pattern[ii - 1] && match[ii - 1][i - pattern[ii - 1]]) {
                nonBlackSegment = true;
            }
        }
    }
    const match2: boolean[][] = Array(pattern.length);
    for (let i = 0; i < match2.length; i++) {
        match2[i] = new Array(line.length);
        match2[i].fill(false);
    }
    const lastIndex = pattern.length - 1;
    const lastLen1 = pattern[lastIndex] - 1;
    for (let i = line.length - 1; i >= lastLen1; i--) {
        match2[lastIndex][i - lastLen1] = match[lastIndex][i - lastLen1];
        if (line[i] === CellType.Black) {
            break;
        }
    }

    for (let ii = lastIndex - 1; ii >= 0; ii--) {
        const segLen1 = pattern[ii] - 1;
        let nonBlackSegment = false;
        for (let i = line.length - 2; i >= segLen1; i--) {
            if (nonBlackSegment) {
                match2[ii][i - segLen1] = match[ii][i - segLen1];
            }
            if (line[i] === CellType.Black) {
                nonBlackSegment = false;
            } else if (match2[ii + 1][i + 1]) {
                nonBlackSegment = true;
            }
        }
    }
    return match2;
}

function fillLine(oldLine: ReadonlyArray<CellType>, pattern: ReadonlyArray<number>): ReadonlyArray<CellType> {
    const line = oldLine.slice();
    const match = possibleMatches(line, pattern);

    const possibleBlack: boolean[] = new Array(line.length);
    const possibleWhite: boolean[] = new Array(line.length);
    possibleBlack.fill(false);
    possibleWhite.fill(false);

    const lastIndex = pattern.length - 1;
    const lastSeg = pattern[lastIndex];

    let found = false;
    for (let i = lastSeg; i < line.length; i++) {
        if (match[lastIndex][i - lastSeg]) {
            found = true;
        }
        if (found) {
            possibleWhite[i] = true;
        }
    }

    found = false;
    for (let i = line.length - 1; i >= 0; i--) {
        if (found) {
            possibleWhite[i] = true;
        }
        if (match[0][i]) {
            found = true;
        }
    }

    for (let ii = 0; ii < pattern.length; ii++) {
        let dist = 1000000;

        // t[i] <=> there is non black segment [i, j-1] with j a possible starting position for the (ii+1)-th segment
        const t: boolean[] = Array(line.length);
        if (ii === lastIndex) {
            t.fill(false);
        } else {
            let ok = false;
            for (let i = line.length - 2; i >= 0; i--) {
                t[i] = ok = (line[i] !== CellType.Black) && (ok || match[ii + 1][i + 1]);
            }
        }

        for (let i = 0; i < line.length; i++) {
            dist = match[ii][i] ? 0 : dist + 1;
            if (dist < pattern[ii]) {
                possibleBlack[i] = true;
            }
        }
        let ok2 = false;
        for (let i = pattern[ii]; i < line.length; i++) {
            ok2 = (line[i] !== CellType.Black) && (ok2 || match[ii][i - pattern[ii]]);
            if (ok2 && t[i]) {
                possibleWhite[i] = true;
            }
        }
    }

    let change = false;

    for (let i = 0; i < line.length; i++) {
        if (!possibleWhite[i]) {
            if (line[i] !== CellType.Black) {
                change = true;
            }
            line[i] = CellType.Black;
        } else if (!possibleBlack[i]) {
            if (line[i] !== CellType.White) {
                change = true;
            }
            line[i] = CellType.White;
        }
    }
    return change ? line : oldLine;
}