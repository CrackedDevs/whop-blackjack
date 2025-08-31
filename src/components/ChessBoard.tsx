import { memo, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { ChessPiece } from "./ChessPiece";

export type Square = `${"A" | "B" | "C" | "D" | "E" | "F" | "G" | "H"}${
	| 1
	| 2
	| 3
	| 4
	| 5
	| 6
	| 7
	| 8}`;

export interface ChessBoardProps {
	pieces: Record<string, string>;
	selectedSquare: string | null;
	legalMoves: string[];
	lastMove: { from: string; to: string } | null;
	kingInCheckSquare?: string;
	isAiThinking: boolean;
	selectSquare: (square: string) => void;
	lightColor: string;
	darkColor: string;
	highlightFrom: string;
	highlightTo: string;
	highlightSelect: string;
	dangerRed: string;
}

const FILES: Array<"A" | "B" | "C" | "D" | "E" | "F" | "G" | "H"> = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
];

function getSquareColor(
	fileIndex: number,
	rank: number,
	light: string,
	dark: string,
): string {
	const isLight = (fileIndex + rank) % 2 === 0;
	return isLight ? light : dark;
}

export const ChessBoard = memo(function ChessBoard({
	pieces,
	selectedSquare,
	legalMoves,
	lastMove,
	kingInCheckSquare,
	isAiThinking,
	selectSquare,
	lightColor,
	darkColor,
	highlightFrom,
	highlightTo,
	highlightSelect,
	dangerRed,
}: ChessBoardProps) {
	const rows = useMemo(() => Array.from({ length: 8 }), []);

	return (
		<View style={styles.boardWrapper}>
			<View style={styles.aspectBox}>
				{rows.map((_, rowIndexFromTop) => {
					const rank = 8 - rowIndexFromTop;
					return (
						<View key={rank} style={styles.row}>
							{FILES.map((file, fileIndex) => {
								const square = `${file}${rank}` as Square;
								const piece = pieces[square];
								const isSelected = selectedSquare === square;
								const isLegal = legalMoves.includes(square);
								const lastFrom = lastMove?.from === square;
								const lastTo = lastMove?.to === square;
								const isCheckSquare = kingInCheckSquare === square;
								const bg = getSquareColor(
									fileIndex,
									rank,
									lightColor,
									darkColor,
								);
								const showOverlay =
									isSelected || isLegal || lastFrom || lastTo || isCheckSquare;
								const overlayColor = isSelected
									? highlightSelect
									: isLegal
										? highlightTo
										: lastFrom
											? highlightFrom
											: lastTo
												? highlightTo
												: isCheckSquare
													? dangerRed
													: undefined;
								return (
									<Pressable
										key={square}
										onPress={() => selectSquare(square)}
										disabled={isAiThinking}
										style={[styles.cell, { backgroundColor: bg }]}
									>
										{showOverlay && (
											<View
												pointerEvents="none"
												style={[
													styles.overlay,
													{
														backgroundColor: overlayColor,
														opacity: isCheckSquare ? 0.25 : 0.18,
													},
												]}
											/>
										)}
										{piece && <ChessPiece piece={piece} />}
										{isLegal && !piece && (
											<Svg
												width="26"
												height="26"
												viewBox="0 0 100 100"
												style={styles.legalDot}
											>
												<Circle
													cx={50}
													cy={50}
													r={14}
													fill="#2e7d32"
													opacity={0.9}
												/>
											</Svg>
										)}
									</Pressable>
								);
							})}
						</View>
					);
				})}
			</View>
		</View>
	);
});

const styles = StyleSheet.create({
	boardWrapper: {
		alignItems: "center",
		justifyContent: "center",
	},
	aspectBox: {
		width: "100%",
		aspectRatio: 1,
		borderRadius: 12,
		overflow: "hidden",
		elevation: 2,
	},
	row: {
		flex: 1,
		flexDirection: "row",
	},
	cell: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	legalDot: {
		position: "absolute",
	},
});

export default ChessBoard;
