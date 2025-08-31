import React from 'react'
import { StyleSheet, View, useColorScheme } from "react-native";
import { useChessGame } from "./hooks/useChessGame";
import { CapturedPiecesRow } from "./components/CapturedPieces";
import { ChessBoard } from "./components/ChessBoard";
import { GameControls } from "./components/GameControls";
import { GameStatusBar } from "./components/GameStatusBar";

export default function App() {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const boardLight = isDark ? "#b68855" : "#f0d9b5";
	const boardDark = isDark ? "#7a4f2a" : "#b58863";
	const highlightFrom = "#f6f669";
	const highlightTo = "#a8e6cf";
	const highlightSelect = "#87cefa";
	const dangerRed = "#ff6b6b";

	const {
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
		newGame,
	} = useChessGame(2);

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: isDark ? "#0b0b0c" : "#fafafa" },
			]}
		>
			<View style={styles.content}>
				<GameControls
					aiLevel={aiLevel}
					setAiLevel={setAiLevel}
					onNewGame={newGame}
					isDark={isDark}
				/>

				<View style={styles.boardWrapper}>
					<CapturedPiecesRow
						captured={capturedWhite}
						color="white"
						backgroundColor={boardDark}
					/>

					<ChessBoard
						pieces={board.pieces}
						selectedSquare={selectedSquare}
						legalMoves={legalMoves}
						lastMove={lastMove}
						kingInCheckSquare={kingInCheckSquare}
						isAiThinking={isAiThinking}
						selectSquare={selectSquare}
						lightColor={boardLight}
						darkColor={boardDark}
						highlightFrom={highlightFrom}
						highlightTo={highlightTo}
						highlightSelect={highlightSelect}
						dangerRed={dangerRed}
					/>

					<CapturedPiecesRow
						captured={capturedBlack}
						color="black"
						backgroundColor={boardLight}
					/>
				</View>

				<GameStatusBar
					statusText={statusText}
					isAiThinking={isAiThinking}
					isDark={isDark}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 12,
		alignItems: "center",
	},
	content: {
		height: "100%",
		maxWidth: "100%",
		aspectRatio: 0.55,
		flex: 1,
	},
	boardWrapper: {
		flex: 1,
		justifyContent: "center",
		gap: 12,
	},
});