import { memo, useMemo } from "react";
import { View } from "react-native";
import {
	BishopIcon,
	KingIcon,
	KnightIcon,
	PawnIcon,
	QueenIcon,
	RookIcon,
} from "../icons";

export interface ChessPieceProps {
	piece: string; // e.g. "P", "k"
}

function isUpperCase(letter: string): boolean {
	return letter === letter.toUpperCase();
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

export const ChessPiece = memo(function ChessPiece({ piece }: ChessPieceProps) {
	const color: "white" | "black" = useMemo(
		() => (isUpperCase(piece) ? "white" : "black"),
		[piece],
	);
	const letter = useMemo(() => getPieceLetter(piece), [piece]);

	return (
		<View
			style={{
				width: "100%",
				height: "100%",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{letter === "R" ? (
				<RookIcon color={color} />
			) : letter === "N" ? (
				<KnightIcon color={color} />
			) : letter === "B" ? (
				<BishopIcon color={color} />
			) : letter === "Q" ? (
				<QueenIcon color={color} />
			) : letter === "K" ? (
				<KingIcon color={color} />
			) : (
				<PawnIcon color={color} />
			)}
		</View>
	);
});

export default ChessPiece;
