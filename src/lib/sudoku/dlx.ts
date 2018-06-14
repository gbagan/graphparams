import * as R from "ramda"; 

type DancingCell = {
    left: DancingCell;
    right: DancingCell;
    up: DancingCell;
    down: DancingCell;
    col: DancingCell;
    row: DancingCell;
    size: number;
    id: number;
};

function dancingCell() {
    const cell: DancingCell = {} as any;
    cell.left = cell;
    cell.right = cell;
    cell.up = cell;
    cell.down = cell;
    cell.col = cell;
    cell.row = cell;
    cell.size = 0;
    cell.id = 0;
    return cell;
}

function linkLR(x: DancingCell, y: DancingCell) {
    x.right = y;
    y.left = x;
}

function linkUD(x: DancingCell, y: DancingCell) {
    x.down = y;
    y.up = x;
}

function unlinkLR(x: DancingCell) {
    x.left.right = x.right;
    x.right.left = x.left;
}

function unlinkUD(x: DancingCell) {
    x.up.down = x.down;
    x.down.up = x.up;
}

function relinkLR(x: DancingCell) {
    x.left.right = x.right.left = x;
}

function relinkUD(x: DancingCell) {
    x.up.down = x.down.up = x;
}

function pruneMatrix(row: DancingCell) {
    for (let cell = row.right; cell !== row; cell = cell.right) {
        const col = cell.col;
        unlinkLR(col);
        for (let cell2 = col.down; cell2 !== col; cell2 = cell2.down) {
            for (let cell3 = cell2.right; cell3 !== cell2; cell3 = cell3!.right) {
                unlinkUD(cell3);
                cell3.col.size--;
            }
        }
    }
}

function restoreMatrix(row: DancingCell) {
    for (let cell = row.left; cell !== row; cell = cell.left) {
        const col = cell.col;
        for (let cell2 = col.up; cell2 !== col; cell2 = cell2.up) {
            for (let cell3 = cell2.left; cell3 !== cell2; cell3 = cell3.left) {
                relinkUD(cell3);
                cell3.col.size++;
            }
        }
        relinkLR(col);
    }
}

type DancingMatrix = {
    root: DancingCell;
    rowsDict: ReadonlyArray<DancingCell>;
    colsDict: ReadonlyArray<DancingCell>;
}

function makeDancingMatrix(nbRows: number, nbColumns: number, matrixPairs: [number, number][]) {
    const root = dancingCell();

    const rowsDict = R.times(i => {
        const cell = dancingCell();
        cell.id = i;
        cell.col = root;
        linkUD(root.up, cell);
        linkUD(cell, root);
        return cell;
    }, nbRows);

    const colsDict = R.times(i => {
        const cell = dancingCell();
        cell.id = i;
        cell.row = root;
        linkLR(root.left, cell);
        linkLR(cell, root);
        return cell;
    }, nbColumns);

    const dm = { root, colsDict, rowsDict };

    for (const [x, y] of matrixPairs)
        insertNode(dm, x, y);

    return dm;
}

function dmFilter(dm: DancingMatrix, fixedVertices: number[]) {
    for (const vertex of fixedVertices) {
        const row = dm.rowsDict[vertex];
        if (row.down.up !== row) { // v has been pruned
            return false;
        }
        pruneMatrix(row);
    }
    return true;
}

const dmEmpty = (dm: DancingMatrix) => dm.root.right === dm.root;

function chooseMinEdge(dm: DancingMatrix) {
    let minCell = dm.root.right;
    let minSize = Infinity;
    for (let cell = minCell; cell !== dm.root; cell = cell.right) {
        if (cell.size <= minSize) {
            minSize = cell.size;
            minCell = cell;
        }
    }
    return minCell;
}

function insertNode(dm: DancingMatrix, row: number, col: number) {
    const rowCell = dm.rowsDict[row];
    const colCell = dm.colsDict[col];
    const cell = dancingCell();
    cell.row = rowCell;
    cell.col = colCell;
    colCell.size++;
    linkUD(colCell.up, cell);
    linkUD(cell, colCell);
    linkLR(rowCell.left, cell);
    linkLR(cell, rowCell);
}

function* _dlx(dm: DancingMatrix): Iterable<number[]> {
    if (dmEmpty(dm)) {
        yield [];
        return;
    }
    const col = chooseMinEdge(dm);
    if (col.size === 0) {
        return;
    }
    for (let cell = col.down; cell !== col; cell = cell.down) {
        const row = cell.row;
        pruneMatrix(row);
        for (const solution of _dlx(dm)) {
            yield solution.concat(row.id);
        }
        restoreMatrix(row);
    }
}

export default function dlx(nbRows: number, nbColumns: number, matrixPairs: [number, number][], fixedVertices:number[]) {
    const dm = makeDancingMatrix(nbRows, nbColumns, matrixPairs);
    const res = dmFilter(dm, fixedVertices);
    return res ? _dlx(dm) : [];
}
