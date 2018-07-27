import {times} from '@fp'; 

const dancingCell = () => {
    const cell = {};
    cell.left = cell;
    cell.right = cell;
    cell.up = cell;
    cell.down = cell;
    cell.col = cell;
    cell.row = cell;
    cell.size = 0;
    cell.id = 0;
    return cell;
};

const linkLR = (x, y) => {
    x.right = y;
    y.left = x;
};

const linkUD = (x, y) => {
    x.down = y;
    y.up = x;
};

const unlinkLR = x => {
    x.left.right = x.right;
    x.right.left = x.left;
};

const unlinkUD = x => {
    x.up.down = x.down;
    x.down.up = x.up;
};

const relinkLR = x => {
    x.left.right = x.right.left = x;
};

const relinkUD = x => {
    x.up.down = x.down.up = x;
};

const pruneMatrix = row => {
    for (let cell = row.right; cell !== row; cell = cell.right) {
        const col = cell.col;
        unlinkLR(col);
        for (let cell2 = col.down; cell2 !== col; cell2 = cell2.down) {
            for (let cell3 = cell2.right; cell3 !== cell2; cell3 = cell3.right) {
                unlinkUD(cell3);
                cell3.col.size--;
            }
        }
    }
};

const restoreMatrix = row => {
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
};

const makeDancingMatrix = (nbRows, nbColumns, matrixPairs) => {
    const root = dancingCell();

    const rowsDict = times(i => {
        const cell = dancingCell();
        cell.id = i;
        cell.col = root;
        linkUD(root.up, cell);
        linkUD(cell, root);
        return cell;
    }, nbRows);

    const colsDict = times(i => {
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
};

const dmFilter = (dm, fixedVertices) => {
    for (const vertex of fixedVertices) {
        const row = dm.rowsDict[vertex];
        if (row.down.up !== row) { // v has been pruned
            return false;
        }
        pruneMatrix(row);
    }
    return true;
};

const dmEmpty = dm => dm.root.right === dm.root;

const chooseMinEdge = dm => {
    let minCell = dm.root.right;
    let minSize = Infinity;
    for (let cell = minCell; cell !== dm.root; cell = cell.right) {
        if (cell.size <= minSize) {
            minSize = cell.size;
            minCell = cell;
        }
    }
    return minCell;
};

const insertNode = (dm, row, col) => {
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
};

function * _dlx(dm) {
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

const dlx = (nbRows, nbColumns, matrixPairs, fixedVertices) => {
    const dm = makeDancingMatrix(nbRows, nbColumns, matrixPairs);
    const res = dmFilter(dm, fixedVertices);
    return res ? _dlx(dm) : [];
};

export default dlx;
