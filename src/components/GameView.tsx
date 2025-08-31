import { __internal_execSync } from "@whop/react-native";
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { BlackjackGame } from "./BlackjackGame";

export function GameView() {
	useEffect(() => {
		try {
			__internal_execSync("setNavigationBarData", {
				title: "Blackjack",
				description: "Classic Casino Game",
			});
		} catch {}
	}, []);

	return (
		<View style={styles.container}>
			<BlackjackGame />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
