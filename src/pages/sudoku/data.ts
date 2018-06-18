import {Boards, Examples} from "./types";

export const boards: Boards = [
    { name: "2x2", data: 2 },
    { name: "3x3", data: 3 },
    { name: "4x4", data: 4 },
    { name: "5x5", data: 5 },
];

export const examples: Examples = [{
    data: {
        fixedCells: [[0, 0, 8], [1, 2, 3], [1, 3, 6], [2, 1, 7], [2, 4, 9], [2, 6, 2], [3, 1, 5],
        [3, 5, 7], [4, 4, 4], [4, 5, 5], [4, 6, 7], [5, 3, 1], [5, 7, 3], [6, 2, 1],
        [6, 7, 6], [6, 8, 8], [7, 2, 8], [7, 3, 5], [7, 7, 1], [8, 1, 9], [8, 6, 4]],
        size: 3,
    },
    name: "example 1",
}];