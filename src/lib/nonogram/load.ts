import {times} from 'ramda';
import {CellType, Nonogram} from "./types";

export const maxRules = (nonogram: Nonogram) =>
    Math.max(...nonogram.rows.map(x => x.length), ...nonogram.columns.map(x => x.length));

export function load(data: string): Nonogram | null {
    let width = 0;
    let height = 0;
    const rows = [];
    const columns = [];
    const lines = data.split(/\r*\n/).filter((line) => line !== "");
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        const words = line.split(" ").filter((word) => word !== "");
        if (words[0] === 'width' && words.length >= 2) {
            width = parseInt(words[1], 10);
        } else if (words[0] === 'height' && words.length >= 2) {
            height = parseInt(words[1], 10);
        } else if (line === 'rows') {
            if (height === 0) {
                return null;
            }
            for (let j = 0; j < height; j++) {
                i++;
                const line2 = lines[i];
                rows.push(line2.split(/\s|,/).map((x) => parseInt(x, 10)));
            }
            i--;
        } else if (line === 'columns') {
            if (width === 0) {
                return null;
            }
            for (let j = 0; j < width; j++) {
                i++;
                const line2 = lines[i];
                columns.push(line2.split(/\s|,/).map((x) => parseInt(x, 10)));
            }
            i--;
        }
        i++;
    }
    const cells = times(_ => CellType.Unknown, width * height);
    return { width, height, rows, columns, cells };
}
