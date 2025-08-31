import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../hooks/useBlackjackGame';

interface PlayingCardProps {
  card: Card;
  index?: number;
}

export const PlayingCard: React.FC<PlayingCardProps> = ({ card, index = 0 }) => {
  const isRed = card.suit === '♥' || card.suit === '♦';
  
  if (card.hidden) {
    return (
      <View style={[styles.card, styles.cardBack, { marginLeft: index * -30 }]}>
        <View style={styles.cardBackPattern} />
      </View>
    );
  }
  
  return (
    <View style={[styles.card, { marginLeft: index * -30 }]}>
      <Text style={[styles.rank, isRed && styles.redText]}>{card.rank}</Text>
      <Text style={[styles.suit, isRed && styles.redText]}>{card.suit}</Text>
      <Text style={[styles.centerSuit, isRed && styles.redText]}>{card.suit}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 80,
    height: 120,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  cardBack: {
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBackPattern: {
    width: '80%',
    height: '80%',
    backgroundColor: '#34495e',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1abc9c',
  },
  rank: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    position: 'absolute',
    top: 8,
    left: 8,
  },
  suit: {
    fontSize: 18,
    color: '#000',
    position: 'absolute',
    top: 30,
    left: 8,
  },
  centerSuit: {
    fontSize: 40,
    color: '#000',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -20 }],
  },
  redText: {
    color: '#e74c3c',
  },
});
