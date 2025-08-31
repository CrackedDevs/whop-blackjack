declare module "js-chess-engine" {
	export type Square =
		| "A1"
		| "A2"
		| "A3"
		| "A4"
		| "A5"
		| "A6"
		| "A7"
		| "A8"
		| "B1"
		| "B2"
		| "B3"
		| "B4"
		| "B5"
		| "B6"
		| "B7"
		| "B8"
		| "C1"
		| "C2"
		| "C3"
		| "C4"
		| "C5"
		| "C6"
		| "C7"
		| "C8"
		| "D1"
		| "D2"
		| "D3"
		| "D4"
		| "D5"
		| "D6"
		| "D7"
		| "D8"
		| "E1"
		| "E2"
		| "E3"
		| "E4"
		| "E5"
		| "E6"
		| "E7"
		| "E8"
		| "F1"
		| "F2"
		| "F3"
		| "F4"
		| "F5"
		| "F6"
		| "F7"
		| "F8"
		| "G1"
		| "G2"
		| "G3"
		| "G4"
		| "G5"
		| "G6"
		| "G7"
		| "G8"
		| "H1"
		| "H2"
		| "H3"
		| "H4"
		| "H5"
		| "H6"
		| "H7"
		| "H8";

	export type MoveMap = Record<string, string[]>;

	export interface BoardStatus {
		turn: "white" | "black";
		isFinished: boolean;
		check: boolean;
		checkMate: boolean;
		pieces: Record<string, string>;
		moves?: MoveMap;
	}

	export class Game {
		constructor(configuration?: object | string);
		move(from: Square, to: Square): Record<string, string>;
		moves(from?: string | null): string[] | MoveMap;
		setPiece(location: string, piece: string): void;
		removePiece(location: string): void;
		aiMove(level?: number): Record<string, string>;
		getHistory(
			reversed?: boolean,
		): Array<{ from: string; to: string; configuration: object }>;
		printToConsole(): void;
		exportJson(): BoardStatus;
		exportFEN(): string;
	}

	export function moves(config: object | string): MoveMap;
	export function status(config: object | string): BoardStatus;
	export function getFen(config: object | string): string;
	export function move(
		config: object | string,
		from: Square,
		to: Square,
	): BoardStatus | string;
	export function aiMove(
		config: object | string,
		level?: number,
	): Record<string, string>;
}
