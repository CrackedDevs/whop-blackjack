import { memo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export interface GameStatusBarProps {
	statusText: string;
	isAiThinking: boolean;
	isDark: boolean;
}

export const GameStatusBar = memo(function GameStatusBar({
	statusText,
	isAiThinking,
	isDark,
}: GameStatusBarProps) {
	return (
		<View style={styles.statusRow}>
			<Text style={[styles.statusText, { color: isDark ? "#eaeaea" : "#222" }]}>
				{statusText}
			</Text>
			{isAiThinking && (
				<View style={styles.aiRow}>
					<ActivityIndicator size="small" color={isDark ? "#fff" : "#333"} />
					<Text style={[styles.aiText, { color: isDark ? "#ddd" : "#333" }]}>
						AI thinking…
					</Text>
				</View>
			)}
		</View>
	);
});

const styles = StyleSheet.create({
	statusRow: {
		height: 44,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 48,
	},
	statusText: {
		fontSize: 15,
		fontWeight: "600",
	},
	aiRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	aiText: {
		fontSize: 13,
		fontWeight: "600",
	},
});

export default GameStatusBar;
