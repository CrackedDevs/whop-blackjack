import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export interface GameControlsProps {
	aiLevel: number;
	setAiLevel: (level: number) => void;
	onNewGame: () => void;
	isDark: boolean;
}

export const GameControls = memo(function GameControls({
	aiLevel,
	setAiLevel,
	onNewGame,
	isDark,
}: GameControlsProps) {
	return (
		<View style={styles.headerRow}>
			<View style={styles.levelContainer}>
				<Text style={[styles.levelLabel, { color: isDark ? "#bbb" : "#555" }]}>
					Difficulty
				</Text>
				<View style={styles.levelRow}>
					{[0, 1, 2, 3, 4].map((lvl) => (
						<Pressable
							key={lvl}
							onPress={() => setAiLevel(lvl)}
							style={[
								styles.levelPill,
								aiLevel === lvl && { backgroundColor: "#2e7d32" },
							]}
						>
							<Text
								style={[
									styles.levelText,
									{
										color: aiLevel === lvl ? "#fff" : isDark ? "#ddd" : "#333",
									},
								]}
							>
								{lvl}
							</Text>
						</Pressable>
					))}
				</View>
			</View>
			<Pressable onPress={onNewGame} style={styles.resetBtnLarge}>
				<Text style={styles.resetTextLarge}>New Game</Text>
			</Pressable>
		</View>
	);
});

const styles = StyleSheet.create({
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	levelContainer: {
		flexDirection: "column",
		alignItems: "flex-start",
		justifyContent: "center",
		gap: 6,
	},
	levelLabel: {
		fontSize: 11,
		fontWeight: "600",
		letterSpacing: 0.2,
		opacity: 0.9,
	},
	levelRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		marginRight: 6,
	},
	levelPill: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: "#4caf50",
		backgroundColor: "transparent",
	},
	levelText: {
		fontSize: 13,
		fontWeight: "600",
	},
	resetBtnLarge: {
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 10,
		backgroundColor: "#1976d2",
	},
	resetTextLarge: {
		color: "#fff",
		fontWeight: "800",
		fontSize: 15,
		letterSpacing: 0.3,
	},
});

export default GameControls;
