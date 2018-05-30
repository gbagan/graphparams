function Array_tabulate<t>(n: number, f: (x: number) => t): t[] {
    const t = new Array(n);
    for (let i = 0; i < n; i++)
        t[i] = f(i);
    return t;
}

class DancingCell {
    left: DancingCell;
    right: DancingCell;
    up: DancingCell;
    down: DancingCell;
    col: DancingCell;
    row: DancingCell;
    size: number;
    id: number;

    constructor() {
        this.left = this;
        this.right = this;
        this.up = this;
        this.down = this;
        this.col = this;
        this.row = this;
        this.size = 0;
        this.id = 0;
    }
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
    x.left.right = x.right.left = x
}

function relinkUD(x: DancingCell) {
    x.up.down = x.down.up = x
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
        const col = cell.col
        for (let cell2 = col.up; cell2 !== col; cell2 = cell2.up) {
            for (let cell3 = cell2.left; cell3 !== cell2; cell3 = cell3.left) {
                relinkUD(cell3);
                cell3.col.size++;
            }
        }
        relinkLR(col);
    }
}

class DancingMatrix {
    root: DancingCell;
    rowsDict: ReadonlyArray<DancingCell>;
    colsDict: ReadonlyArray<DancingCell>;

    constructor(nbRows: number, nbColumns: number, matrixPairs: ReadonlyArray<[number,number]>, fixedVertices: ReadonlyArray<number>) {
        this.root = new DancingCell;

        this.rowsDict = Array_tabulate(nbRows, i => {
            const cell = new DancingCell
            cell.id = i;
            cell.col = this.root;
            linkUD(this.root.up, cell);
            linkUD(cell, this.root);
            return cell
        });

        this.colsDict = Array_tabulate(nbColumns, i => {
            const cell = new DancingCell
            cell.id = i;
            cell.row = this.root;
            linkLR(this.root.left, cell);
            linkLR(cell, this.root);
            return cell
        });

        for (const [x, y] of matrixPairs) {
            this.insertNode(x, y);
        }

        for (let vertex of fixedVertices) {
            const row = this.rowsDict[vertex];
            if (row.down.up !== row) // v has been pruned
                return; /////
            pruneMatrix(row);
        }
    }

    empty() {
        return this.root.right === this.root;
    }

    chooseMinEdge() {
        let minCell = this.root.right;
        let minSize = Infinity;
        for (let cell = minCell; cell !== this.root; cell = cell.right) {
            if (cell.size <= minSize) {
                minSize = cell.size;
                minCell = cell;
            }
        }
        return minCell;
    }

    insertNode(row: number, col: number) {
        const rowCell = this.rowsDict[row];
        const colCell = this.colsDict[col]
        const cell = new DancingCell();
        cell.row = rowCell;
        cell.col = colCell;
        colCell.size++;
        linkUD(colCell.up, cell);
        linkUD(cell, colCell);
        linkLR(rowCell.left, cell);
        linkLR(cell, rowCell);
    }
}

function * _dlx(mat: DancingMatrix) : Iterable<ReadonlyArray<number>> {
    if (mat.empty())
        yield [];
    const col = mat.chooseMinEdge();
    if (col.size == 0)
        return;
    for (let cell = col.down; cell !== col; cell = cell.down) {
        const row = cell.row;
        pruneMatrix(row);
        for (const solution of _dlx(mat))
            yield solution.concat(row.id);
        restoreMatrix(row);
    }
}


export default function dlx(nbRows: number, nbColumns: number, matrixPairs: ReadonlyArray<[number,number]>, fixedVertices: ReadonlyArray<number>) {
    const mat = new DancingMatrix(nbRows, nbColumns, matrixPairs, fixedVertices);
    return _dlx(mat);
}