import React from 'react'
import { StyleSheet, View } from "react-native";
import { BlackjackGame } from './components/BlackjackGame';

export default function App() {
	return (
		<View style={styles.container}>
			<BlackjackGame />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black',
	},
});