import { memo, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
	BishopIcon,
	KnightIcon,
	PawnIcon,
	QueenIcon,
	RookIcon,
} from "../icons";

type PieceLetter = "P" | "R" | "N" | "B" | "Q";

export interface CapturedPiecesRowProps {
	captured: Array<PieceLetter>;
	/** Color of the captured pieces to render */
	color: "white" | "black";
	backgroundColor?: string;
}

export const CapturedPiecesRow = memo(function CapturedPiecesRow({
	captured,
	color,
	backgroundColor,
}: CapturedPiecesRowProps) {
	const items = useMemo(() => {
		return captured.map((letter, idx) => {
			const key = `${letter}-${idx}`;
			if (letter === "Q")
				return (
					<View key={key} style={styles.item}>
						<QueenIcon color={color} size={24} />
					</View>
				);
			if (letter === "R")
				return (
					<View key={key} style={styles.item}>
						<RookIcon color={color} size={24} />
					</View>
				);
			if (letter === "B")
				return (
					<View key={key} style={styles.item}>
						<BishopIcon color={color} size={24} />
					</View>
				);
			if (letter === "N")
				return (
					<View key={key} style={styles.item}>
						<KnightIcon color={color} size={24} />
					</View>
				);
			return (
				<View key={key} style={styles.item}>
					<PawnIcon color={color} size={24} />
				</View>
			);
		});
	}, [captured, color]);

	return (
		<View
			style={[styles.container, backgroundColor ? { backgroundColor } : null]}
		>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{items}
			</ScrollView>
		</View>
	);
});

const styles = StyleSheet.create({
	container: {
		minHeight: 36,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 6,
		marginTop: 6,
		borderRadius: 12,
		paddingHorizontal: 8,
		paddingVertical: 4,
		backgroundColor: "rgba(0,0,0,0.06)",
	},
	scrollContent: {
		alignItems: "center",
		justifyContent: "center",
	},
	item: {
		width: 28,
		height: 28,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 6,
	},
});

export default CapturedPiecesRow;
