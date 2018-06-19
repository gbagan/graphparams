export type Position = {
    row: number;
    col: number;
}

export type PieceType = "queen" | "king" | "bishop" | "knight" | "custom";

export type Piece = Position & { type: PieceType };

export type Rules = {
    pieces: PieceType[];
    customMoves?: {
        local: Position[];
        long: Position[];
    }
};
