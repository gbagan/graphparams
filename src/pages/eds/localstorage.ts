import * as R from "ramda";

export function removeFromLocalStorage(name: string) {
    localStorage.removeItem("graph-" + name);
    return localStorageKeys();
}

export function addToLocalStorage(name: string, code: string, positions: Array<[number, number]>) {
    localStorage.setItem("graph-" + name, JSON.stringify({ code, positions }));
}

export const localStorageKeys = () =>
    R.range(0, localStorage.length)
        .map(i => localStorage.key(i) || "")
        .filter(key => key.startsWith("graph-"))
        .map(key => key.slice(6));


export function fillLocalStorage() {
    if (!localStorage.getItem("graph-petersen")) {
        addToLocalStorage("petersen", "petersen",
        [[-237, -31], [-121, -22], [113, -28], [202, -61], [3, -211], [-115, 208],
        [51, 100], [-81, 104], [73, 203], [-16, -93]]);
    }
    if (!localStorage.getItem("graph-hajos")) {
        addToLocalStorage("hajos", "sun(3)",
        [[92, -7], [-21, 158], [-102, -21],
        [193, 157], [-202, 151], [-11, -178]]);
    }
    if (!localStorage.getItem("graph-sun4")) {
        addToLocalStorage("sun4", "sun(4)", [[-49, -71], [51, -69], [49, 30], [-53, 30],
        [4, -194], [204, -14], [-12, 177], [-205, -19]]);
    }
    return localStorageKeys();
}
