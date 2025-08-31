import { Game } from "js-chess-engine";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type Square = `${"A" | "B" | "C" | "D" | "E" | "F" | "G" | "H"}${
	| 1
	| 2
	| 3
	| 4
	| 5
	| 6
	| 7
	| 8}`;

type MoveMap = Record<string, string[]>;

export interface BoardStatus {
	turn: "white" | "black";
	isFinished: boolean;
	check: boolean;
	checkMate: boolean;
	pieces: Record<string, string>;
	moves?: MoveMap;
}

function isUpperCase(letter: string): boolean {
	return letter === letter.toUpperCase();
}

function isWhitePiece(piece: string | undefined): boolean {
	if (!piece) return false;
	return isUpperCase(piece);
}

function getPieceLetter(piece: string): "P" | "R" | "N" | "B" | "Q" | "K" {
	const upper = piece.toUpperCase();
	if (
		upper === "P" ||
		upper === "R" ||
		upper === "N" ||
		upper === "B" ||
		upper === "Q" ||
		upper === "K"
	) {
		return upper;
	}
	return "P";
}

function countPiecesByColor(
	pieces: Record<string, string>,
	color: "white" | "black",
): Record<"P" | "R" | "N" | "B" | "Q" | "K", number> {
	const counts: Record<"P" | "R" | "N" | "B" | "Q" | "K", number> = {
		P: 0,
		R: 0,
		N: 0,
		B: 0,
		Q: 0,
		K: 0,
	};
	for (const p of Object.values(pieces)) {
		const isWhite = isUpperCase(p);
		if ((color === "white" && isWhite) || (color === "black" && !isWhite)) {
			const letter = getPieceLetter(p);
			counts[letter] += 1;
		}
	}
	return counts;
}

function getCapturedLetterForColor(
	before: Record<string, string>,
	after: Record<string, string>,
	capturedColor: "white" | "black",
): "P" | "R" | "N" | "B" | "Q" | "K" | null {
	const beforeCounts = countPiecesByColor(before, capturedColor);
	const afterCounts = countPiecesByColor(after, capturedColor);
	const order: Array<"Q" | "R" | "B" | "N" | "P" | "K"> = [
		"Q",
		"R",
		"B",
		"N",
		"P",
		"K",
	];
	for (const letter of order) {
		if (afterCounts[letter] < beforeCounts[letter]) {
			return letter;
		}
	}
	return null;
}

function findKingSquare(
	pieces: Record<string, string>,
	turn: "white" | "black",
): string | undefined {
	const target = turn === "white" ? "K" : "k";
	for (const [sq, p] of Object.entries(pieces)) {
		if (p === target) return sq;
	}
	return undefined;
}

export interface UseChessGameResult {
	board: BoardStatus;
	selectedSquare: string | null;
	legalMoves: string[];
	aiLevel: number;
	isAiThinking: boolean;
	lastMove: { from: string; to: string } | null;
	kingInCheckSquare?: string;
	statusText: string;
	capturedWhite: Array<"P" | "R" | "N" | "B" | "Q">;
	capturedBlack: Array<"P" | "R" | "N" | "B" | "Q">;
	setAiLevel: (lvl: number) => void;
	selectSquare: (square: string) => void;
	userMove: (from: string, to: string) => void;
	newGame: () => void;
}

export function useChessGame(initialAiLevel = 2): UseChessGameResult {
	const gameRef = useRef<Game | null>(null);
	const [board, setBoard] = useState<BoardStatus>(
		() => new Game().exportJson() as BoardStatus,
	);
	const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
	const [legalMoves, setLegalMoves] = useState<string[]>([]);
	const [aiLevel, setAiLevel] = useState<number>(initialAiLevel);
	const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
	const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
		null,
	);
	const [capturedWhite, setCapturedWhite] = useState<
		Array<"P" | "R" | "N" | "B" | "Q">
	>([]);
	const [capturedBlack, setCapturedBlack] = useState<
		Array<"P" | "R" | "N" | "B" | "Q">
	>([]);

	useEffect(() => {
		try {
			const fen = localStorage.getItem("current_game");
			if (fen && typeof fen === "string" && fen.length > 10) {
				gameRef.current = new Game(fen);
				setBoard(gameRef.current.exportJson() as BoardStatus);
				try {
					const cw = localStorage.getItem("captured_white");
					const cb = localStorage.getItem("captured_black");
					const parseCaptured = (val: string | null) => {
						let arr: unknown = [];
						if (val) {
							try {
								arr = JSON.parse(val);
							} catch {
								arr = [];
							}
						}
						if (Array.isArray(arr)) {
							return arr
								.map((x: unknown) =>
									typeof x === "string" ? x.toUpperCase() : "",
								)
								.filter((x: string) =>
									["P", "R", "N", "B", "Q"].includes(x),
								) as Array<"P" | "R" | "N" | "B" | "Q">;
						}
						return [] as Array<"P" | "R" | "N" | "B" | "Q">;
					};
					setCapturedWhite(parseCaptured(cw));
					setCapturedBlack(parseCaptured(cb));
				} catch {}
				return;
			}
		} catch {}
		gameRef.current = new Game();
		const status = gameRef.current.exportJson() as BoardStatus;
		setBoard(status);
	}, []);

	const selectSquare = useCallback(
		(square: string) => {
			if (!gameRef.current) return;
			if (isAiThinking) return;

			const piece = board.pieces[square];
			const isUsersTurn = board.turn === "white";

			if (selectedSquare && legalMoves.includes(square)) {
				userMove(selectedSquare, square);
				return;
			}

			if (isUsersTurn && piece && isWhitePiece(piece)) {
				setSelectedSquare(square);
				try {
					const raw = gameRef.current?.moves(square) as unknown;
					const nextMoves = Array.isArray(raw) ? (raw as string[]) : [];
					setLegalMoves(nextMoves);
				} catch {
					// ignore
				}
				return;
			}

			if (selectedSquare) {
				setSelectedSquare(null);
				setLegalMoves([]);
			}
		},
		[board, selectedSquare, legalMoves, isAiThinking],
	);

	const persistCurrentGame = useCallback(() => {
		try {
			const fen = gameRef.current?.exportFEN();
			if (fen) localStorage.setItem("current_game", fen);
		} catch {}
	}, []);

	const triggerAiMove = useCallback((level: number) => {
		setIsAiThinking(true);
		setTimeout(() => {
			const gameInstance = gameRef.current;
			if (!gameInstance) {
				setIsAiThinking(false);
				return;
			}
			try {
				const beforeAi = gameInstance.exportJson() as BoardStatus;
				const beforeAiPieces = { ...beforeAi.pieces } as Record<string, string>;
				const aiPlayed = gameInstance.aiMove(level);
				const [aiFrom, aiTo] = Object.entries(aiPlayed)[0] as [string, string];
				const afterAi = gameInstance.exportJson() as BoardStatus;
				setBoard(afterAi);
				setLastMove({ from: aiFrom, to: aiTo });
				const capturedLetter = getCapturedLetterForColor(
					beforeAiPieces,
					afterAi.pieces,
					"white",
				);

				if (capturedLetter && capturedLetter !== "K") {
					setCapturedWhite((prev) => {
						const next = [...prev, capturedLetter];
						try {
							localStorage.setItem("captured_white", JSON.stringify(next));
						} catch {}
						return next;
					});
				}

				try {
					const fenNow = gameInstance.exportFEN();
					if (fenNow) localStorage.setItem("current_game", fenNow);
				} catch {}
			} catch {
				// ignore
			} finally {
				setIsAiThinking(false);
			}
		}, 50);
	}, []);

	const userMove = useCallback(
		(from: string, to: string) => {
			if (!gameRef.current) return;
			if (isAiThinking) return;

			const before = gameRef.current.exportJson() as BoardStatus;
			const beforePieces = { ...before.pieces } as Record<string, string>;
			try {
				const played = gameRef.current.move(from as Square, to as Square);
				const [mFrom, mTo] = Object.entries(played)[0] as [string, string];
				const after = gameRef.current.exportJson() as BoardStatus;
				setBoard(after);
				setLastMove({ from: mFrom, to: mTo });
				setSelectedSquare(null);
				setLegalMoves([]);

				persistCurrentGame();

				const capturedLetter = getCapturedLetterForColor(
					beforePieces,
					after.pieces,
					"black",
				);

				if (capturedLetter && capturedLetter !== "K") {
					setCapturedBlack((prev) => {
						const next = [...prev, capturedLetter];
						try {
							localStorage.setItem("captured_black", JSON.stringify(next));
						} catch {}
						return next;
					});
				}

				if (after.isFinished || after.checkMate) {
					return;
				}

				triggerAiMove(aiLevel);
			} catch {
				// ignore invalid moves
			}
		},
		[aiLevel, isAiThinking, triggerAiMove, persistCurrentGame],
	);

	const newGame = useCallback(() => {
		gameRef.current = new Game();
		const status = gameRef.current.exportJson() as BoardStatus;
		setBoard(status);
		setSelectedSquare(null);
		setLegalMoves([]);
		setLastMove(null);
		setCapturedWhite([]);
		setCapturedBlack([]);
		try {
			localStorage.removeItem("current_game");
			localStorage.setItem("captured_white", "[]");
			localStorage.setItem("captured_black", "[]");
		} catch {}
	}, []);

	const kingInCheckSquare = useMemo(
		() => (board.check ? findKingSquare(board.pieces, board.turn) : undefined),
		[board.check, board.pieces, board.turn],
	);

	const statusText = useMemo(() => {
		if (board.checkMate || board.isFinished) {
			const youLost = board.turn === "white";
			return youLost ? "Checkmate — You lost" : "Checkmate — You win!";
		}
		if (board.check) {
			return board.turn === "white"
				? "Check — Your king is threatened"
				: "Check — Opponent is threatened";
		}
		return board.turn === "white" ? "Your move" : "AI is thinking";
	}, [board]);

	return {
		board,
		selectedSquare,
		legalMoves,
		aiLevel,
		isAiThinking,
		lastMove,
		kingInCheckSquare,
		statusText,
		capturedWhite,
		capturedBlack,
		setAiLevel,
		selectSquare,
		userMove,
		newGame,
	};
}