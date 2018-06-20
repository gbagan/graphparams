export type Position = {
    row: number;
    col: number;
}

export type LegalMoves = {
    local: Position[];
    long: Position[];
}

export type PieceType = "queen" | "king" | "bishop" | "knight" | "custom";

export type Piece = Position & { type: PieceType };

export type Rules = {
    pieces: PieceType[];
    customMoves?: LegalMoves;
};
